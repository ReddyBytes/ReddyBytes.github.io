# Design System

The visual language for `reddybytes.github.io`. Image-derived hybrid palette + premium SaaS typography + premium motion rules.

> **Core principle:** depth-on-scroll. Restrained on the surface, complexity blooms below. The palette itself enforces this: pink/magenta NEVER appear above the fold.

---

## Color tokens

### Layer 1 — Landing (restrained)
*Derived from `docs/references/dark/landing-dark-03-cinematic-minimal-PREFERRED.png`*

```css
/* Background */
--bg-base:        #08081a;   /* near-black with purple undertone */
--bg-elevated:    #0f0f24;   /* card surfaces */
--bg-glass:       rgba(168, 85, 247, 0.04);  /* glassmorphism, purple tint */

/* Text */
--text-primary:   #f5f5f7;
--text-secondary: #b4b4c8;
--text-tertiary:  #6b6b80;

/* Primary accent — PURPLE (dominant) */
--accent-purple:        #a855f7;   /* portal, CTA, "PULL THE THREAD" */
--accent-purple-bright: #c084fc;
--accent-purple-deep:   #7c3aed;
--accent-violet:        #8b5cf6;

/* Secondary accent — CYAN (system status only) */
--accent-cyan:        #22d3ee;
--accent-cyan-bright: #67e8f9;

/* Borders + glows */
--border-subtle:        rgba(255, 255, 255, 0.08);
--border-purple-faint:  rgba(168, 85, 247, 0.20);
--border-cyan-faint:    rgba(34, 211, 238, 0.20);
--glow-purple:          0 0 32px rgba(168, 85, 247, 0.50);
--glow-cyan:            0 0 24px rgba(34, 211, 238, 0.40);

/* Gradients — RESTRAINED */
--gradient-name-landing:  linear-gradient(135deg, #f5f5f7 0%, #c084fc 100%);
--gradient-cta:           linear-gradient(135deg, #a855f7 0%, #6366f1 100%);
--gradient-portal:        radial-gradient(circle, #a855f7 0%, #7c3aed 40%, transparent 70%);
```

### Layer 2 & 3 — Dashboard + Deep dives (vivid unlocks)
*Derived from `docs/references/dark/landing-dark-01-portal-with-stats.png`*

```css
/* Same bg + text + borders inherited from Layer 1 */

/* Tertiary accent — PINK / MAGENTA (only Layer 2+) */
--accent-pink:        #ec4899;
--accent-magenta:     #d946ef;
--accent-pink-bright: #f472b6;

/* Vivid gradients — Layer 2+ only */
--gradient-name-vivid:  linear-gradient(135deg, #ec4899 0%, #d946ef 35%, #a855f7 70%, #22d3ee 100%);
--gradient-stat:        linear-gradient(135deg, #ec4899 0%, #a855f7 100%);
--gradient-tech-chip:   linear-gradient(135deg, rgba(236,72,153,0.15) 0%, rgba(168,85,247,0.15) 100%);

/* Pink glows */
--glow-pink:    0 0 24px rgba(236, 72, 153, 0.40);
--glow-magenta: 0 0 24px rgba(217, 70, 239, 0.35);
```

### Hybrid rules (CRITICAL — enforced in code)

1. Layer 1 components NEVER import pink/magenta tokens. Lint rule: `no-pink-in-layer1`.
2. Layer 2+ unlocks pink/magenta freely.
3. AI Orb bridges both: outer glow uses purple+cyan (landing-safe), inner pulse uses pink when active.
4. Max 2 accent colors per viewport on Layer 1. Max 4 on Layer 2+.
5. Neon glow only on focus / hover / active / inside portal motif. NEVER ambient page-wide.

---

## Typography

```css
--font-display:    'Space Grotesk', system-ui, sans-serif;    /* Hero, section headers */
--font-body:       'Inter', system-ui, sans-serif;             /* Paragraphs, UI */
--font-mono:       'JetBrains Mono', 'Geist Mono', monospace;  /* Terminal, code, system status */
--font-futuristic: 'Orbitron', sans-serif;                     /* Optional: boot sequence, system labels */
```

### Type scale (1.25 ratio)

| Token | Size | Use |
|---|---|---|
| `--text-xs` | 0.75rem | Small labels, footnotes |
| `--text-sm` | 0.875rem | Secondary text, captions |
| `--text-base` | 1rem | Body |
| `--text-lg` | 1.25rem | Lead paragraphs |
| `--text-xl` | 1.5rem | Card titles |
| `--text-2xl` | 2rem | Subsection headers |
| `--text-3xl` | 2.5rem | Section headers |
| `--text-4xl` | 3.5rem | Page headlines |
| `--text-5xl` | 5rem desktop / 3rem mobile | Hero name |

### Type rules

1. **One `<h1>` per page** (hero name on landing; page title elsewhere)
2. **Line-height**: 1.1 for headlines, 1.6 for body
3. **Letter-spacing**: -0.02em on display, normal on body, +0.05em on monospace labels
4. **Hero name**: always Space Grotesk semibold (600), gradient applied
5. **All-caps**: only on system labels (`SYSTEM STATUS: ONLINE`), never on body

---

## Spacing — 8px grid

`2, 4, 8, 12, 16, 24, 32, 48, 64, 96, 128`

Container max-widths:
- Content text: `max-w-3xl` (768px)
- Card grid: `max-w-7xl` (1280px)
- Full-bleed: 100vw

---

## Component patterns

### Glassmorphism card
```css
.glass-card {
  background: var(--bg-glass);
  backdrop-filter: blur(12px);      /* `backdrop-blur-md`, NOT blur-3xl */
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--border-subtle);
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
}
```

### Portal motif (recurring DNA across hero, AI orb, vault doors)
```css
.portal {
  position: relative;
  border-radius: 50%;
  background: var(--gradient-portal-glow);
}
.portal::before {
  /* glowing ring */
  border: 2px solid var(--accent-purple);
  box-shadow: var(--glow-purple), inset 0 0 32px rgba(168,85,247,0.3);
}
```

### CTA button
```css
.cta-primary {
  background: var(--gradient-cta);
  color: white;
  padding: 14px 28px;
  border-radius: 8px;
  font-weight: 500;
  transition: transform 240ms cubic-bezier(0.2, 0.8, 0.2, 1),
              box-shadow 240ms cubic-bezier(0.2, 0.8, 0.2, 1);
}
.cta-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--glow-purple);
}
```

---

## Motion rules

### Bundle strategy
- **Layer 1**: CSS-only animations + 1 lightweight SVG/Canvas portal. ZERO Framer Motion.
- **Layer 2**: Framer Motion lazy-loaded via `next/dynamic`, loaded on scroll-into-view.
- **Layer 3**: Route-level code-split. Three.js / drei loaded only when route opens.

### Performance budgets (HARD — fail build if exceeded)

| Metric | Landing | Dashboard | Deep dive |
|---|---|---|---|
| JS bundle (gzipped) | < 100KB | < 250KB cumulative | < 500KB cumulative |
| Total page weight | < 500KB | < 1.5MB | < 3MB |
| LCP | < 2.0s | < 3.0s | < 4.0s |
| CLS | < 0.05 | < 0.1 | < 0.1 |
| Lighthouse Performance | ≥ 95 | ≥ 90 | ≥ 85 |

### Motion principles

1. **ALWAYS** check `prefers-reduced-motion: reduce` → degrade to no-motion
2. **Boot sequence** auto-skips if reduced-motion OR localStorage flag `portfolio_visited=true`
3. **Stagger** card entry: 80ms delay between siblings
4. **Easing**: `cubic-bezier(0.2, 0.8, 0.2, 1)` for entries; `cubic-bezier(0.4, 0, 0.2, 1)` for exits
5. **Durations**: hover 240ms · entry 480ms · page transition 600ms
6. **NEVER** animate `top/left/width/height` — use `transform` + `opacity` only
7. **Particles/canvas**: max 60 particles, throttle to 30fps on mobile
8. **`IntersectionObserver`** for scroll-triggered animations (never scroll event listeners)

---

## Theme system

- **Dark first, light later** — v1 ships dark only; light theme is v2
- **Two separate file systems** — NOT Tailwind `dark:` prefix
  - `src/styles/themes/dark/` — base.css, hero.css, projects.css, etc.
  - `src/styles/themes/light/` — same structure (v2)
- **Per-page isolation** — changing one page's dark theme NEVER affects another (Prepzy lesson)
- **System preference + manual toggle** — detect `prefers-color-scheme`, allow override, persist in localStorage
- **Smooth transition** — 400ms color transition on entire page when toggled
- **Zero leaking** — when dark active, light CSS not loaded (route-level conditional import)

---

## Accessibility (WCAG AA minimum)

1. Color contrast ≥ 4.5:1 normal text, ≥ 3:1 large text — verified with axe
2. Keyboard nav on every interaction (focus rings visible, skip-to-main link)
3. ARIA labels on custom widgets (terminal, AI orb, vault doors, train, neural map)
4. Touch targets ≥ 44px on mobile
5. No autoplay sound — ever
6. Boot sequence skippable via Esc / Space
7. Screen reader tested (VoiceOver macOS, NVDA Windows) before "done"

---

## Photo fallback system

Every photo slot gracefully falls back. Build NEVER fails because of missing photo.

```
public/photos/
├── profile/hero.jpg               → fallback: defaults/silhouette-portal.svg
├── about/portrait.jpg             → fallback: defaults/silhouette-standing.svg
├── travel/<slug>.jpg              → fallback: defaults/gradient-mountain.svg
└── defaults/
    ├── silhouette-portal.svg      (cinematic silhouette in ring)
    ├── silhouette-standing.svg    (full-body silhouette)
    ├── gradient-mountain.svg
    ├── gradient-city.svg
    └── gradient-abstract.svg
```

```typescript
// src/lib/photo/fallback.ts
export function getPhoto(slot: PhotoSlot): string {
  const userPath = `/photos/${slot.path}`
  return existsAtBuildTime(userPath) ? userPath : slot.fallback
}
```

Build script `scripts/check_photos.py` runs at `prebuild`, logs slots using fallbacks (visible in CI), warns but never fails.

---

## Signature visual elements

Each of these is a recurring visual DNA across the site — keep them consistent:

1. **Portal ring** — circular border with purple gradient glow. Used in hero, AI orb, vault doors.
2. **Pull-the-thread** — glowing dotted vertical line + pull handle, beckons interaction.
3. **System status panel** — bottom-right corner, monospace, cyan ticks (`ONLINE`, `PYTHON: ACTIVE`).
4. **Tech chip** — pill with subtle gradient bg + monospace label.
5. **Stat card** — large number + tiny label, vivid gradient on number (Layer 2+).
6. **Glassmorphism panel** — translucent card with backdrop-blur, used for content surfaces.

---

## What this doc does NOT cover

- Section-specific layouts → see component files + Storybook (Phase 2)
- Brand guidelines / logo usage → see `BRAND.md` (Phase 3, when brand mark is finalized)
- Print styles → not in scope (web-only portfolio)
