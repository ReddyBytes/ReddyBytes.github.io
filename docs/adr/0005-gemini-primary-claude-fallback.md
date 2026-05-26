# ADR 0005 — Gemini primary, Claude Haiku fallback (no OpenAI)

**Status:** Accepted · **Date:** 2026-05-26

## Context

The RAG-powered AI assistant orb needs an LLM provider. Options:

- (a) OpenAI GPT-4o-mini / GPT-4 — industry default
- (b) Google Gemini 2.5 Flash — free tier, multimodal
- (c) Anthropic Claude Haiku 4.5 — fastest + cheapest of Claude family
- (d) Self-hosted (Llama-3, Mistral on HF Space GPU)
- (e) Multiple — primary + fallback chain

## Decision

**(e) Multiple — Google Gemini 2.5 Flash primary, Anthropic Claude Haiku 4.5 fallback. NO OpenAI.**

Routing logic in `backend/rag/llm/__init__.py`:

```
try Gemini → on rate-limit / outage → try Claude Haiku → on failure → cached FAQ
```

## Why

**Gemini primary:**
- Free tier: 1,500 requests/day — covers portfolio scale entirely at $0
- 1M token context window on 2.5 Flash — never bottlenecked by context
- Latency ~500ms — fast enough for streaming UX
- Multimodal-ready (if we add image-based queries later)

**Claude Haiku 4.5 fallback:**
- Fastest + cheapest in Claude family ($0.25/M input, $1.25/M output)
- Strongest instruction-following per dollar — handles complex recruiter modes well
- Independent failure domain from Google (different cloud, different SLA)
- 200K context window

**No OpenAI** (carried from Prepzy critical rule):
- OpenAI is excluded by user preference — historically aligned with Anthropic + Google ecosystems
- One less vendor relationship to manage
- OpenAI pricing higher than Gemini free tier; no cost win

**Why not self-hosted (option d):**
- Free HF Space has CPU only (no GPU); Llama-3-8B inference too slow on CPU (~30s/response)
- GPU tier $9/mo defeats free-first goal
- Defer to Phase 3+ as a learning project (see RAG-BACKEND.md future evolution)

## Consequences

**Good:**
- $0/month at portfolio scale (Gemini free tier handles 100% of traffic)
- Resilience: two independent provider outages required to break the AI orb
- Recruiter signal: "uses modern free-tier AI providers" (cost-conscious AI engineer)

**Trade-offs:**
- Two API keys to manage (GEMINI_API_KEY + ANTHROPIC_API_KEY)
- Two SDKs in `requirements.txt` (google-generativeai + anthropic)
- Different response shapes — `LLMProvider` interface (ADR-implied) normalizes them
- Streaming format differs slightly — handle in provider adapter

## Monitoring

Log per-request which provider served:

```json
{"requestId": "...", "llm": "gemini-2.5-flash", "tokens_out": 142, "fallback_used": false}
{"requestId": "...", "llm": "claude-haiku-4.5", "tokens_out": 138, "fallback_used": true, "reason": "gemini_rate_limit"}
```

Weekly review: if `fallback_used > 5%` of requests, Gemini quota may be insufficient — consider upgrading or load-balancing.

## Future re-evaluation

Revisit this decision when:
- A new provider undercuts Gemini's free tier significantly
- Self-hosted Llama-3 / Mistral on HF Space GPU becomes price-competitive
- Multimodal queries become a feature (Gemini's edge today)
