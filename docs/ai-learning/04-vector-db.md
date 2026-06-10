# Concept 3 — Vector DB / FAISS

> Read [00-glossary.md](./00-glossary.md) first if any term is unfamiliar.
> Concept 1 ([02-embeddings.md](./02-embeddings.md)) explained vectors. Concept 2 ([03-chunking.md](./03-chunking.md)) explained splitting docs. This file explains where to STORE the resulting embeddings and how to search them fast.

---

## What problem does this solve?

After chunking your `content/` folder and embedding each chunk, you might have 200-1000 vectors. For every recruiter question, you need to:
- Embed the question
- Compare it against EVERY stored vector
- Return the top-3 most similar

If you do this naively (Python list, loop, compute cosine for each), the work scales as O(N): 1000 chunks = 1000 comparisons. For 1000 chunks at 384 dimensions, that's ~50ms — fine for portfolio scale.

But at 1 million chunks, naive comparison is ~50 SECONDS per query. Recruiter bounces.

**Vector databases** are specialized data structures that store vectors AND answer "give me top-k closest to this vector" in milliseconds, even at millions-of-vectors scale.

---

## Think of it like this — phone book vs scanning

Imagine you have a phone book with 1 million names and need to find "John Smith".

- **Naive approach**: read every name, check if it matches → 1 million reads
- **Phone book approach**: it's already sorted alphabetically → jump to "S", then "Sm", then find "Smith" → ~20 reads

The phone book PRE-COMPUTED an index that makes lookup fast. Vector DBs do the same trick but in 384-dimensional space instead of alphabetical 1D space.

---

## What FAISS actually is

**FAISS** stands for **F**acebook **AI** **S**imilarity **S**earch. It's a free library released by Meta in 2017.

Important: FAISS is a **library**, not a **server**. It runs INSIDE your Python process. There's no separate FAISS service to deploy. You import it, build an index in memory, and search it.

```python
import faiss

# Create an empty index for 384-dimensional vectors
index = faiss.IndexFlatIP(384)

# Add vectors (your chunk embeddings)
index.add(embeddings)   # embeddings.shape = (1000, 384)

# Search: find top-3 closest to a query vector
distances, indices = index.search(query_vector, k=3)
```

That's the whole API surface for the simple case.

---

## Index types — exact vs approximate (ANN)

FAISS supports several "index types" that trade speed for exactness:

### IndexFlatIP / IndexFlatL2 — EXACT search
- Compares query against every stored vector, no shortcuts
- 100% accurate
- Slow for huge datasets (millions+)
- **For 100-1000 chunks (portfolio scale): fast enough**

### IndexIVFFlat — APPROXIMATE search
- Pre-clusters vectors into N "cells" during indexing
- Search only looks inside the cells closest to the query → much faster
- ~95% accurate (might miss the true closest)
- For datasets 10K-1M vectors

### IndexHNSW — graph-based APPROXIMATE search
- Builds a navigable graph between vectors
- Very fast even at 100M+ vectors
- ~98% accurate
- For huge datasets

**ANN (Approximate Nearest Neighbor)** is the umbrella term for "find probably-the-closest fast" — IndexIVFFlat and IndexHNSW are ANN methods. Tradeoff: tiny accuracy loss for massive speed gain.

**For our portfolio**: we use `IndexFlatIP` (exact). Reasons:
- Portfolio has ~100 chunks, not millions
- Exact search at 100 chunks = ~5ms (negligible)
- Simpler code, no tuning knobs (ANN methods have hyperparameters)
- If we ever scale to 100K+ chunks, switch to IndexHNSW

---

## IP vs L2 — Inner Product vs Euclidean

Two FAISS index variants you'll see:

- `IndexFlatIP` — **Inner Product**. Compatible with **cosine similarity** IF vectors are normalized first.
- `IndexFlatL2` — **L2 distance** (Euclidean). Direct distance between vectors.

For text embeddings, we want **cosine similarity** (recap from Concept 1). To get cosine via FAISS:

1. Normalize all vectors (divide each vector by its length so length = 1)
2. Use `IndexFlatIP`
3. Inner product of unit vectors = cosine similarity

```python
import faiss
import numpy as np

embeddings = model.encode(chunks)         # shape: (N, 384)
faiss.normalize_L2(embeddings)            # in-place normalize

index = faiss.IndexFlatIP(384)
index.add(embeddings)

query_vec = model.encode([query])         # shape: (1, 384)
faiss.normalize_L2(query_vec)
distances, indices = index.search(query_vec, k=3)
# distances are cosine similarities (between -1 and 1)
```

If you forget `normalize_L2`, the distances will not be cosine — they'll be raw inner products, which include vector magnitude. Different similarity, different results.

---

## Worked example — build a tiny FAISS index

5 chunks, 3-dimensional embeddings (simplified for readability):

```python
import faiss
import numpy as np

# Pretend these came from an embedding model
chunks_metadata = [
    {"id": 0, "source": "prepzy.md",     "text": "Python FastAPI backend"},
    {"id": 1, "source": "prepzy.md",     "text": "PostgreSQL for data"},
    {"id": 2, "source": "skills.md",     "text": "5 years Python experience"},
    {"id": 3, "source": "travel.md",     "text": "Visited Iceland in 2023"},
    {"id": 4, "source": "experience.md", "text": "Built APIs at Apple"},
]

# Their embeddings (3D for example)
embeddings = np.array([
    [0.9, 0.1, 0.0],   # Python FastAPI    → engineering region
    [0.8, 0.2, 0.0],   # PostgreSQL        → engineering region
    [0.85, 0.15, 0.05],# Python experience → engineering region
    [0.0, 0.0, 1.0],   # Iceland           → travel region
    [0.7, 0.3, 0.1],   # APIs at Apple     → engineering region
], dtype="float32")

# Normalize for cosine
faiss.normalize_L2(embeddings)

# Build index
index = faiss.IndexFlatIP(3)   # 3D vectors
index.add(embeddings)
print(f"Index has {index.ntotal} vectors")  # → 5

# Query
query = np.array([[0.88, 0.12, 0.02]], dtype="float32")  # "Python skills?"
faiss.normalize_L2(query)
distances, indices = index.search(query, k=3)

print(distances)  # → [[0.998, 0.992, 0.988]]  (top-3 cosine scores)
print(indices)    # → [[2, 0, 1]]              (indexes into chunks_metadata)

# Map back to source chunks
for i in indices[0]:
    print(f"  {chunks_metadata[i]['source']}: {chunks_metadata[i]['text']}")
# →   skills.md: 5 years Python experience
# →   prepzy.md: Python FastAPI backend
# →   prepzy.md: PostgreSQL for data
```

That's the entire flow: embed → normalize → add → query → map indices back to original chunks.

---

## Persistence — save + load

FAISS indices live in RAM. If your container restarts, you lose the index. Two options:

### Option A — Save to file, load at startup

```python
faiss.write_index(index, "data/faiss_index.bin")    # save
loaded = faiss.read_index("data/faiss_index.bin")   # load on next startup
```

We do this. The index file lives at `data/faiss_index.bin` (gitignored, regenerated on deploy if missing).

### Option B — Rebuild from source on every startup

```python
# At startup
embeddings = model.encode([c["text"] for c in chunks])
faiss.normalize_L2(embeddings)
index = faiss.IndexFlatIP(384)
index.add(embeddings)
```

For 100 chunks: rebuild takes ~5 seconds at startup, then ready. Acceptable for portfolio scale, simpler than persistence.

**For our portfolio**: rebuild at startup for v1 (simpler, content changes infrequently). If startup becomes slow, switch to persistence.

---

## Why this matters for OUR portfolio

Backend startup flow:

```
HF Space container starts
  ↓
Load embedding model (~3 sec for MiniLM-L6-v2)
  ↓
Walk content/ folder, read every .md file
  ↓
Parse frontmatter + chunk into pieces (Concept 2)
  ↓
Embed all chunks (~5 sec for 100 chunks)
  ↓
Normalize + build FAISS IndexFlatIP
  ↓
Ready to serve queries (each query takes ~10ms)
```

At query time:
- Embed the question (~30ms with MiniLM)
- FAISS search (~5ms for 100 chunks)
- Total before LLM: ~35ms

---

## Alternative vector DBs (briefly, for context)

| DB | Type | Cost | When to choose over FAISS |
|---|---|---|---|
| **FAISS** | In-memory library | $0 | Default for our portfolio scale |
| **ChromaDB** | Embedded DB | $0 | Want simpler API + auto persistence |
| **LanceDB** | Embedded DB | $0 | Want SQL-like queries on vectors |
| **Pinecone** | Managed cloud service | $$ | Production scale, don't want self-host |
| **Weaviate** | Self-hosted or cloud | $0 / $$ | Need filters + hybrid search |
| **Qdrant** | Self-hosted or cloud | $0 / $$ | Need filters + better tooling than FAISS |
| **pgvector** | PostgreSQL extension | $0 | Already have Postgres, want one DB |

For portfolio scale, FAISS wins on simplicity. If you ever need filters ("only return chunks from `experience.md`"), consider switching to ChromaDB or Qdrant.

---

## Common mistakes

### Mistake 1 — Forgetting `normalize_L2` before `IndexFlatIP`

Without normalization, the index returns raw inner products (which factor in vector magnitude). Results will be wrong — chunks with longer text often have larger magnitudes and dominate falsely.

**Mitigation**: always `faiss.normalize_L2(vectors)` before `index.add()`. Same for the query vector before `index.search()`.

### Mistake 2 — Mismatched dimensions

If your model produces 384-dim vectors but you create `IndexFlatIP(768)`, FAISS will crash at `add()` time with a cryptic error.

**Mitigation**: derive the dimension from the model: `IndexFlatIP(model.get_sentence_embedding_dimension())`.

### Mistake 3 — Rebuilding the index on every query

```python
# WRONG — terrible performance
def search(query):
    index = faiss.IndexFlatIP(384)         # ← rebuilt every call
    index.add(all_embeddings)               # ← re-added every call
    return index.search(model.encode([query]), k=3)
```

The index should be built ONCE at startup, stored as a module-level variable, and reused per query.

**Mitigation**: build during FastAPI lifespan startup, store in app state.

### Mistake 4 — Not persisting the index

If your HF Space cold-starts, it has to re-embed everything from scratch. For 100 chunks that's ~5 seconds — adds to cold-start time the recruiter sees.

**Mitigation**: save the index to a file after building, load on next startup. Re-save when content changes.

### Mistake 5 — Mapping indices wrong

`index.search()` returns numerical indices (0, 1, 2, ...). You have to map these back to your original chunk metadata (source filename, text content). Forgetting this gives you "the answer is chunk number 7" — meaningless to the LLM.

**Mitigation**: maintain a parallel `chunks_metadata` list in the same order you added embeddings.

---

## Reading list (only if you want to go deeper)

- [ ] [FAISS — GitHub README](https://github.com/facebookresearch/faiss/wiki/Getting-started) — official intro
- [ ] [FAISS — Index types overview](https://github.com/facebookresearch/faiss/wiki/Faiss-indexes) — when to use which
- [ ] [Pinecone — Vector DBs explained](https://www.pinecone.io/learn/vector-database/) — vendor-agnostic intro
- [ ] [ChromaDB — Getting started](https://docs.trychroma.com/getting-started) — alternative we may consider
- [ ] [ANN benchmarks](http://ann-benchmarks.com/) — see how FAISS compares to alternatives at scale

---

## Your own notes on Concept 3
*(write in your own words what you understood)*

## Your reflection on Concept 3
*(would you choose FAISS for the portfolio, or something else? why?)*

---

**Previous:** [03-chunking.md](./03-chunking.md) — Concept 2
**Next:** [05-retrieval.md](./05-retrieval.md) — Concept 4
