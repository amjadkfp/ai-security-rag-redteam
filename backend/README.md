# Backend — Tyndex Lab RAG Red Team API

Thin FastAPI layer around your existing `src/chat.py` retrieval + generation
logic. It does not replace `chat.py` or create a second chatbot — it imports
the same pipeline, refactored into reusable functions in `rag_engine.py`.

## Install into your existing repo

From your project root (`D:\rag-red-team`):

```
copy backend\main.py            backend\main.py
copy backend\rag_engine.py      src\rag_engine.py
copy backend\findings_data.py   backend\findings_data.py
```

Layout should end up looking like:

```
rag-red-team/
  backend/
    main.py
    findings_data.py
  src/
    chat.py
    build_index.py
    rag_engine.py      <- new
    knowledge_base/
  chroma_db/            (built by build_index.py)
  docs/
  .env                  GROQ_API_KEY=...
```

## Install & run

```
pip install -r backend/requirements.txt
python src/build_index.py     # if chroma_db/ isn't built yet
uvicorn backend.main:app --reload --port 8000
```

Check it's alive:

```
curl http://localhost:8000/api/health
```

## Endpoints implemented

| Method | Path | Purpose |
|---|---|---|
| GET | /api/health | Chroma connectivity + Groq key presence, no LLM call |
| POST | /api/chat | `{query, mode}` -> retrieves + generates, vulnerable or hardened |
| POST | /api/attack-replay | `{finding_id, mode}` -> replays a documented finding's query |
| GET | /api/findings | Raw finding query/title lookup table |
| GET | /api/reports | Lists markdown files in docs/ |
| GET | /api/results | 501 until Phase 3/4 scanner output exists — wire up once real |
| GET | /api/methodology | Static checklist + tool list |

## Notes

- `mode: "hardened"` uses a second, hardened system prompt defined in
  `rag_engine.py` (`SYSTEM_PROMPT_HARDENED`) — it does **not** touch
  `chat.py`'s `SYSTEM_PROMPT`, so your Phase 2/3 baseline stays reproducible.
  Replace `SYSTEM_PROMPT_HARDENED` with your actual Phase 4 hardened prompt
  once you've written and tested it.
- CORS is currently open to `localhost:5173` only (Vite's dev server). Widen
  or restrict this in `main.py` before any public deployment, and add rate
  limiting — this endpoint calls a paid/rate-limited Groq model.
- Never commit `.env` or your `GROQ_API_KEY` — this backend reads it the
  same way `chat.py` does, via `python-dotenv`.
