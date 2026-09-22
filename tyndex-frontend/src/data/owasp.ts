export interface OwaspCategory {
  id: string;
  name: string;
  summary: string;
  findingIds: number[];
}

export const owaspTop10: OwaspCategory[] = [
  { id: "LLM01", name: "Prompt Injection", summary: "Crafted input overrides or redirects the model's intended instructions, either typed directly by a user or planted inside content the model later retrieves.", findingIds: [1, 2, 3] },
  { id: "LLM02", name: "Sensitive Information Disclosure", summary: "The model surfaces data the requester shouldn't see, because nothing in the pipeline checks who is asking before content is served.", findingIds: [5] },
  { id: "LLM03", name: "Supply Chain", summary: "Vulnerabilities inherited from third-party models, embeddings, plugins, or training data the application depends on.", findingIds: [] },
  { id: "LLM04", name: "Data and Model Poisoning", summary: "Training or retrieval data is tampered with to bias outputs or plant hidden behavior — the same mechanism behind indirect injection, at the corpus level.", findingIds: [] },
  { id: "LLM05", name: "Improper Output Handling", summary: "Model output is trusted and passed downstream (to a shell, a browser, another system) without validation.", findingIds: [] },
  { id: "LLM06", name: "Excessive Agency", summary: "The model is given more permissions, tools, or autonomy than the task actually requires.", findingIds: [] },
  { id: "LLM07", name: "System Prompt Leakage", summary: "The system prompt — meant to be a private instruction layer — can be extracted by the end user.", findingIds: [4] },
  { id: "LLM08", name: "Vector and Embedding Weaknesses", summary: "Weaknesses in how vectors are generated, stored, or queried let an attacker manipulate what gets retrieved.", findingIds: [] },
  { id: "LLM09", name: "Misinformation", summary: "The model produces confident, plausible-sounding output that is factually wrong.", findingIds: [] },
  { id: "LLM10", name: "Unbounded Consumption", summary: "Uncontrolled inference requests drive excessive cost, latency, or denial of service.", findingIds: [] },
];
