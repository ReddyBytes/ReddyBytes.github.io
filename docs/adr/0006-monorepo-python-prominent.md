# ADR 0006 — Monorepo with Python-prominent structure

**Status:** Accepted · **Date:** 2026-05-26 · **Supersedes:** (partial of) ADR 0001 — repo organization aspect only

## Context

ADR 0001 chose Next.js frontend + FastAPI backend as the technology pair. The original implication was two repos:
- `ReddyBytes.github.io` (frontend, GitHub Pages)
- `portfolio-rag-backend` (backend, Hugging Face Spaces)

Two-repo concerns surfaced:
- Frontend + backend often change together (new API endpoint → new frontend hook)
- Shared `content/` and `shared/` schemas need duplication or submodules
- Two READMEs, two docs/ folders, two CI configs to maintain
- Recruiters have to find both repos to evaluate the full work
- For a solo developer, context-switching between repos adds friction without benefit

Additionally, the user repeatedly emphasized "Python is main" — the repository's identity should signal Python-first to recruiters viewing the project for the first time.

Options considered:
- (a) Two repos (original plan)
- (b) Monorepo with `frontend/` and `backend/` as equal sibling folders
- (c) Monorepo with **Python at root, frontend as subfolder** (Python-prominent)
- (d) Monorepo with `frontend/` at root, `backend/` as subfolder (frontend-prominent)

## Decision

**(c) Monorepo with Python at root, Next.js in `frontend/` subfolder.**

Repository layout:
```
ReddyBytes.github.io/
├── backend/                  # FastAPI + RAG (Python) — ROOT
├── scripts/              # Python build tooling — ROOT
├── content/              # Shared Markdown — ROOT
├── shared/               # Shared schemas — ROOT
├── tests/                # Python tests — ROOT
├── data/                 # RAG index (gitignored) — ROOT
├── evaluate.py           # RAG eval runner — ROOT
├── Dockerfile            # HF Space entry — ROOT
├── requirements.txt      # Python deps — ROOT
├── pyproject.toml        # Python config — ROOT
├── .python-version       # Python pin — ROOT
├── frontend/             # Next.js (TypeScript) — SUBFOLDER
├── docs/
└── .github/
```

Two `workflow_dispatch` deploys:
- `deploy-pages.yml` — builds `frontend/` → publishes `frontend/out/` to gh-pages branch
- `deploy-hf-space.yml` — pushes full repo to HF Space; HF builds `Dockerfile` at root, which only copies `backend/`, `content/`, `shared/`, `requirements.txt` (frontend/ stays out of the running container)

## Why

**Monorepo wins for solo developer:**
- Atomic cross-stack commits (one PR for "new RAG endpoint + new frontend hook")
- Shared `content/` and `shared/` are trivial — no submodules, no duplication
- One README, one docs/, one CONTRIBUTING.md, one CODEOWNERS, one Dependabot
- One repo for recruiters to clone, browse, evaluate
- No context-switching cost
- Both deploys remain INDEPENDENT — frontend can ship without backend, vice versa

**Python at root wins for "Python is main" identity:**
- `ls` at repo root reveals Python first (`backend/`, `scripts/`, `requirements.txt`, `pyproject.toml`)
- README opens with Python language signal
- `Dockerfile` at root signals "this is a container-deployable Python service"
- Aligns with the AI engineer brand positioning
- Recruiters' first impression at `github.com/ReddyBytes/ReddyBytes.github.io` is Python, not TypeScript

**Why not subtree push (`git subtree split --prefix=backend`):**
- Adds workflow complexity
- The Dockerfile-at-root approach achieves the same isolation more elegantly — HF pulls the whole repo but builds only what the Dockerfile copies
- Subtree push history can diverge if mishandled (extra cleanup needed)

**Why not equal siblings (option b, `frontend/` + `backend/`):**
- Visually neutral — doesn't signal "Python is main"
- Same complexity as Python-at-root, lower signal value

**Why not frontend-prominent (option d):**
- Contradicts user's "Python is main" directive
- Makes the AI engineer brand less obvious to recruiters
- Frontend dominance is expected (more code lines naturally) — no need to amplify visually

## Consequences

**Good:**
- One repo to maintain, browse, evaluate, clone
- Atomic cross-stack changes possible
- Shared `content/` + `shared/` schemas served by both stacks with zero duplication
- Python identity preserved without sacrificing Next.js UI ceiling (ADR 0001 stands)
- HF Space deploys cleanly via Dockerfile filtering (no subtree split needed)
- Independent deploy targets — each can ship without the other

**Trade-offs:**
- Larger clone (~hundreds of MB once node_modules + Python venv built locally) — mitigated by `.gitignore`
- CODEOWNERS apply to whole repo (not per-stack) — acceptable for solo
- Dependabot needs two `directory:` entries in `dependabot.yml` (already configured: `/` for npm, `/` for pip — adjust to `/frontend` for npm, `/` for pip when scaffold is done)
- GitHub language statistics will likely show TypeScript or Python depending on line counts; folder structure speaks louder than the language badge
- The HF Space git remote will receive the full repo on every backend deploy (including frontend/) — slightly larger pushes, no operational impact

## Migration triggers

Switch to two-repo split if:
- Frontend grows large enough that backend devs cloning the repo are slowed down significantly
- A separate team takes ownership of backend (different CODEOWNERS needed per stack)
- Compliance requires per-component access controls

None of these apply at portfolio scale.

## Dependabot config update needed

Current `.github/dependabot.yml` references `/backend` for pip. Update to root once scaffolded:

```yaml
- package-ecosystem: "pip"
  directory: "/"            # ← was "/backend"
- package-ecosystem: "npm"
  directory: "/frontend"    # ← was "/"
```
