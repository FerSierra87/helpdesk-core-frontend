# Helpdesk Core — Frontend

Interfaz web para gestionar clientes, equipos y tickets de soporte técnico,
consumiendo la API REST del proyecto [helpdesk-core](../helpdesk-core) (Java +
Spring Boot + PostgreSQL/Supabase).

## Requisitos previos

Este frontend **necesita que el backend `helpdesk-core` esté corriendo** en
`http://localhost:8080`. Sin eso, vas a ver un mensaje de error de conexión
apenas abras la página.

## Instalación

```bash
npm install
npm run dev
```

Abrí `http://localhost:5173`.

## Funcionalidades

- **Dashboard** con contadores en vivo: clientes, equipos, tickets abiertos.
- **Clientes**: alta y listado.
- **Equipos**: alta (asociado a un cliente existente) y listado, mostrando a
  qué cliente pertenece cada uno.
- **Tickets**: alta (asociado a un equipo existente), filtro por estado
  (todos / abiertos / resueltos), y botón para marcar como resuelto.

## Stack

- React 18 + Vite 5
- Tailwind CSS v4
- Font Awesome (iconos)
- `fetch` nativo para consumir la API (sin librerías extra como axios)

## Estructura

```
src/
├── api.js                   # Toda la comunicación con el backend
├── App.jsx                  # Navegación y dashboard
└── components/
    ├── ClientesView.jsx
    ├── EquiposView.jsx
    └── TicketsView.jsx
```

## Notas

- La URL del backend está fija en `src/api.js` (`BASE_URL`). Si el backend
  corre en otro puerto o dominio, cambiala ahí.
- El backend necesita tener configurado CORS para aceptar peticiones desde
  `http://localhost:5173` (ver `CorsConfig.java` en el proyecto backend).
