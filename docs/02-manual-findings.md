# Phase 2 — Manual Attack Findings

Write each finding like a real pentest report entry. Copy the template below per finding.

---

## Finding template (copy for each attack)

### [Finding #] — [Short title, e.g. "Indirect Prompt Injection via Poisoned HR Document"]

- **OWASP LLM category:** LLM0X — [name]
- **MITRE ATLAS technique:** AML.T0XXX — [name]
- **Severity:** Critical / High / Medium / Low
- **Attack type:** Direct injection / Indirect injection / Jailbreak / Exfiltration / Excessive agency

**Description:**
[What the vulnerability is, in 2-3 sentences]

**Reproduction steps:**
1.
2.
3.

**Payload used:**
```
[exact prompt or planted document text]
```

**Observed response:**
```
[exact model output — screenshot or paste]
```

**Impact:**
[What a real attacker could do with this]

**Recommended fix:**
[link forward to Phase 4 mitigation that addresses this]

---

## Findings log

| # | Title | Category | Severity | Status |
|---|---|---|---|---|
| 1 | | | | Open |
| 2 | | | | Open |
| 3 | | | | Open |

## Attacks to attempt (checklist)

- [ ] Direct prompt injection — override system instructions
- [ ] Indirect prompt injection — instruction planted in retrieved document
- [ ] Jailbreak — roleplay/hypothetical framing to bypass refusal
- [ ] System prompt exfiltration
- [ ] Sensitive data exfiltration from knowledge base
- [ ] Excessive agency test (if any tool/action access exists)
