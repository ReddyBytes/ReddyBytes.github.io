# Layer 3 — Experience Design Spec

> Locked design contract for the Experience page. All decisions captured 2026-05-26 via 2 design batches.

> See [`docs/design/LAYER1.md`](./LAYER1.md), [`docs/design/LAYER2.md`](./LAYER2.md), [`docs/design/LAYER3-PROJECTS.md`](./LAYER3-PROJECTS.md), [`docs/design/LAYER3-ABOUT.md`](./LAYER3-ABOUT.md), [`docs/ARCHITECTURE.md`](../ARCHITECTURE.md), [`docs/DESIGN-SYSTEM.md`](../DESIGN-SYSTEM.md).

---

## Goal of Experience

The recruiter has read About (story) and Projects (proof). Now they want to **verify employment history** and understand what Penchala has done at scale. This page must:

1. Be **factual + scannable** — dates, companies, titles, tech, impact
2. Show **trajectory** — career moves make sense as growth, not random hops
3. Show **scope** — what scale of system was owned at each role
4. Reuse Layer 3 patterns — content loader, PageHeader, Framer Motion stagger
5. Match About's visual language — recruiter already familiar with timeline pattern

---

## Layout (vertical role timeline)

```
┌──────────────────────────────────────────────────────────────────┐
│ NAV (sticky)                                                      │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│ // experience                                                     │
│ Where I've worked                                                 │  ← PageHeader
│ Real systems, real teams, real production weight.                 │
│                                                                   │
│ ┌─────────────────────────────────────────────────────────────┐  │
│ │ ● CURRENT                          2024 – present            │  │  ← Role card
│ │ Senior Software Engineer                                      │  │     (current)
│ │ Apple                                                         │  │
│ │ Hyderabad, India                                              │  │
│ │                                                                │  │
│ │ ▸ Shipped X to Y users (impact bullet)                        │  │
│ │ ▸ Led migration of Z system (impact bullet)                   │  │
│ │ ▸ Built A for B (impact bullet)                               │  │
│ │                                                                │  │
│ │ [Python] [Airflow] [Kubernetes] [PostgreSQL]                  │  │
│ └─────────────────────────────────────────────────────────────┘  │
│                                                                   │
│ ┌─────────────────────────────────────────────────────────────┐  │
│ │ ● PRIOR                            2022 – 2024              │  │  ← Role card
│ │ Software Engineer                                             │  │     (prior)
│ │ Previous Company                                              │  │
│ │ ...                                                           │  │
│ └─────────────────────────────────────────────────────────────┘  │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

- Vertical stack of role cards (no L/R alternation — Experience is more list-y than journey)
- Each card: status pill (● CURRENT / ● PRIOR) + dates + title + company + location + impact bullets + tech pills
- Stagger fade-in on scroll (Framer Motion, 100ms per card)
- Mobile: same layout, slightly more compact

---

## Component breakdown

3 new components under `frontend/src/components/layer3/experience/`:

1. **ExperienceTimeline** — outer wrapper, maps roles → RoleCard
2. **RoleCard** — single role card with all metadata
3. **ImpactList** — bullet list of impact statements (small reusable)

Plus reuse:
- `<Nav>` from layer1
- `<PageHeader>` from shared
- `<TechStackPills>` from layer3/projects (already built)

Page: `frontend/src/app/experience/page.tsx` (replaces existing ComingSoonPage).

---

## Content schema (single Markdown file)

`content/experience.md` — array of roles in frontmatter, no Markdown body.

```yaml
---
roles:
  - company: "Apple"
    title: "Senior Software Engineer"
    location: "Hyderabad, India"
    start: "2024"
    end: ""                     # empty = current
    current: true
    impact:
      - "Shipped X to Y users in production"
      - "Led migration of Z system to Kubernetes"
      - "Built A pipeline processing B records/day"
    techStack:
      - "Python"
      - "Airflow"
      - "Kubernetes"
      - "PostgreSQL"
      - "AWS EKS"
  - company: "Previous Company"
    title: "Software Engineer"
    location: "City, Country"
    start: "2022"
    end: "2024"
    current: false
    impact:
      - "..."
    techStack:
      - "Python"
      - "FastAPI"
seo:
  title: "Experience — Penchala Reddy"
  description: "Work history of Penchala Reddy — software engineer with 5+ years building production systems in Python, Airflow, and Kubernetes."
---
```

Validated via Zod schema at `frontend/src/lib/content/experience-schema.ts`. Loader at `frontend/src/lib/content/experience.ts` (parallels About loader).

---

## Visual rules

### Role card
- Width: `max-w-3xl` centered
- Background: `bg-bg-elevated`, border `border-border-subtle`, rounded-lg
- On hover: lift -2px, border accent shift to purple/cyan (current=cyan, prior=purple)
- Padding: 6 (24px)

### Status pill (top of card)
- `● CURRENT` → emerald (matches Layer 2 status pattern)
- `● PRIOR` → tertiary text gray
- Mono font, tracking-widest, uppercase, 10px

### Card header
- Date range right-aligned, mono, accent-cyan, 12px
- Title (h3): display font, large, white
- Company: body font, medium weight, secondary text
- Location: mono, tertiary text, small (12px)

### Impact bullets
- Triangle pointer (purple, rotate-90) like LearningWall in About
- Body text, secondary color, line-height 1.7
- 3-4 bullets max per role (recruiter focus rule)

### Tech pills
- Reuse `<TechStackPills>` from layer3/projects
- All pills as "non-primary" style (since we don't distinguish primary at role level)

### Stagger entry
- Framer Motion: `whileInView` per card
- 100ms delay between cards
- Reduced-motion: instant, no animation

---

## Folder additions

```
content/
└── experience.md                                  # NEW

frontend/src/
├── app/experience/page.tsx                        # MODIFIED (was ComingSoonPage)
├── components/layer3/experience/                  # NEW DIR
│   ├── ExperienceTimeline.tsx
│   ├── RoleCard.tsx
│   └── ImpactList.tsx
└── lib/content/
    ├── experience-schema.ts                       # NEW (Zod)
    └── experience.ts                              # NEW (loader)
```

---

## Performance budget

| Metric | Budget |
|---|---|
| **JS bundle (gzip)** | < 200KB |
| **LCP** | < 2.0s |
| **CLS** | < 0.05 |
| **Lighthouse Performance** | ≥ 90 |
| **Lighthouse SEO** | 100 |

---

## SEO

- `<h1>` from `seo.title`
- JSON-LD `ProfilePage` schema with `Person` + `WorkExperience` (array of `OrganizationRole`)
- Canonical: `https://reddybytes.github.io/experience/`
- Added to sitemap.xml

---

## Content drafting strategy (v1)

I scaffold 2-3 placeholder roles:
- 1 **current** role: company = Apple (per user's earlier "show current openly" decision), title + dates + impact bullets marked with `> EDIT:` placeholders
- 1-2 **prior** roles: fully placeholder (company name, title, dates, bullets all `> EDIT:`)

User replaces all `> EDIT:` markers with real data before merge. Zod will catch schema violations but won't catch placeholder prose — user must review.

---

## Acceptance criteria

- [ ] `/experience` renders 2-3 role cards in chronological order (current → prior)
- [ ] Current role has ● CURRENT pill (emerald), prior roles have ● PRIOR pill (gray)
- [ ] Each card shows title + company + location + dates + 3-4 impact bullets + tech pills
- [ ] Cards stagger-reveal on scroll (Framer Motion)
- [ ] Reduced-motion respected
- [ ] Type check clean (`npx tsc --noEmit`)
- [ ] `npm run build` succeeds with no Zod errors
- [ ] JSON-LD ProfilePage + Person schema present

---

## References

- LAYER3-ABOUT.md (timeline + Framer Motion stagger pattern to mirror)
- LAYER3-PROJECTS.md (`<TechStackPills>` already built, reuse)
- prompts.txt → "Current Work & Company Section" (lighter version — full Jarvis HUD per role deferred to v2)
