// ======================================================================
// TaskFlow backend (Express)
// ======================================================================
// Provee una API REST para la app web:
// - `GET  /api/v1/tasks`: lista tareas desde Supabase (`public.tasks`) o
//   desde memoria si no hay configuración.
// - `POST /api/v1/tasks`: crea una tarea.
// - `PATCH/DELETE /api/v1/tasks/:id`: actualiza / borra una tarea.
// - `GET /api/v1/health`: prueba real de conexión y acceso a la tabla
//   `tasks` (para saber si Supabase está accesible por la key configurada).
//
// Config mediante variables de entorno (no versionar):
// - `SUPABASE_URL`
// - `SUPABASE_ANON_KEY`
// - `PORT` (opcional)
// ======================================================================

const express = require("express");
const cors = require("cors");
const path = require("path");
// Variables de entorno:
// - Local (opcional): crea `.env` en la raíz o en `server/` (está en .gitignore).
// - Vercel (producción): configúralas en Project Settings -> Environment Variables.
//   SUPABASE_URL — Supabase -> Project Settings -> API -> Project URL
//   SUPABASE_ANON_KEY — misma pantalla -> anon public key
//   PORT — opcional (por defecto 3000; en Vercel no suele ser necesario)
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
require("dotenv").config({ path: path.join(__dirname, "..", "..", ".env") });
const { randomUUID } = require("crypto");
const { createClient } = require("@supabase/supabase-js");

const app = express();

const isProduction = process.env.NODE_ENV === "production";
const corsOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);

const defaultDevOrigins = [
  "http://localhost:5500",
  "http://127.0.0.1:5500",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

app.use(
  cors({
    origin(origin, callback) {
      // Permite herramientas sin header Origin (curl, Postman, health checks).
      if (!origin) return callback(null, true);

      const allowedOrigins = isProduction ? corsOrigins : [...defaultDevOrigins, ...corsOrigins];
      if (allowedOrigins.includes(origin)) return callback(null, true);

      return callback(new Error("CORS no permitido"));
    },
  }),
);
app.use(express.json());

const PORT = Number(process.env.PORT || 3000);
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const SUPABASE_TABLE = "tasks";

const hasSupabaseConfig = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
const supabase = hasSupabaseConfig
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  : null;

// Fallback en memoria si faltan variables de Supabase.
let tasks = [];

const PRIORITIES = new Set(["baja", "media", "alta"]);

function validateNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function validatePriority(value) {
  return typeof value === "string" && PRIORITIES.has(value);
}

function normalizePriority(value) {
  if (validatePriority(value)) return value;
  return "media";
}

function seedTextTask({ id, text, done, priority }) {
  return {
    id: id ?? randomUUID(),
    text: String(text),
    done: Boolean(done),
    priority: normalizePriority(priority),
  };
}

function normalizeTask(row) {
  return {
    id: String(row.id),
    text: String(row.text ?? ""),
    done: Boolean(row.done),
    priority: normalizePriority(row.priority),
  };
}

function isSupabaseEnabled() {
  return !!supabase;
}

async function probeTasksTable() {
  if (!supabase) {
    return { ok: true, skipped: true };
  }
  const { error } = await supabase.from(SUPABASE_TABLE).select("id").limit(1);
  if (error) {
    return { ok: false, message: error.message, code: error.code, hint: error.hint };
  }
  return { ok: true, skipped: false };
}

// Ruta raíz amigable para verificar que la API está viva.
app.get("/", (req, res) => {
  return res.status(200).json({
    ok: true,
    message: "TaskFlow API running",
    endpoints: ["/api/v1/health", "/api/v1/tasks"],
  });
});

app.get("/api/v1/health", async (req, res) => {
  const payload = {
    ok: true,
    supabase: isSupabaseEnabled(),
    storage: isSupabaseEnabled() ? "supabase" : "memory",
  };

  if (!isSupabaseEnabled()) {
    return res.status(200).json({ ...payload, database: null });
  }

  const probe = await probeTasksTable();
  if (!probe.ok) {
    return res.status(200).json({
      ...payload,
      database: "error",
      dbMessage: probe.message,
      dbCode: probe.code,
      dbHint: probe.hint,
    });
  }

  return res.status(200).json({ ...payload, database: "ok" });
});

// GET /api/v1/tasks
app.get("/api/v1/tasks", async (req, res, next) => {
  try {
    if (!isSupabaseEnabled()) {
      return res.status(200).json(tasks);
    }

    const { data, error } = await supabase
      .from(SUPABASE_TABLE)
      .select("id,text,done,priority");

    if (error) throw error;

    const rows = Array.isArray(data) ? data : [];
    res.set("Cache-Control", "no-store");
    return res.status(200).json(rows.map(normalizeTask));
  } catch (err) {
    return next(err);
  }
});

// POST /api/v1/tasks
app.post("/api/v1/tasks", async (req, res, next) => {
  try {
    const body = req.body ?? {};

    if (!validateNonEmptyString(body.text)) {
      return res.status(400).json({ message: "El título es obligatorio" });
    }

    const text = body.text.trim();
    const done = body.done === undefined ? false : Boolean(body.done);
    const priority = normalizePriority(body.priority);
    const id = validateNonEmptyString(body.id) ? body.id.trim() : undefined;

    const created = seedTextTask({ id, text, done, priority });

    if (!isSupabaseEnabled()) {
      tasks.push(created);
      return res.status(201).json(created);
    }

    const { data, error } = await supabase
      .from(SUPABASE_TABLE)
      .insert(created)
      .select("id,text,done,priority")
      .single();

    if (error) throw error;
    return res.status(201).json(normalizeTask(data));
  } catch (err) {
    return next(err);
  }
});

// PATCH /api/v1/tasks/:id
app.patch("/api/v1/tasks/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const body = req.body ?? {};
    const patch = {};

    if (body.text !== undefined) {
      if (!validateNonEmptyString(body.text)) {
        return res.status(400).json({ message: "El texto no es válido" });
      }
      patch.text = body.text.trim();
    }

    if (body.done !== undefined) {
      if (typeof body.done !== "boolean") {
        return res.status(400).json({ message: "El done no es válido" });
      }
      patch.done = body.done;
    }

    if (body.priority !== undefined) {
      if (!validatePriority(body.priority)) {
        return res.status(400).json({ message: "La prioridad no es válida" });
      }
      patch.priority = body.priority;
    }

    if (!isSupabaseEnabled()) {
      const task = tasks.find((t) => t.id === id);
      if (!task) throw new Error("NOT_FOUND");
      Object.assign(task, patch);
      return res.status(200).json(task);
    }

    const { data, error } = await supabase
      .from(SUPABASE_TABLE)
      .update(patch)
      .eq("id", id)
      .select("id,text,done,priority")
      .single();

    // PGRST116: no rows returned by single()
    if (error && error.code === "PGRST116") throw new Error("NOT_FOUND");
    if (error) throw error;

    return res.status(200).json(normalizeTask(data));
  } catch (err) {
    return next(err);
  }
});

// DELETE /api/v1/tasks/:id
app.delete("/api/v1/tasks/:id", async (req, res, next) => {
  try {
    const id = req.params.id;

    if (!isSupabaseEnabled()) {
      const index = tasks.findIndex((t) => t.id === id);
      if (index === -1) throw new Error("NOT_FOUND");
      tasks.splice(index, 1);
      return res.status(204).send();
    }

    const { data, error } = await supabase
      .from(SUPABASE_TABLE)
      .delete()
      .eq("id", id)
      .select("id");

    if (error) throw error;
    if (!data || data.length === 0) throw new Error("NOT_FOUND");

    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
});

// Rutas no existentes
app.use((req, res) => res.status(404).json({ message: "No encontrado" }));

// Middleware global final de errores (4 parámetros)
app.use((err, req, res, next) => {
  if (err && err.message === "NOT_FOUND") {
    return res.status(404).json({ message: "Tarea no encontrada" });
  }
  console.error(err);
  return res.status(500).json({ message: "Error interno del servidor" });
});

if (require.main === module) {
  app.listen(PORT, () => {
    if (isSupabaseEnabled()) {
      console.log("Supabase mode enabled (variables cargadas)");
      void probeTasksTable().then((probe) => {
        if (probe.skipped) return;
        if (probe.ok) {
          console.log(`[Supabase] Tabla "${SUPABASE_TABLE}" accesible.`);
        } else {
          console.error(
            `[Supabase] No se puede usar la tabla "${SUPABASE_TABLE}": ${probe.message}`,
            probe.code ? `(código ${probe.code})` : "",
          );
          if (probe.hint) console.error("Sugerencia:", probe.hint);
          console.error(
            "Revisa en Supabase: existe la tabla public.tasks (columnas id, text, done, priority), UUID en id, y políticas RLS que permitan anon (SELECT/INSERT/UPDATE/DELETE) o desactiva RLS para pruebas.",
          );
        }
      });
    } else {
      console.warn(
        "Supabase no configurado: la API usa memoria. La web no lee ni escribe la tabla `tasks` de Supabase hasta definir SUPABASE_URL y SUPABASE_ANON_KEY (.env en server/ o en la raíz del repo).",
      );
    }
    console.log(`TaskFlow backend escuchando en http://localhost:${PORT}`);
  });
}

module.exports = app;

