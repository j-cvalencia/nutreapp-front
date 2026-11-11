# NutreAPP · Frontend

React + Vite + Tailwind CSS v4 + react-router-dom.

```bash
npm install
npm run dev
```

Abre http://localhost:5173

Rutas: `/registro` (formulario de Usuario) → `/home` (plataforma de videos, protegida).
Los datos se guardan en localStorage hasta que el backend Spring Boot exponga endpoints
(`src/auth.js` y `VIDEOS` en `src/pages/Home.jsx` son los puntos a reemplazar por `fetch("/api/...")`).
