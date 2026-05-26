# ADR 0003 — Three-layer experience model

**Status:** Accepted · **Date:** 2026-05-26

## Context

Original prompts (in `docs/requirements/prompts.txt`) describe a richly interactive cinematic experience: Jarvis HUD, terminal, train journey, vault doors, neural map, AI orb, particle backgrounds, boot sequence, etc. The user explicitly said: "landing page simpler, person images minimal, depth-on-scroll."

Reference image `landing-dark-02-dashboard-DENSE` shows what they explicitly DON'T want on the landing — too congested. Reference image `landing-dark-03-cinematic-minimal-PREFERRED` shows the target landing.

Options considered:
- (a) Dense Jarvis HUD from frame 1 (matches some prompts verbatim)
- (b) Pure minimalism, drop most interactions (matches "simpler" but loses differentiation)
- (c) Layered model — minimal surface, dense depth (synthesis)

## Decision

**(c) Three-layer experience model:**

- **Layer 1 (Surface / Landing)** — minimal cinematic, <100KB JS, restrained palette
- **Layer 2 (Dashboard)** — Jarvis HUD energy revealed on scroll, AI orb appears, vivid palette unlocks
- **Layer 3 (Deep dives)** — heavy animation OK (Three.js, particles), per-route code-split

## Why

Resolves the tension between contradictory requirements:
- "Landing simpler" + "futuristic AI command center" — both true, at different layers
- "Minimal person images" + "interactive AI universe" — both true, surface vs depth
- Recruiter 30-second scan + 5-minute deep dive — different visitors get what they need

**Performance follows the layering:**
- Layer 1 has hard <100KB JS budget — protects LCP for the first impression
- Layer 2 lazy-loads Framer Motion when in viewport — pays for the interaction only when discovered
- Layer 3 route-level code-splits Three.js / heavy assets — visitor who never opens Architecture Lab never downloads it

**Color follows the layering** (see ADR 0004):
- Layer 1 restrained palette (purple + cyan + white)
- Layer 2+ unlocks pink/magenta — depth-on-scroll applied to COLOR itself

## Consequences

**Good:**
- 30-second recruiter scan succeeds without sacrificing depth for engaged visitors
- Performance budgets become enforceable (each layer has hard limits)
- Bundle inclusion is determined by layer membership — easy to lint

**Trade-offs:**
- Component organization (`layer1/`, `layer2/`, `layer3/`) adds upfront discipline
- Components must NOT cross-import across layers (Layer 1 cannot use Framer Motion) — needs a lint rule
- Some interactions (AI orb) bridge layers — needs careful styling (purple+cyan glow safe for Layer 1, pink pulse for Layer 2 activation)

## Alternatives ruled out

- **Dense everywhere (a)** — fails 30-second recruiter scan, fails landing perf budget, contradicts user's "simpler" directive
- **Minimal everywhere (b)** — loses the AI engineer differentiation; portfolio becomes generic
