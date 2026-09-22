// API client for the Tyndex Lab RAG Red Team backend.
//
// The backend is a thin FastAPI wrapper around the existing src/chat.py
// retrieval + generation logic (see backend/main.py). This file never talks
// to Groq or ChromaDB directly — it only ever calls this backend.
//
// Set VITE_API_URL in a .env file at the frontend root, e.g.:
//   VITE_API_URL=http://localhost:8000

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export class ApiUnavailableError extends Error {
  constructor(message = "Backend is not reachable") {
    super(message);
    this.name = "ApiUnavailableError";
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
    });
  } catch {
    throw new ApiUnavailableError();
  }
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`${res.status} ${res.statusText}: ${body}`);
  }
  return res.json() as Promise<T>;
}

export interface HealthResponse {
  status: "ok" | "degraded";
  chroma_connected: boolean;
  llm_configured: boolean;
  documents_indexed: number;
}

export interface ChatMode {
  mode: "vulnerable" | "hardened";
}

export interface ChatRequest extends ChatMode {
  query: string;
}

export interface ChatResponse {
  answer: string;
  retrieved_sources: string[];
  model: string;
  mode: "vulnerable" | "hardened";
  latency_ms: number;
}

export interface AttackReplayRequest extends ChatMode {
  finding_id: number;
}

export interface AttackReplayResponse {
  finding_id: number;
  query: string;
  retrieved_document: string;
  constructed_prompt: string;
  model_response: string;
  mode: "vulnerable" | "hardened";
}

export const api = {
  health: () => request<HealthResponse>("/api/health"),

  chat: (body: ChatRequest) =>
    request<ChatResponse>("/api/chat", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  attackReplay: (body: AttackReplayRequest) =>
    request<AttackReplayResponse>("/api/attack-replay", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  results: () => request<unknown>("/api/results"),
};
