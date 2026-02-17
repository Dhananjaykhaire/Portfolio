# Portfolio

Personal portfolio website for Dhananjay Khaire.

## What's included
- Frontend portfolio UI in `index.html` + `script.js`.
- Lightweight Node.js backend (`Express`) in `server.js`.
- API endpoints:
  - `GET /api/health`
  - `GET /api/site-info`

## Run locally
```bash
npm install
npm run dev
```

Open: `http://localhost:3000`

## Notes
- Footer copyright year is auto-generated from backend response and falls back to the current browser year if API is unavailable.
- Contact form currently posts to Web3Forms as before.
