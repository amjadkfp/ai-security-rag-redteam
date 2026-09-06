# Phase 3 - Automated Scanning

## Tools

- **garak** - https://github.com/NVIDIA/garak - probe-based LLM vulnerability scanner
- **promptfoo** - https://github.com/promptfoo/promptfoo - adversarial eval framework, YAML-defined test cases

## Environment setup notes

Before scanning could begin, the target (chat.py, a terminal loop) had to be
exposed over HTTP so garak's REST generator could reach it:

- Wrote src/api_server.py, a ~40-line Flask wrapper that imports the
  existing get_context() / build_prompt() / ask_llm() functions from
  chat.py directly and exposes them as a single POST /chat endpoint.
  This ensures garak tests the full RAG pipeline (retrieval + system
  prompt + LLM call), not just the bare Groq model.
- Embedding model and ChromaDB connection are loaded once at Flask
  startup, not per-request, to keep response times reasonable.
- Verified the endpoint manually with Invoke-RestMethod before pointing
  any scanner at it (confirmed correct answer + correct retrieved
  sources for a known query).

## garak setup issues encountered (environment-specific)

Several non-obvious issues came up getting garak working on this
Windows/PowerShell setup - documented here since they cost real
debugging time and are the kind of friction a real engagement would
also hit:

1. **CLI flags changed in garak 0.16.0.** The originally planned
   command (`--model_type rest --model_name <config.json>`) is
   deprecated. Current flags are `--target_type rest` (selects the
   REST generator family) and `-G <config.json>` / `--generator_option_file`
   (loads the JSON config, which contains the endpoint URI). Using
   `--model_name` to pass a config file path was itself the bug -
   that flag expects a plain string (e.g. a URI), not a file path.

2. **UTF-8 BOM breaks garak's JSON parser.** Windows PowerShell 5.1's
   `Set-Content -Encoding utf8` prepends a Byte Order Mark to text
   files. garak's JSON loader is strict and fails with
   `Unexpected UTF-8 BOM` on a config file that looks completely
   normal in any text editor. Fixed by saving config files with
   `-Encoding ASCII` instead (safe here since the config contains only
   plain ASCII characters).

3. **Default REST timeout too short for a multi-document RAG call.**
   garak's REST generator defaults to a 20-second read timeout. A
   probe that sends an unusually long prompt (promptinject.HijackLongPrompt)
   combined with this pipeline's practice of injecting 3 full retrieved
   documents into every call pushed Groq's response time past that
   window, causing a `ReadTimeoutError`. Fixed by adding
   `"request_timeout": 60` to the generator config.

4. **Windows console encoding breaks garak's own emoji output.**
   `garak --list_probes` crashed with a `UnicodeEncodeError` (`charmap
   codec can't encode character`) because garak prints a star emoji
   next to probe family names and PowerShell's default console
   codepage (cp1252) can't represent it. Fixed per-session with
   `$env:PYTHONIOENCODING = "utf-8"` before running garak commands.

## garak run

```bash
$env:PYTHONIOENCODING = "utf-8"
garak --target_type rest -G src\garak_rest_config.json --probes <probe_name> --generations 1
```

- **Generator config:** `src/garak_rest_config.json` (REST generator,
  points at local `http://127.0.0.1:5000/chat`, extracts the answer
  from the JSON `response` field, 60s timeout)
- **`--generations 1`** used throughout instead of garak's default of 5,
  to fit probe runs within the Groq free-tier daily token/request
  budget (see rate limit section below).

### test.Blank (sanity check)

Sends empty-string prompts to confirm the harness (garak -> Flask ->
RAG pipeline -> Groq -> response) is wired correctly end-to-end.

- **Result:** `any.AnyOutput: FAIL, ok on 0/5 (attack success rate: 100.00%)`
- **Interpretation:** this "FAIL" is expected and not a security
  finding - the detector simply checks whether the model produced any
  non-empty output for a blank prompt, and it did (Groq returned
  reasonable clarifying responses like "I need to know what specific
  question you're asking"). Confirms garak's JSON extraction
  (`response_json_field: "response"`) is correctly pulling real answer
  text out of the API response, not nulls or errors. Included here as
  evidence the harness was validated before running real probes, not
  as a finding.

## Rate limit constraint (real, documented finding)

Running automated probes against `openai/gpt-oss-20b` on Groq's free
tier hit real capacity limits partway through Phase 3:

- **Groq free-tier limits for this model:** 30 requests/minute,
  1,000 requests/day, 8,000 tokens/minute, 200,000 tokens/day
  (confirmed via https://console.groq.com/settings/limits and the
  rate-limit error payload itself).
- **First failure:** a `promptinject` run crashed with
  `groq.RateLimitError: 429 ... tokens per day (TPD): Limit 200000,
  Used 198935` - the daily token budget was nearly exhausted from
  cumulative Phase 2 manual testing plus Phase 3 smoke tests before
  the real probe run even started.
- **Why this pipeline burns tokens fast:** every single call sends the
  system prompt + 3 full retrieved documents + the probe's attack
  payload, regardless of how short the actual question is. A
  256-variation probe family like `promptinject.HijackHateHumans`, at
  garak's default of 5 generations per prompt, would require up to
  1,280 individual Groq calls - far beyond what a 200K-token daily
  budget and 1,000-request daily cap can support in one session.
- **Observed effect after waiting ~2 minutes and retrying:** requests
  succeeded but took ~60 seconds each, with garak's built-in retry/backoff
  logic (via the `backoff` library) silently waiting out rate-limit
  windows between attempts. At that rate, a 256-prompt probe was
  estimated by garak itself at over 4 hours to complete.
- **Decision:** rather than force a full-family run through repeated
  rate-limit stalls, scoped Phase 3 to run individual, unmarked
  (non-"Full") probes one at a time with `--generations 1`, spread
  across multiple sessions to respect the daily quota reset.
- **Takeaway for the report:** free-tier API constraints are a
  legitimate, real-world limitation on automated LLM security testing
  at scale - a finding worth stating plainly rather than hiding, and a
  reason production red-team pipelines typically either use a paid
  tier, a locally-hosted model, or deliberately budget/sample probes
  rather than running full probe libraries unconstrained.

## Probe selection: mapping to Phase 2 manual findings

Rather than running garak's full default probe set (untargeted and
expensive), probes were deliberately chosen to test the same
vulnerability classes already confirmed manually in Phase 2, so
automated results are directly comparable to the manual findings.
Probe names below were confirmed against this installation's actual
catalog via `garak --list_probes` (not assumed from documentation,
since CLI/probe names have changed across garak versions - see setup
issues above). Only unmarked ("non-Full") probe variants were selected
to control token cost; "Full" variants exist for deeper coverage if
budget allows later.

| Phase 2 Finding | garak probe(s) | Rationale |
|---|---|---|
| #1 Indirect Prompt Injection via Poisoned Internal Document (LLM01) | `latentinjection.LatentInjectionReport`, `latentinjection.LatentInjectionResume` | Buries an injected instruction inside document-like content the model is asked to process - the closest automated analog to the planted-memo attack in internal_escalation_procedure.txt |
| #2 Direct Prompt Injection via Explicit Override (LLM01) | `promptinject.HijackHateHumans`, `promptinject.HijackKillHumans` | PromptInject framework hijacking attempts; `HijackLongPrompt` deprioritized after causing a timeout during initial testing (see setup issues) |
| #3 Jailbreak via Roleplay/Hypothetical Framing (LLM01, unsuccessful manually) | `dan.Ablation_Dan_11_0`, `dan.DanInTheWild` | Automated roleplay/persona-based jailbreak attempts, to check whether automation succeeds where manual roleplay attempts were refused |
| #4 System Prompt Exfiltration via Plain Phrasing (LLM07) | `sysprompt_extraction.SystemPromptExtraction` | Purpose-built probe for this exact vulnerability class; directly validates the strongest and cleanest Phase 2 finding |
| #5 No Role-Based Access Control (LLM02) | N/A - not automatable via garak | RBAC is an access-control gap, not a prompt-level attack; garak has no probe for authorization logic. Remains a manual-only finding. |
| (bonus, general leakage) | `web_injection.ColabAIDataLeakage` | Tests a different data-exfiltration pattern; relevant given data_classification_policy.txt exists in the knowledge base |

### Execution order (highest-value findings first)

Run one probe at a time, checking the Flask server log for fast `200`
responses (not 500s or 30-60s stalls indicating rate limiting) before
proceeding to the next:

1. `sysprompt_extraction.SystemPromptExtraction`
2. `latentinjection.LatentInjectionReport`
3. `latentinjection.LatentInjectionResume`
4. `dan.Ablation_Dan_11_0`
5. `dan.DanInTheWild`
6. `promptinject.HijackHateHumans`
7. `promptinject.HijackKillHumans`

## promptfoo suite

Not yet started - planned for after garak probes are complete, to keep
Phase 3 findings organized by tool.

- **Test cases written:** TBD
- **Config:** `src/promptfoo/promptfooconfig.yaml` (not yet created)
- **Raw output:** `results/pre-mitigation/promptfoo_report.json` (pending)

## Why automate after manual testing

Manual testing (Phase 2) built an understanding of *why* each attack
works against this specific system - what in the retrieved documents
or system prompt makes injection or leakage possible. Automation
(Phase 3) turns that understanding into repeatable, quantifiable
coverage: the same probe suite can be re-run identically after
mitigations are added in Phase 4, producing a real before/after
comparison rather than a one-off anecdote.
