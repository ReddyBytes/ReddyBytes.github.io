"""
Configuration via environment variables (Pydantic Settings).

All env vars listed in `.env.example` are loaded here. Local dev reads from `.env`;
production (Hugging Face Spaces) injects via Space secrets — same variable names.
"""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """All backend configuration. Values loaded from env vars or .env file."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # ─── LLM providers ──────────────────────────────────────────
    gemini_api_key: str = ""
    anthropic_api_key: str = ""

    # ─── Admin ──────────────────────────────────────────────────
    admin_bearer_token: str = ""

    # ─── CORS ───────────────────────────────────────────────────
    # Comma-separated. Parsed into list by main.py.
    cors_allowed_origins: str = "http://localhost:3000"

    # ─── Logging ────────────────────────────────────────────────
    log_level: str = "info"


# Singleton — import this everywhere config is needed.
# Why singleton: avoids re-parsing env vars on every import.
settings = Settings()
