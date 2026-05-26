# Troubleshooting

Every debugging issue encountered during development goes here. Format:

```
## YYYY-MM-DD — Short description

**Symptom**: what you saw
**Root cause**: what was actually wrong
**Fix**: exact command / code change
**Prevention**: how to avoid hitting this again
```

Keep entries forever — they save hours on repeat issues.

---

## 2026-05-26 — `git pull` fails with "not a git repository"

**Symptom**: Running `git pull origin main` in `/Users/1065696/project/portfolio/` returns `fatal: not a git repository (or any of the parent directories): .git`

**Root cause**: The folder was not yet initialized as a git repo (no `.git/` directory). Git has nothing to pull *into*.

**Fix**:
```bash
cd /Users/1065696/project/portfolio
git init
git branch -M main
git remote add origin https://github.com/ReddyBytes/ReddyBytes.github.io.git
git pull origin main --allow-unrelated-histories
```

**Prevention**: When starting a new local folder that should track an existing remote, either:
- (a) `git clone <url>` to a NEW folder (git creates folder + .git/), OR
- (b) `git init` + `git remote add` + `pull --allow-unrelated-histories` in an EXISTING folder with content

---

## 2026-05-26 — Repo cloned INTO existing folder created nested git repos

**Symptom**: `/Users/1065696/project/portfolio/` had `.git/` (from earlier `git init`) AND `/Users/1065696/project/portfolio/ReddyBytes.github.io/.git/` (from clone). Two competing git repos with the same remote.

**Root cause**: Ran `git clone` while already inside `/portfolio/`, which created the repo as a SUBFOLDER instead of replacing the existing folder.

**Fix**: Decide which is the "real" repo, move content into it, delete the other:
```bash
# Move content from outer to inner, then delete outer's stray .git
mv outer/docs inner/
mv outer/.claude inner/
rm -rf outer/.git
```

**Prevention**: When cloning into an existing path, either:
- (a) `cd ..` first, then `git clone <url>` (creates new sibling folder)
- (b) `git clone <url> .` (clones INTO current dir, fails if non-empty)
- Never `git clone <url>` inside a folder you want to replace — creates nesting

---

## 2026-05-26 — Folder name vs repo name mismatch

**Symptom**: GitHub repo is `ReddyBytes.github.io` but local folder is `portfolio` — visually confusing vs prepzy convention (`prepzy-app/` matches `github.com/ReddyBytes/prepzy-app`).

**Root cause**: When manually creating a folder + `git init` + `git remote add` (vs `git clone`), git doesn't auto-name the folder after the remote.

**Decision**: Use a **wrapper pattern** — outer folder `portfolio/` (for Claude Code session continuity), inner folder `ReddyBytes.github.io/` (the actual git repo, matches GitHub name). See SKILL.md "Folder structure rationale" section.

**Prevention**: Document the wrapper pattern in SKILL.md so future sessions don't try to "fix" the mismatch.
