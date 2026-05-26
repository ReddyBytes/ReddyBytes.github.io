# Contributing

This is a personal portfolio website maintained by **Penchala Reddy** ([@ReddyBytes](https://github.com/ReddyBytes)).

The repository is public so recruiters and other engineers can read the code as proof of authorship and craft. **External contributions are intentionally narrow in scope.**

---

## What we accept

- **Bug fixes** — broken links, layout breakage on specific viewports, accessibility issues, factual errors in content
- **Security issues** — see [SECURITY.md](./SECURITY.md) (private disclosure required, do NOT open a public issue/PR)
- **Typo fixes** — single-line content corrections

## What we do NOT accept

- New features, sections, or design changes — the portfolio reflects one engineer's voice and product direction
- Content edits beyond typos — bio, project descriptions, blog posts are personal voice
- Refactors that don't fix a concrete bug — "I would write this differently" is not a contribution
- Dependency bumps — handled by Dependabot, not manual PRs
- Translations — i18n is a planned phase 3 feature; PRs for it will be rejected until then

---

## How to contribute a bug fix

1. **Open an issue first** describing the bug — one paragraph + screenshot if visual. Wait for maintainer acknowledgment before starting work to avoid duplicate effort.
2. **Fork** the repository
3. **Branch** from `develop` (NEVER from `main`): `git checkout -b fix/short-description`
4. **Fix** the bug — keep changes minimal and focused on ONE issue
5. **Open a PR** against `develop`
6. **Complete the PR template checklist** — incomplete PRs are not reviewed
7. Wait for CI to pass + maintainer review

---

## Maintainer workflow (for reference)

| Branch | Purpose | Protection |
|--------|---------|------------|
| `main` | Deployed to GitHub Pages | Protected — PR only, requires CI green, 1+ approval |
| `develop` | Active development | Protected — PR only, CI must pass |
| `feature/*` | New sections / features | From `develop`, merged back to `develop` |
| `fix/*` | Bug fixes | From `develop`, merged back to `develop` |
| `hotfix/*` | Emergency production fix | From `main`, cherry-picked to `develop` |

**Never commit directly to `main` or `develop`.** PRs only.

---

## Code standards

- **TypeScript strict mode** — no `any`, no implicit nulls
- **Python typed** — full type hints, `mypy backend/` must pass
- **Tailwind utility classes** — no inline `style={}`, no separate `.css` files (except theme tokens)
- **`prefers-reduced-motion`** respected on every animation
- **Mobile-first responsive** — test 375px (Pixel) → 1440px (MacBook) → 1920px (desktop)
- **Plug-and-play** — every layer (RAG provider, LLM, embeddings, theme, content source) swappable via interface
- See `docs/DESIGN-SYSTEM.md` for visual rules
- See `docs/RAG-BACKEND.md` for backend rules

---

## Pre-PR checklist (run locally)

```bash
# Frontend
npx tsc --noEmit          # type check
npm run lint              # lint
npm run build             # static build succeeds
npm run lighthouse        # all changed pages score >= 95

# Backend (if touched)
cd backend
mypy .                    # type check
pytest                    # tests pass
```

---

## Contact

- **Security**: [SECURITY.md](./SECURITY.md)
- **General**: `penchalareddy260@gmail.com`
- **GitHub**: [@ReddyBytes](https://github.com/ReddyBytes)
