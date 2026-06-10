# Layer 1 Design Spec — Hero / Landing

> Locked design contract for the portfolio's landing experience (Layer 1 of the 3-layer model). All decisions captured 2026-05-26 via 6 batches of design questions; this doc is the single source of truth before code is written.

> See [`docs/ARCHITECTURE.md`](../ARCHITECTURE.md) for the 3-layer experience model overview.
> See [`docs/DESIGN-SYSTEM.md`](../DESIGN-SYSTEM.md) for color tokens, typography, motion rules.

---

## Goal of Layer 1

The landing page is the recruiter's **30-second first impression**. It must:

1. Communicate identity (name, role, value prop) immediately
2. Feel **cinematic and minimal** — NOT a busy dashboard (that's Layer 2)
3. Tease depth — make recruiter curious to scroll/pull
4. Load fast on a slow corporate laptop (LCP < 2s, JS < 100KB gzip)
5. Work on mobile (375px) and desktop (1440px+)
6. Respect `prefers-reduced-motion` and keyboard navigation

**Anti-pattern (what NOT to do):** dense dashboard like `landing-dark-02-DENSE-anti-pattern.png`. That energy belongs in Layer 2.
**Target reference:** `landing-dark-03-cinematic-minimal-PREFERRED.png`. Calm, atmospheric, single focal point.

---

## Component breakdown

Layer 1 has 7 visual components:

```
┌────────────────────────────────────────────────────────────────────┐
│  [PR] PENCHALA REDDY    HOME ABOUT PROJECTS EXPERIENCE TRAVEL ...  │  ← Top nav (1)
│                                                                     │
│   HELLO, I'M                                          ╭─────╮      │
│                                                       │  ◉  │      │  ← Pull-thread (3)
│   PENCHALA                                            ╰──┬──╯      │
│   REDDY  ←───────────  gradient                          │         │
│                                                          │         │
│   Software Engineer · AI Engineer · Python ...      ┌────────┐    │
│                                                     │  ◯◯◯   │    │  ← Hero portal (2)
│   I build intelligent backend systems and AI-      │   ◉    │    │     (silhouette
│   powered solutions that solve real-world           │  ◯◯◯   │    │      in glow ring)
│   problems at scale.                                └────────┘    │
│                                                                     │
│   [ ENTER THE SYSTEM → ]   [ WATCH INTRO ]                         │  ← CTAs (4)
│                                                                     │
│                                                                     │
│   ⌬ ⌬ ⌬                              ┌─SYSTEM STATUS───┐          │
│   GH LI ✉                            │ ● ONLINE        │          │
│                                      │ PYTHON   5+ YR  │          │
│                                      │ AI/RAG   LEARN  │          │
│   ↓ SCROLL TO EXPLORE                │ PROD     LIVE   │          │
│                                      └─────────────────┘          │
│   ↑ Social (5)         ↑ Bottom hint (7)    ↑ Status panel (6)    │
└────────────────────────────────────────────────────────────────────┘
```

1. **Top navigation bar** — brand mark + 7 nav items + Resume button
2. **Hero portal** — glowing purple ring containing silhouette
3. **Pull-thread affordance** — draggable, top-right
4. **CTA buttons** — primary + secondary
5. **Social icons** — bottom-left
6. **System status panel** — bottom-right, alive feel
7. **Bottom scroll hint** — animated arrow + label

Plus the invisible 8th component:

8. **Boot sequence** — full-screen overlay shown before hero on first visit

---

## 1. Top navigation bar

### Content
- **Brand mark (left)**: `[PR]` icon + `PENCHALA REDDY` text
- **Nav items (center-right)**: HOME · ABOUT · PROJECTS · EXPERIENCE · TRAVEL · SKILLS · CONTACT
- **Action (right)**: `RESUME` button (placeholder href until v1.1)

### Behavior
- All nav items smooth-scroll to their respective sections (when sections exist) or open relevant pages
- HOME = scroll to top
- Active section highlights its nav item (cyan underline) using IntersectionObserver
- Sticky on scroll (always visible)
- On mobile: hamburger icon → full-screen overlay menu

### Styling rules
- Backdrop: glassmorphism (`backdrop-blur-md` over near-black bg)
- Bottom border: 1px subtle white/8
- Brand mark: `PR` in stylized box (purple gradient border), full name in space-grotesk medium weight
- Nav items: small caps tracking, opacity 0.7 default, opacity 1 + cyan underline on active/hover
- Resume button: outlined cyan border, hover fills cyan with bg

### Mobile
- Brand collapses to just `[PR]` icon
- Hamburger → fullscreen menu drawer
- Resume button visible inside the drawer

---

## 2. Hero portal (centerpiece on right side of viewport)

### Visual
- **Outer ring**: glowing purple gradient circle (radial-gradient from `--accent-purple` to transparent), pulse animation 4s loop
- **Inner content**: SVG silhouette (default) standing on a small platform
- **Background inside ring**: cosmic gradient (deep navy to subtle purple), faint star particles
- **Position**: right 40% of viewport on desktop, smaller and centered on mobile
- **Size**: 480px diameter desktop, 280px mobile

### Photo fallback (per SKILL.md photo rules)
- Default: `public/photos/defaults/silhouette-portal.svg` (generic stylized figure)
- User upload: drop a file at `public/photos/profile/hero.jpg` → build script auto-detects, swaps default
- Build never fails on missing photo

### Animation
- Ring: pulse opacity 0.7 → 1.0 → 0.7 over 4s, infinite (CSS @keyframes)
- Silhouette: subtle 8s float (translateY ±4px), CSS only
- Stars in background: drift across at 30s, CSS only, max 60 dots

### Reduced motion
- Ring: static at opacity 0.85 (no pulse)
- Silhouette: no float
- Stars: hidden

---

## 3. Pull-thread affordance

### Visual
- Glowing thin line (1px wide) hangs from top of portal area
- Small orb handle at the bottom of the line (8px diameter, purple glow)
- Tooltip on hover: "Pull to discover more" (cyan text, mono font)

### Position
- Top-right of viewport, slightly to the left of the portal ring
- Length: 120px on desktop, 80px on mobile
- Anchored to nav bottom edge

### Trigger
- **Desktop**: drag mouse downward on the orb by 50+ pixels
- **Mobile**: swipe-down gesture starting on the orb
- **Fallback**: click on orb → triggers same animation
- Tooltip + cursor change on hover signal it's interactive

### Reveal animation
- 800ms cinematic transition:
  1. Thread "unwinds" downward, orb stretches and trails light particles (300ms)
  2. Hero content fades to opacity 0.3 (200ms overlap)
  3. Smooth scroll to Layer 2 dashboard (500ms ease-in-out)
- Layer 2 fades in via IntersectionObserver as scroll completes

### Reduced motion
- No drag animation
- Click → instant scroll to Layer 2 (no fade, no thread animation)

---

## 4. CTA buttons

### Primary: `ENTER THE SYSTEM →`
- Style: gradient border (purple → cyan), bg transparent, white text
- On hover: bg fills with gradient, text becomes near-black, slight translate-y-1px lift
- Action: triggers same animation as pull-thread (unwind + scroll to Layer 2)
- Keyboard: Enter / Space activates

### Secondary: `WATCH INTRO`
- Style: text-only, no border, mono font, lowercase tracking
- Right side: small arrow icon
- On hover: slight cyan glow, arrow translates 2px right
- Action: replays boot sequence as full-screen overlay (reuses BootSequence component)
- Keyboard: Tab-focusable, Enter / Space activates

### Layout
- Side-by-side on desktop (Primary first, gap 16px)
- Stacked on mobile (Primary on top)

### Reduced motion
- No hover translate, no arrow translate, no fade
- Primary action: instant scroll to Layer 2 (no thread animation)
- Secondary action: opens boot sequence with `prefers-reduced-motion` already auto-skipping it (effectively a no-op — show toast "Already in reduced-motion mode")

---

## 5. Social icons (bottom-left of hero)

### Icons
- **GitHub**: links to `https://github.com/ReddyBytes` (opens new tab)
- **LinkedIn**: links to LinkedIn profile (URL TBD by user)
- **Email**: `mailto:penchalareddy260@gmail.com` (opens default mail client)

### Visual
- 24px lucide icons, opacity 0.6 default
- Horizontal row, gap 16px
- On hover: opacity 1.0, scale 1.1, cyan glow ring
- Subtle pulse on the email icon (2x per visit max) to nudge contact

### Mobile
- Stay in bottom-left corner, slightly smaller (20px icons)

---

## 6. System status panel (bottom-right of hero)

### Content
```
SYSTEM STATUS

● ONLINE
PYTHON      5+ YR
AI/RAG      LEARNING
PRODUCTION  DEPLOYED
```

### Visual
- Compact panel, mono font (JetBrains Mono), tracking-widest
- Background: glassmorphism (white/4 over near-black)
- Border: 1px white/12
- Width: 220px desktop, hidden on mobile (replaced by inline status pill in nav)
- Top label "SYSTEM STATUS": cyan, 10px, bold, tracking-widest
- Status dot `●` ONLINE: green (#10b981), pulsing 2s
- Field rows: gray-400 left label + white right value, 12px
- Padding: 12px

### Hover
- Slight border color shift to cyan/30
- Tooltip on each row showing more detail (Python: "Python (5+ years experience), Pandas, FastAPI, Airflow, Pydantic")

### Mobile (< 768px)
- Status panel hidden
- Replaced by inline `● ONLINE` pill in the nav bar (right side)

---

## 7. Bottom scroll hint

### Content
- Animated chevron `↓` arrow
- Label: `SCROLL TO EXPLORE` in mono font, small caps
- Position: centered horizontally, 32px from bottom of viewport

### Animation
- Arrow gentle bounce: translateY 0 → 6 → 0 over 1.6s loop
- Label: opacity 0.6 default, opacity 1.0 on viewport idle > 5s (subtle nudge)

### Reduced motion
- No bounce, static arrow
- No idle nudge

### When does it disappear?
- Hides on scroll position > 100px (user has started scrolling, hint has served its purpose)

---

## 8. Boot sequence (full-screen overlay before hero)

### When it shows
- **First visit**: shown automatically before hero
- **Return visits**: skipped (localStorage flag `portfolio_visited=true`)
- **Reduced motion**: auto-skipped entirely
- **Manual trigger**: secondary CTA `WATCH INTRO` replays it

### Content (5 lines)
```
INITIALIZING ENGINEER PROFILE...
Loading Python runtime...
Loading AI systems...
Loading Kubernetes clusters...
Loading neural architectures...
Profile ready.
```

### Visual style
- Full-screen overlay, deep navy background
- Mono font (JetBrains Mono), 14-18px depending on viewport
- Each line types character-by-character (typewriter effect, ~30ms per char)
- Each line has subtle cyan glow on the active typing line; previous lines fade to gray-500
- Sparse drifting particles in background (max 30, CSS animation, 30s drift loop)
- Blinking cursor at end of currently-typing line

### Timing
- Line typing: ~30ms per char (avg ~25 chars per line = ~750ms per line)
- Pause between lines: 200ms
- Total: ~5 lines × ~950ms = ~4.7 seconds (or instant skip)
- Final "Profile ready." pause 800ms then 400ms fade-out to hero

### Skip mechanism
- Visible **`SKIP →`** button top-right of overlay (always visible, white text, opacity 0.7)
- Hotkey: `Esc` or `Space` skips immediately
- On click/key: fade out 200ms → hero appears

### Persistence
- On successful completion OR skip: `localStorage.setItem('portfolio_visited', 'true')`
- Future visits: check flag → skip boot, go to hero directly
- "Reset visit" hidden in dev tools / via `?firstvisit=1` URL param for testing

### Reduced motion
- Auto-skipped immediately (no animation, no delay)
- localStorage flag not set (so user can manually trigger via WATCH INTRO if they want)

---

## Performance budgets (HARD LIMITS)

Layer 1 must hit these. CI fails build if exceeded:

| Metric | Budget | How achieved |
|---|---|---|
| **JS bundle (gzip)** | < 100KB | NO Framer Motion, NO Three.js — CSS-only animations |
| **Total page weight** | < 500KB | SVG silhouette (< 5KB), no real photos by default, font preload subset |
| **LCP** | < 2.0s | Inline critical CSS, font-display: swap, hero text in HTML (not lazy-loaded) |
| **CLS** | < 0.05 | Reserve space for portal + status panel via aspect-ratio + min-height |
| **Lighthouse Performance** | ≥ 95 | All of the above + image optimization (WebP, lazy below fold) |
| **Lighthouse Accessibility** | 100 | semantic HTML, ARIA on custom widgets, keyboard nav, color contrast 4.5:1+ |
| **Lighthouse SEO** | 100 | meta tags, OG, JSON-LD Person schema, sitemap, semantic h1 |

---

## Color tokens used (from DESIGN-SYSTEM.md Layer 1 palette)

```css
--bg-base:        #08081a   /* deep navy with purple undertone */
--bg-elevated:    #0f0f24   /* card surface (status panel) */
--bg-glass:       rgba(168, 85, 247, 0.04)  /* glassmorphism nav + panel */

--text-primary:   #f5f5f7
--text-secondary: #b4b4c8
--text-tertiary:  #6b6b80

--accent-purple:        #a855f7   /* portal ring, REDDY name gradient start */
--accent-cyan:          #22d3ee   /* CTAs, scroll arrow, system status active */
--gradient-name-landing: linear-gradient(135deg, #f5f5f7 0%, #c084fc 100%)
                          /* PENCHALA white → REDDY purple wash */

--border-subtle:        rgba(255, 255, 255, 0.08)
--glow-purple:          0 0 32px rgba(168, 85, 247, 0.50)
```

**NEVER use** `--accent-pink`, `--accent-magenta`, `--gradient-name-vivid` on Layer 1. Those unlock in Layer 2.

---

## Typography

| Element | Font | Size (desktop) | Size (mobile) | Weight |
|---|---|---|---|---|
| Greeting "HELLO, I'M" | JetBrains Mono | 14px | 12px | 500 |
| Hero name (PENCHALA REDDY) | Space Grotesk | 96px | 56px | 700 |
| Role line | Inter | 18px | 16px | 500 |
| Description | Inter | 16px | 14px | 400 |
| CTA primary | Inter | 14px | 14px | 600 |
| CTA secondary | JetBrains Mono | 13px | 12px | 500 |
| Nav items | Inter | 13px | n/a (drawer uses 16px) | 500 |
| System status | JetBrains Mono | 11px | hidden | 500 |
| Scroll hint label | JetBrains Mono | 11px | 10px | 500 |
| Boot sequence | JetBrains Mono | 16px | 13px | 400 |

---

## Folder layout (where files live)

```
frontend/src/
├── app/
│   ├── layout.tsx              # Root layout, fonts, metadata, theme
│   └── page.tsx                # Landing page (composes all Layer 1 components)
├── components/
│   ├── layer1/
│   │   ├── Nav.tsx             # Top navigation bar (component 1)
│   │   ├── HeroPortal.tsx      # Glowing ring + silhouette (component 2)
│   │   ├── PullThread.tsx      # Draggable thread (component 3)
│   │   ├── HeroCTA.tsx         # Primary + secondary buttons (component 4)
│   │   ├── SocialIcons.tsx     # GH/LI/email row (component 5)
│   │   ├── SystemStatus.tsx    # Bottom-right status panel (component 6)
│   │   ├── ScrollHint.tsx      # Bottom scroll arrow (component 7)
│   │   ├── BootSequence.tsx    # Full-screen boot overlay (component 8)
│   │   └── Hero.tsx            # Composes 2-7 (the visible hero)
│   └── shared/
│       └── BrandMark.tsx       # PR icon + name (used by Nav)
├── lib/
│   ├── theme/
│   │   └── tokens.ts           # exports color/font/spacing constants for TS use
│   ├── photo/
│   │   └── fallback.ts         # photo slot resolver with default
│   ├── motion/
│   │   └── reducedMotion.ts    # useReducedMotion() hook
│   └── visit/
│       └── firstVisit.ts       # localStorage helper for boot sequence skip
├── styles/
│   └── themes/
│       └── dark/
│           ├── base.css        # CSS custom properties + reset
│           ├── layer1.css      # Layer 1 specific styles
│           └── boot.css        # Boot sequence styles
└── hooks/
    ├── usePullThread.ts        # drag/swipe handler
    └── useTypewriter.ts        # boot sequence typing
```

---

## Acceptance criteria (when is Layer 1 "done")

- [ ] All 8 components render correctly on desktop (1440px) and mobile (375px)
- [ ] All 7 nav items present, brand mark shows, Resume button placeholder
- [ ] Hero portal renders silhouette (default SVG fallback) inside glowing ring with pulse
- [ ] Pull-thread is draggable on desktop, swipeable on mobile, falls back to click
- [ ] Pull-thread or primary CTA triggers same unwind+scroll animation
- [ ] Boot sequence shows on first visit, skips on return visits (localStorage)
- [ ] Boot has visible Skip button + Esc/Space hotkey
- [ ] Secondary CTA `WATCH INTRO` replays boot
- [ ] System status panel shows live `● ONLINE` pulse + 4 stats rows
- [ ] Scroll hint at bottom bounces gently, hides past 100px scroll
- [ ] Social icons (GH/LI/email) all have correct hrefs and open new tabs
- [ ] `prefers-reduced-motion` honored — boot auto-skips, no float/pulse animations
- [ ] Keyboard nav: Tab order is logical, every interactive element has focus ring
- [ ] Color contrast ≥ 4.5:1 on all text
- [ ] No `pink`/`magenta`/`vivid` color tokens used (Layer 1 rule)
- [ ] No `framer-motion` or `three` imports (Layer 1 perf budget rule)
- [ ] Lighthouse: Performance ≥ 95, Accessibility 100, SEO 100, Best Practices ≥ 95
- [ ] Bundle size: JS < 100KB gzipped, total page < 500KB
- [ ] LCP < 2.0s on simulated slow 3G
- [ ] All 8 component files have file-level JSDoc explaining what they do

---

## Build order (suggested implementation sequence within this branch)

1. Next.js scaffold + Tailwind 4 + folder structure (this commit + next)
2. Theme tokens (`base.css` + `tokens.ts`)
3. Static skeleton: `<main>` with all 8 component placeholders rendering text labels
4. Component 1 (Nav) — purely static
5. Component 5 (SocialIcons) + Component 7 (ScrollHint) — small, easy
6. Component 2 (HeroPortal) — SVG + ring + pulse animation
7. Component 4 (HeroCTA) — primary + secondary, no animations yet
8. Component 6 (SystemStatus) — static stats, then live pulse
9. Hero.tsx (compose 2/4/5/6/7)
10. Component 3 (PullThread) — drag handler + animation
11. Component 8 (BootSequence) — typewriter + skip + localStorage
12. Wire CTAs to PullThread + BootSequence actions
13. Mobile responsive pass (375px / 414px / 768px)
14. Reduced motion pass (test with OS preference set)
15. Lighthouse + axe pass — fix any failures
16. Final polish + screenshots for PR

Each step = 1 commit (or grouped if small).

---

## Open items deferred to later branches

- **Top nav: ABOUT/PROJECTS/EXPERIENCE/TRAVEL/SKILLS/CONTACT** anchor targets won't exist yet on Layer 1; clicks scroll to a placeholder section "Coming Soon" or to the Layer 2 dashboard area
- **Resume button** href = `#` (placeholder), real PDF added in v1.1 branch
- **LinkedIn URL** — user provides the exact URL via env var or component prop
- **AI orb** is Layer 2 — not in this branch
- **Layer 2 dashboard scroll target** — Layer 2 doesn't exist yet either; for this branch, scroll target is just `<section id="layer2-placeholder">` rendering a "Layer 2 will live here" message

---

## References

- Image: `docs/references/dark/landing-dark-03-cinematic-minimal-PREFERRED.png` (closest visual target)
- Anti-pattern: `docs/references/dark/landing-dark-02-dashboard-DENSE-anti-pattern.png` (what NOT to do)
- 3-layer model: `docs/ARCHITECTURE.md`
- Color system: `docs/DESIGN-SYSTEM.md`
- Photo fallback rule: SKILL.md → "Photo Fallback System" section
- Performance budget: SKILL.md → "Animation Rules" section
