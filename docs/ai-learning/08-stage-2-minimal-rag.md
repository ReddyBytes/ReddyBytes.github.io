# Stage 2 — Minimal end-to-end RAG (~1 day)

> ⏳ **Status: pending.** Will be written after Stage 1 (all 6 concepts) is complete.

**Goal**: Build the smallest possible RAG that works. 1 markdown doc → 1 chunk → 1 embedding → FAISS index → retrieve → Gemini answer. No UI, no streaming, no rate limiting. Just confirm the pipeline conceptually works.

---

## Planned implementation outline

```python
# Pseudo-code (the actual file will be backend/rag/minimal.py)

text = open("content/about.md").read()
chunks = [text[:500], text[500:1000], text[1000:1500]]   # naive chunking
embeddings = model.encode(chunks)                          # sentence-transformers
index = faiss.IndexFlatIP(embeddings.shape[1])
index.add(embeddings)

query = "What is Penchala's experience with Python?"
query_embedding = model.encode([query])
distances, indices = index.search(query_embedding, k=2)
top_chunks = [chunks[i] for i in indices[0]]

prompt = f"Context:\n{top_chunks}\n\nQuestion: {query}\n\nAnswer:"
answer = gemini.generate(prompt)
print(answer)
```

---

## What this stage will produce

- A standalone script `backend/rag/minimal.py` that runs end-to-end
- Working RAG pipeline (no UI, no API yet)
- Confirmation that all the pieces talk to each other
- Foundation to add provider abstractions in Stage 4+

## Reflection slots (to fill in when done)

### What worked
*(populate after building)*

### What didn't work / surprised me
*(populate after building)*

### What changed in my mental model after building vs reading
*(populate after building)*

---

**Previous:** [07-hallucination.md](./07-hallucination.md)
**Next:** [09-stage-3-evaluation-set.md](./09-stage-3-evaluation-set.md) (also pending)
