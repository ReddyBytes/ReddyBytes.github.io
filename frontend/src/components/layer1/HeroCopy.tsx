/**
 * HeroCopy — the typographic block (greeting → name → role → description).
 *
 * Per LAYER1.md spec — Component 4 supporting content for Hero composition.
 * Pure server component, no interactivity. Animations are CSS-only
 * (animate-fade-in-up with staggered delays).
 *
 * Decisions encoded:
 *   - "HELLO, I'M" small greeting (mono, cyan)
 *   - "PENCHALA REDDY" — PENCHALA white, REDDY purple→cyan gradient
 *   - "Software Engineer · AI Engineer · Python Backend Developer"
 *   - 1-sentence description
 */

export function HeroCopy() {
  return (
    <div className="flex flex-col gap-6">
      <span
        className="animate-fade-in-up text-[13px] font-medium tracking-[0.2em] text-accent-cyan uppercase"
        style={{
          fontFamily: "var(--font-mono)",
          animationDelay: "0ms",
        }}
      >
        Hello, I&apos;m
      </span>

      <h1
        className="animate-fade-in-up font-bold leading-[0.95] tracking-tight"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(3.5rem, 9vw, 6rem)",
          animationDelay: "120ms",
        }}
      >
        <span className="block text-text-primary">PENCHALA</span>
        <span
          className="block bg-clip-text text-transparent"
          style={{
            backgroundImage:
              "linear-gradient(135deg, #f5f5f7 0%, #c084fc 50%, #a855f7 100%)",
          }}
        >
          REDDY
        </span>
      </h1>

      <p
        className="animate-fade-in-up text-base font-medium tracking-wide text-text-secondary uppercase sm:text-[18px]"
        style={{
          fontFamily: "var(--font-sans)",
          letterSpacing: "0.08em",
          animationDelay: "240ms",
        }}
      >
        Software Engineer{" "}
        <span className="text-accent-purple">·</span> AI Engineer{" "}
        <span className="text-accent-purple">·</span> Python Backend Developer
      </p>

      <p
        className="animate-fade-in-up max-w-xl text-base leading-relaxed text-text-secondary sm:text-lg"
        style={{
          fontFamily: "var(--font-sans)",
          animationDelay: "360ms",
        }}
      >
        I build intelligent backend systems and AI-powered solutions that solve
        real-world problems at scale.
      </p>
    </div>
  );
}
