# Stage 4 — Chunking experiments (1-2 days)

> ⏳ **Status: pending.** Will be written after Stage 3.

**Goal**: Holding embedding model + everything else constant, vary chunking strategy and measure impact on retrieval quality (P@1, P@3, Recall@5).

---

## Experiments to run

| Experiment | Variant | Hypothesis |
|---|---|---|
| Baseline | 500-char chunks, no overlap | reference |
| Smaller | 256-token chunks, 50 overlap | better precision, worse context |
| Larger | 1024-token chunks, 100 overlap | better context, worse precision |
| Semantic | split on `##` headings | best — natural boundaries |
| Hierarchical | parent chunks + child chunks | best for long docs |

---

## Results table (to fill in)

| Experiment | Chunks created | P@1 | P@3 | Recall@5 | Notes |
|---|---|---|---|---|---|
| Baseline (500-char) | _____ | _____ | _____ | _____ | _____ |
| Smaller (256 tokens, 50 overlap) | _____ | _____ | _____ | _____ | _____ |
| Larger (1024 tokens, 100 overlap) | _____ | _____ | _____ | _____ | _____ |
| Semantic (## headings) | _____ | _____ | _____ | _____ | _____ |
| Hierarchical | _____ | _____ | _____ | _____ | _____ |

---

## Winner & why
*(fill in after experiments)*

## What I learned about chunking
*(populate after experiments)*

---

**Previous:** [09-stage-3-evaluation-set.md](./09-stage-3-evaluation-set.md)
**Next:** [11-stage-5-embedding-experiments.md](./11-stage-5-embedding-experiments.md) (also pending)
