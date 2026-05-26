# Backend — FastAPI + RAG

The Python service that powers the AI assistant orb on [reddybytes.github.io](https://reddybytes.github.io).

**Deployed to:** [Hugging Face Spaces](https://huggingface.co/spaces/ReddyBytes/portfolio-rag) (free tier, Docker SDK)

## Status

**v0.1.0** — Scaffold only.

- ✅ FastAPI app with CORS + lifespan hooks
- ✅ `GET /api/v1/health` endpoint
- ✅ Pydantic Settings (env vars via `.env`)
- ✅ Dockerfile at repo root (HF Space entry)
- ✅ pytest setup with health endpoint tests
- ⏳ RAG pipeline — see `docs/AI-LEARNING-LOG.md` (9-stage curriculum)
- ⏳ Rate limiting (slowapi)
- ⏳ Structured logging (structlog)

## Local development

```bash
# From repo ROOT (not from backend/)
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Copy env template + fill values
cp .env.example .env
# edit .env — at minimum, you can leave LLM keys empty for the health endpoint

# Run
uvicorn backend.main:app --reload --port 7860
# → http://localhost:7860/api/v1/health
# → http://localhost:7860/docs (auto-generated OpenAPI UI)
```

## Tests

```bash
# From repo root
pytest

# With coverage
pytest --cov=backend --cov-report=term-missing

# Specific test
pytest tests/test_health.py -v
```

## Type checking + linting

```bash
mypy backend/
ruff check backend/ scripts/ tests/
ruff format backend/ scripts/ tests/
```

## Architecture + design

- [`docs/ARCHITECTURE.md`](../docs/ARCHITECTURE.md) — system diagram, folder structure, deploy flow
- [`docs/RAG-BACKEND.md`](../docs/RAG-BACKEND.md) — RAG pipeline, plug-and-play interfaces, recruiter modes
- [`docs/AI-LEARNING-LOG.md`](../docs/AI-LEARNING-LOG.md) — 9-stage learning curriculum (treat the RAG build as a learning project)
- [`docs/DEPLOYMENT.md`](../docs/DEPLOYMENT.md) — HF Space deploy steps

## Why FastAPI + HF Spaces

See [`docs/adr/0001-nextjs-frontend-fastapi-backend.md`](../docs/adr/0001-nextjs-frontend-fastapi-backend.md) and [`docs/adr/0002-gh-pages-plus-hf-spaces.md`](../docs/adr/0002-gh-pages-plus-hf-spaces.md).
