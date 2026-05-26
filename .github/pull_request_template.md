<!--
PR title format: <type>(<scope>): <description>
  type:  feat | fix | docs | style | refactor | perf | test | chore | ci | build
  scope: hero | projects | about | rag | backend | infra | docs | etc.
  Example: fix(hero): correct portal animation on Safari
-->

## What this PR does

<!-- One or two sentences. What changed and why. -->

## Type of change
- [ ] Bug fix
- [ ] New section or feature
- [ ] Design / UX update
- [ ] Content update (project / blog / travel / about)
- [ ] RAG / backend change
- [ ] Build / CI / infra
- [ ] Docs only
- [ ] Dependency update (Dependabot)

## Related issue
<!-- Use `Closes #N` to auto-close on merge, or `Refs #N` to link. -->
Closes #

## Checklist — must complete before review

### Code
- [ ] PR is against `develop` (not `main`)
- [ ] `npx tsc --noEmit` passes (frontend)
- [ ] `npm run lint` passes
- [ ] `mypy backend/` passes (if backend touched)
- [ ] `pytest backend/` passes (if backend touched)
- [ ] Tests added or updated for the change
- [ ] No new dependencies added (or if added, justified in PR description)
- [ ] No secrets committed (`.env`, API keys, tokens) — `git diff --cached | grep -iE "key|token|secret|password"` clean

### Quality
- [ ] Lighthouse score on changed pages ≥ 95 (Performance, Accessibility, SEO)
- [ ] `prefers-reduced-motion` respected on any new animation
- [ ] Tested on mobile (375px) AND desktop (1440px)
- [ ] Tested in dark theme (light theme is v2 deferred)
- [ ] Keyboard navigation works on any new interaction
- [ ] No console errors / warnings in browser devtools

### Docs
- [ ] `docs/ARCHITECTURE.md` updated if architecture changed
- [ ] `docs/DESIGN-SYSTEM.md` updated if design tokens changed
- [ ] `docs/RAG-BACKEND.md` updated if RAG pipeline changed
- [ ] `docs/TROUBLESHOOTING.md` updated if a non-obvious bug was fixed
- [ ] `docs/AI-LEARNING-LOG.md` updated if a RAG-tuning stage was completed

### Recruiter impact (for content / design / hero changes only)
- [ ] Does this change improve the 30-second recruiter impression? How?
- [ ] Does every CTA / button in the change actually work (no dead links)?

## Screenshots / recordings
<!-- For any visual change, attach before/after screenshots or a short Loom. -->

| Before | After |
|--------|-------|
| <!-- screenshot --> | <!-- screenshot --> |

## Notes for reviewer
<!-- Anything reviewer should know: tricky decisions, alternatives considered, follow-ups planned. -->
