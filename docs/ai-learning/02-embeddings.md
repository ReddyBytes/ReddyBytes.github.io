# Concept 1 — Embeddings

> Read [00-glossary.md](./00-glossary.md) first if any term is unfamiliar.
> Read [01-big-picture.md](./01-big-picture.md) for context on where this concept fits in RAG.

---

## What problem does this solve?

You have 50 documents about yourself. The recruiter asks: **"What's Penchala's strongest Python project?"**

You need to find which of those 50 documents is most relevant to "Python project" — quickly, before answering.

**The wrong way (keyword search):** Search for the word "Python" in each document. But what if a document says "snake-charmer language" or "the language pandas uses for data engineering"? Same meaning, but the WORD "Python" never appears. Keyword search MISSES these.

**The right way (semantic search):** Convert each document into a number representation that captures MEANING, not just words. Then find the document whose meaning is closest to the question's meaning.

That number representation is called an **embedding**.

---

## Think of it like this — the library map analogy

Imagine a giant 3-dimensional map of a library where:
- Every BOOK is placed somewhere on the map based on what it's about
- Books on "cooking" are all clustered in one corner
- Books on "Python programming" are clustered in another corner
- Books on "World War II" are in a third corner
- A book on "Python cooking recipes" sits BETWEEN the cooking and Python clusters
- The librarian doesn't read book titles — they navigate by **location** on the map

You give the librarian a question card: "Show me books on Python tutorials". The librarian places the QUESTION CARD on the same map. Whatever books are physically CLOSEST to the card on the map are the most relevant answers.

**Embeddings are this map.** Instead of 3 dimensions (left/right, forward/back, up/down), the map has 384 dimensions. You can't visualize 384 dimensions, but the math works the same: similar things end up close to each other, unrelated things are far apart.

---

## What an embedding actually looks like

We take some text → run it through an embedding model → get out a list of 384 numbers.

```
Input text:  "Penchala built a Kubernetes pipeline"
                            ↓ (embedding model processes it)
Output:      [0.12, -0.34, 0.81, 0.05, -0.22, 0.67, ..., 0.41]
             (384 numbers total — we shortened it here for readability)
```

Each number is a coordinate on one axis of the 384-dimensional map. Together, they pinpoint exactly where this text "lives" on the map. Different text = different location.

---

## Worked example — three texts, three embeddings

Let's walk through this concretely. We'll use very small embeddings (3 numbers instead of 384) so you can follow line by line.

```
Text A: "Penchala built a Kubernetes pipeline"
        embedding → [0.9, 0.1, 0.2]      (lives in the "engineering" corner of the map)

Text B: "Penchala worked on K8s infrastructure"
        embedding → [0.88, 0.12, 0.18]   (very close to Text A — almost identical meaning)

Text C: "What's the weather like today?"
        embedding → [-0.3, 0.95, -0.1]   (far from both A and B — unrelated topic)
```

**Look at the numbers:**
- Text A and Text B have very similar numbers because they mean almost the same thing (Kubernetes = K8s, "built" ≈ "worked on")
- Text C has completely different numbers because it's about a totally different topic

**The embedding model figured this out on its own** during training. Nobody hand-coded "K8s = Kubernetes". The model learned from millions of pairs of similar text — including thousands of examples where engineers used "K8s" and "Kubernetes" interchangeably.

---

## How do we measure "similar"? Cosine similarity

Once we have two embeddings, we need a way to compute how similar they are. The standard tool is **cosine similarity**.

**Don't worry about the formula.** Just remember the intuition:

> Cosine similarity asks: "Are these two arrows pointing in the same direction?"

It returns a number between -1 and 1:
- `1.0` = pointing exactly the same direction → identical meaning
- `0.7` = mostly same direction → very similar meaning
- `0.0` = perpendicular → completely unrelated
- `-1.0` = pointing opposite directions → very rare with text

Worked example with our texts above:

```
similarity(A, B) = 0.99  → "K8s pipeline" vs "K8s infrastructure"  → nearly identical
similarity(A, C) = 0.05  → "K8s pipeline" vs "weather today"       → unrelated
similarity(B, C) = 0.07  → "K8s infrastructure" vs "weather today" → unrelated
```

In Python (you don't need to compute this by hand — libraries do it):
```python
from sentence_transformers import SentenceTransformer, util

# Load the model once at startup
model = SentenceTransformer("all-MiniLM-L6-v2")

texts = [
    "Penchala built a Kubernetes pipeline",
    "Penchala worked on K8s infrastructure",
    "What's the weather like today?",
]

# Convert all 3 texts to embeddings (a list of 3 vectors, each with 384 numbers)
embeddings = model.encode(texts)

# Compare them
print(util.cos_sim(embeddings[0], embeddings[1]))  # → ~0.85  (similar — pass)
print(util.cos_sim(embeddings[0], embeddings[2]))  # → ~0.05  (unrelated — drop)
```

That's literally it. **Convert text → vector. Compare vectors with cosine similarity. Done.** Everything else in RAG builds on this primitive.

---

## Why this matters for OUR portfolio

The backend (`backend/`) will do this:

1. **Once at startup** (or after content updates):
   - Read every Markdown file in `content/`
   - Convert each one to an embedding (a 384-number vector)
   - Store all the embeddings in memory (technically, in FAISS — see Concept 3)

2. **Every time a recruiter asks a question**:
   - Convert the question to an embedding (using the SAME model)
   - Compare the question's embedding to every stored embedding using cosine similarity
   - Pick the top 3 most similar chunks
   - Hand those chunks + the question to Gemini
   - Gemini writes a grounded answer using only those chunks as source

Total time per query: ~50ms for embedding the question + ~10ms for the similarity search = 60ms before the LLM even starts. Fast enough that the recruiter doesn't notice.

---

## Which embedding model do we use?

There are many embedding models. They all do the same job (text → vector) but vary in:
- **Size** (how much disk/RAM they need)
- **Speed** (how long each embedding takes)
- **Quality** (how well similar meanings get similar vectors)
- **Language** (English-only vs multilingual)

| Model | Size | Vector dims | Speed | Quality | When to use |
|---|---|---|---|---|---|
| `all-MiniLM-L6-v2` | 22MB | 384 | fastest | good | **baseline — we start here** |
| `all-mpnet-base-v2` | 420MB | 768 | medium | better | when quality matters more than speed |
| `BAAI/bge-base-en-v1.5` | 440MB | 768 | medium | best for its size | state of the art without huge model |
| `BAAI/bge-large-en-v1.5` | 1.3GB | 1024 | slow | top quality | overkill for portfolio |

**We start with `all-MiniLM-L6-v2`** because:
- Tiny (22MB) → loads fast on Hugging Face Spaces free tier
- 384 dimensions → small vectors → fast similarity comparisons
- "Good enough" quality for portfolio-size content (50-100 chunks)
- Stage 5 will A/B test bigger models on our eval set and switch only if quality matters more than speed

---

## Common mistakes (you WILL hit these — be prepared)

### Mistake 1 — Forgetting that "not X" and "X" embed similarly

If you ask "What do you NOT know about Kubernetes?", embeddings won't distinguish that from "What do you KNOW about Kubernetes?" The negation is invisible to embedding math. **Embeddings see TOPIC, not POLARITY** (yes/no). We handle this later by telling the LLM in its system prompt to respect negation when writing the answer.

### Mistake 2 — Embedding entire long documents

Most embedding models cut off (truncate) text at 256 or 512 tokens (~200-400 words). If your `prepzy.md` is 5000 words, **only the first ~400 are actually embedded**. Everything past that is invisible to retrieval. Your search will fail to find content you know exists.

**Solution: chunking** — split long docs into 200-500 token pieces, embed each piece separately. That's [Concept 2](./03-chunking.md) (next).

### Mistake 3 — Using English-only models for other languages

If you embed Hindi or Telugu text with an English-trained model, all non-English text clusters together regardless of meaning. Search becomes essentially random. We stay English-only for v1; if you ever add Hindi/Telugu content, switch to `paraphrase-multilingual-MiniLM-L12-v2`.

### Mistake 4 — Mixing different embedding models

If you embed your documents with Model A and the query with Model B, the vectors live in DIFFERENT 384-dimensional spaces — comparison is mathematical nonsense. The numbers won't even mean the same thing.

**Always use ONE model for both indexing AND querying.** If you change the model later, you MUST re-embed every document with the new model.

---

## Reading list (only if you want to go deeper)

- [ ] [sentence-transformers — Pretrained models](https://www.sbert.net/docs/pretrained_models.html) — full table of models with descriptions
- [ ] [sentence-transformers — Sentence Embeddings basics](https://www.sbert.net/examples/applications/computing-embeddings/README.html) — beginner tutorial
- [ ] [Cohere — Understanding Embeddings](https://docs.cohere.com/docs/embeddings) — well-written vendor-agnostic intro
- [ ] [Pinecone — Vector Embeddings Explained](https://www.pinecone.io/learn/vector-embeddings/) — visual explanation with diagrams
- [ ] [Hugging Face MTEB Leaderboard](https://huggingface.co/spaces/mteb/leaderboard) — current best embedding models, ranked

---

## Your own notes on Concept 1
*(write in your own words what you understood — the act of writing it out is the actual learning, not just reading)*

## Your reflection on Concept 1
*(what was unclear? what surprised you? what would you want to try with embeddings on your own content?)*

---

**Next:** [03-chunking.md](./03-chunking.md) — Concept 2 (will be written when we proceed)
