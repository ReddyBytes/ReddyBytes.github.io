/**
 * Theme tokens — TypeScript constants mirroring CSS custom properties.
 *
 * Single source of truth for colors used in TS code (e.g. inline styles for
 * dynamic SVG colors, programmatic gradients). The matching CSS variables
 * live in src/app/globals.css @theme inline {} block.
 *
 * Layer 1 only — pink/magenta tokens deferred to Layer 2+.
 */

export const colors = {
  bg: {
    base: "#08081a",
    elevated: "#0f0f24",
    glass: "rgba(168, 85, 247, 0.04)",
  },
  text: {
    primary: "#f5f5f7",
    secondary: "#b4b4c8",
    tertiary: "#6b6b80",
  },
  accent: {
    purple: "#a855f7",
    purpleBright: "#c084fc",
    purpleDeep: "#7c3aed",
    violet: "#8b5cf6",
    cyan: "#22d3ee",
    cyanBright: "#67e8f9",
  },
  border: {
    subtle: "rgba(255, 255, 255, 0.08)",
    purpleFaint: "rgba(168, 85, 247, 0.2)",
    cyanFaint: "rgba(34, 211, 238, 0.2)",
  },
  // Status / system
  online: "#10b981",
} as const;

export const fonts = {
  sans: "var(--font-inter), system-ui, sans-serif",
  mono: "var(--font-jetbrains-mono), monospace",
  display: "var(--font-space-grotesk), system-ui, sans-serif",
} as const;

/** Spec-locked nav items rendered in the top bar (LAYER1.md). */
export const NAV_ITEMS = [
  { label: "HOME", href: "#top" },
  { label: "ABOUT", href: "#about" },
  { label: "PROJECTS", href: "#projects" },
  { label: "EXPERIENCE", href: "#experience" },
  { label: "TRAVEL", href: "#travel" },
  { label: "SKILLS", href: "#skills" },
  { label: "CONTACT", href: "#contact" },
] as const;

/** Bottom-right system status panel rows (LAYER1.md spec). */
export const SYSTEM_STATUS = [
  { label: "PYTHON", value: "5+ YR" },
  { label: "AI/RAG", value: "LEARNING" },
  { label: "PRODUCTION", value: "DEPLOYED" },
] as const;

/** Boot sequence text (5 lines + final ready, LAYER1.md spec). */
export const BOOT_LINES = [
  "INITIALIZING ENGINEER PROFILE...",
  "Loading Python runtime...",
  "Loading AI systems...",
  "Loading Kubernetes clusters...",
  "Loading neural architectures...",
  "Profile ready.",
] as const;
