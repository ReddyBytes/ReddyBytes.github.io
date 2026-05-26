# Big picture — why RAG exists

> First read [00-glossary.md](./00-glossary.md) if any term is unfamiliar.

---

## The problem

Imagine you ask ChatGPT: **"What's Penchala's strongest Python project?"**

ChatGPT has NO IDEA who Penchala is. It was trained on text from the public internet, which probably doesn't include details about Penchala's projects. So ChatGPT will do one of three things:

1. **Say it doesn't know** — honest but useless to a recruiter
2. **Make up an answer** — invents a fake project, fake details, fake numbers. This is **hallucination**, and it's the main problem with LLMs.
3. **Give a generic answer** — talks about Python projects in general, not yours specifically. Also useless.

None of these help a recruiter who wants real info about you.

---

## The solution — RAG

**RAG (Retrieval-Augmented Generation)** solves this by giving the LLM the actual answer BEFORE it generates a response. Think of it as the difference between an OPEN-BOOK exam and a CLOSED-BOOK exam.

### Closed-book (no RAG)

```
Recruiter: "What's Penchala's Python project?"
                  ↓
LLM (from memory only): "Based on my training data...
                         [hallucinates or says don't know]"
```

The LLM is alone with its training knowledge. Anything it doesn't already remember, it has to guess. Result: wrong or generic answers.

### Open-book (with RAG)

```
Recruiter: "What's Penchala's Python project?"
                  ↓
Step 1 — FIND the answer in YOUR documents:
         Search content/ → find content/projects/prepzy.md is most relevant
                  ↓
Step 2 — SHOW the LLM the answer + the question:
         "Here's a document about Penchala: [prepzy.md content]
          Now answer this question: What's Penchala's Python project?"
                  ↓
Step 3 — LLM responds using YOUR text:
         "According to prepzy.md, Penchala built Prepzy, an exam-prep
          platform using Python, FastAPI, PostgreSQL..."
```

The LLM's job changes from **"guess from memory"** to **"summarize this specific text I just gave you"**. Much harder to hallucinate when the source is right in front of it.

---

## How this maps to our portfolio

**For our portfolio**, RAG turns Markdown content in `content/` into a knowledge base the AI orb can answer from. Recruiters get accurate answers grounded in real content — not hallucinated marketing fluff.

```
┌────────────────────────────────────────────────────────────────┐
│ Recruiter visits reddybytes.github.io                          │
│ Clicks AI orb, asks: "What's Penchala's K8s experience?"       │
└────────────────────────────────────────────────────────────────┘
                              ↓
┌────────────────────────────────────────────────────────────────┐
│ Frontend (Next.js) sends question to backend                   │
│   POST https://reddybytes-portfolio-rag.hf.space/api/v1/ask    │
└────────────────────────────────────────────────────────────────┘
                              ↓
┌────────────────────────────────────────────────────────────────┐
│ Backend (FastAPI) does the RAG dance:                          │
│                                                                 │
│   1. Embed the question (Concept 1)                            │
│   2. Search FAISS for top-3 closest chunks (Concept 3 + 4)     │
│   3. Build a prompt with those chunks (Concept 5)              │
│   4. Send to Gemini, stream response                           │
└────────────────────────────────────────────────────────────────┘
                              ↓
┌────────────────────────────────────────────────────────────────┐
│ Frontend streams response into the orb UI                      │
│ Recruiter sees: "According to experience.md and projects/      │
│                  prepzy.md, Penchala has worked with K8s..."   │
└────────────────────────────────────────────────────────────────┘
```

The recruiter gets a real answer, grounded in the actual content you wrote. No hallucinations. Cited sources.

---

## The 6 concepts ahead

Each concept is one piece of the RAG puzzle. We go through them in order in the next files (`02-embeddings.md` through `07-hallucination.md`).

| # | Concept | What it does |
|---|---|---|
| 1 | **Embeddings** | Convert text into numbers so we can compare meanings mathematically |
| 2 | **Chunking** | Split long documents into small pieces the embedding model can handle |
| 3 | **Vector DB (FAISS)** | Store thousands of embeddings + find the closest matches in milliseconds |
| 4 | **Retrieval** | Pick the BEST few chunks for the user's question |
| 5 | **RAG pattern** | The recipe for combining retrieved chunks + question + LLM into a good answer |
| 6 | **Hallucination + grounding** | Why LLMs still lie even with RAG, and how to reduce it |

---

## Why we're doing this stage-by-stage (not just shipping code)

Going straight from "build RAG" → working code teaches wiring, not *why*. We go concept-by-concept with **evaluation between concepts** so you understand how each piece affects quality.

Recruiters can tell the difference between "wired LangChain together" and "tuned chunk size after measuring retrieval precision". The second wins. The learning trail (this folder) IS part of the recruiter signal.

---

## Your reflection on the big picture
*(after reading, write what your mental model of RAG is now in your own words — even 2-3 sentences helps cement it)*
