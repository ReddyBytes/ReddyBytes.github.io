# Concept 5 — RAG pattern (prompt construction)

> Read [00-glossary.md](./00-glossary.md) first if any term is unfamiliar.
> Previous concepts taught us how to find the right chunks. This file teaches us how to STUFF those chunks into the LLM prompt effectively.

---

## What problem does this solve?

You've retrieved the 3 best chunks for the recruiter's question. Now you have to hand them to the LLM along with the question and get back an answer.

**The naive way**: just paste the chunks before the question.

```
Penchala uses Python. He built Prepzy. K8s for deploy.
Question: What's Penchala's experience?
```

**Problems with this**:
- LLM has no instructions on HOW to answer (concise? detailed? cite sources?)
- LLM doesn't know which text is "context" vs "question" — might treat the whole thing as one prompt
- LLM has no source attribution — can't cite where info came from
- LLM has no refusal rule — will try to answer even with poor context
- LLM might pad with hallucinated extra info to sound complete

**The RAG pattern** is the standard structured way to construct prompts that gets the LLM to behave: grounded, concise, citing sources, refusing when unsure.

---

## Think of it like this — giving notes to an open-book student

Two scenarios for an open-book exam:

### Bad teacher
Hands the student a stack of unsorted papers (study materials) along with the exam question. Says nothing. Student doesn't know which papers are relevant, what format to answer in, what to do if the answer isn't in the papers.

Result: student might guess, might bluff, might cite invented sources, might answer in 10 pages when 2 sentences was enough.

### Good teacher
Hands the student:
- A clear instruction sheet: "Answer using ONLY these notes. Cite the page number. If notes don't have the answer, say 'not in notes'."
- The relevant notes, numbered and labeled with source
- The question, clearly separated

Result: student answers precisely, cites sources, and is honest about gaps.

**RAG prompt construction is being the good teacher.**

---

## Anatomy of a RAG prompt

A well-structured RAG prompt has 4 sections:

```
┌──────────────────────────────────────────────────────────┐
│ 1. SYSTEM PROMPT (the instructions)                       │
│    "You are Penchala's AI assistant. Answer using only    │
│     the provided context. Cite sources as [source: X].    │
│     If context doesn't contain the answer, say so."       │
├──────────────────────────────────────────────────────────┤
│ 2. CONTEXT (retrieved chunks, numbered + labeled)         │
│    [1] source: skills.md                                  │
│    Strong in Python (5+ years), FastAPI, PostgreSQL.      │
│                                                            │
│    [2] source: projects/prepzy.md                         │
│    Built Prepzy, an exam-prep SaaS. Tech: Python backend, │
│    Next.js frontend...                                     │
├──────────────────────────────────────────────────────────┤
│ 3. (Optional) FEW-SHOT EXAMPLES                           │
│    Q: What's the candidate's strongest language?          │
│    A: Python — used for 5+ years [source: skills.md].     │
├──────────────────────────────────────────────────────────┤
│ 4. USER QUESTION                                          │
│    Q: What's Penchala's experience?                       │
│    A:                                                      │
└──────────────────────────────────────────────────────────┘
```

The LLM reads top-to-bottom, executes the system instructions, uses the context, follows the examples, answers the question.

---

## Worked example — bad prompt vs good prompt

Both use the same retrieved chunks. Watch how the answer quality differs.

### Bad prompt

```
Penchala has 5 years Python. Built Prepzy with FastAPI and PostgreSQL.
Deployed to AWS.

What's Penchala's experience?
```

**LLM might respond** (hallucinated extras in **bold**):
> Penchala is a senior software engineer with 5 years of Python experience.
> He built Prepzy, a successful SaaS that has **served thousands of users**,
> using FastAPI and PostgreSQL. He's also worked with **Kubernetes,
> Docker, and various other DevOps tools**. He's currently based in
> **San Francisco**.

Most of that is invented (bold). LLM padded the answer to sound complete.

### Good prompt

```
SYSTEM: You are Penchala's portfolio AI assistant. Answer recruiter questions
using ONLY the provided context. Always cite source filenames in brackets
[source: filename.md]. If the context doesn't contain enough info, say
"I don't have that information — try asking about projects or skills."
Keep answers to 2-3 sentences.

CONTEXT:
[1] source: skills.md
Strong in Python (5+ years), FastAPI, PostgreSQL.

[2] source: projects/prepzy.md
Built Prepzy, an exam-prep SaaS. Tech: Python backend, Next.js frontend.
Deployed to AWS ECS.

USER: What's Penchala's experience?

ASSISTANT:
```

**LLM responds**:
> Penchala has 5+ years of Python experience and works with FastAPI and PostgreSQL
> [source: skills.md]. He built Prepzy, an exam-prep SaaS with a Python backend
> and Next.js frontend, deployed to AWS ECS [source: projects/prepzy.md].

Concise, cited, grounded. No hallucinations. No invented locations or unrelated tools.

---

## Best practices (the rules behind good prompts)

### Rule 1 — Use clear section delimiters

LLMs are very sensitive to structure. Use one of:
- Markdown headings (`## CONTEXT`)
- XML-style tags (`<context>...</context>`)
- ASCII separators (`---` or `===`)

Pick one and use it consistently throughout your prompt.

### Rule 2 — Number + label every chunk

Don't just paste chunks raw. Format them as:
```
[1] source: skills.md
   Content here...

[2] source: projects/prepzy.md
   Content here...
```

This lets the LLM:
- Refer to specific chunks ("based on [1]...")
- Cite sources accurately
- Distinguish between separate retrieved pieces

### Rule 3 — Explicit instructions at the TOP and END

LLMs (especially long-context models) sometimes "forget" instructions buried in the middle of a prompt. Put critical instructions at the START (system prompt) and remind at the END if needed.

Example bad placement:
```
Context: ...
Important: cite sources!
Context: ...
```

Example good placement:
```
SYSTEM: Cite sources as [source: X]. Refuse if unsure.

CONTEXT: ...

USER: ...
```

### Rule 4 — Tell LLM what to do when context is empty

If retrieval returned poor chunks (low similarity), the LLM will try to bluff. Pre-empt this:

```
If the context doesn't contain the answer, say:
"I don't have that information — try asking about projects, skills, or experience."
```

### Rule 5 — Set `max_tokens` (or equivalent)

LLMs sometimes ramble. Cap the output length:
```python
gemini.generate(prompt, max_output_tokens=400)
```

For Q&A RAG, 200-400 tokens is plenty for a complete answer.

### Rule 6 — Use few-shot examples for consistency

Showing the LLM 2-3 example (Q, A) pairs teaches it the answer style you want, much more reliably than describing it in words.

```
Example:
Q: What languages does Penchala know?
A: Python (5+ years) and JavaScript [source: skills.md].

Q: Has Penchala shipped anything to production?
A: Yes — Prepzy is live at prepzy.co.in [source: projects/prepzy.md].

Now answer:
Q: <recruiter's actual question>
A:
```

The LLM mimics the example style — concise, cited, factual.

---

## Why this matters for OUR portfolio

Our exact system prompt (will refine in Stage 7) looks like:

```
You are Penchala Reddy's portfolio AI assistant.

Your job:
- Answer recruiter questions using ONLY the provided context.
- Always cite source filenames in brackets, e.g. [source: skills.md].
- Keep answers to 2-3 sentences unless asked for more detail.
- If the context doesn't contain the answer, say:
  "I don't have that info — try asking about projects, skills, or experience."
- Never invent facts, numbers, dates, or details not in the context.
- Match the recruiter's tone (formal recruiter → formal answer; casual → casual).
```

Plus role-aware variants (Stage 8 — `14-stage-8-recruiter-modes.md`):

```python
ROLE_PROMPTS = {
  "default": "...above system prompt...",
  "backend": "...above + Focus on Python, FastAPI, infrastructure, databases.",
  "ai_ml": "...above + Focus on RAG, embeddings, LLMs, AI architecture.",
  "platform": "...above + Focus on infrastructure, scaling, deployment.",
}
```

Stage 7 (`13-stage-7-prompt-tuning.md`) is where we systematically test prompt variants on the eval set and pick the best.

---

## Common mistakes

### Mistake 1 — Burying instructions in the middle of the prompt

```
[long context]
[instructions]
[more context]
[user question]
```

LLM often ignores middle instructions. Put them at the top (system) or end.

### Mistake 2 — No source labels in chunks

```
Penchala uses Python. He built Prepzy. 
```

LLM doesn't know WHERE these facts came from → can't cite reliably → might fabricate citations ("according to my training data..." or invent fake sources).

**Mitigation**: every chunk prefixed with `[N] source: filename.md`.

### Mistake 3 — Missing refusal instruction

LLM trained to be helpful → will always try to answer, even when it shouldn't.

If your context contains chunks about Python and the recruiter asks about Java, the LLM might say "Penchala probably knows Java since he knows Python" — pure speculation.

**Mitigation**: explicit "if context doesn't contain answer, refuse" line.

### Mistake 4 — Stuffing too many chunks

Modern LLMs have huge context windows (Gemini = 1M tokens). Tempting to throw in 20 chunks.

But research shows: LLMs degrade past ~50% of context window. Specifically, content in the MIDDLE of long contexts often gets ignored ("lost in the middle" problem).

**Mitigation**: k=3 to k=5 chunks. Even if you have room for more, don't.

### Mistake 5 — Mixing instructions with context

```
Context: Penchala uses Python. Please cite sources. Context: He built Prepzy.
```

LLM might interpret "please cite sources" as part of the context (e.g., as something Penchala said). Confusing.

**Mitigation**: clear section delimiters. Instructions in SYSTEM block, context in CONTEXT block.

### Mistake 6 — Inconsistent citation format

Sometimes you say `[source: X]`, sometimes `(source: X)`, sometimes `from X.md`. LLM mimics whichever you used last → inconsistent output across queries.

**Mitigation**: pick one format, use it everywhere (in instructions, examples, chunks).

---

## Reading list (only if you want to go deeper)

- [ ] [Anthropic — Be clear and direct](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/be-clear-and-direct) — solid prompt design principles
- [ ] [OpenAI — RAG cookbook](https://cookbook.openai.com/examples/question_answering_using_embeddings) — full RAG example with prompt construction
- [ ] [Anthropic — Prompt engineering overview](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview) — best practices
- [ ] ["Lost in the Middle" paper](https://arxiv.org/abs/2307.03172) — why long contexts degrade
- [ ] [Google — Gemini prompt design](https://ai.google.dev/gemini-api/docs/prompting-intro) — Gemini-specific tips

---

## Your own notes on Concept 5
*(write in your own words what you understood)*

## Your reflection on Concept 5
*(which best practice felt most surprising? which one would you skip and why?)*

---

**Previous:** [05-retrieval.md](./05-retrieval.md) — Concept 4
**Next:** [07-hallucination.md](./07-hallucination.md) — Concept 6
