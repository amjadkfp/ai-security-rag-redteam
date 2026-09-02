# Phase 1 — Target System Architecture

## Overview

[1 paragraph: what the chatbot does, what knowledge base it has, who the fictional "user" is]

## Data flow

1. User submits query
2. Query embedded via `all-MiniLM-L6-v2`
3. Top-k chunks retrieved from ChromaDB
4. Retrieved chunks + system prompt + query assembled into final prompt
5. Sent to Groq API (Llama 3.1/3.3)
6. Response returned to user

## Diagram

![architecture](assets/architecture.png)

## Knowledge base

- Number of documents: [ ]
- Topics covered: [ ]
- **Planted injection payload:** describe the "confidential note" document you'll use in Phase 2, and *why* it's a realistic analog for a real internal doc an attacker might poison

## System prompt (v1, pre-hardening)

```
[paste your initial, unhardened system prompt here — you'll compare this
against the hardened version in Phase 4]
```

## Design decisions

| Decision | Options considered | Why this one |
|---|---|---|
| LLM provider | Groq / Gemini / local Ollama | |
| Vector store | ChromaDB / FAISS | |
| Embedding model | all-MiniLM-L6-v2 / other | |

## Setup instructions

```bash
# fill in once built
pip install -r requirements.txt
python src/build_index.py
python src/chat.py
```
