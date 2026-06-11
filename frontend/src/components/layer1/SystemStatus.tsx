/**
 * SystemStatus — bottom-right glassmorphism panel.
 *
 * Layer 1 component 6. Per LAYER1.md spec:
 *   - SYSTEM STATUS label (cyan, 10px, bold tracking-widest)
 *   - ● ONLINE pulsing green dot
 *   - 3 stat rows: Python · AI/RAG · Production
 *   - Hidden on mobile (< 768px); replaced by inline ● ONLINE pill in nav
 *     (note: Layer 2 will add the inline mobile pill; Layer 1 just hides this)
 *
 * Pure server component, glassmorphism + CSS pulse animation.
 */
import { SYSTEM_STATUS } from "@/lib/theme/tokens";

export function SystemStatus() {
  return (
    <aside
      className="animate-fade-in-up glass hidden w-[220px] rounded-lg p-3 md:block"
      style={{
        animationDelay: "720ms",
        fontFamily: "var(--font-mono)",
      }}
      aria-label="System status"
    >
      <div className="mb-2 text-[10px] font-bold tracking-widest text-accent-cyan uppercase">
        System status
      </div>

      <div className="mb-3 flex items-center gap-2">
        <span
          className="animate-status-pulse h-2 w-2 rounded-full"
          style={{ background: "#10b981" }}
          aria-hidden="true"
        />
        <span className="text-[11px] font-medium tracking-wider text-text-primary uppercase">
          Online
        </span>
      </div>

      <ul className="flex flex-col gap-1.5">
        {SYSTEM_STATUS.map((row) => (
          <li
            key={row.label}
            className="flex items-baseline justify-between text-[11px] tracking-wider"
          >
            <span className="text-text-tertiary uppercase">{row.label}</span>
            <span className="text-text-primary">{row.value}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
