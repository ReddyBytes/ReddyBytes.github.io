# Stage 5 — Embedding model experiments (1-2 days)

> ⏳ **Status: pending.** Will be written after Stage 4.

**Goal**: Holding chunking strategy constant (Stage 4's winner), swap embedding models and measure impact on retrieval quality.

---

## Models to test

| Model | Size | Dims | Expected behavior |
|---|---|---|---|
| `all-MiniLM-L6-v2` | 22MB | 384 | fastest, baseline quality |
| `all-mpnet-base-v2` | 420MB | 768 | better quality, slower |
| `BAAI/bge-base-en-v1.5` | 440MB | 768 | best for size, SOTA on benchmarks |
| `BAAI/bge-large-en-v1.5` | 1.3GB | 1024 | top quality, may be overkill |

---

## Results table (to fill in)

| Model | Embed time / query (ms) | Index build time (s) | RAM used (MB) | P@1 | P@3 | Recall@5 |
|---|---|---|---|---|---|---|
| `all-MiniLM-L6-v2` | _____ | _____ | _____ | _____ | _____ | _____ |
| `all-mpnet-base-v2` | _____ | _____ | _____ | _____ | _____ | _____ |
| `BAAI/bge-base-en-v1.5` | _____ | _____ | _____ | _____ | _____ | _____ |
| `BAAI/bge-large-en-v1.5` | _____ | _____ | _____ | _____ | _____ | _____ |

---

## Quality vs speed tradeoff (winner)
*(pick based on actual numbers — quality matters more if delta is significant; speed matters more if delta is small)*

## What I learned about embedding models
*(populate after experiments)*

---

**Previous:** [10-stage-4-chunking-experiments.md](./10-stage-4-chunking-experiments.md)
**Next:** [12-stage-6-reranking.md](./12-stage-6-reranking.md) (also pending)
