# Layer 3 — About Design Spec

> Locked design contract for the About page (the page recruiters open when they want to understand WHO Penchala is beyond the resume). All decisions captured 2026-05-26 via 3 design batches.

> See [`docs/design/LAYER1.md`](./LAYER1.md), [`docs/design/LAYER2.md`](./LAYER2.md), [`docs/design/LAYER3-PROJECTS.md`](./LAYER3-PROJECTS.md), [`docs/ARCHITECTURE.md`](../ARCHITECTURE.md), [`docs/DESIGN-SYSTEM.md`](../DESIGN-SYSTEM.md).

---

## Goal of About

The recruiter has seen the hero, browsed Layer 2 cards, maybe clicked a project. Now they want to know **who this engineer is**. The About page must:

1. Be **personal** — not buzzword soup. Show a real human.
2. Tell the **growth story** — village → engineer → AI builder. Convey trajectory.
3. Show **current focus + current learning** — "what is this person doing this month?"
4. Make **contact friction-free** — email, GitHub, LinkedIn all 1-click.
5. Stay scannable in 60 seconds AND deep-readable for the curious recruiter (5+ minutes).

---

## Section order (top to bottom)

```
┌──────────────────────────────────────────────────────────────────┐
│ NAV (sticky)                                                      │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│ // about                                                          │
│ Know the builder                                                  │  ← PageHeader (reused)
│ A working AI engineer who builds in public.                       │
│                                                                   │
│ ┌────────────┬────────────────────────────────────────────────┐  │
│ │            │                                                 │  │
│ │            │  Hi, I'm Penchala — engineer turning ideas      │  │  ← Hero
│ │   PHOTO    │  into intelligent systems.                       │  │     (photo left,
│ │  (strip)   │                                                 │  │      text right)
│ │            │  2-3 paragraph 'who I am' intro                  │  │
│ │            │                                                 │  │
│ └────────────┴────────────────────────────────────────────────┘  │
│                                                                   │
│ // journey                                                        │
│ The path so far                                                   │
│                                                                   │  ← Journey
│       2010 — Village                                              │     (vertical
│         A small town in Telangana...                              │      timeline,
│              ↓                                                    │      alternating
│       2015 — Engineering                                          │      L/R cards)
│         B.Tech in CS, first taste of code...                      │
│              ↓                                                    │
│       (...8-10 milestones total)                                  │
│              ↓                                                    │
│       2026 — AI builder                                           │
│         Building RAG systems, learning in public.                 │
│                                                                   │
│ // building                                                       │
│ What I'm building right now                                       │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐                            │  ← Currently
│ │ Prepzy   │ │Portfolio │ │AI Learn  │                            │     Building
│ │ ●LIVE    │ │●LIVE     │ │●LEARNING │                            │     (3 cards)
│ │ Exam... │ │Python... │ │RAG cur.. │                            │
│ └──────────┘ └──────────┘ └──────────┘                            │
│                                                                   │
│ // learning                                                       │
│ The build-in-public wall                                          │
│                                                                   │  ← Currently
│ ▸ Transformers       █████████░  90%                              │     Learning
│ ▸ RAG tuning         ███████░░░  70%                              │     (wall — topics
│ ▸ LoRA fine-tuning   ████░░░░░░  40%                              │      + progress)
│ ▸ AI agents          ███░░░░░░░  30%                              │
│ ▸ MCP                ██░░░░░░░░  20%                              │
│                                                                   │
│ // contact                                                        │
│ Let's talk                                                        │
│ The best ways to reach me:                                        │  ← Contact CTA
│ [📧 Email]  [🔗 GitHub]  [💼 LinkedIn]                            │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## Component breakdown

5 new components, all under `frontend/src/components/layer3/about/`:

1. **AboutHero** — full-bleed photo strip left + intro text right
2. **JourneyTimeline** — vertical timeline with milestone cards alternating L/R
3. **JourneyMilestone** — single milestone card (used inside JourneyTimeline)
4. **CurrentlyBuilding** — 3-card row (Prepzy / Portfolio / AI Learning)
5. **LearningWall** — list of 5-8 topics with progress bars
6. **ContactCTA** — big bottom CTA with email/GitHub/LinkedIn pills

Plus reuse:
- `<Nav>` from layer1
- `<PageHeader>` from shared (already exists)

Page route: `frontend/src/app/about/page.tsx` (replaces existing ComingSoonPage).

---

## Content schema (single Markdown file)

`content/about.md` — frontmatter defines structured data, Markdown body is the intro prose.

```yaml
---
hero:
  greeting: "Hi, I'm Penchala —"
  tagline: "engineer turning ideas into intelligent systems"
  photo: "/photos/about/portrait.jpg"   # fallback: silhouette SVG
  paragraphs:                            # rendered as <p> in hero text column
    - "I'm a software engineer with 5+ years of Python backend experience, currently learning AI deeply (RAG, embeddings, fine-tuning)."
    - "What I love: shipping real systems that scale, building in public, and bridging the gap between traditional backend engineering and modern AI workflows."
    - "What I'm doing now: working at Apple, building Prepzy (govt exam prep platform), and documenting my AI learning journey in this very portfolio."
journey:
  - { year: "2010", title: "Village", body: "Grew up in a small town in Telangana..." }
  - { year: "2015", title: "Engineering", body: "B.Tech in Computer Science..." }
  # ... 8-10 milestones total
building:
  - {
      slug: "prepzy",
      title: "Prepzy",
      status: "live",                      # live | beta | learning | shipped
      description: "Govt exam prep platform shipped to production.",
      href: "/projects/prepzy/"
    }
  - {
      slug: "portfolio",
      title: "This Portfolio",
      status: "live",
      description: "Python-powered AI engineer site you're on right now.",
      href: "/projects/portfolio/"
    }
  - {
      slug: "ai-learning",
      title: "AI Learning Curriculum",
      status: "learning",
      description: "9-stage public learning trail for building RAG systems from scratch.",
      href: "https://github.com/ReddyBytes/ReddyBytes.github.io/tree/main/docs/ai-learning"
    }
learning:
  - { topic: "Transformers", progress: 90, link: "docs/ai-learning/02-embeddings.md" }
  - { topic: "RAG tuning",   progress: 70, link: "docs/ai-learning/04-vector-db.md" }
  - { topic: "LoRA fine-tuning", progress: 40 }
  - { topic: "AI agents",    progress: 30 }
  - { topic: "MCP",          progress: 20 }
contact:
  intro: "The best ways to reach me — for hiring, consulting, or just to chat about AI engineering:"
  email: "penchalareddy260@gmail.com"
  github: "https://github.com/ReddyBytes"
  linkedin: "https://www.linkedin.com/in/penchalareddy"
seo:
  title: "About — Penchala Reddy"
  description: "Software engineer building intelligent backend systems and AI-powered solutions. The journey from village to engineer to AI builder."
---

(no Markdown body — all content is in frontmatter for this page)
```

Validated via Zod schema at `frontend/src/lib/content/about-schema.ts` (parallels project-schema.ts). Loader at `frontend/src/lib/content/about.ts`.

---

## Visual rules

### Hero (full-bleed photo strip left)
- Photo column: left 35% on desktop, full-width image strip on top for mobile
- Fallback: silhouette-portal.svg (same default as Layer 1 portal)
- Photo aspect: ~3/4 portrait
- Subtle purple→cyan gradient overlay on photo bottom (matches palette)
- Text column: right 65% on desktop, full-width below photo on mobile
- Greeting + tagline → display font, large
- Intro paragraphs → body text, max-w-2xl, generous line-height

### Journey timeline
- Single vertical line down the center on desktop, left-aligned on mobile
- Milestone cards alternate left/right of the line on desktop
- Each card: year (mono, accent-cyan), title (display, h3), body (body text)
- Connector dots at each milestone on the line, purple → cyan gradient
- Cards fade-in on scroll (Framer Motion stagger, 80ms per card)
- Mobile: all cards on the right of the line (no L/R alternation)

### Currently Building (3 cards)
- 3-column grid desktop, single-column mobile
- Each card: status pill (top-right, colored by status) + title + description + arrow link
- Status colors:
  - `live` → emerald (●)
  - `beta` → amber
  - `learning` → cyan
  - `shipped` → tertiary text
- Same hover behavior as Layer 2 vault cards (lift + gradient border accent)

### Learning Wall (build-in-public)
- Vertical list of 5-8 topic rows
- Each row: triangle pointer (purple) + topic name + progress bar + percentage
- Progress bar: gradient fill (purple → cyan), animates from 0 to target on scroll-into-view (Framer Motion)
- Subtle hint: "Updated [date]" mono caption above the list

### Contact CTA
- Centered, mid-spaced
- Intro sentence above (1 line)
- 3 large pill buttons in a row (desktop) / column (mobile): Email, GitHub, LinkedIn
- Each pill: icon + label + gradient border on hover
- Below: small mono note "Best response within 24h" (optional trust signal)

---

## Performance budget

| Metric | Budget |
|---|---|
| **JS bundle (gzip)** | < 220KB (Layer 1 + nav + about components + Framer Motion lazy) |
| **LCP** | < 2.5s |
| **CLS** | < 0.05 |
| **Lighthouse Performance** | ≥ 90 |
| **Lighthouse Accessibility** | 100 |
| **Lighthouse SEO** | 100 |

### Implementation rules
- Framer Motion lazy-loaded (same `next/dynamic` pattern as Layer 2 Dashboard)
- Photo: WebP recommended, `unoptimized: true` for static export, `priority` for hero
- Progress bars: Framer Motion `whileInView` (IntersectionObserver under the hood)
- No new dependencies (everything needed is installed via Projects branch)

---

## Reduced motion + a11y

- Timeline reveal: no fade-in-up animation, cards visible immediately
- Currently Building card hover: no translate, just border accent shift
- Learning Wall progress bars: instant fill (no animation) — value visible immediately
- Contact pills: no hover transform
- Semantic HTML: `<article>` for each milestone card, `<nav aria-label="Contact methods">` for the contact pills
- Skip-to-content link at top
- Focus rings visible on all interactive pills

---

## SEO

- `<h1>` from frontmatter `seo.title` rendered via PageHeader
- `<meta description>` from `seo.description`
- OG image: hero photo (or fallback to default OG image if not uploaded)
- Twitter card: summary_large_image
- JSON-LD `AboutPage` schema linked to Person (Penchala)
- Canonical URL `https://reddybytes.github.io/about/`
- Added to sitemap.xml at build

---

## Content drafting strategy (v1)

I draft `content/about.md` from existing context:
- Hero intro paragraphs: from prompts.txt + this repo's identity decisions
- Journey milestones: I draft 8-10 placeholder milestones with **bracketed `EDIT:` notes** where I'm guessing (e.g., dates, specific job titles, locations). User fills in real details before merge.
- Currently Building: 3 real cards (Prepzy + Portfolio + AI Learning) — all things we know exist.
- Learning Wall: 5 topics drawn from docs/ai-learning/ (Transformers, RAG tuning, LoRA, AI agents, MCP) with **placeholder progress percentages** the user replaces with honest self-assessments.
- Contact: real (email + GitHub + LinkedIn URLs already locked).

---

## Folder additions

```
content/
└── about.md                                       # NEW — single content file

frontend/
├── public/photos/about/
│   └── (portrait.jpg goes here — optional, falls back to default silhouette)
└── src/
    ├── app/about/page.tsx                         # MODIFIED (was ComingSoonPage)
    ├── components/layer3/about/                   # NEW DIR
    │   ├── AboutHero.tsx
    │   ├── JourneyTimeline.tsx
    │   ├── JourneyMilestone.tsx
    │   ├── CurrentlyBuilding.tsx
    │   ├── LearningWall.tsx
    │   └── ContactCTA.tsx
    └── lib/content/                               # additions
        ├── about-schema.ts                        # NEW — Zod
        └── about.ts                               # NEW — loader
```

---

## Build order (8 steps inside this branch)

1. `lib/content/about-schema.ts` — Zod schema
2. `lib/content/about.ts` — loader (read content/about.md, parse, validate)
3. `content/about.md` — drafted content (with EDIT placeholders)
4. `components/layer3/about/AboutHero.tsx`
5. `components/layer3/about/JourneyMilestone.tsx` + `JourneyTimeline.tsx`
6. `components/layer3/about/CurrentlyBuilding.tsx` + `LearningWall.tsx`
7. `components/layer3/about/ContactCTA.tsx`
8. `app/about/page.tsx` — replace ComingSoonPage; smoke test build

---

## Acceptance criteria

- [ ] `/about` renders 5 sections in order (Hero → Journey → Building → Learning → Contact)
- [ ] Hero has photo strip + intro text; falls back to silhouette if photo missing
- [ ] Journey timeline shows 8-10 milestones, alternating L/R on desktop, all-left on mobile
- [ ] Milestones reveal on scroll with stagger (Framer Motion, lazy-loaded)
- [ ] Currently Building shows 3 cards with status pills (live/learning); clicking goes to relevant page/repo
- [ ] Learning Wall shows 5+ topics with progress bars; bars animate from 0 on scroll-in
- [ ] Contact CTA shows email + GitHub + LinkedIn pills, all open in new tab
- [ ] Reduced-motion: no animations, instant reveal, no progress bar animation
- [ ] `npm run build` succeeds with no Zod validation errors
- [ ] Type check (`npx tsc --noEmit`) clean
- [ ] Photo fallback works (build doesn't fail if portrait.jpg is missing)

---

## References

- LAYER1.md + LAYER2.md + LAYER3-PROJECTS.md (visual + animation patterns)
- DESIGN-SYSTEM.md (color tokens — full vivid palette available on Layer 3)
- ARCHITECTURE.md (folder structure conventions)
- prompts.txt → "About Me Section" (prompts 9, 10 — engineering journey, mindset, currently learning, future ambitions)
