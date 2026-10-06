import React, { useState } from 'react';
import { MessageCircle, Plus, Check } from 'lucide-react';
import {
  BRAND_CONFIG,
  CRAFT_PILLARS,
  CRAFT_STORY_IMAGE,
  CULINARY_DISHES,
  formatINR,
  getProductById,
} from '../data/spices';
import { addToCart, buildWhatsAppUrl, openProductModal, showToast } from '../store/shopStore';
import { ResilientImage } from './ResilientImage';

export const CraftAndCulinarySection: React.FC = () => {
  const [activeDishIndex, setActiveDishIndex] = useState(0);
  const [dishAdded, setDishAdded] = useState(false);

  const activeDish = CULINARY_DISHES[activeDishIndex];

  const handleAddRecipeSpices = () => {
    activeDish.spiceFormula.forEach((item) => {
      addToCart(item.productId, '100g', 1);
    });
    setDishAdded(true);
    showToast(`Added ${activeDish.spiceFormula.length} spices for ${activeDish.title} (100g each)`);
    setTimeout(() => setDishAdded(false), 1400);
  };

  return (
    <>
      {/* SECTION 02: COLD-GRINDING CRAFT & ORIGIN STORY */}
      <section
        id="craft"
        className="scroll-mt-16 border-b border-[var(--color-border)] bg-[var(--color-primary-dark)] text-[#F6F4EF] py-14 sm:py-24"
      >
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start lg:gap-12">
            {/* Left Column: Documentary Craft Story & Visual */}
            <div className="lg:col-span-5">
              <p className="text-xs font-medium text-[#E5B869] tracking-wide">
                02. The Cold-Grinding Standard · हमारी कहानी
              </p>
              <h2 className="mt-2 font-display heading-section-fluid font-semibold tracking-tight text-white">
                Small Brand. Uncompromising Purity Standards.
              </h2>
              <p className="mt-4 text-sm sm:text-base text-[#D5DDD8] leading-relaxed">
                An authentic initiative by{' '}
                <strong className="font-semibold text-white">{BRAND_CONFIG.company}</strong>, KBR
                Masale was founded to restore the aroma, natural pigment, and therapeutic richness
                of traditional Indian spices—without synthetic dyes or commercial shortcuts.
              </p>

              {/* Documentary Craft Image Card */}
              <div className="mt-6 overflow-hidden rounded-lg border border-white/15 bg-[#1B3B2B]">
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <ResilientImage
                    src={CRAFT_STORY_IMAGE}
                    alt="Traditional slow stone-grinding and artisanal sorting of whole Indian spices"
                    fallbackTitle="Seedhe Khet Se Aapki Rasoi Tak"
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                  <div className="absolute bottom-3.5 left-4 right-4 text-white">
                    <p className="font-display text-sm sm:text-base font-medium">
                      &ldquo;{BRAND_CONFIG.taglineHindi}&rdquo;
                    </p>
                    <p className="mt-0.5 text-xs text-white/80">
                      Seedhe khet se aapki rasoi tak — shuddhata aur behtareen rang ka vada.
                    </p>
                  </div>
                </div>

                <div className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 border-t border-white/10 text-xs text-[#D5DDD8]">
                  <span>Direct Helpline: {BRAND_CONFIG.whatsappDisplay}</span>
                  <a
                    href={buildWhatsAppUrl(
                      'Namaste! I would like to know more about KBR Masale sourcing and purity.'
                    )}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-[38px] sm:min-h-0 items-center gap-1.5 font-semibold text-[#E5B869] hover:underline"
                  >
                    <MessageCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>Ask Our Sourcing Team</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column: 4 Numbered Craft Pillars (Clean Human Editorial Numbering) */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {CRAFT_PILLARS.map((pillar) => (
                <div
                  key={pillar.index}
                  className="flex flex-col justify-between rounded-lg border border-white/15 bg-[#1B3B2B]/90 p-5 sm:p-6"
                >
                  <div>
                    <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-white/10 pb-3">
                      <span className="font-display text-xl font-semibold text-[#E5B869]">
                        {pillar.index}
                      </span>
                      <span className="font-mono-num text-xs text-[#D5DDD8]">
                        {pillar.metric}
                      </span>
                    </div>
                    <h3 className="mt-4 font-display text-lg font-semibold text-white">
                      {pillar.title}
                    </h3>
                    <p className="mt-2 text-sm text-[#D5DDD8] leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>

                  <p className="mt-5 pt-3 border-t border-white/10 text-xs text-[#E5B869]">
                    {pillar.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 03: CULINARY PAIRING & TADKA FORMULA MATRIX */}
      <section
        id="pairings"
        className="scroll-mt-16 border-b border-[var(--color-border)] bg-[var(--color-surface)] py-14 sm:py-24"
      >
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between border-b border-[var(--color-border)] pb-6 sm:pb-8">
            <div>
              <p className="text-xs font-medium text-[var(--color-secondary)]">
                03. Culinary Tadka Guide · रसोई के अनुपात
              </p>
              <h2 className="mt-2 font-display heading-section-fluid font-semibold tracking-tight text-[var(--color-text)]">
                Exact Spice Proportions for Everyday Indian Dishes
              </h2>
              <p className="mt-2 max-w-2xl text-sm sm:text-base text-[var(--color-text-secondary)]">
                Because cold-milled spices retain their full essential oil concentration, a measured
                spoonful delivers deeper colour and aroma. Select a classic dish below to view its
                tadka ratio.
              </p>
            </div>

            {/* Dish Selector Tabs: 2x2 grid on mobile for easy 44px tapping, horizontal on sm+ */}
            <div
              role="tablist"
              aria-label="Select a classic Indian recipe"
              className="w-full sm:w-auto grid grid-cols-2 sm:flex sm:flex-wrap gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-1.5 sm:p-1 self-start lg:self-auto"
            >
              {CULINARY_DISHES.map((dish, idx) => {
                const isSelected = idx === activeDishIndex;
                return (
                  <button
                    key={dish.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => setActiveDishIndex(idx)}
                    className={`min-h-[42px] sm:min-h-[38px] rounded-md px-3 py-2 text-xs font-medium transition-colors duration-150 whitespace-nowrap truncate ${
                      isSelected
                        ? 'bg-[var(--color-primary)] text-white font-semibold'
                        : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
                    }`}
                  >
                    {dish.title.split(' ').slice(-2).join(' ')}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Dish Formula Breakdown */}
          <div className="mt-8 grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-5 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-5 sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--color-text-muted)]">
                <span className="font-medium text-[var(--color-secondary)]">
                  {activeDish.hindiTitle} · {activeDish.course}
                </span>
                <span className="font-mono-num">Prep: {activeDish.prepTime}</span>
              </div>

              <h3 className="mt-2 font-display heading-sub-fluid font-semibold text-[var(--color-text)]">
                {activeDish.title}
              </h3>

              <div className="mt-4 border-t border-[var(--color-border)] pt-4">
                <p className="text-xs font-semibold text-[var(--color-text)]">
                  Tadka &amp; Roasting Technique
                </p>
                <p className="mt-1.5 text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  {activeDish.tadkaTechnique}
                </p>
              </div>

              <div className="mt-4 border-t border-[var(--color-border)] pt-4">
                <p className="text-xs font-semibold text-[var(--color-text)]">
                  Sensory Notes
                </p>
                <p className="mt-1 text-xs text-[var(--color-text-secondary)] leading-relaxed">
                  {activeDish.flavorProfile}
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddRecipeSpices}
                className="mt-6 flex min-h-[46px] w-full items-center justify-center gap-2 rounded-lg bg-[var(--color-primary)] py-3 px-4 text-xs sm:text-sm font-semibold text-white hover:bg-[var(--color-primary-dark)] transition-colors duration-150"
              >
                {dishAdded ? (
                  <>
                    <Check className="h-4 w-4 shrink-0" />
                    <span>Recipe Spices Added to Bag</span>
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 shrink-0" />
                    <span>
                      Add All {activeDish.spiceFormula.length} Required Spices (100g Each)
                    </span>
                  </>
                )}
              </button>
            </div>

            {/* Right Column: Required Spice Formula Cards */}
            <div className="lg:col-span-7 space-y-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--color-text-muted)]">
                <span>KBR Spice Ratio (Serves 4)</span>
                <span>Tap any spice to inspect or add individually</span>
              </div>

              {activeDish.spiceFormula.map((item) => {
                const product = getProductById(item.productId);
                if (!product) return null;
                return (
                  <div
                    key={product.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4 hover:border-[var(--color-primary)] transition-colors duration-150"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <button
                        type="button"
                        onClick={() => openProductModal(product)}
                        className="h-14 w-14 shrink-0 overflow-hidden rounded border border-[var(--color-border)] bg-[var(--color-surface-elevated)]"
                        aria-label={`Inspect ${product.name}`}
                      >
                        <ResilientImage
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      </button>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
                          <span className="font-mono-num font-semibold text-[var(--color-primary)]">
                            {item.proportion}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>{product.hindi}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => openProductModal(product)}
                          className="font-display text-base font-semibold text-[var(--color-text)] hover:text-[var(--color-primary)] text-left truncate block w-full"
                        >
                          {product.name}
                        </button>
                        <p className="text-xs text-[var(--color-text-secondary)]">
                          Role: {item.role}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 border-[var(--color-border)]/60 pt-3 sm:pt-0 shrink-0">
                      <span className="font-mono-num text-xs font-medium text-[var(--color-text-secondary)]">
                        {formatINR(product.pricing['100g'])} / 100g
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          addToCart(product.id, '100g', 1);
                          showToast(`Added ${product.name} (100g) to bag`);
                        }}
                        className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3.5 py-2 text-xs font-semibold text-[var(--color-text)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-colors duration-150 whitespace-nowrap"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Add 100g</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
