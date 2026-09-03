"""
build_index.py

Reads every .txt file in src/knowledge_base/, converts each one into a
vector embedding, and stores it in a local ChromaDB collection so it can
be searched later by chat.py.

Run this once (and again any time you add/change a document):
    python src/build_index.py
"""

import os
import chromadb
from sentence_transformers import SentenceTransformer

KB_DIR = os.path.join(os.path.dirname(__file__), "knowledge_base")
DB_DIR = os.path.join(os.path.dirname(__file__), "..", "chroma_db")
COLLECTION_NAME = "tyndex_lab_kb"

def main():
    print("Loading embedding model (all-MiniLM-L6-v2)...")
    # This model turns text into a 384-number vector that captures its
    # meaning. Runs entirely on CPU, ~80MB, no GPU needed.
    embedder = SentenceTransformer("all-MiniLM-L6-v2")

    print("Connecting to local ChromaDB...")
    # PersistentClient writes the vector database to disk at DB_DIR,
    # so it survives between runs (you don't have to re-embed every time).
    client = chromadb.PersistentClient(path=DB_DIR)

    # Wipe and recreate the collection each time this script runs, so the
    # index always matches exactly what's in knowledge_base/.
    try:
        client.delete_collection(COLLECTION_NAME)
    except Exception:
        pass
    collection = client.create_collection(COLLECTION_NAME)

    documents = []
    metadatas = []
    ids = []

    filenames = sorted(f for f in os.listdir(KB_DIR) if f.endswith(".txt"))
    print(f"Found {len(filenames)} documents in knowledge_base/")

    for i, filename in enumerate(filenames):
        filepath = os.path.join(KB_DIR, filename)
        with open(filepath, "r", encoding="utf-8") as f:
            text = f.read()

        # For this project we keep it simple: one document = one chunk.
        # (In a production RAG system you'd usually split long docs into
        # smaller chunks, but for ~18 short policy docs, whole-document
        # chunks keep things easy to reason about and easy to attack/debug.)
        documents.append(text)
        metadatas.append({"source": filename})
        ids.append(f"doc_{i}")

    print("Generating embeddings...")
    embeddings = embedder.encode(documents).tolist()

    print("Writing to ChromaDB collection...")
    collection.add(
        documents=documents,
        embeddings=embeddings,
        metadatas=metadatas,
        ids=ids,
    )

    print(f"Done. Indexed {len(documents)} documents into '{COLLECTION_NAME}'.")
    print(f"Vector DB stored at: {DB_DIR}")

if __name__ == "__main__":
    main()
