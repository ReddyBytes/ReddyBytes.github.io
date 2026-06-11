/**
 * ProjectFooter — prev/next project nav at the bottom of every case study.
 *
 * Loops: last project's "next" wraps to first; first's "prev" wraps to last.
 */
import { ArrowLeft, ArrowRight, FolderOpen } from "lucide-react";
import Link from "next/link";

interface ProjectFooterProps {
  prevSlug: string;
  prevTitle: string;
  nextSlug: string;
  nextTitle: string;
}

export function ProjectFooter({
  prevSlug,
  prevTitle,
  nextSlug,
  nextTitle,
}: ProjectFooterProps) {
  return (
    <footer className="mx-auto mt-16 max-w-5xl border-t border-border-subtle px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex justify-center">
        <Link
          href="/projects/"
          className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-text-secondary uppercase transition-colors hover:text-accent-cyan"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          <FolderOpen className="h-3.5 w-3.5" />
          All projects
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Link
          href={`/projects/${prevSlug}/`}
          className="group rounded-lg border border-border-subtle bg-bg-elevated p-4 text-left transition-all hover:-translate-y-px hover:border-accent-purple/60"
        >
          <div className="flex items-center gap-2 text-[10px] font-medium tracking-widest text-text-tertiary uppercase">
            <ArrowLeft className="h-3 w-3" />
            Previous
          </div>
          <div className="mt-1 text-sm font-semibold text-text-primary group-hover:text-accent-cyan">
            {prevTitle}
          </div>
        </Link>

        <Link
          href={`/projects/${nextSlug}/`}
          className="group rounded-lg border border-border-subtle bg-bg-elevated p-4 text-right transition-all hover:-translate-y-px hover:border-accent-cyan/60"
        >
          <div className="flex items-center justify-end gap-2 text-[10px] font-medium tracking-widest text-text-tertiary uppercase">
            Next
            <ArrowRight className="h-3 w-3" />
          </div>
          <div className="mt-1 text-sm font-semibold text-text-primary group-hover:text-accent-cyan">
            {nextTitle}
          </div>
        </Link>
      </div>
    </footer>
  );
}
