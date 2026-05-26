# Stage 7 — Prompt + generation tuning (ongoing)

> ⏳ **Status: pending.** Will be written after Stage 6.

**Goal**: Now that retrieval is optimal, tune the LLM-side parameters and prompts for best answer quality.

---

## Experiments to run

### 1. System prompt iteration
Start with a baseline ("You are Penchala's AI assistant..."). Test 5 variants. Pick best based on eval set + manual review.

| Variant | Description | Quality (manual review) |
|---|---|---|
| v1 (baseline) | Generic helpful assistant | _____ |
| v2 (cite sources) | Explicit "always cite [source: X]" | _____ |
| v3 (refuse if unsure) | Adds "if context insufficient, say so" | _____ |
| v4 (concise) | Adds "answer in 2-3 sentences max" | _____ |
| v5 (all of above) | Combined | _____ |

### 2. Temperature tuning
- 0.0 — fully deterministic (factual questions)
- 0.3 — slight creativity (conversational tone)
- 0.7 — too creative (rejected for portfolio)

### 3. Few-shot examples
Give the LLM 2-3 example (Q, A) pairs in the system prompt. Compare consistency before vs after.

### 4. Output format constraints
- "Answer in 2-3 sentences"
- "Always cite source files in brackets [source: about.md]"
- "If context doesn't contain the answer, say 'I don't have that info — check the projects section'"

---

## Best final prompt (to fill in)
*(record final version of system prompt after experimentation)*

```
<final system prompt goes here>
```

## What I learned about prompt tuning
*(populate after experiments)*

---

**Previous:** [12-stage-6-reranking.md](./12-stage-6-reranking.md)
**Next:** [14-stage-8-recruiter-modes.md](./14-stage-8-recruiter-modes.md) (also pending)
