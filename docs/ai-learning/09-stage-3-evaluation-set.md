# Stage 3 — Evaluation set (~1 day)

> ⏳ **Status: pending.** Will be written after Stage 2.

**Goal**: Before tuning anything in Stages 4-9, build a way to MEASURE if changes help. Without an eval set, you're just guessing.

---

## What we'll build

1. **30 realistic recruiter questions** mixing easy/hard/role-specific:
   - "What's the candidate's strongest language?"
   - "Show me their Kubernetes experience"
   - "Have they shipped anything to production?"
   - "What are they currently learning?"
   - ...

2. **Gold labels** — for each question, manually identify which chunks from `content/` SHOULD be retrieved as the correct answer.

3. **Eval script** — `evaluate.py` at repo root. Runs all 30 queries, computes:
   - **Precision@1** — was the top-1 retrieved chunk correct?
   - **Precision@3** — was the correct chunk in top-3?
   - **Recall@5** — of all correct chunks, what % appeared in top-5?

4. **Baseline numbers** — run with default config (Stage 2's minimal setup) and record P@1, P@3, Recall@5. Every tuning experiment in Stages 4-9 compares against this baseline.

---

## Planned location

- `backend/data/recruiter_questions.json` — eval set (questions + gold labels)
- `evaluate.py` (repo root) — eval runner script
- `backend/data/eval_results/<timestamp>.json` — eval results over time (for tracking improvement)

## Baseline numbers (to fill in)

| Metric | Value |
|---|---|
| P@1 | _____ |
| P@3 | _____ |
| Recall@5 | _____ |

## Reflection (after building)

### What kinds of questions did the baseline fail on?

### What surprised me about the baseline performance?

---

**Previous:** [08-stage-2-minimal-rag.md](./08-stage-2-minimal-rag.md)
**Next:** [10-stage-4-chunking-experiments.md](./10-stage-4-chunking-experiments.md) (also pending)
