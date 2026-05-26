# Content Guide

How to add content to the portfolio. All content is **Markdown + frontmatter**, validated by Zod at build time.

> **Single source of truth:** content/ folder. Frontend renders it as pages. Backend embeds it for RAG.

---

## Content types

| Type | Path | Renders as | Indexed in RAG? |
|---|---|---|---|
| About | `content/about.md` | `/about` page | Yes |
| Skills | `content/skills.md` | Embedded on landing + dedicated section | Yes |
| Journey | `content/journey.md` | `/journey` train timeline | Yes |
| Experience | `content/experience.md` | Embedded on `/about` | Yes |
| Projects | `content/projects/<slug>.md` | `/projects/<slug>` vault-door page | Yes |
| Travel | `content/travel/<slug>.md` | `/travel` world map node | Yes |
| Blog (Phase 3) | `content/blog/<slug>.md` | `/blog/<slug>` | Yes |

---

## Frontmatter schema (Zod-enforced)

Every Markdown file MUST have valid frontmatter. Build fails on invalid schema.

```yaml
---
title: "Prepzy — Govt Exam Prep Platform"
slug: prepzy
type: project          # project | travel | blog | experience | about
audience:              # who this content is most relevant to
  - recruiter
  - showcase
weight: 10             # 1-10, higher = more prominent in RAG retrieval
tags:
  - python
  - ai
  - kubernetes
  - airflow
  - postgres
  - nextjs
github: https://github.com/ReddyBytes/prepzy-app
demo: https://prepzy.co.in
status: published      # draft | published — drafts NOT built, NOT indexed
indexed: true          # set false to exclude from RAG (rare; status=draft is the usual flag)
created: 2026-01-15
updated: 2026-05-26
hero_image: prepzy-hero.jpg    # optional; lives at public/photos/projects/<slug>-hero.jpg
---

# Markdown content here

## Sections

Use standard Markdown. Code blocks with language hints get syntax highlighting.
```

### Schema reference

```typescript
// src/lib/content/schema.ts
export const ContentSchema = z.object({
  title: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  type: z.enum(['project', 'travel', 'blog', 'experience', 'about']),
  audience: z.array(z.enum(['recruiter', 'showcase', 'brand', 'ai_ml'])),
  weight: z.number().int().min(1).max(10),
  tags: z.array(z.string()).max(10),
  github: z.string().url().optional(),
  demo: z.string().url().optional(),
  status: z.enum(['draft', 'published']),
  indexed: z.boolean().default(true),
  created: z.coerce.date(),
  updated: z.coerce.date(),
  hero_image: z.string().optional(),
})
```

---

## How to add a project

```bash
python scripts/scaffold/new_project.py "Project Name"
# → creates content/projects/project-name.md with prefilled frontmatter
```

Then fill in the case study using the template:

```markdown
# Project Name

## Problem
What problem does this solve? (1-2 paragraphs)

## What was built
High-level description (3-5 bullets)

## My contribution
What YOU specifically built (vs team) — important for recruiters

## Tech stack
- Frontend: ...
- Backend: ...
- Infra: ...

## Architecture
[Mermaid diagram or link to docs]

## Outcome / impact
Metrics if possible: users, requests/sec, cost saved, etc.

## What I learned
2-3 lessons specific to this project

## Links
- [GitHub](https://github.com/...)
- [Live demo](https://...)
- [Blog post](https://...) (if exists)
```

---

## How to add a travel memory

```bash
python scripts/scaffold/new_travel.py "Location Name"
```

Template:

```markdown
# Location Name

## When
Month Year

## Why I went
Short context (1 paragraph)

## What I learned
What did the trip teach me? (this is what the RAG retrieves for travel queries)

## Memorable moment
A specific story (1-2 paragraphs)

## Photos
Files: public/photos/travel/<slug>-1.jpg, <slug>-2.jpg, etc.
```

---

## How to add a blog post (Phase 3)

```bash
python scripts/scaffold/new_blog.py "Post Title"
```

Templates TBD — Phase 3.

---

## Photos

- **Upload to `public/photos/<section>/`** with kebab-case filenames matching the content slug
- **Missing photos auto-fall-back** to defaults in `public/photos/defaults/` (see DESIGN-SYSTEM.md photo fallback section)
- **Build never fails** because of missing photos — `scripts/check_photos.py` logs warnings only

### Photo slot conventions

| Slot | Path | Fallback |
|---|---|---|
| Hero silhouette | `public/photos/profile/hero.jpg` | `defaults/silhouette-portal.svg` |
| About portrait | `public/photos/about/portrait.jpg` | `defaults/silhouette-standing.svg` |
| Project hero | `public/photos/projects/<slug>-hero.jpg` | `defaults/gradient-abstract.svg` |
| Travel | `public/photos/travel/<slug>-N.jpg` | `defaults/gradient-mountain.svg` (or `gradient-city.svg`) |

---

## Validation

Before commit:

```bash
python scripts/validate_content.py
# → checks every .md file for valid frontmatter
# → reports invalid files with line numbers
```

CI runs this on every PR. PRs with invalid frontmatter are blocked from merge.

---

## RAG re-indexing

After adding/editing content:

1. Commit + push to `main` (frontend repo)
2. Backend (HF Space) re-indexes on next visit OR triggered manually via `POST /api/v1/reindex` (admin auth required)
3. New content searchable within minutes

See [RAG-BACKEND.md](./RAG-BACKEND.md) for indexing details.

---

## Drafts

Set `status: draft` in frontmatter to hide content from both the site AND the RAG index:

```yaml
---
title: "Work in progress"
status: draft   # ← excluded from build + RAG
---
```

Drafts can be committed safely — they won't appear publicly.
