# Tyndex Lab RAG Red Team — Website Integration Guide

This package contains two things that sit alongside your existing repo:

```
tyndex-frontend/   React + Vite + TS + Tailwind site — drop in as a sibling
                    of src/, docs/, results/ in your repo root
backend/            FastAPI wrapper around chat.py — see backend/README.md
INTEGRATION.md       this file
```

## 1. Backend

Follow `backend/README.md`. Short version:

```
copy backend\rag_engine.py  src\rag_engine.py
pip install -r backend/requirements.txt
uvicorn backend.main:app --reload --port 8000
```

## 2. Frontend

```
cd tyndex-frontend
npm install
copy .env.example .env      (edit if your API isn't on localhost:8000)
npm run dev
```

Open http://localhost:5173 — the Live RAG Demo and Attack Replay pages call
your FastAPI backend for real. If the backend isn't running, those two pages
show a clear "backend not reachable" state rather than fabricating a
response — by design, per your instruction not to invent results.

## 3. What's real vs. demo data right now

| Page | Data source |
|---|---|
| Overview, Architecture | Static, sourced from your docs/01-architecture.md |
| Findings | Static, sourced from your 5 documented findings |
| OWASP + ATLAS mapping | Static, derived from Findings |
| Live RAG Demo | **Live** — calls POST /api/chat on your real backend |
| Attack Replay | **Live** — calls POST /api/attack-replay on your real backend |
| Before/After Results | Explicitly labeled "Demo Data" until results/pre-mitigation/ and results/post-mitigation/ are populated and GET /api/results is wired to parse them |
| Reports | Links straight to the markdown files on GitHub |

## 4. Wiring up real Results data (Phase 3/4)

Once you've run garak + promptfoo and have JSON/HTML output in
`results/pre-mitigation/` and `results/post-mitigation/`:

1. Write a small parser in `backend/main.py`'s `/api/results` handler that
   reads those files and returns category pass/fail counts.
2. Replace `DEMO_CATEGORY_DATA` in `tyndex-frontend/src/pages/Results.tsx`
   with a `useEffect` that calls `api.results()` and shapes the response
   for the chart — the chart component itself doesn't need to change.

## 5. Deploying

Keep frontend and backend as separate deployments (e.g. frontend on
Vercel/Netlify, backend on Render/Fly/a VPS). Set `VITE_API_URL` in the
frontend's environment to the backend's public URL, and update
`allow_origins` in `backend/main.py`'s CORS config to that frontend's public
URL before going live. Never expose `GROQ_API_KEY` to the frontend — it only
ever lives in the backend's `.env`.
