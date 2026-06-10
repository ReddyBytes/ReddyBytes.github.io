# AI Learning Log

> Build-in-public learning trail for the RAG-powered AI assistant. Each stage = read concepts → build → evaluate → reflect → document. The log itself becomes a recruiter signal ("this candidate doesn't just use AI tools — they understand them").

See [`../RAG-BACKEND.md`](../RAG-BACKEND.md) for the architecture overview; this folder captures the **learning journey**.

---

## How to read this folder

Files are numbered for reading order. Start at `00-glossary.md`, then proceed through each file in sequence.

| File | Topic | Status |
|---|---|---|
| [00-glossary.md](./00-glossary.md) | Every term defined in plain English | ✅ |
| [01-big-picture.md](./01-big-picture.md) | What RAG is — closed-book vs open-book | ✅ |
| [02-embeddings.md](./02-embeddings.md) | Concept 1 — turn text into vectors | ✅ |
| [03-chunking.md](./03-chunking.md) | Concept 2 — split long docs into pieces | ✅ |
| [04-vector-db.md](./04-vector-db.md) | Concept 3 — store + search vectors fast (FAISS) | ✅ |
| [05-retrieval.md](./05-retrieval.md) | Concept 4 — pick the best chunks for a question | ✅ |
| [06-rag-pattern.md](./06-rag-pattern.md) | Concept 5 — recipe combining chunks + question + LLM | ✅ |
| [07-hallucination.md](./07-hallucination.md) | Concept 6 — why LLMs lie, how to reduce it | ✅ |
| [08-stage-2-minimal-rag.md](./08-stage-2-minimal-rag.md) | Stage 2 — minimal end-to-end RAG in code (~30 lines) | ⏳ |
| [09-stage-3-evaluation-set.md](./09-stage-3-evaluation-set.md) | Stage 3 — 30 recruiter questions + P@k baseline | ⏳ |
| [10-stage-4-chunking-experiments.md](./10-stage-4-chunking-experiments.md) | Stage 4 — test chunk sizes + strategies | ⏳ |
| [11-stage-5-embedding-experiments.md](./11-stage-5-embedding-experiments.md) | Stage 5 — test embedding model alternatives | ⏳ |
| [12-stage-6-reranking.md](./12-stage-6-reranking.md) | Stage 6 — cross-encoder re-ranker on top-20 → top-5 | ⏳ |
| [13-stage-7-prompt-tuning.md](./13-stage-7-prompt-tuning.md) | Stage 7 — system prompt + temperature + few-shot | ⏳ |
| [14-stage-8-recruiter-modes.md](./14-stage-8-recruiter-modes.md) | Stage 8 — specialized prompts per role | ⏳ |
| [15-stage-9-production-hardening.md](./15-stage-9-production-hardening.md) | Stage 9 — rate limits, cache, cold-start, streaming, eval-in-CI | ⏳ |

---

## Why we treat the RAG as a learning project (not just shipping code)

Going straight from "build RAG" → working code teaches you wiring but not the *why*. Stage-by-stage with **evaluation between stages** teaches you how each piece affects quality.

Recruiters can tell the difference between "wired LangChain together" and "tuned chunk size after measuring retrieval precision". The second wins.

The workflow per stage:
1. **Read** — 1-2 hours of docs/articles on the concept
2. **Sketch** — write notes in your own words (the "Your notes" sections in each file)
3. **Build** — implement the smallest version that works
4. **Evaluate** — run the eval script, record numbers
5. **Reflect** — write what you learned, what surprised you, what to try next
6. **Update** — bump `../RAG-BACKEND.md` with the new approach if architecture changed

---

## Progress checklist

### Stage 1 — Concepts (NO code, ~1 day)
- [x] 00-glossary
- [x] 01-big-picture
- [x] 02-embeddings
- [x] 03-chunking
- [x] 04-vector-db
- [x] 05-retrieval
- [x] 06-rag-pattern
- [x] 07-hallucination

**Stage 1 status: ALL 6 CONCEPTS WRITTEN.** Read each, fill in your own notes + reflections, then proceed to Stage 2.

### Stages 2-9 — Build, evaluate, tune
- [ ] Stage 2 — minimal end-to-end
- [ ] Stage 3 — evaluation set
- [ ] Stage 4 — chunking experiments
- [ ] Stage 5 — embedding experiments
- [ ] Stage 6 — re-ranking
- [ ] Stage 7 — prompt tuning
- [ ] Stage 8 — recruiter modes
- [ ] Stage 9 — production hardening

---

## Future (Phase 3+ — after baseline RAG is shipped)

- [ ] Fine-tune embeddings on portfolio content (contrastive learning)
- [ ] LoRA fine-tune small LLM (Llama-3.2-1B) for Penchala-voice — runs on HF Space T4 if upgraded
- [ ] Hybrid search (vector + BM25) for rare-term recall
- [ ] Query rewriting (LLM expands query before retrieval)
- [ ] Conversational memory (session-scoped multi-turn)
- [ ] Self-RAG / iterative retrieval

---

## Resources used (running list — add as you read)

*(empty — populate as you go through reading lists in each concept file)*
