// Usa el host actual (IP o dominio) para que funcione también desde móvil.
// Se puede sobrescribir con window.__TASKFLOW_API_BASE__ si hace falta.
const API_BASE =
  window.__TASKFLOW_API_BASE__ ||
  `${window.location.protocol}//${window.location.hostname}:3000`;
const API_URL = `${API_BASE}/api/v1/tasks`;

export async function getTasks() {
  const response = await fetch(API_URL);
  return response.json();
}

export async function createTask(text, priority) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ text, priority })
  });

  return response.json();
}

export async function deleteTask(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE'
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || 'Error al eliminar la tarea');
  }
}

export async function updateTask(id, patch) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(patch || {})
  });

  // Devuelve el JSON si existe; si no, lanza error para que el frontend lo maneje.
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || 'Error actualizando tarea');
  }

  return response.json();
}