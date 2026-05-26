# Stage 8 — Recruiter modes (1 day)

> ⏳ **Status: pending.** Will be written after Stage 7.

**Goal**: Add specialized prompts per recruiter role. Backend engineer recruiters care about different things than AI/ML engineer recruiters.

---

## Mode prompts to design

```python
ROLE_PROMPTS = {
    "default": "...",
    "backend": "Focus on Python, FastAPI, Airflow, Kubernetes, system design, scalability...",
    "ai_ml": "Focus on RAG, embeddings, LangChain, LLM apps, ML pipelines, AI architecture...",
    "platform": "Focus on infrastructure, deployments, observability, scaling, SRE practices...",
}
```

UI exposes these as quick-action buttons on the AI orb. Default mode runs if recruiter doesn't pick.

---

## Per-mode evaluation

Create role-specific eval questions (e.g., 10 backend questions, 10 AI/ML questions, 10 platform questions). Measure each mode against its own role-specific set.

| Mode | P@1 (role-specific questions) | Sample answer quality |
|---|---|---|
| default | _____ | _____ |
| backend | _____ | _____ |
| ai_ml | _____ | _____ |
| platform | _____ | _____ |

---

## What I learned about role-specialized prompts
*(populate after experiments)*

---

**Previous:** [13-stage-7-prompt-tuning.md](./13-stage-7-prompt-tuning.md)
**Next:** [15-stage-9-production-hardening.md](./15-stage-9-production-hardening.md) (also pending)
