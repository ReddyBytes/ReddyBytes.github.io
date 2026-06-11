---
techs:
  # ─── Languages ───
  - slug: python
    name: "Python"
    category: "language"
    isCenter: true
    years: "5+"
    confidence: "Deepest fluency. Async, type-safe, production-grade. The language I reach for first for any backend or AI work."
    projects: ["prepzy", "portfolio"]
    connects: []
  - slug: sql
    name: "SQL"
    category: "language"
    years: "EDIT: 4+"
    confidence: "EDIT: Comfortable writing complex queries directly when the ORM gets in the way. PostgreSQL dialect mainly."
    projects: ["prepzy"]
    connects: ["postgresql"]

  # ─── Systems ───
  - slug: fastapi
    name: "FastAPI"
    category: "systems"
    years: "3+"
    confidence: "Primary backend framework. Async + Pydantic + auto-generated OpenAPI. The portfolio's AI orb runs on it."
    projects: ["prepzy", "portfolio"]
    connects: ["python"]
  - slug: airflow
    name: "Airflow"
    category: "systems"
    years: "3+"
    confidence: "Production data pipelines on EKS. Custom operators, sensor patterns, on-call debugging at scale."
    projects: ["prepzy"]
    connects: ["python", "kubernetes"]
  - slug: kubernetes
    name: "Kubernetes"
    category: "systems"
    years: "EDIT: 2+"
    confidence: "EDIT: Hands-on K8s for Airflow workloads on EKS — HPA, IRSA, pod crash debugging, rolling deploys."
    projects: ["prepzy"]
    connects: ["docker", "python"]
  - slug: docker
    name: "Docker"
    category: "systems"
    years: "EDIT: 3+"
    confidence: "EDIT: Containerize everything. Multi-stage builds, layer caching, slim Python images for HF Spaces deploys."
    projects: ["prepzy", "portfolio"]
    connects: ["kubernetes"]
  - slug: postgresql
    name: "PostgreSQL"
    category: "systems"
    years: "EDIT: 4+"
    confidence: "EDIT: Primary RDBMS. Schema design, indexing, migration discipline (expand-contract), production tuning."
    projects: ["prepzy"]
    connects: ["sql"]

  # ─── AI / ML ───
  - slug: rag
    name: "RAG"
    category: "ai"
    years: "1"
    confidence: "Building real RAG systems with sentence-transformers + FAISS + Gemini. 9-stage learning curriculum public on this site."
    projects: ["portfolio"]
    connects: ["python", "faiss"]
  - slug: langchain
    name: "LangChain"
    category: "ai"
    years: "<1"
    confidence: "EDIT: Using selectively for chains + prompt templating. Prefer direct calls when LangChain adds more weight than value."
    projects: ["portfolio"]
    connects: ["python", "rag"]
  - slug: faiss
    name: "FAISS"
    category: "ai"
    years: "<1"
    confidence: "Vector index for the portfolio AI orb. IndexFlatIP + normalize_L2 for cosine, persisted to file for HF Space restart-resilience."
    projects: ["portfolio"]
    connects: ["python", "rag"]
  - slug: sentence-transformers
    name: "sentence-transformers"
    category: "ai"
    years: "<1"
    confidence: "Open-source embedding stack. Currently on all-MiniLM-L6-v2 for portfolio scale; will A/B test BGE in Stage 5."
    projects: ["portfolio"]
    connects: ["python", "rag", "faiss"]
seo:
  title: "Skills — Penchala Reddy"
  description: "Technical skill map of Penchala Reddy — Python at the center, with FastAPI, Airflow, Kubernetes, RAG, LangChain, and FAISS branching out."
---
