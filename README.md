# ReddyBytes.github.io

> **Python-powered AI engineer portfolio.** A cinematic, interactive site with a real RAG backend (FastAPI + sentence-transformers + FAISS + Gemini) and a Next.js frontend. Single monorepo, two deploy targets, $0/month to host.

**Live**: [reddybytes.github.io](https://reddybytes.github.io) · **AI assistant**: [reddybytes-portfolio-rag.hf.space](https://huggingface.co/spaces/ReddyBytes/portfolio-rag)

---

## What this is

Not a templated portfolio. An **interactive AI engineer universe** with:

- **Real RAG-powered AI assistant** — ask the floating orb anything; FastAPI backend retrieves from my projects, skills, journey, then streams a Gemini-generated answer
- **Cinematic minimal landing** — silhouette in a glowing purple portal, depth-on-scroll discovery
- **Signature interactions** — pull-the-thread reveals, vault doors for projects, futuristic train timeline, neural skill map, terminal with easter eggs
- **Plug-and-play architecture** — every layer (LLM, embeddings, theme, content source) swappable via interface
- **Monorepo with Python at root** — `app/`, `scripts/`, `content/`, `tests/` at root; Next.js in `frontend/`. Python is main.

---

## Tech stack (one-line view)

**Backend (Python)**: FastAPI + sentence-transformers + FAISS + Gemini 2.5 Flash (primary) + Claude Haiku 4.5 (fallback)
**Frontend (TypeScript)**: Next.js 16 + Tailwind 4 + Framer Motion (lazy) + Three.js (Architecture Lab only)
**Build tooling (Python)**: PIL for OG images, scripts for sitemap, photo fallback, knowledge index pre-build
**Hosting**: GitHub Pages (frontend) + Hugging Face Spaces (backend) — both free tiers
**CI**: GitHub Actions (Python + TS checks, manual-trigger deploys)

See [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) for full system + Mermaid diagrams.

---

## Project structure (monorepo — Python at root)

```
ReddyBytes.github.io/
├── app/                     # FastAPI + RAG (Python) — at ROOT
├── scripts/                 # Python build tooling — at ROOT
├── content/                 # SHARED Markdown — read by both stacks
├── shared/                  # SHARED schemas — Zod + Pydantic from same source
├── tests/                   # Python tests (pytest) — at ROOT
├── data/                    # RAG FAISS index (gitignored)
├── frontend/                # Next.js (TypeScript) — subfolder
│   ├── src/{app,components,lib,hooks,styles}/
│   ├── public/photos/
│   └── package.json
├── docs/                    # Architecture, design system, RAG, ADRs
├── .github/                 # CODEOWNERS, dependabot, PR template, workflows
├── Dockerfile               # HF Space entry — only ships backend bits
├── requirements.txt         # Python deps
├── pyproject.toml           # Python config (mypy, ruff, pytest)
├── .python-version          # Pinned: 3.11
├── LICENSE                  # MIT
├── README.md
├── CONTRIBUTING.md
└── SECURITY.md
```

---

## Quick start

> This is a personal portfolio. External contributions limited to bug fixes only. See [CONTRIBUTING.md](./CONTRIBUTING.md).

```bash
# Clone (single repo, both stacks)
git clone https://github.com/ReddyBytes/ReddyBytes.github.io.git
cd ReddyBytes.github.io

# Backend (Python) — repo root
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
# → http://localhost:7860

# Frontend (Next.js) — subfolder
cd frontend
npm install
npm run dev
# → http://localhost:3000
```

---

## Documentation

| Doc | What |
|---|---|
| [ARCHITECTURE.md](./docs/ARCHITECTURE.md) | System diagram, folder structure (monorepo), build + deploy flow |
| [DESIGN-SYSTEM.md](./docs/DESIGN-SYSTEM.md) | Colors (hybrid palette), typography, motion, component patterns |
| [RAG-BACKEND.md](./docs/RAG-BACKEND.md) | AI assistant architecture, plug-and-play interfaces |
| [ai-learning/](./docs/ai-learning/) | 9-stage RAG tuning curriculum (17 numbered files — concepts + experiments) |
| [CONTENT-GUIDE.md](./docs/CONTENT-GUIDE.md) | How to add a project / blog / travel memory |
| [DEPLOYMENT.md](./docs/DEPLOYMENT.md) | GH Pages + HF Space deploy from one monorepo |
| [TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md) | Debugging log (grows over time) |
| [adr/](./docs/adr/) | Architecture Decision Records (6 ADRs) |

---

## License

[MIT](./LICENSE) — code free to learn from + adapt. Please don't copy the portfolio wholesale; build your own voice.

## Security

Found a vulnerability? See [SECURITY.md](./SECURITY.md) — please report privately, do NOT open a public issue.

## Contact

- GitHub: [@ReddyBytes](https://github.com/ReddyBytes)
- Email: `penchalareddy260@gmail.com`
- Portfolio: [reddybytes.github.io](https://reddybytes.github.io)
