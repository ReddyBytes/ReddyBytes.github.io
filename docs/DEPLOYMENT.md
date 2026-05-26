# Deployment

How to deploy the portfolio (frontend + backend, both from the same monorepo). Both are manual-trigger only — no auto-deploy on merge.

> **Monorepo with Python at root, Next.js in `frontend/` subfolder.** See `ARCHITECTURE.md` for full structure. Two deploy targets, two independent workflows, one source of truth.

---

## Frontend → GitHub Pages

### Prerequisites (one-time setup)
1. GitHub repo `ReddyBytes/ReddyBytes.github.io` exists (✓ done)
2. **Settings → Pages**: source = "GitHub Actions" (not "Deploy from a branch" — we use Actions to publish from `frontend/out/`)
3. Branch protection enabled on `main` (see SKILL.md governance section)
4. Custom domain (optional, later): add CNAME record + configure in Settings → Pages

### Deploy steps

```bash
# 1. Ensure main is at the version you want to deploy
git checkout main
git pull

# 2. Trigger the frontend deploy workflow manually
# GitHub UI: Actions tab → "Deploy frontend to Pages" → Run workflow → main
# OR via gh CLI:
gh workflow run deploy-pages.yml --ref main
```

### What the workflow does (`.github/workflows/deploy-pages.yml`)

1. Checkout `main`
2. Install Node 20 + Python 3.11
3. `pip install -r requirements.txt` (for build scripts)
4. `cd frontend && npm install`
5. `python scripts/validate_content.py` — Zod schema check on all `content/*.md`
6. `python scripts/check_photos.py` — log fallbacks
7. `cd frontend && npm run lint`
8. `cd frontend && npm run build` — produces `frontend/out/`
9. `python scripts/generate_sitemap.py` — writes `frontend/out/sitemap.xml`
10. `python scripts/og_image_generator.py` — writes OG images to `frontend/out/og/`
11. Lighthouse on landing → fail if Performance < 90
12. Upload `frontend/out/` as Pages artifact
13. Deploy to GitHub Pages

### Post-deploy verification

```bash
# Check the site is live + returning expected content
curl -sI https://reddybytes.github.io | grep -E "200|cache"
curl -s https://reddybytes.github.io | grep -q "Penchala Reddy"

# Check OG image
curl -sI https://reddybytes.github.io/og/landing.png

# Check sitemap
curl -s https://reddybytes.github.io/sitemap.xml | head -20
```

### Rollback

```bash
# Revert the bad commit on main
git revert <bad-sha>
git push

# Re-trigger deploy
gh workflow run deploy-pages.yml --ref main
```

---

## Backend → Hugging Face Spaces

### Prerequisites (one-time setup)
1. HF account: `ReddyBytes`
2. Create Space: `huggingface.co/spaces/ReddyBytes/portfolio-rag`, SDK = `docker`
3. Generate HF access token (Settings → Access Tokens → write scope), save as GitHub Secret `HF_TOKEN`
4. Add secrets to the HF Space (via HF UI: Settings → Variables and secrets):
   - `GEMINI_API_KEY`
   - `ANTHROPIC_API_KEY`
   - `ADMIN_BEARER_TOKEN` (for `/reindex`)

### Deploy steps (from this monorepo)

```bash
# Ensure main is at the version you want to deploy
git checkout main
git pull

# Trigger backend deploy
gh workflow run deploy-hf-space.yml --ref main
```

### What the workflow does (`.github/workflows/deploy-hf-space.yml`)

The simplest approach: push the entire repo to HF Space's git remote. HF builds the `Dockerfile` at root, which only `COPY`s `backend/`, `content/`, `shared/`, `requirements.txt` — `frontend/` is not included in the container.

```yaml
- name: Push to HF Space
  env:
    HF_TOKEN: ${{ secrets.HF_TOKEN }}
  run: |
    git remote add hf https://USER:$HF_TOKEN@huggingface.co/spaces/ReddyBytes/portfolio-rag
    git push hf main --force
```

### Dockerfile at repo root (what HF builds)

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Only backend bits — frontend/ is NOT copied
COPY backend/ ./backend/
COPY content/ ./content/
COPY shared/ ./shared/

EXPOSE 7860
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "7860"]
```

### Build observability

- Live build logs: `huggingface.co/spaces/ReddyBytes/portfolio-rag/logs/build`
- Runtime logs: `huggingface.co/spaces/ReddyBytes/portfolio-rag/logs/container`

### Re-index knowledge base manually

```bash
curl -X POST https://reddybytes-portfolio-rag.hf.space/api/v1/reindex \
  -H "Authorization: Bearer $ADMIN_BEARER_TOKEN"
```

---

## Cold-start mitigation (HF Space free tier)

Free tier sleeps after 48h. Wake takes 15-30s. Mitigations:

1. **Frontend gracefully handles** — shows "AI assistant is waking up..." UX (see RAG-BACKEND.md cold-start UX section)
2. **Optional keep-alive ping** every 24h via GitHub Action cron — adds minor "always-on" cost but prevents cold-starts
3. **Future: upgrade to persistent Space ($9/mo)** when recruiter traffic justifies

---

## Custom domain (when ready)

1. Buy domain (Namecheap / Cloudflare) — `~$12/yr`
2. DNS: add `CNAME` record pointing to `reddybytes.github.io`
3. GitHub: **Settings → Pages → Custom domain** → enter domain → save
4. Wait for DNS propagation (~10min) + HTTPS provisioning (~30min)
5. Enforce HTTPS (checkbox in Pages settings)
6. Update `CORS_ALLOWED_ORIGINS` in HF Space secrets to include the new domain

---

## Failure recovery

### Frontend build fails on Lighthouse
- Download the Lighthouse report artifact from the failed workflow run
- Common causes: oversized image (use WebP, ≤200KB), missing alt text, low contrast
- Fix locally with `cd frontend && npm run lighthouse:landing`, then re-push

### Frontend build fails on content validation
- Run `python scripts/validate_content.py` locally for full error trace
- Common cause: frontmatter typo (missing required field, invalid enum value)
- Fix and re-push

### Backend down (HF Space red)
- Check container logs at `huggingface.co/spaces/ReddyBytes/portfolio-rag/logs/container`
- Common causes: missing env var (Gemini key), out-of-memory loading embedding model, dependency conflict
- Frontend should still load — orb shows "AI assistant unavailable, please check projects directly"

### Deploy succeeded but site is broken
- Use rollback procedure above (git revert + redeploy)
- Open TROUBLESHOOTING.md to log the cause for next time

### HF push fails with "permission denied"
- HF token may have expired or be missing `write` scope
- Regenerate at `huggingface.co/settings/tokens`, update GitHub secret `HF_TOKEN`
