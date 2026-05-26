# Next Session Pickup

> Quick-reference for the next coding session. Mirrors SKILL.md `Last Session` block.

---

## Where we are right now (2026-05-26 end of session)

### What's done

**Documentation phase complete:**
- ✅ Global SKILL.md authored (1194+ lines, full prepzy-depth)
- ✅ Repo created: `github.com/ReddyBytes/ReddyBytes.github.io`
- ✅ Local repo: `/Users/1065696/project/portfolio/ReddyBytes.github.io/` (wrapper + inner pattern)
- ✅ Governance committed + pushed to main:
  - `.gitignore`, `LICENSE` (MIT), `CONTRIBUTING.md`, `SECURITY.md`
  - `.github/CODEOWNERS`, `pull_request_template.md`, `dependabot.yml`
- ✅ Docs scaffolded:
  - `README.md` (public-facing intro)
  - `docs/ARCHITECTURE.md` (system + folder + Mermaid diagrams)
  - `docs/DESIGN-SYSTEM.md` (hybrid palette + motion rules)
  - `docs/RAG-BACKEND.md` (FastAPI architecture + plug-and-play)
  - `docs/CONTENT-GUIDE.md` (Markdown + frontmatter schema)
  - `docs/AI-LEARNING-LOG.md` (9-stage tuning curriculum)
  - `docs/DEPLOYMENT.md` (GH Pages + HF Space deploy)
  - `docs/TROUBLESHOOTING.md` (3 entries from this session)
  - `docs/adr/0001-0005-*.md` (5 ADRs covering key decisions)

### Locked decisions

| Topic | Decision |
|---|---|
| Frontend stack | Next.js 16 + TypeScript + Tailwind 4 + Framer Motion (lazy) + Three.js (Layer 3 only) |
| Backend stack | FastAPI + sentence-transformers + FAISS + Gemini primary + Claude Haiku fallback |
| Hosting | GitHub Pages (frontend) + Hugging Face Spaces (backend) |
| Repo name | `ReddyBytes.github.io` (user-page convention) |
| Local folder | Wrapper: `~/project/portfolio/ReddyBytes.github.io/` (Claude continuity) |
| Color palette | Hybrid — restrained on Layer 1 (purple+cyan), vivid on Layer 2+ (adds pink+magenta) |
| Boot sequence | Skippable, first-time only (localStorage flag) |
| Photos | Silhouette hero + 1 in About; user-uploaded with SVG fallbacks |
| Animation | Light landing, heavy deep (progressive enhancement) |
| License | MIT |
| Branch strategy | `main` (deploy) ← `develop` (default) ← `feature/*` |
| Identity | Penchala Reddy · `penchalareddy260@gmail.com` · `@ReddyBytes` |
| Current company/role | placeholder — user to fill |

---

## What's NEXT

### Immediate next steps (priority order)

1. **User commits + pushes docs**:
   ```bash
   cd /Users/1065696/project/portfolio/ReddyBytes.github.io
   git checkout -b docs/scaffold-documentation
   git add docs/ README.md
   git commit -m "docs: scaffold architecture, design system, RAG, ADRs, content guide, deployment, troubleshooting, AI learning log"
   git push -u origin docs/scaffold-documentation
   # → open PR docs/scaffold-documentation → main
   ```

2. **Enable branch protection** on `main` (GitHub UI — see SKILL.md governance section)

3. **Frontend scaffold** — initialize Next.js 16 with App Router, Tailwind 4, TypeScript strict
   ```bash
   npx create-next-app@latest . --typescript --tailwind --app --eslint --src-dir --import-alias "@/*"
   ```

4. **Folder structure** per ARCHITECTURE.md (create stubs: `src/components/layer1/`, `layer2/`, `layer3/`, `src/lib/`, `src/styles/themes/dark/`, `content/`, `scripts/`)

5. **Hero portal** (Layer 1) — silhouette + glowing ring + skippable boot sequence + pull-thread affordance, CSS-only animation, <100KB bundle

6. **Backend scaffold (same monorepo, `backend/` at root)** — `backend/main.py` FastAPI hello-world, `requirements.txt` at root, `Dockerfile` at root, then walk through Stage 1-2 of AI-LEARNING-LOG.md

### Open decisions still to lock

- Custom domain timing (current: deferred)
- Exact list of projects to feature beyond Prepzy
- Skills exact list + proficiency rationale (for `content/skills.md`)
- Travel locations to include
- Whether to ship contact form via Formspree or stick with mailto only
- Empty prompt slots 11-13 in `docs/requirements/prompts.txt` — user to confirm if more are coming

### Blockers

None.

---

## Critical gotchas to remember

1. **NEVER git push/pull/commit/add** — user handles all git operations manually (Critical Rule #1-3)
2. **Provide commit messages after every phase** (Hard Rule)
3. **Folder is `portfolio/ReddyBytes.github.io/`** — outer wrapper for Claude continuity, inner is real git repo
4. **Layer 1 = no Framer Motion, no Three.js** — protect landing bundle <100KB
5. **prefers-reduced-motion respected on every animation** — boot sequence auto-skips
6. **MUST run `npx tsc --noEmit` + Lighthouse before reporting "done"**
7. **Photos user-uploaded with defaults** — build never fails on missing photo
8. **Pink/magenta NEVER on Layer 1** — lint rule will enforce later
9. **HF Space free tier sleeps after 48h** — frontend must show "waking up..." UX
10. **Plug-and-play everywhere** — interfaces over concrete implementations

---

## Commit messages ready to use (from this session)

### For the docs scaffold
```
docs: scaffold architecture, design system, RAG, ADRs, content guide, deployment, troubleshooting, AI learning log

- ARCHITECTURE.md — system diagram, folder structure, build + deploy flow
- DESIGN-SYSTEM.md — hybrid palette (Layer 1 restrained, Layer 2+ vivid), typography, motion rules
- RAG-BACKEND.md — FastAPI architecture, plug-and-play interfaces, recruiter modes
- CONTENT-GUIDE.md — Markdown + frontmatter schema, how to add project/travel/blog
- AI-LEARNING-LOG.md — 9-stage RAG tuning curriculum (concepts → minimal → eval → tune → harden)
- DEPLOYMENT.md — GH Pages + HF Space deploy steps + rollback
- TROUBLESHOOTING.md — 3 entries from session (git pull failure, nested repos, folder naming)
- adr/0001-0005 — Next.js+FastAPI, GH Pages+HF Spaces, 3-layer model, hybrid palette, Gemini+Claude
- README.md — public-facing intro with live URLs + tech overview
```
