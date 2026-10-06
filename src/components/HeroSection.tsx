import React, { useState } from 'react';
import { ArrowRight, Plus, Check } from 'lucide-react';
import {
  BRAND_CONFIG,
  formatINR,
  HERO_IMAGE,
  SPICE_PRODUCTS,
} from '../data/spices';
import { addToCart, openProductModal, showToast } from '../store/shopStore';
import { ResilientImage } from './ResilientImage';

export const HeroSection: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [justAddedId, setJustAddedId] = useState<number | null>(null);
  const activeSpice = SPICE_PRODUCTS[selectedIndex];

  const handleQuickAdd = (productId: number, name: string) => {
    addToCart(productId, '100g', 1);
    setJustAddedId(productId);
    showToast(`Added ${name} (100g) to your bag`);
    setTimeout(() => {
      setJustAddedId((current) => (current === productId ? null : current));
    }, 1400);
  };

  return (
    <section
      id="top"
      className="relative border-b border-[var(--color-border)] bg-[var(--color-background)] pt-5 pb-12 sm:pt-12 sm:pb-20 lg:pt-16 lg:pb-24"
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        {/* Top Editorial Metadata Strip (Zero-Pill Unboxed Text) */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-2 border-b border-[var(--color-border)] pb-3.5 text-xs text-[var(--color-text-muted)]">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="font-semibold text-[var(--color-primary)]">
              {BRAND_CONFIG.company}
            </span>
            <span aria-hidden="true">·</span>
            <span>{BRAND_CONFIG.taglineHindi}</span>
            <span aria-hidden="true" className="hidden md:inline">
              ·
            </span>
            <span className="hidden md:inline">
              Direct-From-Mandi Single-Origin Spices
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono-num text-[11px] sm:text-xs text-[var(--color-text-secondary)]">
            <span>Free Delivery ₹500+</span>
            <span aria-hidden="true">·</span>
            <span>Up to 40% Pantry Reserve Off</span>
          </div>
        </div>

        {/* Main Asymmetric 12-Column Grid:
            Mobile flow: Text + CTAs -> Visual + Spice Switcher -> Quantitative Metrics
            Desktop flow: Left (7 cols) Text + CTAs + Metrics | Right (5 cols) Visual + Spice Switcher */}
        <div className="mt-6 sm:mt-10 lg:mt-12 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start lg:gap-12">
          {/* Left Column (7 cols): Value Proposition & Primary Action */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              <p className="text-xs font-medium text-[var(--color-secondary)] tracking-wide">
                Cold-Milled Below 42°C · Zero Synthetic Dyes · Sealed Fresh in India
              </p>

              <h1 className="mt-3 font-display heading-hero-fluid font-semibold tracking-tight text-[var(--color-text)]">
                Pure Indian kitchen spices, cold-ground to keep their{' '}
                <em className="italic font-normal text-[var(--color-primary)]">
                  living aroma
                </em>{' '}
                intact.
              </h1>

              <p className="mt-4 sm:mt-5 max-w-2xl text-sm sm:text-lg leading-relaxed text-[var(--color-text-secondary)]">
                Commercial high-speed mills scorch spices above 85°C, stripping away the
                volatile oils that give Indian cooking its soul. At{' '}
                <strong className="font-semibold text-[var(--color-text)]">
                  KBR Masale
                </strong>
                , we procure whole-harvest Haldi, Lal Mirch, Dhaniya, and Jeera directly
                from audited regional farms and slow-mill them in small batches—seedhe
                khet se, bina kisi milawat ke aapki rasoi tak.
              </p>

              {/* CTA Block: Full-width stacked on mobile, inline on sm+ */}
              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3">
                <a
                  href="#spices"
                  className="inline-flex min-h-[48px] items-center justify-center gap-2.5 rounded-lg bg-[var(--color-primary)] px-6 py-3.5 text-sm font-semibold text-white hover:bg-[var(--color-primary-dark)] transition-colors duration-150"
                >
                  <span>Explore the 4 Core Spices</span>
                  <ArrowRight className="h-4 w-4 shrink-0" />
                </a>

                <a
                  href="#reserve"
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-3.5 text-sm font-semibold text-[var(--color-text)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors duration-150"
                >
                  <span>Build 4-Spice Pantry Bundle</span>
                </a>
              </div>
            </div>

            {/* Desktop Quantitative Proof & Sourcing Ledger */}
            <div className="hidden lg:grid mt-12 grid-cols-4 gap-4 border-t border-[var(--color-border)] pt-6">
              <div>
                <p className="font-mono-num text-2xl font-semibold text-[var(--color-primary)]">
                  &lt; 42°C
                </p>
                <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                  Cold-grinding temp preserves essential oils
                </p>
              </div>
              <div>
                <p className="font-mono-num text-2xl font-semibold text-[var(--color-primary)]">
                  0.0%
                </p>
                <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                  Synthetic colours, starch, or anti-caking fillers
                </p>
              </div>
              <div>
                <p className="font-mono-num text-2xl font-semibold text-[var(--color-primary)]">
                  ₹8 – ₹500
                </p>
                <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                  6 pack weights from 25g trial to 1kg reserve
                </p>
              </div>
              <div>
                <p className="font-mono-num text-2xl font-semibold text-[var(--color-primary)]">
                  2–5 Days
                </p>
                <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                  Pan-India doorstep delivery · COD &amp; UPI
                </p>
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): Editorial Apothecary Showcase & Interactive Spice Tasting Switcher */}
          <div className="lg:col-span-5">
            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-3.5 sm:p-5">
              {/* Main 16:10 Editorial Still-Life with Active Spice Overlay */}
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded bg-[var(--color-surface-elevated)]">
                <ResilientImage
                  src={HERO_IMAGE}
                  alt="Handcrafted brass bowls of KBR Haldi, Lal Mirch, Dhaniya, and Jeera spices on soapstone"
                  fallbackTitle="KBR Masale Apothecary Collection"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2 text-white">
                  <div className="min-w-0">
                    <p className="text-[11px] text-white/80 truncate">
                      Single-Origin Indian Harvest · Batch 2610
                    </p>
                    <p className="font-display text-sm sm:text-base font-medium truncate">
                      Four Unadulterated Kitchen Staples
                    </p>
                  </div>
                  <span className="font-mono-num text-xs text-white/95 shrink-0">
                    100% Pure
                  </span>
                </div>
              </div>

              {/* Interactive 4-Spice Selector Tabs (Touch-friendly 44px height) */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)] mb-2">
                  <span>Inspect Harvest Lot</span>
                  <span className="font-mono-num">{activeSpice.batchCode}</span>
                </div>

                <div
                  role="tablist"
                  aria-label="Preview the 4 KBR core spices"
                  className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 rounded-lg bg-[var(--color-surface-elevated)] p-1.5"
                >
                  {SPICE_PRODUCTS.map((spice, idx) => {
                    const isSelected = idx === selectedIndex;
                    return (
                      <button
                        key={spice.id}
                        type="button"
                        role="tab"
                        aria-selected={isSelected}
                        onClick={() => setSelectedIndex(idx)}
                        className={`min-h-[42px] rounded-md py-2 px-2.5 text-center text-xs font-medium transition-colors duration-150 ${
                          isSelected
                            ? 'bg-[var(--color-surface)] text-[var(--color-primary)] font-semibold shadow-2xs'
                            : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
                        }`}
                      >
                        <span className="block truncate">
                          {spice.shortName.split(' ')[0]}
                        </span>
                        <span className="block text-[10px] opacity-75 sm:hidden">
                          {spice.hindi.split(' ')[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Active Spice Detail Preview Row — Responsive wrap on narrow mobile */}
                <div className="mt-3.5 border-t border-[var(--color-border)] pt-3.5">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => openProductModal(activeSpice)}
                      className="relative h-16 w-16 shrink-0 overflow-hidden rounded border border-[var(--color-border)] bg-[var(--color-surface-elevated)] group"
                      aria-label={`Inspect ${activeSpice.name}`}
                    >
                      <ResilientImage
                        src={activeSpice.image}
                        alt={activeSpice.name}
                        className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                      />
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs text-[var(--color-text-muted)]">
                        <span className="font-medium text-[var(--color-secondary)]">
                          {activeSpice.hindi}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="truncate">{activeSpice.originRegion}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => openProductModal(activeSpice)}
                        className="mt-0.5 text-left font-display text-base font-semibold text-[var(--color-text)] hover:text-[var(--color-primary)] block w-full truncate"
                      >
                        {activeSpice.name}
                      </button>
                      <p className="mt-0.5 text-xs text-[var(--color-text-secondary)] line-clamp-1">
                        {activeSpice.aromaNotes}
                      </p>
                    </div>
                  </div>

                  {/* Price & Quick Add Bar */}
                  <div className="mt-3 flex items-center justify-between gap-3 border-t border-[var(--color-border)]/60 pt-3">
                    <div>
                      <span className="font-mono-num text-base font-semibold text-[var(--color-text)]">
                        {formatINR(activeSpice.pricing['100g'])}
                      </span>
                      <span className="text-xs text-[var(--color-text-muted)]">
                        {' '}
                        / 100g pack (Starts ₹{activeSpice.pricing['25g']})
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleQuickAdd(activeSpice.id, activeSpice.name)}
                      className="inline-flex min-h-[42px] items-center justify-center gap-1.5 rounded-lg bg-[var(--color-primary)] px-4 py-2 text-xs font-semibold text-white hover:bg-[var(--color-primary-dark)] transition-colors duration-150 whitespace-nowrap shrink-0"
                    >
                      {justAddedId === activeSpice.id ? (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <Plus className="h-3.5 w-3.5" />
                          <span>Add 100g</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile & Tablet Quantitative Proof Ledger (Displayed after visual on <lg screens) */}
          <div className="grid lg:hidden grid-cols-2 sm:grid-cols-4 gap-3.5 border-t border-[var(--color-border)] pt-6">
            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-3.5">
              <p className="font-mono-num text-lg sm:text-xl font-semibold text-[var(--color-primary)]">
                &lt; 42°C
              </p>
              <p className="mt-1 text-xs text-[var(--color-text-secondary)] leading-snug">
                Cold-grinding preserves essential oils
              </p>
            </div>
            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-3.5">
              <p className="font-mono-num text-lg sm:text-xl font-semibold text-[var(--color-primary)]">
                0.0%
              </p>
              <p className="mt-1 text-xs text-[var(--color-text-secondary)] leading-snug">
                Synthetic colours or starch fillers
              </p>
            </div>
            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-3.5">
              <p className="font-mono-num text-lg sm:text-xl font-semibold text-[var(--color-primary)]">
                ₹8 – ₹500
              </p>
              <p className="mt-1 text-xs text-[var(--color-text-secondary)] leading-snug">
                6 pack weights from 25g to 1kg
              </p>
            </div>
            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-3.5">
              <p className="font-mono-num text-lg sm:text-xl font-semibold text-[var(--color-primary)]">
                2–5 Days
              </p>
              <p className="mt-1 text-xs text-[var(--color-text-secondary)] leading-snug">
                Pan-India delivery · COD &amp; UPI
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
