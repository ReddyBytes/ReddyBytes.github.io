# Layer 2 Design Spec — Dashboard / Discovery

> Locked design contract for the Layer 2 dashboard that unfolds after recruiter pulls thread / clicks ENTER THE SYSTEM. All decisions captured 2026-05-26 via 4 batches of design questions; this doc is the single source of truth before code is written.

> See [`docs/ARCHITECTURE.md`](../ARCHITECTURE.md) for the 3-layer experience model.
> See [`docs/design/LAYER1.md`](./LAYER1.md) for the Layer 1 spec it builds on.
> See [`docs/DESIGN-SYSTEM.md`](../DESIGN-SYSTEM.md) for color tokens.

---

## Goal of Layer 2

If Layer 1 is the **30-second first impression**, Layer 2 is the **5-minute exploration**. It must:

1. Let recruiter pick where to go next — six explorable section cards
2. Feel **alive and dense** — Jarvis HUD energy unlocks here (vivid palette allowed: pink/magenta/cyan/purple all in play)
3. Surface the **AI orb** for the first time — the signature AI engineer differentiator
4. Surface the **interactive terminal** — easter-egg invitation
5. Show **proof at a glance**: stats bar, tech chips, why-hire-me card

**Reference image:** `landing-dark-01-portal-with-stats.png` (dense, multi-panel, alive — Jarvis-like).
**v1 scope is UI shell only** — AI orb returns mocked JSON answers; real RAG wired in a later branch when backend is ready.

---

## Section order (top to bottom)

```
┌──────────────────────────────────────────────────────────────────────┐
│ TOP NAV (sticky, from Layer 1)                                       │
├──────────────────────────────────────────────────────────────────────┤
│                                                                       │
│           ┌──────────────┐                  ┌─────────────────┐     │
│  STATS    │ 5+   YRS    │  12+  PROJ      │ FLOATING:       │     │  ← Stats bar
│  BAR      │ 2.5K COMMITS│  20+  TECH      │ "Why hire me"   │     │
│           └──────────────┘                  │  • ship-fast    │     │
│                                             │  • AI-curious   │     │
│                                             │  • systems      │     │
│                                             │            [×]  │     │
│                                             └─────────────────┘     │
│                                                                       │
│  ╔══════════╗ ╔══════════╗ ╔══════════╗                              │
│  ║ ./projects║ ║./experience║ ║ ./arch  ║                            │  ← Section
│  ║ what I    ║ ║ where I    ║ ║ systems ║                            │     cards
│  ║ shipped   ║ ║ worked     ║ ║ designed║                            │     (3x2 grid)
│  ╚══════════╝ ╚══════════╝ ╚══════════╝                              │
│  ╔══════════╗ ╔══════════╗ ╔══════════╗                              │
│  ║ ./travel ║ ║ ./skills ║ ║ ./about  ║                              │
│  ║ life     ║ ║ what I   ║ ║ the story║                              │
│  ║ beyond   ║ ║ know     ║ ║ so far   ║                              │
│  ╚══════════╝ ╚══════════╝ ╚══════════╝                              │
│                                                                       │
│  ▶ PYTHON · FASTAPI · AIRFLOW · K8S · DOCKER · POSTGRES · ...        │  ← Tech chips
│    (auto-scrolls horizontally)                                       │     (row)
│                                                                       │
│  > _open terminal                              ┌──────────────┐      │
│                                                │  ◊ AI ORB   │      │  ← Terminal
│                                                │  (rotating  │      │     btn (bl)
│                                                │   crystal)  │      │     + Orb (br)
│                                                └──────────────┘      │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Component breakdown

Layer 2 has 6 visual components (numbered by build priority):

1. **Stats bar** — horizontal strip of 4 big numbers + small labels
2. **Section cards** (6) — vault-door themed grid, 3x2 desktop / 1 col mobile
3. **Tech chips row** — auto-scrolling icon+label chips
4. **Why-hire-me card** — floating top-right, dismissible
5. **AI Orb** — rotating neural crystal bottom-right, tap to expand into chat panel
6. **Terminal** — collapsed button bottom-left, expands to full panel

---

## 1. Stats bar

### Content (4 stats — conservative defaults, editable in `tokens.ts` before merge)
```
5+        12+         2.5K+        20+
YEARS     PROJECTS    COMMITS      TECHNOLOGIES
```

### Visual
- 4 equal columns, horizontal strip
- Big number: `4xl` (36px) font, `--font-display` Space Grotesk bold, vivid gradient (pink → cyan)
- Small label: `xs` (12px) font, mono, tracking-widest, `text-text-tertiary`
- Centered horizontally, max-w-5xl, ~80px tall
- Background: glassmorphism pill or simple bordered rect
- Hover on a stat: subtle scale-up + glow

### Animation
- Stagger fade-in-up on Layer 2 entry (60ms between stats)
- Optional: count-up animation deferred to v2 (perf cost not worth it for v1)

### Mobile
- 2x2 grid instead of 1x4, slightly smaller numbers

---

## 2. Section cards (the main thing)

### 6 cards, 3x2 grid (desktop) / 1 column (mobile)

| Order | Title (action-oriented) | Tease line | Route |
|---|---|---|---|
| 1 | `SEE MY WORK` | What I've shipped end-to-end | `/projects` |
| 2 | `TRACE MY PATH` | Where I've worked + grown | `/experience` |
| 3 | `EXPLORE THE LAB` | Architectures I've designed | `/architecture-lab` |
| 4 | `WANDER WITH ME` | Life beyond code | `/travel` |
| 5 | `CHECK MY STACK` | What I know deeply | `/skills` |
| 6 | `KNOW THE BUILDER` | The story so far | `/about` |

### Vault-door themed visual

Each card is a vault door. Default state: door is CLOSED (gradient + small lock icon), title visible. Hover: door cracks open ~10% revealing icon + tease line inside. Click: navigates to the route.

```
   CLOSED                       HOVER (door cracks open)
  ┌────────────┐                ┌────────────┐
  │ ╔════════╗ │                │ ╔════════╗ │
  │ ║        ║ │                │ ║ [icon] ║ │ ← peek inside
  │ ║ TITLE  ║ │      ───>      │ ║        ║ │
  │ ║ ◉      ║ │                │ ║ TITLE  ║ │
  │ ╚════════╝ │                │ ║ tease  ║ │
  └────────────┘                │ ╚════════╝ │
                                └────────────┘
```

### Card styling
- 240×280px desktop, 100%×220px mobile
- Background: `bg-bg-elevated` with subtle gradient overlay per card (unique color per section, drawn from full vivid palette)
- Border: 1px gradient stroke that changes color on hover
- Card unique colors:
  - Projects → cyan-purple
  - Experience → purple-pink (vivid signal: "career")
  - Architecture Lab → pink-cyan
  - Travel → purple-magenta
  - Skills → magenta-cyan
  - About → cyan-violet
- Lock icon (lucide Lock): top-right corner, hover → unlocks (animate to Unlock icon)
- Title: mono font, tracking-widest, white
- Tease: smaller, `text-text-secondary`, only visible on hover

### Animation
- Stagger fade-in-up on Layer 2 entry (100ms between cards)
- Hover: door cracks open via Framer Motion (translateY on inner panel + opacity on tease text)
- Active/pressed: subtle scale-down (0.98)
- Reduced motion: no door animation, hover just shows tease + accent color shift

### Mobile
- 1 column stack, full-width, taller cards (320px) to keep portrait-y aspect
- Tap (no hover) → tease visible permanently below title

---

## 3. Tech chips row

### 12 techs (AI engineer focus, ordered by relevance)
```
Python · FastAPI · Airflow · Kubernetes · Docker · PostgreSQL ·
LangChain · RAG · LLMs · Linux · AWS · Next.js
```

### Visual
- Each chip: 32px icon (lucide where possible, custom SVG for tech logos) + label, ~120px wide, 36px tall
- Pill shape: `rounded-full`, bordered, glassmorphism
- Hover: scale 1.05, border accent shift to matching tech color
- Background: very subtle gradient per chip (purple-cyan tint)

### Auto-scroll behavior
- Two duplicated rows scrolling left at constant 60s loop (infinite marquee)
- Pause on hover (any chip)
- Reduced motion: static row, user scrolls manually via touch / arrow keys

### Mobile
- Same auto-scroll, slightly smaller chips (28px height)
- Touch swipe takes over → pauses auto-scroll for 5s

---

## 4. Why-hire-me card

### Position
- Floating top-right of Layer 2 viewport, just below the nav
- Z-index above section cards but below modals
- Sticky-ish: visible on Layer 2 entry, hidden when scrolled past stats bar

### Content (3 bullets)
```
WHY HIRE ME

▸ Ship-fast engineer
  Delivered Prepzy from 0 → production in <6 months

▸ AI-curious
  Building real RAG systems with FastAPI + FAISS + Gemini

▸ Systems thinker
  Plug-and-play architecture · Airflow · Kubernetes
```

### Visual
- 280px wide card, ~200px tall, glassmorphism
- Top: small "WHY HIRE ME" label in cyan mono
- Bullets: triangle pointer + bold first line + light tease line
- Close button (X) top-right; dismissible
- On dismiss: `localStorage.setItem('hire_card_dismissed', 'true')` so it doesn't re-appear
- Subtle gradient border (purple → pink → cyan)

### Animation
- Slide in from right + fade in on Layer 2 entry
- Dismiss: fade out + slide right
- Pulse on first arrival (1 cycle) to draw attention

### Mobile
- Becomes a bottom-sheet card that pops up once when Layer 2 first enters viewport
- Tap-anywhere outside to dismiss + persist

---

## 5. AI Orb — rotating neural crystal

### Visual
- ~64px geometric crystal shape (icosahedron silhouette, SVG)
- Rotating wireframe overlay (CSS-only on Layer 2; if perf permits, Three.js in Layer 3 architecture-lab)
- Purple → cyan gradient fill on faces
- Pulsing halo behind it
- Position: bottom-right, 32px margin, fixed
- Emerges from sparkle particles on Layer 2 first-entry (Framer Motion)

### Tap behavior
- Tap → expands into bottom-right chat panel (~400px wide, ~60vh tall)
- Panel animation: scale from orb center outward, 400ms cubic-bezier
- Close button (X) top-right of panel
- Crystal becomes a small pulse-dot at top-left of panel (collapsed-state indicator)

### Chat panel content

#### Greeting (on first open)
```
◊ Hi — I'm Penchala's AI assistant.
  Ask me anything about his work, skills, or experience.
  
  (Mocked responses for v1 — real RAG coming soon.)
```

#### 6 suggested questions (chips below greeting)
1. *Tell me about Penchala* — recruiter
2. *Show me his Python projects* — recruiter
3. *What's his Kubernetes experience?* — recruiter
4. *Explain RAG-powered systems* — showcase
5. *What is he currently learning?* — personal brand
6. *Can he build LLM applications?* — freelance / skill-deep

#### Mocked response source
`content/ai-mocks.json`:
```json
{
  "questions": [
    {
      "id": "tell-me-about-penchala",
      "text": "Tell me about Penchala",
      "audience": "recruiter",
      "answer": "Penchala is a Software Engineer with 5+ years of Python backend experience..."
    },
    ...
  ]
}
```

#### Free-text input fallback
- Below suggested questions, an input box: *"Ask anything..."*
- On submit: keyword match against mocked answers; if no match, return generic *"Great question — I'm still learning to answer that. Try one of the suggestions above."*
- Streaming illusion: type characters into the response area at ~30ms/char (reuses `useTypewriter` hook from Layer 1)

### Reduced motion
- Orb static (no rotation, no halo pulse)
- Chat panel opens instantly (no scale animation)
- Streaming response shows all at once instead of typing

---

## 6. Interactive Terminal

### Collapsed state
- Bottom-left fixed button, ~140px wide × 36px tall
- Mono text: `> open terminal`
- Blinking underscore at end
- Hover: subtle glow + slight scale

### Expanded state
- 600px wide, 360px tall panel anchored bottom-left
- Dark mono background, opaque (not glass)
- Top bar: dots (●●●) + label "PENCHALA-OS · v1.0.0" + minimize/close buttons
- Body: scrollable terminal output area
- Bottom: input prompt `>` + blinking cursor + free-text input

### Supported commands (v1)
| Command | Output |
|---|---|
| `help` | Lists all commands |
| `projects` | Lists projects with one-liners + clickable github links |
| `skills` | Skills table grouped by category |
| `github` | Opens github.com/ReddyBytes in new tab (toast in terminal first) |
| `resume` | Toast: "Resume coming in v1.1 — for now check the Projects section" |
| `about` | Renders the same content as the About section card peek |
| `clear` | Wipes terminal output |
| `whoami` | `penchala_reddy@portfolio:~$ Software Engineer · AI Engineer` |
| `deploy engineer` | ASCII rocket + "Candidate deployment successful 🚀" (easter egg) |
| `hire now` | Same as deploy engineer (alias) |
| `kubectl get projects` | Kubectl-style table of projects |
| `python --skills` | Skills as `import` statements |
| (unknown) | `command not found: <cmd>. Type 'help' for commands.` |

### Visual
- Glassmorphism panel
- Border: subtle purple gradient
- Output text: text-text-secondary, mono
- Active line: text-accent-cyan-bright

### Animation
- Expand: scale-up from button position (400ms)
- Collapse: scale-down to button (300ms)
- Command response: typewriter effect for multi-line outputs (~30ms/char)
- Particle effect on `deploy engineer` easter egg (drift up from input)

### Reduced motion
- Instant expand/collapse
- No typewriter (all output appears at once)
- No particles

### Mobile
- Terminal becomes a full-screen modal instead of floating panel
- Tap "open terminal" pill → full-screen takeover
- Keyboard helper bar (suggested commands as chips) above the input

---

## Performance budgets (HARD LIMITS)

Layer 2 adds JS on top of Layer 1's 100KB. CI fails if exceeded:

| Metric | Budget |
|---|---|
| **JS bundle (Layer 1 + Layer 2 combined, gzip)** | < 250KB |
| **Total page weight (combined)** | < 1.5MB |
| **LCP** | < 3.0s |
| **CLS** | < 0.1 |
| **Lighthouse Performance** | ≥ 90 |
| **Lighthouse Accessibility** | 100 |

### How to stay under budget
- Framer Motion lazy-loaded via `next/dynamic` (~25KB gzip when loaded)
- Crystal SVG inline (~2KB), no Three.js on Layer 2
- Tech chip icons: lucide where possible (tree-shakable, ~1KB each)
- Terminal renders on-demand (collapsed until clicked)
- AI orb chat panel renders only when opened
- `content/ai-mocks.json` lazy-fetched on first orb open

---

## Color tokens used (Layer 2 unlocks the FULL vivid palette)

```css
/* Inherited from Layer 1 */
--bg-base · --bg-elevated · --bg-glass
--text-primary · --text-secondary · --text-tertiary
--accent-purple · --accent-cyan
--border-subtle

/* NEW for Layer 2 (per DESIGN-SYSTEM.md vivid section) */
--accent-pink: #ec4899          /* card borders, why-hire-me accents */
--accent-magenta: #d946ef       /* gradient stops */
--accent-pink-bright: #f472b6   /* hover states */

/* New gradients */
--gradient-stat: linear-gradient(135deg, #ec4899 0%, #22d3ee 100%)
                  /* stat bar big numbers */
--gradient-vivid-card: linear-gradient(135deg, #ec4899 0%, #a855f7 50%, #22d3ee 100%)
                       /* section card border on hover */
--gradient-tech-chip: linear-gradient(135deg, rgba(236,72,153,0.15) 0%, rgba(168,85,247,0.15) 100%)
                      /* chip background */
```

`globals.css` gets these tokens added under the existing `@theme inline {}` block.

---

## Folder layout (additions to `frontend/src/`)

```
frontend/src/
├── app/
│   └── page.tsx                # extends Layer 1 page with Layer 2 below
├── components/
│   ├── layer2/                 # NEW
│   │   ├── Layer2Dashboard.tsx # client orchestrator
│   │   ├── StatsBar.tsx
│   │   ├── SectionCards.tsx
│   │   ├── VaultCard.tsx       # single vault-door card
│   │   ├── TechChips.tsx
│   │   ├── WhyHireMeCard.tsx
│   │   ├── AIOrb.tsx           # orb visual + tap-to-expand
│   │   ├── ChatPanel.tsx       # the chat UI inside the orb
│   │   └── Terminal.tsx        # collapsed button + expanded panel
│   └── shared/                 # additions
│       └── (none for now)
├── lib/
│   ├── ai/                     # NEW
│   │   ├── mocks.ts            # loads + searches content/ai-mocks.json
│   │   └── types.ts            # MockQuestion, MockAnswer types
│   └── terminal/               # NEW
│       └── commands.ts         # command registry + handler functions
└── hooks/                      # NEW additions
    ├── useDismissible.ts       # localStorage-backed dismiss state
    └── useTerminal.ts          # terminal state (history, input, output)
```

Plus new content file:
```
content/
└── ai-mocks.json               # 6 suggested Q&A pairs + audience tags
```

---

## Dependencies needed (one new package)

```json
{
  "dependencies": {
    "framer-motion": "^12.0.0"
  }
}
```

Install with the public registry override:
```bash
cd frontend
npm install framer-motion --registry=https://registry.npmjs.org/
```

---

## Acceptance criteria (when is Layer 2 "done")

- [ ] All 6 components render on desktop (1440px) and mobile (375px)
- [ ] Stats bar shows 4 numbers, mobile becomes 2x2
- [ ] 6 vault-door section cards, hover cracks open peek, click navigates to placeholder route
- [ ] Tech chips auto-scroll horizontally, pause on hover, 12 chips visible across two rows
- [ ] Why-hire-me card floats top-right, dismissible, persists dismiss in localStorage
- [ ] AI orb: rotating neural crystal visible bottom-right, taps open chat panel
- [ ] Chat panel: greeting + 6 suggested questions + free text input + mocked responses
- [ ] Terminal: collapsed button bottom-left, click expands to panel, all 12 commands work
- [ ] All 4 easter egg commands work (`deploy engineer`, `hire now`, `kubectl get projects`, `python --skills`)
- [ ] `prefers-reduced-motion`: no orb rotation, no auto-scroll, instant panel transitions
- [ ] Pink/magenta tokens added to globals.css and used (Layer 2 unlocks vivid palette)
- [ ] Framer Motion is lazy-loaded — verify Layer 1 bundle didn't grow
- [ ] Lighthouse: Performance ≥ 90, Accessibility 100
- [ ] All new component files have file-level JSDoc

---

## Build order (suggested 14 steps inside this branch)

1. Install Framer Motion (you run command)
2. Add pink/magenta tokens to globals.css
3. `content/ai-mocks.json` — 6 mock Q&A pairs
4. `lib/ai/mocks.ts` + `lib/ai/types.ts`
5. `lib/terminal/commands.ts` — registry of 12 commands
6. `hooks/useDismissible.ts` + `hooks/useTerminal.ts`
7. `StatsBar.tsx` (simple, no animation)
8. `VaultCard.tsx` (single card) → `SectionCards.tsx` (grid)
9. `TechChips.tsx` (auto-scrolling row)
10. `WhyHireMeCard.tsx` (floating + dismissible)
11. `Terminal.tsx` (collapsed + expanded states)
12. `AIOrb.tsx` + `ChatPanel.tsx`
13. `Layer2Dashboard.tsx` (orchestrator)
14. Update `page.tsx` to render Layer 2 below Layer 1; update placeholder routes (`/projects`, etc.) as empty pages saying "Coming in v1.1"

Each step = 1 commit (or grouped if tiny).

---

## Open items deferred to later branches

- **Real RAG integration** — orb still uses mocks in this PR; real `/api/v1/ask` wiring happens in `feature/100-frontend-rag-integration` after backend AI-LEARNING-LOG Stages 1-9 ship
- **Layer 3 deep dives** — vault cards link to placeholder routes; real Projects/Experience/etc. pages built in `feature/100-frontend-layer3-*` branches
- **Live GitHub stats** — stats bar uses hardcoded values; build-time GitHub API fetch deferred to v1.1
- **Resume PDF** — terminal `resume` command shows placeholder; real PDF in v1.1

---

## References

- Image: `docs/references/dark/landing-dark-01-portal-with-stats.png` (Jarvis HUD energy reference)
- Anti-pattern: `docs/references/dark/landing-dark-02-dashboard-DENSE-anti-pattern.png` (too crowded — don't go this far even on Layer 2)
- 3-layer model: `docs/ARCHITECTURE.md`
- Color system: `docs/DESIGN-SYSTEM.md` (vivid palette section)
- Layer 1 spec: `docs/design/LAYER1.md`
