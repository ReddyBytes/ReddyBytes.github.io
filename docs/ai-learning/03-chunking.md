# Concept 2 — Chunking

> Read [00-glossary.md](./00-glossary.md) first if any term is unfamiliar.
> Concept 1 ([02-embeddings.md](./02-embeddings.md)) explained why we convert text to vectors. This file explains why we have to split text into pieces first.

---

## What problem does this solve?

Recap from Concept 1: embedding models convert text → vectors. We then compare vectors to find similar meanings.

But there's a hidden problem: **most embedding models can only read 256 to 512 tokens at a time** (~200-400 English words). Anything past that limit gets silently truncated — chopped off and ignored.

Example: your `content/projects/prepzy.md` is 5000 words. You embed the whole file. The model sees only the first ~400 words. The rest is **invisible** to your RAG search. Your recruiter asks about a feature mentioned at word 3000 and the search returns nothing.

**Chunking** is splitting long documents into smaller pieces (chunks), embedding each piece separately, and storing each as its own searchable unit.

There's a second reason chunking matters: **precision**. If you embed an entire 5000-word document as one vector, that vector represents an *average* of all the topics in the document. A query about "PostgreSQL" might not match well because the document mostly talks about "Next.js". Smaller chunks = each chunk is about ONE thing = better matches.

---

## Think of it like this — books vs chapters

Imagine you walk into a library and ask the librarian: "Where in *Cracking the Coding Interview* does it talk about graph algorithms?"

- **Bad library**: librarian only indexes the BOOK ("this book is about coding interviews"). They hand you the whole 700-page book. You have to find graph algorithms yourself.
- **Good library**: librarian indexes each CHAPTER ("Ch 12 = graphs, Ch 8 = trees..."). They hand you exactly chapter 12.

The chapters are **chunks**. The book is too coarse; sentences are too fine; chapters are the sweet spot.

---

## What a chunk actually is

A chunk is just a piece of text — usually 200-500 tokens long — that you embed and store as one searchable unit.

```
Original document (prepzy.md — 5000 tokens):
┌──────────────────────────────────────────────────────────────┐
│ # Prepzy                                                      │
│                                                                │
│ ## Tech Stack                                                  │
│ Built with Python, FastAPI, PostgreSQL... (200 tokens)        │
│                                                                │
│ ## Architecture                                                │
│ Multi-tenant SaaS with... (300 tokens)                        │
│                                                                │
│ ## Outcome                                                     │
│ 2K users in 3 months... (150 tokens)                          │
└──────────────────────────────────────────────────────────────┘

After chunking (3 chunks):

Chunk 1: "# Prepzy\n\n## Tech Stack\nBuilt with Python..."
         embedding → [0.1, 0.8, 0.2, ...]

Chunk 2: "## Architecture\nMulti-tenant SaaS with..."
         embedding → [0.3, 0.6, 0.1, ...]

Chunk 3: "## Outcome\n2K users in 3 months..."
         embedding → [0.0, 0.4, 0.9, ...]
```

Now each chunk has its OWN embedding. A query about "tech stack" matches Chunk 1 strongly. A query about "scaling" matches Chunk 2. A query about "metrics" matches Chunk 3. We get precise matches per topic.

---

## The 4 chunking strategies

There's no single "best" way to chunk. Four common strategies, ranked roughly from simple → sophisticated:

### Strategy 1 — Fixed-size (every N characters)

The simplest: every 500 characters becomes a chunk.

```
Original: "This is a sample document about Python programming. It discusses many topics."

Chunked at 30 chars (no overlap):
  Chunk 1: "This is a sample document abo"
  Chunk 2: "ut Python programming. It dis"
  Chunk 3: "cusses many topics."
```

**Problem**: chunks break in the middle of sentences. "abo" + "ut Python" — the embedding for "abo" is garbage; the embedding for "ut Python programming" loses the subject.

### Strategy 2 — Sliding window (fixed-size with overlap)

Same as fixed-size, but each chunk overlaps the previous one by N characters. Preserves continuity around the cut points.

```
Original: "This is a sample document about Python programming. It discusses many topics."

Chunked at 30 chars, 10 overlap:
  Chunk 1: "This is a sample document abo"
  Chunk 2: "ocument about Python programmi"
  Chunk 3: "n programming. It discusses ma"
```

**Better**: overlap means concepts that span a cut point appear in BOTH chunks, so at least one chunk captures the full meaning. **Cost**: more chunks (some duplication), more storage.

### Strategy 3 — Semantic (split on natural boundaries)

Don't split mid-sentence. Split on paragraphs, headings, or sentence boundaries.

```
Original (Markdown):
# Prepzy
## Tech Stack
Built with Python, FastAPI...
## Architecture
Multi-tenant SaaS with...

Chunked on ## headings:
  Chunk 1: "# Prepzy\n## Tech Stack\nBuilt with Python, FastAPI..."
  Chunk 2: "## Architecture\nMulti-tenant SaaS with..."
```

**Best quality**: each chunk is a coherent unit (a section, a paragraph). No mid-sentence cuts. **Cost**: requires parsing the document format (Markdown headings, code blocks, etc.). Variable chunk sizes (small sections vs huge sections).

### Strategy 4 — Hierarchical (parent + child chunks)

Store TWO levels: small "child" chunks (a paragraph each) + large "parent" chunks (a whole section). When you retrieve, the child gives you precision (which paragraph matched), and the parent gives the LLM full context (the whole section).

```
Parent chunk 1: entire "Tech Stack" section (500 tokens)
  Child chunk 1.1: "Built with Python, FastAPI..."  (100 tokens)
  Child chunk 1.2: "PostgreSQL for data..."          (120 tokens)
  Child chunk 1.3: "Hosted on AWS..."                (80 tokens)

Parent chunk 2: entire "Architecture" section (700 tokens)
  Child chunk 2.1: ...
  ...

Retrieval: search children → match 1.2 → return parent 1 to LLM
```

**Highest quality**: precise matching + rich context. **Cost**: 2x storage, more complex code.

---

## Worked example — same document, 3 strategies side by side

A real `content/projects/prepzy.md` excerpt (300 tokens, simplified):

```markdown
# Prepzy
A SaaS platform for exam prep.

## Tech Stack
Python backend with FastAPI for API routes.
PostgreSQL for relational data.
Redis for session caching.

## Architecture
Multi-tenant design with row-level security.
Background jobs via Celery + Redis.
Deployed to AWS ECS with CloudFront CDN.
```

**Strategy 1 — Fixed-size (150 chars):**
```
Chunk A: "# Prepzy\nA SaaS platform for exam prep.\n\n## Tech Stack\nPython backend with FastAPI for API routes.\nPostgreSQL fo"
Chunk B: "r relational data.\nRedis for session caching.\n\n## Architecture\nMulti-tenant design with row-level security.\nBackgr"
Chunk C: "ound jobs via Celery + Redis.\nDeployed to AWS ECS with CloudFront CDN."
```
Notice: Chunk A ends mid-sentence ("PostgreSQL fo"). Chunk B starts garbled ("r relational data"). Retrieval would suffer.

**Strategy 3 — Semantic on `##` headings:**
```
Chunk A: "# Prepzy\nA SaaS platform for exam prep."
Chunk B: "## Tech Stack\nPython backend with FastAPI for API routes.\nPostgreSQL for relational data.\nRedis for session caching."
Chunk C: "## Architecture\nMulti-tenant design with row-level security.\nBackground jobs via Celery + Redis.\nDeployed to AWS ECS with CloudFront CDN."
```
Clean. Each chunk is one section. A query "what database does Prepzy use?" matches Chunk B precisely.

**Strategy 4 — Hierarchical:**
```
Parent: entire prepzy.md (300 tokens)
Children:
  - "# Prepzy\nA SaaS platform for exam prep."
  - "## Tech Stack\nPython backend with FastAPI for API routes."
  - "PostgreSQL for relational data."
  - "Redis for session caching."
  - "## Architecture\nMulti-tenant design..."
  - "Background jobs via Celery + Redis."
  - "Deployed to AWS ECS with CloudFront CDN."

Retrieval: match the child "PostgreSQL for relational data" → return parent for full context.
```

---

## Why this matters for OUR portfolio

We're going to start with **semantic chunking** (Strategy 3) using Markdown `##` heading boundaries. Reasons:

1. All our content is Markdown — heading structure is built-in, easy to parse
2. Our docs are short (~300-1000 tokens each) — semantic chunks fit naturally
3. No mid-sentence cuts
4. Stage 4 will A/B test other strategies (256/512/1024 fixed, sliding, hierarchical) on our eval set

Stage 4 (`10-stage-4-chunking-experiments.md`) is where we measure which strategy actually performs best on our content. Until then, semantic is the safe default.

---

## Tradeoffs at a glance

| Strategy | Quality | Complexity | Storage | When to use |
|---|---|---|---|---|
| Fixed-size | poor | trivial | 1x | quick prototypes, ignore for prod |
| Sliding window | OK | easy | ~1.2x | general-purpose, when you don't want to parse format |
| Semantic | good | medium | 1x | Markdown / HTML / structured docs (our case) |
| Hierarchical | best | hard | 2x | long docs, when context matters as much as precision |

**Chunk size guidance:**
- **<200 tokens**: too small, loses context, "this" with no antecedent
- **200-500 tokens**: sweet spot for most RAG
- **500-1000 tokens**: only for long-form docs or when context matters more than precision
- **>1000 tokens**: rarely good; getting close to embedding model limits

---

## Common mistakes

### Mistake 1 — Chunks too small

A chunk like "It was deployed to AWS in 2024" has no anchor — what's "it"? The query "How was Prepzy deployed?" might not match because "Prepzy" isn't in this chunk.

**Mitigation**: include 1-2 sentences of context, or use heading-based semantic chunking so the heading provides anchor.

### Mistake 2 — Chunks too big

A 2000-token chunk covers 5 topics. The query "PostgreSQL?" matches this chunk because PostgreSQL is mentioned somewhere — but so are 4 other things. The retrieval is imprecise. The LLM then gets a chunk with 80% irrelevant content.

**Mitigation**: stay under 500 tokens per chunk.

### Mistake 3 — Breaking mid-code-block

If your doc has a Markdown code fence and chunking splits it mid-fence, the chunk has an unclosed ``` and the embedding model gets confused. Worse, the LLM might see broken code later.

**Mitigation**: pre-process to keep code blocks intact (treat them as atomic units, don't split inside).

### Mistake 4 — Losing frontmatter

If your `prepzy.md` starts with YAML frontmatter (`title: Prepzy`, `tags: [python, fastapi]`), the chunking might strip it entirely. You lose the title and tags, which are often the strongest semantic signals.

**Mitigation**: include frontmatter title/tags as the FIRST chunk, or prepend them to every chunk of the document.

### Mistake 5 — Unequal chunk weights

If one chunk is 800 tokens and another is 100, the 800-token chunk dominates retrieval just because there's more text. Not because it's more relevant.

**Mitigation**: keep chunks roughly equal size (within 2x of each other).

---

## Reading list (only if you want to go deeper)

- [ ] [LangChain — Text Splitters](https://python.langchain.com/docs/concepts/text_splitters/) — overview of strategies
- [ ] [Pinecone — Chunking strategies](https://www.pinecone.io/learn/chunking-strategies/) — visual + practical guide
- [ ] [Cohere — Chunking strategies for RAG](https://docs.cohere.com/page/rag-chunking) — well-illustrated
- [ ] [Greg Kamradt — Levels of chunking](https://www.youtube.com/watch?v=8OJC21T2SL4) — video walkthrough of 5 levels

---

## Your own notes on Concept 2
*(write in your own words what you understood)*

## Your reflection on Concept 2
*(which strategy would you intuitively pick for your portfolio content, and why?)*

---

**Previous:** [02-embeddings.md](./02-embeddings.md) — Concept 1
**Next:** [04-vector-db.md](./04-vector-db.md) — Concept 3
