# ADR 0002 — GitHub Pages + Hugging Face Spaces

**Status:** Accepted · **Date:** 2026-05-26

## Context

Hosting options for the portfolio (Next.js frontend + FastAPI backend, see ADR 0001):

- (a) GitHub Pages (frontend) + Hugging Face Spaces (backend)
- (b) Vercel (frontend + serverless functions, no Python)
- (c) Cloudflare Pages + Cloudflare Workers (no Python)
- (d) AWS (S3 + CloudFront + Lambda or Fargate)
- (e) Self-hosted (DigitalOcean/Hetzner droplet)

## Decision

**(a) GitHub Pages + Hugging Face Spaces.**

## Why

**GitHub Pages for frontend:**
- $0/month, 100GB bandwidth/month free
- Source-code-visible-to-recruiters is a feature, not a bug — recruiters trust public proof of authorship
- User-page URL `<username>.github.io` is clean and memorable
- Custom domain attachable later (one CNAME)
- "Hosted on GitHub Pages" is a recruiter-trust signal (community standard for dev portfolios)

**Hugging Face Spaces for backend:**
- $0/month, Python-native container runtime
- ML library ecosystem (sentence-transformers, FAISS, transformers) pre-cached at the Docker layer
- HF community familiarity = AI engineer brand signal in itself
- Auto-deploy on git push, easy environment variable management
- The Space being visible at `huggingface.co/spaces/ReddyBytes/portfolio-rag` adds another portfolio piece

**Why not Vercel (option b):** No Python runtime. Forces TypeScript backend with OpenAI/Anthropic SDKs only. Loses "Python is main" positioning (ADR 0001).

**Why not Cloudflare (option c):** Same Python limitation as Vercel. Workers are JS/WASM-only.

**Why not AWS (option d):** Overkill for portfolio scale. Free tier expires after 12 months. Cognitive overhead of Lambda + IAM + CloudFront for a static site is not worth it. Reserve AWS for Prepzy-scale projects.

**Why not self-hosted (option e):** Monthly cost (~$6+/month), maintenance burden, no recruiter trust signal vs managed platforms.

## Consequences

**Good:**
- $0/month forever at portfolio traffic levels
- Two recruiter trust signals (GitHub + HF) for free
- Independent scaling per layer (upgrade HF tier if RAG load grows; GitHub Pages handles frontend forever)

**Trade-offs:**
- HF Spaces free tier sleeps after 48h inactivity → 15-30s cold-start on wake. Must show "AI is waking up..." UX (see RAG-BACKEND.md).
- GitHub Pages can only serve from one branch (gh-pages or main) — no preview environments. Use Vercel/Netlify-style branch previews via separate ad-hoc tooling if needed.
- CORS configuration between `*.github.io` and `*.hf.space`.

## Migration triggers

Switch hosting when:
- **Frontend**: GH Pages bandwidth exceeds 100GB/mo → move to Cloudflare Pages (also free, higher limits) — see DEPLOYMENT.md
- **Backend**: HF Space cold-starts become a UX problem (>5% of recruiter visits affected) → upgrade to HF persistent storage ($9/mo) OR move to Fly.io free tier
