"""
FastAPI entrypoint. Mounts middleware + routes.

HF Spaces runs this via Dockerfile CMD:
    uvicorn backend.main:app --host 0.0.0.0 --port 7860

Local dev:
    uvicorn backend.main:app --reload --port 7860
"""

from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.config import settings
from backend.routes import health


@asynccontextmanager
async def lifespan(_app: FastAPI) -> AsyncIterator[None]:
    """Startup + shutdown hooks. RAG index loading goes here in later iterations."""
    # TODO(rag): load FAISS index, warm up embedding model on startup
    yield
    # TODO(rag): persist FAISS index, cleanup on shutdown


app = FastAPI(
    title="ReddyBytes Portfolio RAG Backend",
    description="FastAPI + RAG powering the AI assistant on reddybytes.github.io",
    version="0.1.0",
    lifespan=lifespan,
)

# ─── CORS ────────────────────────────────────────────────────────
# Allow the frontend domain(s) to call the API. Origins are configured per env.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in settings.cors_allowed_origins.split(",") if o.strip()],
    allow_credentials=False,  # no cookies — JWT-free public API
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# ─── Routes ──────────────────────────────────────────────────────
# Versioned under /api/v1 — gives us room to evolve without breaking clients.
app.include_router(health.router, prefix="/api/v1", tags=["health"])
