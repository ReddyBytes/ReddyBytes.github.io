# Concept 6 — Hallucination + grounding

> Read [00-glossary.md](./00-glossary.md) first if any term is unfamiliar.
> This is the final concept of Stage 1. Previous concepts taught us how to retrieve good chunks and build good prompts. This file explains WHY LLMs still lie even after all that, and HOW we minimize it.

---

## What problem does this solve?

You've done everything right:
- Good chunking (Concept 2)
- Fast vector DB (Concept 3)
- Smart retrieval (Concept 4)
- Well-structured prompts (Concept 5)

Recruiter asks a question. LLM responds:

> "Penchala worked at Google from 2019-2022 as a Senior Backend Engineer, where he led the Search Infrastructure team and reduced query latency by 40%."

**Sounds plausible. Is mostly invented.**

Penchala doesn't have a Google job in his content. The LLM made it up — confidently, with specific dates and metrics. This is **hallucination**, and it happens even with RAG.

This concept is about WHY it still happens and what techniques reduce it.

---

## Think of it like this — bluffing student vs honest student

Two students take the same open-book exam.

### Bluffing student
Reads the notes. Doesn't find the answer. Writes a confident-sounding paragraph anyway, full of plausible-but-fake details. The handwriting is neat, the sentences flow well, but the FACTS are made up.

### Honest student
Reads the notes. Doesn't find the answer. Writes: "The notes don't cover this — I'd need more info to answer." Or quotes the notes directly with attribution.

**LLMs default to bluffing student.** They're trained to be helpful and complete; refusing feels rude. So they pad and confabulate.

Our job: train them (via prompt engineering) to act like the honest student.

---

## Why LLMs hallucinate even with RAG

This is the key insight: **LLMs are next-token predictors, not fact-checkers**.

When generating text, an LLM picks each word based on:
1. What's likely to come next given the prompt
2. Its training data patterns

It doesn't have a "fact-checking" mechanism. If the prompt context says "Penchala worked with Python" and the next plausible-sounding sentence would be "He led a team of 10 engineers at Apple" — the LLM might write that sentence even though nothing in the context supports it.

Sources of hallucination, ranked by frequency:

1. **Padding** — answer would feel incomplete without extra details, so LLM invents them
2. **Combining real facts wrong** — context mentions "Apple" and "Python" separately; LLM connects them as "Python at Apple"
3. **Specific numbers** — LLM loves to add metrics ("40% improvement", "10K users") even when not in context
4. **Dates** — LLM loves to add specific years ("from 2019-2022") even when not in context
5. **Implication overreach** — context says "Python experience"; LLM extrapolates to "Python expert who could lead teams"

---

## Why RAG reduces but doesn't eliminate hallucination

**With RAG**: LLM has the source text right in the prompt. Hallucination drops dramatically (~70-80%) because the LLM is biased toward what it sees.

**But it can't drop to zero** because:
- LLM might IGNORE the source if it conflicts with training data ("but I 'know' Penchala worked at Google!")
- LLM might INVENT details not in the source (numbers, dates, implications)
- LLM might MISCITE — say "[source: skills.md]" for a claim that came from training, not from skills.md

The grounding techniques below are what push hallucination from "rare" to "very rare". You can't fully eliminate it without architectural changes (fine-tuning, multi-agent fact-checking, etc.).

---

## 5 grounding techniques

### Technique 1 — Explicit refusal instruction

Add to the system prompt:

```
If the context doesn't contain the answer, say:
"I don't have that information — try asking about projects, skills, or experience."
NEVER invent facts not present in the context.
```

The "NEVER invent facts" is doing a lot of work. LLMs treat capitalized rules as load-bearing.

### Technique 2 — Citation enforcement

```
Every factual claim MUST be followed by a source citation in this format:
[source: filename.md]
If you cannot cite a source for a claim, do not make the claim.
```

When LLMs HAVE to cite, they're less willing to make stuff up (because the bogus citation is easy to spot).

### Technique 3 — Quote requirement

For the strongest grounding, ask the LLM to quote the supporting text directly:

```
For each claim, quote the exact phrase from context that supports it:
"Penchala has 5+ years of Python experience" — context says "Python (5+ years)"
                                                  [source: skills.md]
```

This is more verbose but harder to fake. Hallucinations require inventing a "quote" that's checkable.

### Technique 4 — Low temperature

Temperature controls randomness:
- `temperature = 0.0`: LLM picks the SINGLE most likely next token every time (deterministic, conservative)
- `temperature = 0.7`: LLM samples from likely tokens (creative, can invent)
- `temperature = 1.0+`: highly creative/random (rarely useful)

For factual Q&A (our case), **set temperature = 0.0**. Reduces creative inventions.

```python
gemini.generate(prompt, temperature=0.0)
```

### Technique 5 — Source attribution in UI

This is a UX trick rather than a prompt trick. In the AI orb UI, SHOW the recruiter which chunks were retrieved:

```
┌──────────────────────────────────────────────┐
│ Penchala has 5+ years of Python experience   │
│ [source: skills.md]                          │
│                                              │
│ Sources used:                                │
│ - skills.md                                  │
│ - projects/prepzy.md                         │
└──────────────────────────────────────────────┘
```

Two effects:
1. **Trust** — recruiter sees the answer is grounded, not invented
2. **Accountability** — if the LLM hallucinated, recruiter can click and verify the source DOESN'T support the claim

---

## Worked example — same question, hallucinated vs grounded

Question: **"What's Penchala's leadership experience?"**

Retrieved context:
```
[1] source: experience.md
Worked as a software engineer at Apple (2022-present). Built backend
APIs and data pipelines. Mentored 2 interns in 2024.

[2] source: skills.md
Strong in Python, FastAPI, PostgreSQL. Comfortable in cross-functional teams.
```

### Hallucinated answer (bad prompt — no refusal, no temperature control)

> Penchala has **strong leadership experience**, having **led a team of 5 engineers
> at Apple** since 2022. He **drove a 30% improvement in API performance** and
> **mentored multiple interns and junior engineers**. He's known for his
> **collaborative leadership style** and ability to deliver complex systems
> on schedule.

**Reality**: he MENTORED 2 INTERNS. Everything else is invented to sound like "leadership experience".

### Grounded answer (good prompt with refusal + temperature 0)

> Penchala's primary leadership experience is mentoring 2 interns in 2024
> while working as a software engineer at Apple [source: experience.md]. The
> available context doesn't include formal team-lead roles or larger leadership
> responsibilities.

**Reality**: this is what the context actually supports. Honest about the gap.

The good answer is shorter, less impressive-sounding, but TRUE. A good recruiter values truthful answers over inflated ones.

---

## Detection strategies (how to catch hallucinations)

You can't prevent all hallucinations, so you also need to DETECT them. Three approaches:

### Manual review
Run your eval set. For each (question, answer) pair, manually check:
- Is every claim in the answer supported by the cited source?
- Are the citations real (do those files actually contain that info)?

Tedious but the gold standard.

### LLM-as-judge
Use a second LLM to fact-check the first:
```
You are a fact-checker. Given the SOURCE and the CLAIM, output:
- "supported" if the source contains the claim
- "unsupported" if the source doesn't contain the claim
- "contradicted" if the source says the opposite

SOURCE: <retrieved chunk>
CLAIM: <one claim from the LLM's answer>
```

Cheaper than manual review, less accurate. Good for catching the worst hallucinations.

### Regex / heuristic fact-check
For specific patterns:
- If LLM mentions a year (`2019`, `2022`), check if that year appears in any retrieved chunk
- If LLM mentions a number (`40%`, `10K users`), check if it's in the context
- If LLM mentions a company name (`Google`, `Microsoft`), check the context

Cheap, fast, catches obvious fabrications.

---

## Why this matters for OUR portfolio

Hallucinations are especially damaging for a portfolio:
- A recruiter who catches an obvious lie ("Penchala worked at Google in 2019" — checkable on LinkedIn) loses trust completely
- Even if recruiter doesn't catch it, the candidate is now committed to a false story
- Bad-faith use: recruiters who later quote the lie in interview ("you said you led teams at Google?")

So our grounding pipeline (Stage 9 production version):

1. **System prompt** explicitly forbids invented details, requires citations, mandates refusal
2. **Temperature = 0.0** (deterministic responses)
3. **UI shows retrieved chunks** (trust + accountability)
4. **Eval set** includes "trap" questions (asking about things NOT in content) — LLM should refuse, not invent
5. **Eval-in-CI** — fail the PR if hallucination rate increases

Stage 7 (`13-stage-7-prompt-tuning.md`) tests prompt variants. Stage 9 (`15-stage-9-production-hardening.md`) wires up the production guardrails.

---

## Common mistakes

### Mistake 1 — Trusting LLM confidence

LLMs ALWAYS sound confident. They don't say "I'm not sure" unless explicitly told to. High-confidence hallucinations are the most dangerous because they read as authoritative.

**Mitigation**: NEVER assume "the LLM sounded sure, so it's probably right." Always check against source.

### Mistake 2 — Not testing edge cases

You only test the eval set with questions you KNOW have answers in content. You never test "out-of-scope" questions (questions whose answer isn't in your content).

So you have no idea how often the LLM hallucinates vs refuses.

**Mitigation**: include 5-10 "out-of-scope" questions in your eval set. Measure refusal rate vs invention rate.

### Mistake 3 — Skipping eval

"The answers look good when I try it" is not evaluation. Manual vibes-check on 5 questions doesn't catch the 20% of questions where the LLM hallucinates.

**Mitigation**: build the eval set in Stage 3. Run it on every change. Track metrics over time.

### Mistake 4 — Long context degradation

You stuff 20 chunks (10K tokens) into the prompt. LLM ignores instructions buried in the prompt's middle section. Refusal rule fails, LLM bluffs.

**Mitigation**: keep k=3 to k=5. Put critical instructions at top (system) AND end (right before user question).

### Mistake 5 — Citing without checking

LLM cites `[source: skills.md]` for a claim that isn't actually in skills.md. The CITATION looks correct (real filename), but the underlying fact is invented.

**Mitigation**: in your eval, verify every (claim, citation) pair against the actual file. Use LLM-as-judge to scale.

---

## Reading list (only if you want to go deeper)

- [ ] [Anthropic — Reducing hallucinations](https://docs.anthropic.com/en/docs/test-and-evaluate/strengthen-guardrails/reduce-hallucinations) — official guidance
- [ ] [LangChain — Self-querying retrievers](https://python.langchain.com/docs/integrations/retrievers/self_query/) — query-aware retrieval
- [ ] ["Survey of Hallucination in NLG" paper](https://arxiv.org/abs/2202.03629) — academic deep dive
- [ ] [Vectara — Hallucination leaderboard](https://github.com/vectara/hallucination-leaderboard) — model-by-model comparison
- [ ] [Anthropic — Claude is good at refusing](https://www.anthropic.com/news/claude-2-1-prompting) — model-specific tip

---

## Your own notes on Concept 6
*(write in your own words what you understood)*

## Your reflection on Concept 6 + overall Stage 1
*(now that you've finished all 6 concepts, what's the biggest shift in how you think about RAG? What's the part you're least confident on?)*

---

**Previous:** [06-rag-pattern.md](./06-rag-pattern.md) — Concept 5
**Stage 1 complete!** Next stage starts at [08-stage-2-minimal-rag.md](./08-stage-2-minimal-rag.md) — where we finally write the first lines of RAG code.

---

## Stage 1 retrospective

You've now read all 6 concepts. Before moving to Stage 2 (code), zoom out and answer these in writing (in your notes):

1. In one paragraph, explain RAG to a non-technical recruiter.
2. Which of the 6 concepts felt most counterintuitive?
3. Which gotcha do you think will bite us first?
4. What's something you'd like to try that we haven't planned yet?
