# ADR 0004 — Hybrid color palette (depth-on-scroll for color)

**Status:** Accepted · **Date:** 2026-05-26

## Context

Reference images show two distinct color treatments:
- **Image 4 (preferred landing)** — restrained: white name on deep navy, purple portal as dominant accent, cyan only on system status / scroll arrow / social icons
- **Image 1 (dashboard style)** — vivid: pink → magenta → purple → cyan gradient on name, more saturated everywhere

Options considered:
- (a) Use Image 4 palette everywhere (restrained throughout)
- (b) Use Image 1 palette everywhere (vivid throughout)
- (c) Hybrid — restrained on landing (Layer 1), vivid on Dashboard + Deep (Layer 2+)
- (d) Defer — placeholder tokens, user fills exact colors later

## Decision

**(c) Hybrid palette tied to the three-layer experience model (ADR 0003).**

- **Layer 1** uses restrained palette: purple `#a855f7` + cyan `#22d3ee` on deep navy `#08081a`, name in white with subtle purple gradient
- **Layer 2 & 3** unlock vivid palette: adds pink `#ec4899` + magenta `#d946ef`, name uses full pink→magenta→purple→cyan gradient

## Why

**Color participates in the depth-on-scroll storytelling.** The site teaches the visitor visually: "the surface is calm; complexity blooms below."

**Pink/magenta on landing breaks the calm promise.** Vivid colors on Layer 1 create the "DENSE" feeling the user explicitly rejected (image 2 anti-pattern).

**Both palettes are derived from real reference images, not invented.** Reduces design subjectivity and risk of mismatch.

## Hybrid rules (enforced)

1. Layer 1 components NEVER import pink/magenta tokens
2. Lint rule: `no-pink-in-layer1` checks token usage at build
3. AI Orb bridges layers: outer glow uses purple+cyan (landing-safe); inner pulse uses pink ONLY when active in Layer 2+
4. Max 2 accent colors per viewport on Layer 1; max 4 on Layer 2+
5. Neon glow only on focus/hover/active/inside-portal-motif. Never ambient page-wide.

## Consequences

**Good:**
- Visual storytelling matches narrative ("calm surface, dense depth")
- Designers/devs can't accidentally pollute Layer 1 with vivid tokens (lint enforces)
- Two reference images become two concrete palettes — zero ambiguity

**Trade-offs:**
- More tokens to maintain (Layer 1 + Layer 2 sets)
- Token swap mid-page (Layer 1 → Layer 2 boundary) must be smooth — done via CSS variables scoped by section

## Alternatives ruled out

- **Restrained everywhere (a)** — loses the "wow" energy that prompts asked for; visit feels flat
- **Vivid everywhere (b)** — creates the "DENSE" landing the user rejected; fails 30-second recruiter test
- **Defer (d)** — leaves color decisions to coding phase; risks misalignment late in build
