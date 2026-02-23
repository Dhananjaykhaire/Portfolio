# Portfolio

Personal portfolio Website for Dhananjay Khaire with a full-stack setup.

## What's included
- Frontend portfolio UI in `index.html` + `script.js`.
- Dependency-free Node.js backend in `server.js`.
- API endpoints:
  - `GET /api/health`
  - `GET /api/site-info`
  - `POST /api/contact`
- Local message persistence in `messages.json` (auto-created when contact form is submitted).

## Run locally
```bash
npm run dev
```

Open: `http://localhost:3000`

## Notes
- Footer copyright year is auto-generated from backend response and falls back to browser year if API is unavailable.
- Contact form now submits to your own backend endpoint (`/api/contact`) instead of third-party form service.
