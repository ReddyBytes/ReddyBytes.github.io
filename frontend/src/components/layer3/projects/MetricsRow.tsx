/**
 * MetricsRow — 3-4 metric tiles showing project impact.
 *
 * Per LAYER3-PROJECTS.md "OutcomeMetrics" spec.
 * Big value (gradient text) + small label below.
 */
import type { ProjectMetric } from "@/lib/content/project-schema";

interface MetricsRowProps {
  metrics: readonly ProjectMetric[];
}

export function MetricsRow({ metrics }: MetricsRowProps) {
  if (metrics.length === 0) return null;

  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
      {metrics.map((m) => (
        <li
          key={m.label}
          className="rounded-lg border border-border-subtle bg-bg-elevated p-4 text-center"
        >
          <div
            className="bg-clip-text text-2xl font-bold text-transparent sm:text-3xl"
            style={{
              fontFamily: "var(--font-display)",
              backgroundImage:
                "linear-gradient(135deg, #ec4899 0%, #a855f7 50%, #22d3ee 100%)",
            }}
          >
            {m.value}
          </div>
          <div
            className="mt-1 text-[10px] font-medium tracking-widest text-text-tertiary uppercase sm:text-xs"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {m.label}
          </div>
        </li>
      ))}
    </ul>
  );
}
