## 🐉 Empireo Archive - TaskFlow

Aplicacion web interactiva con estetica de archivo draconico y gestion de tareas.

En esta version:

- **Frontend**: HTML + CSS + JavaScript.
- **Backend**: Node.js + Express.
- **Persistencia**: Supabase (tabla `tasks`) con fallback a memoria si no hay configuracion.

---

## 🚀 Funcionalidades principales

- **Tareas con API REST**
  - Crear, listar, editar, marcar completadas y eliminar tareas.
  - Validaciones basicas (`text` obligatorio, prioridad valida).
  - Estado de conexion visible en la UI.

- **Dashboard visual**
  - Secciones de perfiles, dragones, misiones y resumen.
  - Filtros y busquedas en diferentes bloques.

- **Tema y estilos**
  - CSS compilado de Tailwind en `dist/app.css`.
  - Estilos manuales de hero en `src/css/hero.css`.

---

## 🧠 Como funciona (arquitectura simple)

1. El navegador carga `index.html`.
2. `index.html` carga:
   - `dist/app.css` (estilos compilados),
   - `src/css/hero.css` (estilos visuales del hero),
   - scripts de `src/js/*`.
3. El frontend de tareas (`src/js/logic/tasks.rest.logic.js`) llama al backend.
4. El backend (`server/src/index.js`) usa Supabase si hay variables; si no, usa memoria local.

---

## ▶️ Puesta en marcha

1. Instala dependencias:

```bash
npm install
```

2. Crea o rellena `.env` en la raiz:

```env
SUPABASE_URL=
SUPABASE_ANON_KEY=
PORT=3000
```

3. Arranca backend:

```bash
npm run dev:server
```

4. Abre el frontend de una de estas formas:
   - **Local**: con Live Server (o servidor estatico) sobre `index.html`.
   - **Desplegado**: usando la URL de Vercel del frontend.

> Nota importante: en deploy Vercel, `localhost` no aplica.  
> La app usa el mismo dominio desplegado para llamar a `/api/v1/*`.

---

## ☁️ Deploy en Vercel (Frontend + Backend)

Configuracion recomendada: **1 solo proyecto Vercel (fullstack)**.

### 1) Proyecto unico (frontend + API)

- **Repositorio**: este mismo repo.
- **Root Directory**: `.`
- **Framework Preset**: `Other`
- **Variables de entorno** (en Vercel, no en `.env` local):
  - `SUPABASE_URL`
  - `SUPABASE_ANON_KEY`

Archivos clave ya preparados:

- `vercel.json` (sirve frontend y enruta `/api/*` al backend)
- `server/src/index.js` exporta `app` para serverless
- `index.html` usa `window.location.origin` como base API en deploy (sin hardcode de dominio)

Comprobacion:

- `https://TU-DOMINIO.vercel.app/` (frontend)
- `https://TU-DOMINIO.vercel.app/api/v1/tasks` (API)
- `https://TU-DOMINIO.vercel.app/api/v1/health` (salud + BD)

> Ejemplo real de este proyecto: `https://taskflow-project-rzeo.vercel.app`

### 2) Checklist post-deploy

- Backend responde `health` con `ok: true`.
- Si Supabase esta bien configurado: `supabase: true` y `database: "ok"`.
- Crear/editar/borrar tareas desde la UI persiste tras recargar.

---

## 🔌 Backend y API

Archivo principal: `server/src/index.js`.

Base local: `http://localhost:3000`

- `GET /api/v1/health`
  - Estado del backend.
  - Indica si hay Supabase configurado.
  - Hace prueba real contra `tasks` para confirmar conectividad/permiso.

- `GET /api/v1/tasks`
  - Devuelve lista de tareas.

- `POST /api/v1/tasks`
  - Crea tarea (`text` obligatorio).

- `PATCH /api/v1/tasks/:id`
  - Actualiza `text`, `done` y/o `priority`.

- `DELETE /api/v1/tasks/:id`
  - Borra tarea por `id`.

---

## 🗄️ Base de datos (Supabase)

La API espera `public.tasks` con columnas equivalentes a:

- `id`
- `text`
- `done`
- `priority`

Puntos importantes:

- Si la tabla no existe o no hay permisos para `anon`, la API falla.
- Si faltan variables de entorno, el backend sigue funcionando en **modo memoria**.
- En modo memoria, al reiniciar servidor se pierden los datos.
- Si /api/v1/health devuelve error y Supabase está en plan free, comprobar si el proyecto está paused.

---

## 📂 Para que sirve cada archivo de raiz

- `index.html`  
  Estructura principal de la web; punto de entrada del frontend.

- `package.json`  
  Scripts y dependencias del proyecto (`dev:server`, `start:server`, etc.).

- `package-lock.json`  
  Versiones exactas del arbol de dependencias instaladas por npm.

- `postcss.config.js`  
  Configuracion de PostCSS (Tailwind + Autoprefixer).

- `tailwind.config.js`  
  Configuracion de Tailwind (rutas `content`, tema y plugins).

- `README.md`  
  Documentacion general y guia rapida de uso.

---

## 🗂️ Para que sirve cada carpeta principal

- `server/src/`  
  Backend Express y endpoints REST.

- `src/css/`  
  CSS fuente del frontend:
  - `app.css` (entrada Tailwind para compilar),
  - `hero.css` (estilos visuales personalizados).

- `dist/`  
  Salida CSS compilada (`app.css`) usada por `index.html`.

- `src/js/data/`  
  Datasets estaticos (perfiles, dragones, filtros, KPIs, etc.).

- `src/js/logic/`  
  Logica de comportamiento de UI (tareas, riders, helpers).

- `src/js/modules/`  
  Modulos reutilizables para inicializar bloques concretos.

- `docs/`  
  Documentacion de apoyo y notas del proyecto.

---

## 🧪 Pruebas rapidas

Con backend encendido:

1. Salud del sistema:

```bash
curl http://localhost:3000/api/v1/health
```

2. Listar tareas:

```bash
curl http://localhost:3000/api/v1/tasks
```

3. Crear tarea (PowerShell):

```bash
curl -X POST http://localhost:3000/api/v1/tasks ^
  -H "Content-Type: application/json" ^
  -d "{\"text\":\"Probar API\",\"priority\":\"media\"}"
```

---

## 📝 Resumen para entenderlo yo

- El **frontend** es el escaparate: lo que ves y donde haces click.
- El **backend** es la persona de almacen: recibe peticiones y guarda/lee tareas.
- **Supabase** es el almacen real donde se guardan las tareas para que no se pierdan.

Cuando creas una tarea:

1. La escribes en pantalla.
2. La web se la envia al backend.
3. El backend la guarda en Supabase.
4. La web vuelve a pedir la lista y ya aparece actualizada.

Si Supabase no esta configurado:

- La app no se rompe.
- Guarda temporalmente en memoria para que puedas seguir probando.
- Pero al reiniciar servidor, esas tareas se borran.

En una frase:

- **Frontend** = lo visual.
- **Backend** = la logica y la API.
- **Supabase** = donde viven los datos de verdad.
