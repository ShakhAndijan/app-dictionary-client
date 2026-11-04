# Lug'at — web

React + TypeScript + Vite web client for the same backend as the mobile app.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production bundle in dist/
```

API manzili `.env` ichidagi `VITE_API_URL` orqali beriladi (lokal: `http://localhost:8080/api`,
production: `https://shakhdict.duckdns.org/api`). Server CORS hamma originga ochiq.
