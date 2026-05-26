# AI Learning Log

> Build-in-public learning trail for the RAG-powered AI assistant. Each stage = read concepts → build → evaluate → reflect → document. The log itself becomes a recruiter signal ("this candidate doesn't just use AI tools, they understand them").

> See `RAG-BACKEND.md` for the architecture overview; this doc captures the **learning journey**.

---

## Stage 1 — Concepts (NO code, ~1 day reading)

**Goal**: Understand each RAG building block before writing a line of code.

### Topics to cover
- Embeddings — text → vector. Why vectors? Cosine similarity. Read sentence-transformers docs.
- Chunking strategies — fixed-size vs sliding-window vs semantic vs hierarchical. Why each fails differently.
- Vector DB internals — FAISS uses approximate nearest neighbor (ANN). Tradeoff: speed vs exactness.
- Retrieval — top-k, MMR (Maximal Marginal Relevance), re-ranking. When each helps.
- RAG pattern — retrieve → stuff → generate. Why prompt format matters.
- Hallucination + grounding — why LLMs invent, how RAG reduces it, how to instruct LLM to cite/refuse.

### Reading list
- [ ] sentence-transformers documentation intro
- [ ] LangChain chunking guide
- [ ] FAISS GitHub readme + "ANN vs exact" explainer
- [ ] LangChain retrieval guide
- [ ] OpenAI RAG cookbook (concepts apply to Gemini/Claude)
- [ ] "Patterns to reduce hallucination" articles

### Notes
*(fill in as you read)*

### Reflection
*(what surprised you? what's still unclear?)*

---

## Stage 2 — Minimal end-to-end (~1 day)

**Goal**: Build the smallest possible RAG. 1 doc, hardcoded query, no UI.

### Implementation
```python
# pseudo-code, ~30 lines
text = open("content/about.md").read()
chunks = [text[:500], text[500:1000], text[1000:1500]]
embeddings = model.encode(chunks)
index = faiss.IndexFlatIP(embeddings.shape[1])
index.add(embeddings)

query = "What is Penchala's Python experience?"
query_embedding = model.encode([query])
distances, indices = index.search(query_embedding, k=2)
top_chunks = [chunks[i] for i in indices[0]]

prompt = f"Context:\n{top_chunks}\n\nQuestion: {query}\n\nAnswer:"
answer = gemini.generate(prompt)
print(answer)
```

### What worked

### What didn't

### Reflection

---

## Stage 3 — Evaluation set (~1 day)

**Goal**: Build a 30-question eval set + measurement script.

### Eval set creation
1. Write 30 realistic recruiter questions mixing easy/hard/role-specific
2. Manually identify which content chunks SHOULD be the answer (gold labels)
3. Save as `backend/data/recruiter_questions.json`

### Metrics to measure
- **Precision@1** — was top-1 retrieved chunk correct?
- **Precision@3** — was correct chunk in top-3?
- **Recall@5** — what % of correct chunks appeared in top-5?

### Baseline numbers
*(record after first run)*
- P@1: ___
- P@3: ___
- Recall@5: ___

### Reflection
*(what kinds of questions did the baseline fail on?)*

---

## Stage 4 — Chunking experiments (1-2 days)

**Goal**: Find the best chunking strategy for portfolio content.

### Experiments (hold embedding model + everything else constant)

| Experiment | Chunk size | Overlap | P@1 | P@3 | Recall@5 | Notes |
|---|---|---|---|---|---|---|
| Baseline | 500 chars | 0 | ___ | ___ | ___ | |
| Small | 256 tokens | 50 | ___ | ___ | ___ | |
| Large | 1024 tokens | 100 | ___ | ___ | ___ | |
| Semantic | split on `##` headings | n/a | ___ | ___ | ___ | |
| Hierarchical | parent + child chunks | n/a | ___ | ___ | ___ | |

### Winner & why

### Reflection

---

## Stage 5 — Embedding model experiments (1-2 days)

**Goal**: Find best quality-vs-speed embedding model.

| Model | Size | Speed (queries/sec) | P@1 | P@3 | Notes |
|---|---|---|---|---|---|
| `all-MiniLM-L6-v2` | 22MB | ___ | ___ | ___ | baseline |
| `all-mpnet-base-v2` | 420MB | ___ | ___ | ___ | balanced |
| `BAAI/bge-base-en-v1.5` | 440MB | ___ | ___ | ___ | best for size |
| `BAAI/bge-large-en-v1.5` | 1.3GB | ___ | ___ | ___ | overkill check |

### Winner & why

### Reflection

---

## Stage 6 — Re-ranking (1-2 days)

**Goal**: Add cross-encoder re-ranker on top-20 → top-5.

### Model: `cross-encoder/ms-marco-MiniLM-L-6-v2`

### Metrics
| | Without re-rank | With re-rank | Δ |
|---|---|---|---|
| P@1 | ___ | ___ | ___ |
| P@3 | ___ | ___ | ___ |
| Latency (ms) | ___ | ___ | ___ |

### Decision
Keep re-ranker if P@1 improvement > 5 points. Drop if marginal — latency matters for recruiter UX.

### Reflection

---

## Stage 7 — Prompt + generation tuning (ongoing)

**Goal**: Tune LLM-side parameters and prompts.

### Experiments

- [ ] **System prompt iteration** — 5 variants, eval each, pick best
- [ ] **Temperature** — 0.0 (factual) vs 0.3 (conversational), test on eval set
- [ ] **Few-shot examples** — add 2-3 example Q→A pairs, measure consistency
- [ ] **Output format constraints** — enforce 2-3 sentences + citation format
- [ ] **Refusal handling** — "if context insufficient, say so" — test on out-of-scope questions

### Best system prompt
*(record final version)*

### Reflection

---

## Stage 8 — Recruiter modes (1 day)

**Goal**: Specialized prompts per role (backend / ai_ml / platform).

### Mode prompts
```python
ROLE_PROMPTS = {
  "default": "...",
  "backend": "...",
  "ai_ml": "...",
  "platform": "...",
}
```

### Per-mode eval
| Mode | P@1 (mode-specific questions) | Sample answer quality |
|---|---|---|
| default | ___ | ___ |
| backend | ___ | ___ |
| ai_ml | ___ | ___ |
| platform | ___ | ___ |

### Reflection

---

## Stage 9 — Production hardening (1 day)

**Goal**: Make it survive real recruiter traffic.

### Checklist
- [ ] Rate limit: 10 req/min, 100/day per IP (slowapi)
- [ ] Response cache: LRU on identical queries within 1 hour
- [ ] Cold-start UX: frontend shows "AI is waking up... ~15s" on 503
- [ ] Streaming: SSE working, tokens appear progressively
- [ ] Logging: every query logged anonymously (hashed IP + topic, NOT raw query)
- [ ] Eval-in-CI: PR fails if P@1 drops > 5 points
- [ ] Error handling: graceful degradation if all LLMs fail (cached FAQ)

### Reflection

---

## Future (Phase 3+)

Defer until baseline RAG is shipped:

- [ ] Fine-tune embeddings on portfolio content (contrastive learning on (Q, correct-chunk) pairs)
- [ ] LoRA fine-tune small LLM (Llama-3.2-1B) for Penchala-voice — runs on HF Space T4 if upgraded
- [ ] Hybrid search (vector + BM25) for rare-term recall
- [ ] Query rewriting (LLM expands query before retrieval)
- [ ] Conversational memory (session-scoped multi-turn)
- [ ] Self-RAG / iterative retrieval

---

## Resources used (running list)

*(add as you read)*

- LangChain docs: ...
- sentence-transformers docs: ...
- FAISS GitHub: ...
- "Patterns for RAG" blog post: ...
