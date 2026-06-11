/**
 * SkillsLegend — small legend bottom-right of the map.
 *
 * Shows the 3 category colors.
 */
export function SkillsLegend() {
  const items = [
    { label: "Languages", color: "#22d3ee" },
    { label: "Systems", color: "#a855f7" },
    { label: "AI / ML", color: "#ec4899" },
  ];

  return (
    <div
      className="pointer-events-none absolute bottom-4 right-4 z-10 flex flex-col gap-2 rounded-lg border border-border-subtle bg-bg-elevated/80 px-3 py-2 backdrop-blur"
      aria-hidden="true"
    >
      <p
        className="text-[9px] font-bold tracking-widest text-text-tertiary uppercase"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        // legend
      </p>
      <ul className="flex flex-col gap-1">
        {items.map((item) => (
          <li
            key={item.label}
            className="flex items-center gap-2 text-[10px] text-text-secondary"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: item.color }}
            />
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
