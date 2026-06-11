/**
 * SectionCards — the 3x2 grid of vault-door section cards.
 *
 * Per LAYER2.md spec. Reads card spec from tokens.ts so adding/removing/
 * re-ordering is a data change, not a layout change.
 */
import { VaultCard } from "@/components/layer2/VaultCard";
import { LAYER2_SECTION_CARDS } from "@/lib/theme/tokens";

export function SectionCards() {
  return (
    <section
      id="layer-2-cards"
      aria-label="Section navigation"
      className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
        {LAYER2_SECTION_CARDS.map((card, i) => (
          <VaultCard
            key={card.href}
            title={card.title}
            tease={card.tease}
            href={card.href}
            iconKey={card.icon}
            gradient={card.gradient}
            index={i}
          />
        ))}
      </div>
    </section>
  );
}
