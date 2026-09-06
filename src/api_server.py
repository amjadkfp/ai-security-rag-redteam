"""
api_server.py

A thin Flask wrapper around the existing RAG pipeline from chat.py, so
tools like garak (which talk HTTP, not Python function calls) can send
requests through the REAL pipeline: retrieval -> prompt assembly -> Groq.

This does NOT change any RAG logic -- it just exposes the same functions
chat.py already uses, over a single HTTP endpoint.

Run it with:
    python src/api_server.py

Then POST to http://127.0.0.1:5000/chat with JSON body: {"prompt": "..."}
"""

import os
from flask import Flask, request, jsonify
import chromadb
from sentence_transformers import SentenceTransformer
from groq import Groq
from dotenv import load_dotenv

from chat import get_context, build_prompt, ask_llm, DB_DIR, COLLECTION_NAME

load_dotenv()

app = Flask(__name__)

# Load once at startup, not per-request -- loading the embedding model
# on every request would make each garak probe extremely slow.
print("Loading embedding model...")
embedder = SentenceTransformer("all-MiniLM-L6-v2")

print("Connecting to ChromaDB...")
chroma_client = chromadb.PersistentClient(path=DB_DIR)
collection = chroma_client.get_collection(COLLECTION_NAME)

groq_client = Groq(api_key=os.environ.get("GROQ_API_KEY"))


@app.route("/chat", methods=["POST"])
def chat_endpoint():
    data = request.get_json(force=True)
    user_query = data.get("prompt", "")

    docs, sources = get_context(user_query, embedder, collection)
    full_prompt = build_prompt(user_query, docs)
    answer = ask_llm(groq_client, full_prompt)

    # garak's generic REST generator expects a plain string/dict response
    # it can parse -- we return both the answer and sources for our own
    # debugging, but garak will typically be configured to read "response"
    return jsonify({"response": answer, "sources": sources})


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000)
