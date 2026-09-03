# RAG Red Team: Attack & Harden a Retrieval-Augmented LLM Application

> A hands-on offensive + defensive security assessment of a RAG-based chatbot, mapped to the OWASP Top 10 for LLM Applications and MITRE ATLAS.

**Status:** 🟡 In Progress — Phase 1 of 5 complete
**Author:** [Amjad Khaleel Farhan] | [https://www.linkedin.com/in/amjad-khaleel-farhan-97290b228/] 

---

## TL;DR (for recruiters/hiring managers)

- Built a RAG chatbot ("Tyndex Lab AI Student & IT Assistant") — LLM + vector DB — as an attack target
- Will run manual + automated adversarial testing (garak, promptfoo) covering prompt injection, indirect injection, jailbreaks, and data exfiltration
- Every finding will be mapped to **OWASP LLM Top 10** and **MITRE ATLAS** technique IDs
- Will implement layered defenses and re-run the identical attack suite to produce measurable before/after results
- **Result:** _in progress — full results land in Phase 4/5_

📄 Full report (in progress): [`docs/05-final-report.md`](docs/05-final-report.md)
📊 Before/after results (in progress): [`results/`](results/)

---

## Why this project

I'm a cybersecurity student with no prior AI/ML background, building this project to break into entry-level AI security roles (AI Red Teamer, ML Security Engineer, LLM Security Analyst). I wanted hands-on experience with how LLM-based applications actually fail — prompt injection, data leakage, jailbreaks — and how to defend against them, using the same frameworks (OWASP LLM Top 10, MITRE ATLAS) that real security teams and job postings reference.

## Architecture

- **Target system:** "Tyndex Lab AI Student & IT Assistant" — a fictional RAG chatbot for a fictional AI/cybersecurity training organization, backed by 18 internal policy documents (HR, IT, student policies)
- **LLM:** Groq API — `openai/gpt-oss-20b`
- **Embeddings:** sentence-transformers (`all-MiniLM-L6-v2`)
- **Vector store:** ChromaDB (local, persistent)
- **Guardrails:** planned for Phase 4

## Repo structure

docs/ phase-by-phase writeups, findings, final report
results/ raw scanner output, pre- and post-mitigation
src/ application code (target system + defenses)
knowledge_base/ 18 fictional internal documents (Tyndex Lab)
build_index.py embeds documents into ChromaDB
chat.py the RAG chat loop (retrieve → prompt → Groq → answer)



## How to run

```bash
pip install -r requirements.txt

# create a .env file in the project root with:
# GROQ_API_KEY=your_key_here

python src/build_index.py   # builds the vector index (run once, or after editing docs)
python src/chat.py          # starts the interactive assistant
```

## Frameworks referenced

- [OWASP Top 10 for LLM Applications](https://owasp.org/www-project-top-10-for-large-language-model-applications/)
- [MITRE ATLAS](https://atlas.mitre.org/)

## Project log

| Phase | Status | Doc |
|---|---|---|
| 0 — Foundations | 🟡 | [docs/00-foundations.md](docs/00-foundations.md) |
| 1 — Build target system | ✅ | [docs/01-architecture.md](docs/01-architecture.md) |
| 2 — Manual attacks | ⬜ | [docs/02-manual-findings.md](docs/02-manual-findings.md) |
| 3 — Automated scanning | ⬜ | [docs/03-automated-scan.md](docs/03-automated-scan.md) |
| 4 — Mitigations | ⬜ | [docs/04-mitigations.md](docs/04-mitigations.md) |
| 5 — Final report | ⬜ | [docs/05-final-report.md](docs/05-final-report.md) |
