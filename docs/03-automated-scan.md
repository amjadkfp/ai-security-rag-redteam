# Phase 3 — Automated Scanning

## Tools

- **garak** — https://github.com/leondz/garak — probe-based LLM vulnerability scanner
- **promptfoo** — https://github.com/promptfoo/promptfoo — adversarial eval framework, YAML-defined test cases

## garak run

```bash
# command used
garak --model_type rest --model_name <endpoint-config> --probes <probe list>
```

- **Probes run:** [list which garak probes you used and why, e.g. promptinject, dan, leakreplay]
- **Raw output:** saved to `results/pre-mitigation/garak_report.html`
- **Summary:**

| Probe | Pass rate | Notable failures |
|---|---|---|
| | | |

## promptfoo suite

- **Test cases written:** [how many, what categories]
- **Config:** `src/promptfoo/promptfooconfig.yaml`
- **Raw output:** `results/pre-mitigation/promptfoo_report.json`
- **Summary:**

| Category | Pass | Fail | Pass rate |
|---|---|---|---|
| Prompt injection | | | |
| Jailbreak | | | |
| Data leakage | | | |

## Why automate after manual testing

[1-2 sentences: manual testing built understanding of *why* attacks work; automation gives repeatable, quantifiable coverage — and is what you re-run in Phase 4 to prove mitigations work]
