# Stage 9 — Production hardening (1 day)

> ⏳ **Status: pending.** Final stage of the curriculum. Will be written after Stage 8.

**Goal**: Make the RAG survive real recruiter traffic. Once retrieval + generation work well, add the real-world layer.

---

## Hardening checklist

- [ ] **Rate limit**: 10 req/min, 100/day per IP (slowapi)
- [ ] **Response cache**: LRU on identical queries within 1 hour (saves Gemini quota)
- [ ] **Cold-start UX**: when HF Space wakes, frontend shows "AI is waking up... ~15s" (not generic spinner)
- [ ] **Streaming responses (SSE)**: tokens appear progressively, not after a 5-second wait
- [ ] **Logging**: every query + retrieved chunks + generation logged (anonymized — hashed IP, not raw)
- [ ] **Eval-in-CI**: every PR re-runs Stage 3 eval; fail if quality drops > 5 points
- [ ] **Error handling**: graceful degradation if all LLMs fail (return cached FAQ)
- [ ] **Circuit breaker**: if Gemini fails 3x in 30s, switch to Claude for 60s before retrying Gemini

---

## What this stage produces

- Production-ready RAG endpoint that handles failures gracefully
- Monitoring + alerting on quality regressions
- Cost-conscious caching layer
- Recruiter-grade UX on cold-start + slow-LLM scenarios

---

## Reflection slots (after build)

### Most surprising production issue
*(populate after going live)*

### What broke that I didn't expect
*(populate after going live)*

### How the eval-in-CI gate caught issues
*(populate over time as PRs are blocked)*

---

## After this stage

Stage 9 marks the end of the curriculum. The RAG is production-ready, evaluation-driven, and resilient.

**Phase 3+ (future, after baseline ships) — defer until baseline is live:**

- [ ] Fine-tune embeddings on portfolio content (contrastive learning on (Q, correct-chunk) pairs)
- [ ] LoRA fine-tune a small LLM (Llama-3.2-1B) for Penchala-voice responses — runs on HF Space T4 if upgraded
- [ ] Hybrid search (vector + BM25) for rare-term recall
- [ ] Query rewriting (LLM expands query before retrieval)
- [ ] Conversational memory (session-scoped multi-turn)
- [ ] Self-RAG / iterative retrieval

See [README.md](./README.md) Future section for full Phase 3+ list.

---

**Previous:** [14-stage-8-recruiter-modes.md](./14-stage-8-recruiter-modes.md)
**Curriculum complete!** See [README.md](./README.md) for the full progress tracker.
