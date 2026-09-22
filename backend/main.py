"""
main.py

FastAPI backend for the Tyndex Lab RAG Red Team Lab website. This is the
only thing the frontend ever talks to — it never touches Groq or ChromaDB
directly. Wraps the existing chat.py logic (refactored into
src/rag_engine.py) behind a small REST API.

Setup (run from your project root, D:\rag-red-team):
    pip install fastapi uvicorn[standard]
    # existing requirements.txt (groq, chromadb, sentence-transformers,
    # python-dotenv) must already be installed and chroma_db/ built via
    # python src/build_index.py

Run:
    uvicorn backend.main:app --reload --port 8000

The frontend expects this to be reachable at VITE_API_URL
(defaults to http://localhost:8000).
"""

import os
import sys

# Allow importing rag_engine.py whether this file lives at backend/main.py
# (repo root) or has been moved into src/ alongside chat.py.
sys.path.insert(0, os.path.dirname(__file__))
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "src"))

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Literal

try:
    import rag_engine
except ImportError as e:
    raise ImportError(
        "Could not import rag_engine. Copy backend/rag_engine.py to src/rag_engine.py "
        "(next to chat.py), or run uvicorn from a location where src/ is importable."
    ) from e

from findings_data import FINDINGS

app = FastAPI(title="Tyndex Lab RAG Red Team API")

# Dev-friendly CORS. Tighten allow_origins to your deployed frontend URL
# before any public deployment.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

Mode = Literal["vulnerable", "hardened"]


class ChatRequest(BaseModel):
    query: str
    mode: Mode = "vulnerable"


class AttackReplayRequest(BaseModel):
    finding_id: int
    mode: Mode = "vulnerable"


@app.get("/api/health")
def health():
    return rag_engine.health_check()


@app.post("/api/chat")
def chat(body: ChatRequest):
    if not body.query.strip():
        raise HTTPException(400, "query must not be empty")
    try:
        result = rag_engine.run_query(body.query, body.mode)
    except Exception as e:
        raise HTTPException(502, f"RAG engine error: {e}")
    return {
        "answer": result["answer"],
        "retrieved_sources": result["retrieved_sources"],
        "model": result["model"],
        "mode": result["mode"],
        "latency_ms": result["latency_ms"],
    }


@app.post("/api/attack-replay")
def attack_replay(body: AttackReplayRequest):
    finding = FINDINGS.get(body.finding_id)
    if not finding:
        raise HTTPException(404, f"No finding with id {body.finding_id}")
    try:
        result = rag_engine.run_query(finding["query"], body.mode)
    except Exception as e:
        raise HTTPException(502, f"RAG engine error: {e}")
    retrieved = result["retrieved_sources"][0] if result["retrieved_sources"] else "none"
    return {
        "finding_id": body.finding_id,
        "query": finding["query"],
        "retrieved_document": retrieved,
        "constructed_prompt": result["constructed_prompt"],
        "model_response": result["answer"],
        "mode": result["mode"],
    }


@app.get("/api/findings")
def list_findings():
    return FINDINGS


@app.get("/api/results")
def results():
    # Placeholder until Phase 3/4 scanner output exists. Wire this up to
    # parse results/pre-mitigation/ and results/post-mitigation/ once those
    # files are populated by garak/promptfoo.
    raise HTTPException(
        501,
        "Automated scan results not yet available — Phase 3/4 in progress. "
        "Wire this endpoint to results/pre-mitigation/ and results/post-mitigation/ once populated.",
    )


@app.get("/api/reports")
def reports():
    docs_dir = os.path.join(os.path.dirname(__file__), "..", "docs")
    if not os.path.isdir(docs_dir):
        raise HTTPException(404, "docs/ directory not found relative to backend/")
    return sorted(f for f in os.listdir(docs_dir) if f.endswith(".md"))


@app.get("/api/methodology")
def methodology():
    return {
        "manual_checklist": [
            "Direct prompt injection",
            "Indirect prompt injection",
            "Jailbreak via roleplay/hypothetical framing",
            "System prompt exfiltration",
            "Sensitive data exfiltration",
            "Excessive agency",
        ],
        "automated_tools": ["garak", "promptfoo"],
    }
