/**
 * CaseStudyToc — sticky left-side table of contents for case study pages.
 *
 * Per LAYER3-PROJECTS.md spec:
 *   - Visible only on lg: (desktop)
 *   - IntersectionObserver tracks active section
 *   - Click → smooth-scroll to section
 *   - Reduced motion → instant scroll
 */
"use client";

import { useEffect, useState } from "react";

import { useReducedMotion } from "@/lib/motion/reducedMotion";

interface CaseStudyTocProps {
  sections: { id: string; label: string }[];
}

export function CaseStudyToc({ sections }: CaseStudyTocProps) {
  const [activeId, setActiveId] = useState<string | null>(
    sections[0]?.id ?? null,
  );
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 },
    );

    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sections]);

  const handleClick = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        block: "start",
      });
    }
  };

  if (sections.length === 0) return null;

  return (
    <nav
      aria-label="Case study sections"
      className="hidden lg:block lg:sticky lg:top-24 lg:self-start"
    >
      <p
        className="mb-3 text-[10px] font-bold tracking-widest text-accent-cyan uppercase"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        // contents
      </p>
      <ul className="flex flex-col gap-1.5">
        {sections.map((s) => {
          const active = s.id === activeId;
          return (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                onClick={handleClick(s.id)}
                className={`block border-l-2 px-3 py-1 text-xs tracking-wider uppercase transition-all ${
                  active
                    ? "border-accent-cyan text-text-primary"
                    : "border-border-subtle text-text-tertiary hover:border-accent-purple/60 hover:text-text-secondary"
                }`}
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {s.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
