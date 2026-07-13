# Helpdesk Core — Frontend

Panel de gestión para clientes, equipos y tickets de soporte técnico.
Consume la API REST de [helpdesk-core](https://github.com/FerSierra87/helpdesk-core)
(Java + Spring Boot + PostgreSQL).

**🔗 Demo en vivo:** https://helpdesk-core-one.web.app

*(el backend gratuito puede tardar ~30-50 segundos en "despertar" en la
primera petición si nadie lo usó en un rato — no es un error, es el plan
gratuito de Render)*

## Funcionalidades

- **Dashboard** con contadores en vivo: clientes, equipos, tickets abiertos
- **Clientes**: alta y listado
- **Equipos**: alta (asociado a un cliente existente vía selector) y listado,
  mostrando a qué cliente pertenece cada uno
- **Tickets**: alta (asociado a un equipo existente), filtro por estado
  (todos / abiertos / resueltos), y botón para marcar como resuelto
- Interfaz responsive, con scroll horizontal en las tablas para pantallas
  chicas

## Stack

- React 18 + Vite 5
- Tailwind CSS v4
- Font Awesome (iconos)
- `fetch` nativo para consumir la API (sin librerías extra como axios)
- Firebase Hosting (despliegue)

## Correrlo en local

Requiere que el [backend](https://github.com/FerSierra87/helpdesk-core) esté
corriendo (local en `http://localhost:8080`, o le apuntás a la URL de
producción cambiando `BASE_URL` en `src/api.js`).

```bash
npm install
npm run dev
```

Abrí `http://localhost:5173`.

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

## Despliegue (Firebase Hosting)

```bash
npm run build
firebase deploy --only hosting:front
```

El sitio de Hosting (`helpdesk-core-one`) está configurado como *target*
dentro de `firebase.json`, ya que este proyecto de Firebase puede alojar
varios sitios distintos.

## Notas

- La URL del backend está fija en `src/api.js` (constante `BASE_URL`). Si el
  backend cambia de dominio, se actualiza solo ahí.
- El backend necesita tener CORS habilitado explícitamente para el dominio de
  este frontend (`CorsConfig.java` en el repo del backend) — sin eso, el
  navegador bloquea las peticiones aunque el backend esté funcionando bien.

## Posibles mejoras a futuro

- Edición inline de clientes/equipos/tickets (hoy solo hay alta y baja)
- Paginación o búsqueda en las listas largas
- Autenticación de usuarios
- Gráficos de tickets por categoría/prioridad en el dashboard
