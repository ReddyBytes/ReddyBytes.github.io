# ─────────────────────────────────────────────────────────────────
# Dockerfile for Hugging Face Spaces
# Builds the FastAPI backend. Only ships backend/ + content/ + shared/
# (frontend/ lives in the same monorepo but is excluded from this image.)
#
# HF Spaces convention: app listens on port 7860.
# ─────────────────────────────────────────────────────────────────

FROM python:3.11-slim

# Stay reproducible — don't write .pyc, don't buffer stdout
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

WORKDIR /app

# System deps for ML libs (sentence-transformers, faiss) will be added
# when needed — keep the image lean during scaffold phase.
# RUN apt-get update && apt-get install -y --no-install-recommends \
#     build-essential \
#     && rm -rf /var/lib/apt/lists/*

# Install Python deps first for better Docker layer caching
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy ONLY what the backend needs — frontend/ stays out of this image
COPY backend/ ./backend/
COPY content/ ./content/
COPY shared/ ./shared/

# HF Spaces expect the app on port 7860
EXPOSE 7860

# Run via uvicorn — backend.main:app refers to backend/main.py's `app` object
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "7860"]
