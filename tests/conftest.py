"""Shared pytest fixtures — used across all test files."""

from collections.abc import Iterator

import pytest
from backend.main import app
from fastapi.testclient import TestClient


@pytest.fixture
def client() -> Iterator[TestClient]:
    """FastAPI TestClient for endpoint tests.

    Yields a configured client that auto-handles startup/shutdown lifespan.
    """
    with TestClient(app) as c:
        yield c
