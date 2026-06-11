/**
 * Nav — top navigation bar (Layer 1, component 1).
 *
 * Per LAYER1.md spec:
 *   - Brand mark (PR icon + name) on left
 *   - 7 nav items (HOME · ABOUT · PROJECTS · EXPERIENCE · TRAVEL · SKILLS · CONTACT)
 *   - RESUME button on right (placeholder for v1, real PDF in v1.1)
 *   - Sticky on scroll, glassmorphism background
 *   - Mobile: hamburger → fullscreen drawer
 *
 * Client component — needs useState for mobile drawer toggle. The drawer is
 * the only client-side interactivity here; nav is otherwise static.
 */
"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { BrandMark } from "@/components/shared/BrandMark";
import { NAV_ITEMS } from "@/lib/theme/tokens";

export function Nav() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <header
      className="fixed inset-x-0 top-0 z-40 glass"
      style={{
        // glassmorphism with gradient bottom-border accent
        borderBottom: "1px solid var(--color-border-subtle)",
      }}
    >
      <nav
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
        aria-label="Primary"
      >
        <BrandMark />

        {/* Desktop nav items */}
        <ul className="hidden items-center gap-7 md:flex">
          {NAV_ITEMS.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className="text-[13px] font-medium tracking-wider text-text-secondary uppercase transition-colors hover:text-accent-cyan"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right-side: Resume button (desktop) + hamburger (mobile) */}
        <div className="flex items-center gap-3">
          <Link
            href="#resume"
            className="hidden rounded-md border border-accent-cyan/50 px-4 py-2 text-[13px] font-semibold tracking-wider text-accent-cyan uppercase transition-all hover:bg-accent-cyan/10 hover:border-accent-cyan md:inline-block"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Resume
          </Link>

          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="grid h-10 w-10 place-items-center rounded-md border border-border-subtle md:hidden"
            aria-label="Open menu"
            aria-expanded={drawerOpen}
            aria-controls="mobile-drawer"
          >
            <Menu className="h-5 w-5 text-text-primary" />
          </button>
        </div>
      </nav>

      {/* Mobile drawer — fullscreen overlay */}
      {drawerOpen && (
        <div
          id="mobile-drawer"
          className="fixed inset-0 z-50 bg-bg-base/98 md:hidden"
          style={{ backdropFilter: "blur(20px)" }}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <div className="flex h-16 items-center justify-between px-4">
            <BrandMark iconOnly />
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="grid h-10 w-10 place-items-center rounded-md border border-border-subtle"
              aria-label="Close menu"
            >
              <X className="h-5 w-5 text-text-primary" />
            </button>
          </div>

          <ul className="mt-8 flex flex-col gap-2 px-4">
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  onClick={() => setDrawerOpen(false)}
                  className="block rounded-md px-4 py-3 text-base font-medium tracking-wider text-text-primary uppercase transition-colors hover:bg-bg-elevated"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="mt-4">
              <Link
                href="#resume"
                onClick={() => setDrawerOpen(false)}
                className="block rounded-md border border-accent-cyan/50 px-4 py-3 text-center text-base font-semibold tracking-wider text-accent-cyan uppercase"
              >
                Resume
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
