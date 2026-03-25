## Empíreo Archive – TaskFlow (Frontend + Backend REST)

Proyecto de prácticas en **Corner Estudios**. El frontend consume un backend Express REST con `fetch` y las tareas ya no usan `localStorage`.

---

## Backend Express (simple y en memoria)

El backend vive en `server/` y está centralizado en `server/src/index.js`.
Usa un array en memoria (`tasks`) y expone un REST API bajo `/api/v1/tasks`.
El puerto se toma de `server/.env` (por defecto `3000`).

---

## Endpoints REST

Prefijo: `http://localhost:3000/api/v1/tasks`

- `GET /api/v1/tasks`
  - `200`: lista de tareas.

- `POST /api/v1/tasks`
  - `201`: crea una tarea.
  - Body esperado:
    - `text` (string, obligatorio)
    - `priority` (baja|media|alta, opcional)
    - `done` (boolean, opcional)
    - `id` (string, opcional; permite UI optimista)

- `PATCH /api/v1/tasks/:id`
  - `200`: actualiza `text`, `done` y/o `priority`.

- `DELETE /api/v1/tasks/:id`
  - `204`: elimina una tarea.

---

## Refactor frontend (sin persistencia local para tareas)

Las llamadas HTTP y el renderizado viven en `src/js/logic/tasks.rest.logic.js` usando `fetch`:
- carga tareas con `GET /api/v1/tasks`
- crea con `POST /api/v1/tasks`
- toggle/editar con `PATCH /api/v1/tasks/:id`
- eliminar con `DELETE /api/v1/tasks/:id`

---

## Ejecución

1. Backend:
   ```bash
   cd server
   npm run dev
   ```
   (usa `server/.env` con `PORT=3000`)

2. Frontend:
   - Sirve `index.html` desde la raíz del proyecto (por ejemplo con Live Server).
   - Abre en `http://localhost:<PUERTO_ESTATICO>`

---

## Pruebas rápidas (Postman / Thunder Client)

1. POST sin `text`:
   - `POST /api/v1/tasks`
   - Body: `{ "priority": "media" }`
   - Esperado: `400` con `{"message":"El título es obligatorio"}`

2. DELETE con id inexistente:
   - `DELETE /api/v1/tasks/NO_EXISTE`
   - Esperado: `404` con `{"message":"Tarea no encontrada"}`

3. Flujo feliz:
   - `POST` => `201`
   - `PATCH` => `200`
   - `DELETE` => `204`

---

## Documentación de herramientas

Consulta `docs/backend-api.md`.
Incluye: Axios, Postman, Sentry y Swagger (OpenAPI).

