# Phase 4 — Mitigations

## Mitigation 1: System prompt hardening

**Before:**
```
[v1 system prompt from docs/01-architecture.md]
```

**After:**
```
[hardened version — explicit refusal instructions, delimiter-based
separation of instructions vs retrieved content]
```

**Rationale:** [why this specific change addresses which finding(s)]

## Mitigation 2: Input/output guardrails

- **Tool:** Llama Guard (via Groq) — or custom similarity classifier
- **What it checks:**
- **Where in the pipeline it sits:** [before LLM call / after LLM call / both]

## Mitigation 3: Retrieval sanitization

- **Approach:** [how you detect/strip instruction-like text in retrieved chunks before they enter the prompt]
- **Limitations:** [be honest — no filter is perfect, note false positive/negative tradeoffs]

## Re-test results

Ran the identical garak + promptfoo suite from Phase 3 against the hardened system.

| Category | Pre-mitigation pass rate | Post-mitigation pass rate | Δ |
|---|---|---|---|
| Prompt injection | | | |
| Jailbreak | | | |
| Data leakage | | | |
| Indirect injection | | | |

📊 See `results/post-mitigation/` for raw output.

## What's still not fully fixed

[Be honest — real security reports acknowledge residual risk. This is a credibility signal, not a weakness.]
