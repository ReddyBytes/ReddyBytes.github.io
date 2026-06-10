# Concept 4 — Retrieval

> Read [00-glossary.md](./00-glossary.md) first if any term is unfamiliar.
> Previous concepts: vectors (Concept 1), chunking (Concept 2), vector DB (Concept 3). This file explains how to use the vector DB intelligently to pick the BEST chunks for a question.

---

## What problem does this solve?

We have a FAISS index with 100 embedded chunks. The recruiter asks: **"What's Penchala's AI experience?"**

The naive answer: "get top-1 closest chunk."

But what if:
- The top-1 chunk is about AI but misses key context that's in chunk #2?
- The top-3 chunks are nearly IDENTICAL (3 different files all saying "5 years Python"), so the LLM gets redundant info?
- The top-1 chunk has a similarity score of only 0.3 — barely related — should we even return it?

**Retrieval is the layer that turns "raw vector search" into "the right context for the LLM."** It's deciding HOW MANY chunks, WHICH chunks, and IN WHAT ORDER.

---

## Think of it like this — Google search

Google doesn't return the single most relevant webpage when you search. It returns:
- 10 results (not 1) → gives you options
- A mix of types (videos, news, knowledge panels) → diverse content types
- Re-ranks based on freshness, authority, your location → quality refinement
- Returns "no good results" sometimes → graceful refusal

A good retrieval layer does the same things for RAG:
- Returns top-k chunks (k = 3 to 5 usually) → multiple sources for the LLM
- Diversifies (MMR) → avoids returning 3 near-identical chunks
- Re-ranks for quality (cross-encoder) → better top-1
- Refuses when no chunks score above a threshold → "I don't have that info"

---

## Picking k — how many chunks to retrieve?

**k = 1**: Pick only the best chunk.
- Fast
- If correct: great
- If wrong: total failure (LLM has nothing useful)
- Rarely used in production

**k = 3-5**: Pick the top few.
- Standard for RAG
- LLM can SYNTHESIZE from multiple sources ("according to skills.md AND prepzy.md...")
- Some redundancy is OK — multiple chunks reinforcing same fact = high confidence
- **What we'll start with: k=3**

**k = 10+**: Pick many chunks.
- LLM context window fills up fast
- LLM gets confused by too much info ("which of these 10 chunks should I focus on?")
- Latency increases (more tokens to process)
- Often LOWER answer quality than k=3 — counter-intuitive but well-documented

---

## MMR (Maximal Marginal Relevance) — diversity in retrieval

Imagine you ask "What's Penchala's Python experience?" and the top-5 chunks are:
1. "Penchala has 5 years of Python." (from skills.md)
2. "Penchala has 5+ years of Python." (from experience.md)
3. "Penchala's primary language is Python." (from about.md)
4. "Penchala uses Python for Prepzy backend." (from projects/prepzy.md)
5. "Penchala writes data pipelines in Python." (from experience.md)

All 5 chunks are HIGHLY relevant. But chunks 1, 2, 3 say nearly the same thing. The LLM gets a redundant context and might miss chunks 4-5 (which add NEW info).

**MMR** picks chunks that are BOTH relevant to the query AND different from each other.

The trick: at each step, MMR picks the chunk that maximizes:

```
score = λ * similarity_to_query - (1 - λ) * max_similarity_to_already_picked
```

- `λ = 1.0`: pure relevance (no diversity) — same as vanilla top-k
- `λ = 0.5`: balance relevance + diversity
- `λ = 0.0`: pure diversity (don't care about relevance — silly)

**Default**: λ = 0.5 to 0.7. Returns chunks that ARE relevant but cover different aspects.

With MMR applied to the example above, you might get chunks 1, 4, 5 (general claim + Prepzy specifics + data pipelines) instead of 1, 2, 3 (three near-duplicates).

---

## Re-ranking — two-stage retrieval

A more sophisticated technique: do FAST broad retrieval first, then SLOW precise re-ranking.

```
Stage 1 — Bi-encoder retrieval (fast, embedding-based, top-20)
  - Use FAISS to get top-20 candidates
  - ~5ms

Stage 2 — Cross-encoder re-ranking (slow, accurate, top-5)
  - For each (query, chunk) pair, compute a relevance score
  - Sort by score, take top-5
  - ~50ms (because cross-encoder runs on each pair)

Final: top-5 chunks for the LLM
```

### Why bi-encoder vs cross-encoder?

**Bi-encoder (what we use in FAISS)**:
- Encodes query and chunk SEPARATELY into vectors
- Compares with cosine similarity
- Fast (each chunk's embedding is precomputed once)
- Approximate — doesn't see query and chunk together

**Cross-encoder (the re-ranker)**:
- Takes (query, chunk) pair → outputs a relevance score directly
- Much more accurate because the model can attend to interactions ("the word X in the query matches concept Y in the chunk")
- Slower because each pair must be processed at query time (can't precompute)

Best of both: bi-encoder narrows down to 20, cross-encoder picks the best 5 from those 20.

**For our portfolio**: we'll measure in Stage 6 whether re-ranking adds enough quality to justify the +50ms latency. If yes, keep it. If marginal, skip.

---

## Handling "no good matches"

What if all retrieved chunks have low similarity (e.g., cosine < 0.4)? Means the question is OUT OF SCOPE — recruiter asked about something not in your content.

**Bad behavior**: pass low-similarity chunks to the LLM anyway → LLM hallucinates an answer or gives a confidently wrong response.

**Good behavior**: detect low similarity, tell the LLM "no context found, refuse gracefully."

```python
distances, indices = index.search(query_vec, k=5)

if max(distances[0]) < 0.4:
    # No chunks above threshold — refuse
    return "I don't have info on that. Try asking about projects, skills, or experience."

# Otherwise proceed normally with retrieved chunks
```

The threshold (0.4 here) needs tuning per content/model — we'll set it empirically in Stage 7.

---

## Worked example — same query, three retrieval strategies

Query: **"What's Penchala's database experience?"**

Available chunks (simplified):
```
A. "Strong with PostgreSQL, used in 3 projects."   (skills.md)
B. "Prepzy uses PostgreSQL for relational data."   (projects/prepzy.md)
C. "Multi-tenant Postgres with row-level security." (projects/prepzy.md)
D. "Worked with Redis caching at Apple."           (experience.md)
E. "Wrote Python backend with FastAPI."            (skills.md)
```

### Strategy 1 — Vanilla top-3

```
Sorted by cosine similarity to "database experience":
  1. A (PostgreSQL, 3 projects)        → 0.92
  2. B (Prepzy uses PostgreSQL)        → 0.89
  3. C (Multi-tenant Postgres)         → 0.86
  4. D (Redis caching)                 → 0.71
  5. E (Python FastAPI)                → 0.45

Top-3: A, B, C — all about PostgreSQL. Redundant.
LLM answer: "Penchala has strong PostgreSQL experience used in projects like Prepzy."
(Missed Redis entirely.)
```

### Strategy 2 — Top-3 with MMR (λ=0.5)

```
MMR iteration:
  - Pick A first (highest similarity).
  - For chunk 2: B is similar to query (0.89) but VERY similar to A (0.87)
                  → penalize B. Pick D instead (0.71 sim, low overlap with A).
  - For chunk 3: B still ranks well, C ranks similar to B.
                  → pick C (new content about row-level security).

Top-3 with MMR: A, D, C
LLM answer: "Penchala has PostgreSQL experience (Prepzy uses it with row-level
security) and also worked with Redis caching at Apple."
(Got both DB types — more complete.)
```

### Strategy 3 — Re-ranking (top-20 then top-3 via cross-encoder)

```
Stage 1: FAISS top-20 (no scoring shown).
Stage 2: cross-encoder scores each (query, chunk) pair:
  - A: 0.95   (cross-encoder confirms strong match)
  - B: 0.91
  - C: 0.88
  - D: 0.78   (Redis is a DB too — cross-encoder catches this)
  - E: 0.30   (FastAPI is not a DB — cross-encoder downgrades)
  - others: <0.50

Top-3 after re-rank: A, B, D
LLM answer: similar to MMR strategy — includes Redis.
```

For this query, both MMR and re-ranking produced better results than vanilla top-3.

---

## Why this matters for OUR portfolio

Retrieval quality directly affects LLM answer quality. The famous principle:

> **Garbage in, garbage out.** Even GPT-4 can't answer well if you feed it the wrong chunks.

For Stage 2 (minimal RAG), we'll use vanilla top-3 (simplest). For Stages 6+ we'll measure if MMR / re-ranking improve our eval set scores (P@1, P@3).

Our retrieval pipeline (Stage 9 production version):

```
Query → embed (~30ms)
     → FAISS top-10 (~5ms)
     → optional MMR (~2ms)
     → optional cross-encoder re-rank (~50ms)
     → similarity threshold check (refuse if all < 0.4)
     → top-3 chunks → LLM
```

---

## Tradeoffs at a glance

| Strategy | Quality | Latency | Complexity | When to use |
|---|---|---|---|---|
| Vanilla top-k | OK | ~10ms | trivial | **default — start here** |
| Top-k with MMR | better | ~12ms | small overhead | when chunks overlap a lot |
| Re-ranking (top-20 → top-5) | best | ~60ms | extra model | when P@1 matters more than latency |
| Hybrid (BM25 + vector) | best for keywords | varies | more code | when queries include rare terms (specific tech names, codenames) |

---

## Common mistakes

### Mistake 1 — k too large

You set k=10 thinking "more context is better." LLM gets 10 chunks (5000+ tokens) → degrades, picks wrong chunk to emphasize, answer quality drops.

**Mitigation**: k=3 to k=5 for portfolio. Increase only if eval set shows recall problems.

### Mistake 2 — No "no good matches" handling

You always return top-k regardless of scores. Recruiter asks "Do you have experience with COBOL?" → top-3 are unrelated chunks → LLM either hallucinates COBOL experience OR awkwardly summarizes Python content.

**Mitigation**: similarity threshold + explicit refusal in system prompt.

### Mistake 3 — Forgetting to normalize the query vector

If you normalize embeddings before adding to FAISS but FORGET to normalize the query vector, similarity scores are off and ordering can be wrong.

**Mitigation**: same `faiss.normalize_L2(query_vec)` step as for stored vectors.

### Mistake 4 — Returning duplicate-content chunks

Same content appears in multiple files (e.g., your bio summary in about.md AND in resume.md). Top-3 might all be slight variations of the same paragraph. Wasted context.

**Mitigation**: deduplicate by content hash before retrieval, OR use MMR.

### Mistake 5 — Wrong distance metric for index type

`IndexFlatIP` returns inner products; `IndexFlatL2` returns Euclidean distances. If you treat IP distances as L2 (or vice versa), top-k ordering will be backwards (smaller = better for L2, larger = better for IP).

**Mitigation**: check index type, sort appropriately. With normalized vectors + IndexFlatIP, larger = better (closer to 1.0 = more similar).

---

## Reading list (only if you want to go deeper)

- [ ] [LangChain — Retrieval overview](https://python.langchain.com/docs/concepts/retrieval/) — concepts + alternatives
- [ ] [Pinecone — MMR explained](https://www.pinecone.io/learn/series/rag/maximum-marginal-relevance/) — visual MMR walkthrough
- [ ] [Hugging Face — Sentence Transformers Cross-encoders](https://www.sbert.net/examples/applications/cross-encoder/README.html) — re-ranking guide
- [ ] [Anthropic — Contextual retrieval](https://www.anthropic.com/news/contextual-retrieval) — advanced retrieval techniques
- [ ] [Greg Kamradt — Advanced RAG retrieval](https://www.youtube.com/@DataIndependent) — video tutorials

---

## Your own notes on Concept 4
*(write in your own words what you understood)*

## Your reflection on Concept 4
*(would you start with vanilla or jump to MMR + re-ranking? why?)*

---

**Previous:** [04-vector-db.md](./04-vector-db.md) — Concept 3
**Next:** [06-rag-pattern.md](./06-rag-pattern.md) — Concept 5
