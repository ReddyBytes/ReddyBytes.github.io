/**
 * PageHeader — eyebrow + title + tagline header.
 *
 * Reused by all Layer 3 pages for visual consistency.
 * Pure server component, no interactivity.
 */
import type { ReactNode } from "react";

interface PageHeaderProps {
  /** Small uppercase label above the title (e.g., "// shipped"). */
  eyebrow: string;
  /** Main page title. */
  title: string;
  /** Subtitle / tagline below the title. */
  tagline?: ReactNode;
}

export function PageHeader({ eyebrow, title, tagline }: PageHeaderProps) {
  return (
    <header className="mx-auto max-w-7xl px-4 pt-24 pb-8 sm:px-6 sm:pt-32 sm:pb-12 lg:px-8">
      <p
        className="mb-2 text-[10px] font-bold tracking-widest text-accent-pink-bright uppercase"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {eyebrow}
      </p>
      <h1
        className="text-4xl font-bold tracking-tight text-text-primary sm:text-5xl"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {title}
      </h1>
      {tagline && (
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-text-secondary sm:text-lg">
          {tagline}
        </p>
      )}
    </header>
  );
}
