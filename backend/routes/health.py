"""
Health check endpoint — returns 200 when the service is alive.

Used by:
- Hugging Face Space (liveness probe)
- Frontend cold-start detection (poll /api/v1/health to know when the Space wakes)
- External uptime monitors
"""

from fastapi import APIRouter
from pydantic import BaseModel

from backend import __version__

router = APIRouter()


class HealthResponse(BaseModel):
    """Shape of GET /api/v1/health response."""

    status: str
    version: str


@router.get("/health", response_model=HealthResponse)
async def health() -> HealthResponse:
    """Liveness probe. Returns {status: 'ok', version: '0.1.0'}."""
    return HealthResponse(status="ok", version=__version__)
