# Layer 3 — Skills Design Spec

> Locked design contract for the Skills page (neural-map of backend + AI skills). All decisions captured 2026-05-26 via 2 design batches.

> See [`docs/design/LAYER1.md`](./LAYER1.md), [`docs/design/LAYER2.md`](./LAYER2.md), [`docs/design/LAYER3-PROJECTS.md`](./LAYER3-PROJECTS.md), [`docs/design/LAYER3-ABOUT.md`](./LAYER3-ABOUT.md), [`docs/design/LAYER3-EXPERIENCE.md`](./LAYER3-EXPERIENCE.md), [`docs/ARCHITECTURE.md`](../ARCHITECTURE.md), [`docs/DESIGN-SYSTEM.md`](../DESIGN-SYSTEM.md).

---

## Goal of Skills

The recruiter has seen identity (Hero), explored (Layer 2), browsed work (Projects + Experience), read journey (About). Now they want to **verify technical depth**. This page must:

1. Convey **strength via structure** — Python at the center, related techs branch out
2. Make tech connections **visible** — hover Python → light up FastAPI, Airflow, etc.
3. Cross-link to **proof** — clicking a tech shows projects where it was used
4. Be **draggable + zoomable** — recruiter can rearrange / focus
5. Respect SKILL.md rule: **backend + AI ONLY** (no Next.js, React, Tailwind, TS, etc.)

---

## Visual approach: React Flow neural map

React Flow (`@xyflow/react`) gives us:
- Built-in drag + zoom + pan
- SVG-based edge rendering (we control the look)
- Custom node components
- Mini-map (optional) + controls (zoom/fit)
- Tree-shakable, ~80KB gzip when loaded
- Lazy-loaded via `next/dynamic` so other pages aren't affected

### Layout (initial render)
- Python node at center
- 3 category clusters arranged 120° apart around Python:
  - **Languages** (top): Python, SQL
  - **Systems** (bottom-left): FastAPI, Airflow, Kubernetes, Docker
  - **AI/ML** (bottom-right): RAG, LangChain, FAISS, LLMs
- Edges connect:
  - Python → every tech in Systems + AI/ML (Python is the connector)
  - SQL → PostgreSQL (when added) — for now SQL is standalone language
  - FastAPI → Pydantic (sub-cluster)
- Animation: nodes spawn at center + fly outward to target positions on first render (Framer Motion-driven, 800ms total)

### Visual rules (custom node)
- Each node: 100x60px rounded card
- Background: glass surface (`bg-bg-elevated`) with gradient border
- Python (center): largest (140x80px), bright purple → cyan gradient border, glowing halo
- Category color hint:
  - Languages → cyan border
  - Systems → purple border
  - AI/ML → pink border
- Tech label: mono font, 12px, white
- Hover/tap state: node scales 1.1, halo intensifies, connected edges brighten cyan, connected nodes get amber outline

### Edge styling
- Thin curved lines, faint white (rgba(255,255,255,0.12))
- On hover of either endpoint: brightens to cyan (rgba(34,211,238,0.6)), thickens to 2px
- Animated gradient flow along edge when both endpoints highlighted

---

## Component breakdown

5 new components under `frontend/src/components/layer3/skills/`:

1. **SkillsMap** — outer React Flow wrapper (client, lazy-loaded)
2. **SkillNode** — custom node component (Python + tech nodes)
3. **SkillPopover** — hover/tap popover with years + confidence + project links
4. **SkillsFallback** — category list shown if React Flow fails to load OR reduced-motion is on
5. **SkillsLegend** — small legend bottom-right (color = category)

Plus reuse:
- `<Nav>` from layer1
- `<PageHeader>` from shared

Page: `frontend/src/app/skills/page.tsx` (replaces existing ComingSoonPage).

---

## Content schema

`content/skills.md` — array of techs in frontmatter, no Markdown body.

```yaml
---
techs:
  - slug: python
    name: "Python"
    category: "language"          # language | systems | ai
    isCenter: true                # only one node has this; Python = center
    years: "5+"
    confidence: "Deepest fluency. Async, type-safe, production-grade."
    projects: ["prepzy", "portfolio"]   # slugs that match content/projects/*.md
    connects: []                  # other tech slugs to draw edges to (auto: center connects to all)
  - slug: fastapi
    name: "FastAPI"
    category: "systems"
    years: "3+"
    confidence: "Primary backend framework. Async + Pydantic + OpenAPI."
    projects: ["prepzy", "portfolio"]
    connects: ["python"]
  - slug: airflow
    name: "Airflow"
    category: "systems"
    years: "3+"
    confidence: "Production data pipelines on EKS. Custom operators."
    projects: ["prepzy"]
    connects: ["python", "kubernetes"]
  # ... ~10 techs total
seo:
  title: "Skills — Penchala Reddy"
  description: "Technical skill map of Penchala Reddy — Python at the center, with FastAPI, Airflow, Kubernetes, RAG, LangChain, and FAISS branching out."
---
```

Validated via Zod at `frontend/src/lib/content/skills-schema.ts`. Loader at `frontend/src/lib/content/skills.ts`. Cross-links to projects happen in the loader: for each tech's `projects: [...]` slugs, the loader joins with already-loaded `content/projects/*.md` to fetch project titles → renders real project links in the popover.

---

## Categories + techs (locked, ~10 total)

Per SKILL.md: **backend + AI only, NO frontend stack**.

### Languages (cyan)
- Python (center, isCenter: true)
- SQL

### Systems (purple)
- FastAPI
- Airflow
- Kubernetes
- Docker
- PostgreSQL

### AI/ML (pink)
- RAG
- LangChain
- FAISS
- sentence-transformers

---

## Interaction

### Hover/tap a tech node
- Node scales 1.1, halo intensifies (CSS transform)
- Connected edges brighten cyan
- Connected nodes get amber outline
- Popover appears anchored above node showing:
  - Tech name (display, h4)
  - Years badge (mono, accent-cyan)
  - Confidence statement (body, 1-2 lines)
  - "Used in" project links (clickable; opens `/projects/<slug>/`)

### Pan / zoom
- Mouse: drag to pan, scroll to zoom
- Trackpad: pinch to zoom, 2-finger drag to pan
- Touch: 1-finger drag to pan, pinch to zoom
- Keyboard: arrow keys to pan, +/- to zoom, R to reset layout

### Reset button
- Top-right corner of map
- Click → animates layout back to initial radial arrangement (800ms spring)

### Initial spawn animation
- All non-center nodes start at Python's center position with opacity 0
- Stagger fly-out to target positions over 800ms (40ms per node), ease cubic-bezier(0.2, 0.8, 0.2, 1)
- Reduced-motion: nodes appear in target positions instantly

---

## Reduced-motion + fallback

If `prefers-reduced-motion: reduce`:
- No spawn animation, no edge flow animation, no scale-on-hover
- Map still renders, drag/zoom still work (those are user-initiated, not auto-motion)

If React Flow fails to load (rare, but graceful degradation):
- `<SkillsFallback>` renders: 3 columns (Languages / Systems / AI) with tech name + years + click-to-expand confidence + project links
- No fancy visuals, just structured info

---

## Performance budget

| Metric | Budget |
|---|---|
| **JS bundle (gzip)** | < 280KB (Layer 1 + React Flow lazy-loaded ~80KB) |
| **LCP** | < 2.5s |
| **CLS** | < 0.05 |
| **Lighthouse Performance** | ≥ 85 (slightly lower than other pages due to React Flow) |
| **Lighthouse Accessibility** | 100 (nodes are buttons, popover is dialog, etc.) |
| **Lighthouse SEO** | 100 |

### Implementation rules
- React Flow lazy-loaded via `next/dynamic` (`ssr: false`)
- Fallback `<SkillsFallback>` renders immediately as SSR'd HTML — React Flow swaps in on hydration
- Edge animations CSS-only (no Framer Motion on edges)
- Popover lazy: render only when a node is hovered/tapped

---

## SEO

- `<h1>` from `seo.title`
- JSON-LD `Person` schema with `knowsAbout` array (every tech name)
- Canonical: `https://reddybytes.github.io/skills/`
- Added to sitemap.xml

---

## Folder additions

```
content/
└── skills.md                                      # NEW

frontend/
├── package.json                                   # MODIFIED (+@xyflow/react)
└── src/
    ├── app/skills/page.tsx                        # MODIFIED (was ComingSoonPage)
    ├── components/layer3/skills/                  # NEW DIR
    │   ├── SkillsMap.tsx                          # React Flow wrapper (client, lazy)
    │   ├── SkillNode.tsx                          # custom node
    │   ├── SkillPopover.tsx                       # hover detail
    │   ├── SkillsFallback.tsx                     # category list fallback
    │   └── SkillsLegend.tsx
    └── lib/content/
        ├── skills-schema.ts                       # NEW (Zod)
        └── skills.ts                              # NEW (loader + project cross-link)
```

---

## Dependencies

One new package:

```json
{
  "dependencies": {
    "@xyflow/react": "^12.8.0"
  }
}
```

`@xyflow/react` is the canonical React Flow package (renamed from `reactflow` in v12). MIT license, ~80KB gzipped, tree-shakable.

Install:
```bash
cd frontend
npm install --registry=https://registry.npmjs.org/
```

---

## Acceptance criteria

- [ ] `/skills` renders neural map with Python at center
- [ ] ~10 tech nodes in 3 category clusters (Languages / Systems / AI)
- [ ] NO frontend techs present (no Next.js, React, Tailwind, TS, JS, CSS, HTML)
- [ ] Nodes spawn-animate from center on first render (or instant if reduced-motion)
- [ ] Drag a node → moves; reset button restores radial layout
- [ ] Zoom in/out (scroll/pinch) works
- [ ] Hover/tap tech node → popover shows years + confidence + project links
- [ ] Connected edges brighten on hover
- [ ] Project links open `/projects/<slug>/` correctly
- [ ] Fallback list renders if React Flow fails or reduced-motion is on
- [ ] Legend visible bottom-right showing 3 category colors
- [ ] Type check clean
- [ ] Build succeeds with no Zod errors

---

## Content drafting strategy

I draft `content/skills.md` with all 10 techs scaffolded:
- Python: real "years: 5+", confidence drafted from prompts.txt + SKILL.md context
- Other techs: years marked `EDIT: <best estimate>`, confidence drafted with `> EDIT:` placeholders the user replaces
- Project slugs reference existing `prepzy` + `portfolio` (already in `content/projects/`)

---

## References

- LAYER3-PROJECTS.md (project loader pattern + cross-link strategy)
- LAYER3-ABOUT.md (skill-related content already in About's LearningWall — Skills is separate, more visual)
- prompts.txt → "Skills Visualization" (neural energy bars / radar systems / animated graph nodes — we chose radial neural map)
- SKILL.md "Hard Rule: Skills Page = Backend + AI ONLY"
