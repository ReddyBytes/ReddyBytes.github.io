/**
 * BrandMark — "PR" stylized icon + full "PENCHALA REDDY" text.
 *
 * Used in: Nav (top-left). Per LAYER1.md spec.
 * Size variants: "lg" (default, nav) and "sm" (compact, footer/mobile).
 * Pure server component (no interactivity, no client-only APIs).
 */
import Link from "next/link";

interface BrandMarkProps {
  size?: "sm" | "lg";
  /** Hide the full name text, show just the PR icon (mobile nav). */
  iconOnly?: boolean;
}

export function BrandMark({ size = "lg", iconOnly = false }: BrandMarkProps) {
  const iconSize = size === "lg" ? "h-8 w-8" : "h-6 w-6";
  const fontSize = size === "lg" ? "text-sm" : "text-xs";

  return (
    <Link
      href="/"
      className="group flex items-center gap-3 transition-opacity hover:opacity-90"
      aria-label="Penchala Reddy — Home"
    >
      {/* PR icon — outlined gradient box with monogram inside */}
      <div
        className={`${iconSize} relative grid place-items-center rounded-md border border-accent-purple/40`}
        style={{
          background:
            "linear-gradient(135deg, rgba(168,85,247,0.12) 0%, rgba(34,211,238,0.08) 100%)",
        }}
      >
        <span
          className="font-display font-bold text-text-primary"
          style={{
            fontSize: size === "lg" ? "0.85rem" : "0.7rem",
            letterSpacing: "0.04em",
          }}
        >
          PR
        </span>
        {/* Subtle glow on hover */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-md opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            boxShadow: "0 0 12px rgba(168, 85, 247, 0.4)",
          }}
        />
      </div>

      {!iconOnly && (
        <span
          className={`${fontSize} font-medium tracking-widest text-text-primary uppercase`}
          style={{ fontFamily: "var(--font-display)" }}
        >
          Penchala Reddy
        </span>
      )}
    </Link>
  );
}
