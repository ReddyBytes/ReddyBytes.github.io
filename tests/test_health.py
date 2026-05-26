"""Tests for GET /api/v1/health endpoint."""

from fastapi.testclient import TestClient


def test_health_returns_200(client: TestClient) -> None:
    """Health endpoint must always return 200 when service is alive."""
    response = client.get("/api/v1/health")
    assert response.status_code == 200


def test_health_returns_expected_shape(client: TestClient) -> None:
    """Response shape must match HealthResponse model — frontend relies on this."""
    response = client.get("/api/v1/health")
    body = response.json()
    assert body["status"] == "ok"
    assert "version" in body
    assert isinstance(body["version"], str)


def test_health_only_accepts_get(client: TestClient) -> None:
    """Health is GET-only — POST should return 405 Method Not Allowed."""
    response = client.post("/api/v1/health")
    assert response.status_code == 405


def test_health_responds_quickly(client: TestClient) -> None:
    """Health should be fast — no expensive work on this endpoint.

    Why: HF Space cold-start probes hit /health repeatedly while waking up.
    """
    import time

    start = time.perf_counter()
    response = client.get("/api/v1/health")
    elapsed_ms = (time.perf_counter() - start) * 1000

    assert response.status_code == 200
    assert elapsed_ms < 100, f"Health took {elapsed_ms:.0f}ms — should be <100ms"
