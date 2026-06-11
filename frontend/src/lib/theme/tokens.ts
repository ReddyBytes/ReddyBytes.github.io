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

/** Layer 2 stats bar values (conservative defaults — edit me before merge). */
export const LAYER2_STATS = [
  { value: "5+", label: "YEARS" },
  { value: "12+", label: "PROJECTS" },
  { value: "2.5K", label: "COMMITS" },
  { value: "20+", label: "TECHNOLOGIES" },
] as const;

/** Layer 2 tech chips — 12 techs ordered by AI engineer relevance. */
export const LAYER2_TECH_CHIPS = [
  "Python",
  "FastAPI",
  "Airflow",
  "Kubernetes",
  "Docker",
  "PostgreSQL",
  "LangChain",
  "RAG",
  "LLMs",
  "Linux",
  "AWS",
  "Next.js",
] as const;

/** Layer 2 section cards — 6 cards, action-oriented titles. */
export const LAYER2_SECTION_CARDS = [
  {
    title: "SEE MY WORK",
    tease: "What I've shipped end-to-end",
    href: "/projects",
    icon: "projects" as const,
    gradient: "from-accent-cyan to-accent-purple",
  },
  {
    title: "TRACE MY PATH",
    tease: "Where I've worked + grown",
    href: "/experience",
    icon: "experience" as const,
    gradient: "from-accent-purple to-accent-pink",
  },
  {
    title: "EXPLORE THE LAB",
    tease: "Architectures I've designed",
    href: "/architecture-lab",
    icon: "lab" as const,
    gradient: "from-accent-pink to-accent-cyan",
  },
  {
    title: "WANDER WITH ME",
    tease: "Life beyond code",
    href: "/travel",
    icon: "travel" as const,
    gradient: "from-accent-purple to-accent-magenta",
  },
  {
    title: "CHECK MY STACK",
    tease: "What I know deeply",
    href: "/skills",
    icon: "skills" as const,
    gradient: "from-accent-magenta to-accent-cyan",
  },
  {
    title: "KNOW THE BUILDER",
    tease: "The story so far",
    href: "/about",
    icon: "about" as const,
    gradient: "from-accent-cyan to-accent-violet",
  },
] as const;

/** Layer 2 why-hire-me 3 bullets. */
export const LAYER2_WHY_HIRE_ME = [
  {
    headline: "Ship-fast engineer",
    tease: "Delivered Prepzy from 0 → production in <6 months",
  },
  {
    headline: "AI-curious",
    tease: "Building real RAG systems with FastAPI + FAISS + Gemini",
  },
  {
    headline: "Systems thinker",
    tease: "Plug-and-play architecture · Airflow · Kubernetes",
  },
] as const;
