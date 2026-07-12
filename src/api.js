/**
 * api.js
 * ------
 * Capa de conexión con el backend helpdesk-core (Spring Boot).
 * Centraliza todas las llamadas HTTP para no repetir fetch() por todos lados.
 */

const BASE_URL = 'https://helpdesk-core-pbgv.onrender.com';

/**
 * Wrapper genérico de fetch que maneja errores y JSON automáticamente.
 */
async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!res.ok) {
    // 204 No Content no tiene body, lo tratamos aparte
    if (res.status === 204) return null;
    const text = await res.text();
    throw new Error(`Error ${res.status}: ${text || res.statusText}`);
  }

  // Si no hay contenido (ej. DELETE), no intentamos parsear JSON
  const contentType = res.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) return null;

  return res.json();
}

// ---------------------------------------------------------------------
// CLIENTES
// ---------------------------------------------------------------------
export const clientesApi = {
  listar: () => request('/clientes'),
  crear: (data) => request('/clientes', { method: 'POST', body: JSON.stringify(data) }),
  actualizar: (id, data) => request(`/clientes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  eliminar: (id) => request(`/clientes/${id}`, { method: 'DELETE' }),
};

// ---------------------------------------------------------------------
// EQUIPOS
// ---------------------------------------------------------------------
export const equiposApi = {
  listar: () => request('/equipos'),
  listarPorCliente: (clienteId) => request(`/equipos/cliente/${clienteId}`),
  crear: (data) => request('/equipos', { method: 'POST', body: JSON.stringify(data) }),
  actualizar: (id, data) => request(`/equipos/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  eliminar: (id) => request(`/equipos/${id}`, { method: 'DELETE' }),
};

// ---------------------------------------------------------------------
// TICKETS
// ---------------------------------------------------------------------
export const ticketsApi = {
  listar: () => request('/tickets'),
  listarPorEquipo: (equipoId) => request(`/tickets/equipo/${equipoId}`),
  listarPorEstado: (estado) => request(`/tickets/estado/${estado}`),
  crear: (data) => request('/tickets', { method: 'POST', body: JSON.stringify(data) }),
  resolver: (id) => request(`/tickets/${id}/resolver`, { method: 'PUT' }),
  eliminar: (id) => request(`/tickets/${id}`, { method: 'DELETE' }),
};
