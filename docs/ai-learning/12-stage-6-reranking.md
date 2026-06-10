# Stage 6 — Re-ranking (1-2 days)

> ⏳ **Status: pending.** Will be written after Stage 5.

**Goal**: Add a second-stage cross-encoder re-ranker. Retrieve top-20 with fast bi-encoder (Stage 5's embedding model), then re-rank top-5 with slower but more accurate cross-encoder.

---

## Why re-ranking helps

- **Bi-encoder (embedding model)**: encodes query + doc separately, compares with cosine. Fast but approximate.
- **Cross-encoder**: takes (query, doc) pair, returns relevance score directly. Slower but much more accurate because it can attend to interactions between query and doc.
- Common pattern: retrieve broad with bi-encoder (top-20), then re-rank to narrow with cross-encoder (top-5).

---

## Model to test

- `cross-encoder/ms-marco-MiniLM-L-6-v2` (the standard re-ranker for English Q&A)

---

## Experiment

Compare top-5 results without re-rank vs with re-rank, on the eval set from Stage 3.

| Metric | Without re-rank | With re-rank | Δ |
|---|---|---|---|
| P@1 | _____ | _____ | _____ |
| P@3 | _____ | _____ | _____ |
| Recall@5 | _____ | _____ | _____ |
| Avg latency / query (ms) | _____ | _____ | _____ |

---

## Decision criteria

Keep re-ranker if P@1 jumps by >5 points. Drop if marginal — latency matters for recruiter UX.

## Decision (to fill in)
*(keep or drop, with rationale based on actual numbers)*

## What I learned about re-ranking
*(populate after experiment)*

---

**Previous:** [11-stage-5-embedding-experiments.md](./11-stage-5-embedding-experiments.md)
**Next:** [13-stage-7-prompt-tuning.md](./13-stage-7-prompt-tuning.md) (also pending)
