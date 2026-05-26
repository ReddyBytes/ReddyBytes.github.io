# ADR 0001 — Next.js frontend + FastAPI backend

**Status:** Accepted · **Date:** 2026-05-26

## Context

The portfolio needs to deliver:
- A premium cinematic visual experience (Layer 1 landing, depth-on-scroll, signature interactions)
- A real RAG-powered AI assistant (showcasing AI engineering, not faking it)
- Free hosting at $0/month at portfolio scale
- "Python is main" positioning for the AI engineer brand

Options considered:
- (a) Next.js frontend + FastAPI backend — split stack
- (b) Pure Python (Pelican SSG + FastAPI) — Python end-to-end
- (c) Next.js with Vercel Functions (TypeScript backend)
- (d) Astro frontend + FastAPI backend

## Decision

**(a) Next.js frontend (TypeScript) + FastAPI backend (Python).**

Frontend deploys as a static export to GitHub Pages. Backend runs on Hugging Face Spaces.

## Why

**Next.js wins on UI ceiling.** The signature interactions (cinematic portal hero, vault doors, train journey, neural skill map, Architecture Lab with Three.js) demand the highest React + animation ecosystem available. Pelican (b) and Astro (d) can produce static HTML but require significant workarounds for heavy interactivity. The visual differentiation from other portfolios depends on these interactions — UI ceiling is non-negotiable.

**FastAPI wins on backend.** Python is the AI engineer's strongest language and the brand's positioning. FastAPI on HF Spaces:
- Python-native ML libraries (sentence-transformers, FAISS, LangChain) run cleanly
- HF Spaces is free + ML-community-aware (recruiter signal in itself)
- TypeScript backends (option c) lose the "Python is main" message and force OpenAI/Anthropic SDKs over Python ML ecosystem
- The split is honest: frontend is presentation, backend is intelligence

**"Python is main" is preserved without compromise.** Python runs in 4 places: backend (FastAPI/RAG), build scripts (photos/sitemap/OG/knowledge index), content scaffolders, CI workflows. The frontend being TypeScript doesn't dilute Python positioning — the AI brain that recruiters interact with IS Python.

## Consequences

**Good:**
- Maximum visual ceiling + maximum AI ceiling
- $0 hosting (both free tiers)
- Two independent deploy cycles (frontend ships without backend, vice versa)
- Plug-and-play boundary at the HTTP layer

**Trade-offs:**
- Two repos to maintain (frontend on GitHub, backend on HF Space)
- Cold-start UX on HF Space free tier (~15s wake from 48h sleep) — must handle gracefully in the UI
- CORS configuration needed between domains

## Alternatives ruled out

- **Pelican (option b)** — UI ceiling too low for vault doors / train / Architecture Lab; would force iframe hacks
- **Vercel Functions in TypeScript (option c)** — loses Python positioning; OpenAI SDKs only; not the AI engineer brand
- **Astro (option d)** — lower interaction ceiling than Next.js; less recruiter-familiar
