export const vulnerablePipeline = [
  { label: "User Query", detail: "Typed into the terminal chat loop, no auth" },
  { label: "Embed Query", detail: "all-MiniLM-L6-v2, sentence-transformers" },
  { label: "ChromaDB Search", detail: "Top-3 similarity match, whole-document chunks" },
  { label: "Retrieved Documents", detail: "Concatenated with no trust boundary or source filtering" },
  { label: "Prompt Assembly", detail: "System prompt + raw documents + question, no delimiters" },
  { label: "Groq LLM", detail: "openai/gpt-oss-20b, temperature 0.2" },
  { label: "Response", detail: "Returned as-is, no output validation" },
];

export const hardenedPipeline = [
  { label: "Input Validation", detail: "Planned — reject or flag adversarial patterns before retrieval" },
  { label: "Authentication / Authorization", detail: "Planned — establish requester role" },
  { label: "Secure Retrieval", detail: "Planned — filter retrieval by role before documents reach the prompt" },
  { label: "Untrusted Context Handling", detail: "Planned — delimiter-based separation of instructions vs. retrieved content" },
  { label: "Groq LLM", detail: "Hardened system prompt with explicit refusal + non-disclosure rules" },
  { label: "Output Validation", detail: "Planned — guardrail classifier on model output before it reaches the user" },
  { label: "Response", detail: "Returned to user" },
];
