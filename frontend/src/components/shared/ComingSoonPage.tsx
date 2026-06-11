/**
 * Placeholder page for each Layer 3 deep-dive section.
 *
 * Real content (Projects, Experience, Architecture Lab, Travel, Skills, About)
 * built in `feature/100-frontend-layer3-*` branches as each section ships.
 * This shared placeholder gives the Layer 2 vault cards a valid route to land
 * on in v1 — recruiters see "Coming in v1.1" instead of a 404.
 */
import Link from "next/link";

interface PlaceholderProps {
  title: string;
  tease: string;
}

export function ComingSoonPage({ title, tease }: PlaceholderProps) {
  return (
    <main className="grid min-h-screen place-items-center bg-bg-base px-4 pt-24">
      <div className="text-center">
        <p
          className="mb-2 text-[10px] font-bold tracking-widest text-accent-pink-bright uppercase"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          // layer 3
        </p>
        <h1
          className="text-4xl font-bold tracking-tight text-text-primary sm:text-5xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {title}
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm text-text-secondary sm:text-base">
          {tease}
        </p>
        <p className="mt-6 text-xs text-text-tertiary">Coming in v1.1.</p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-md border border-accent-cyan/50 px-4 py-2 text-xs font-semibold tracking-widest text-accent-cyan uppercase transition-all hover:bg-accent-cyan/10"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          ← Back to home
        </Link>
      </div>
    </main>
  );
}
