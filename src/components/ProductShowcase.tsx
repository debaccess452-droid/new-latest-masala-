import React, { useState } from 'react';
import { Heart, ShoppingBag, Check, SlidersHorizontal, Sparkles } from 'lucide-react';
import {
  DISCOUNT_TIERS,
  formatINR,
  PACK_WEIGHTS,
  PackWeight,
  SPICE_PRODUCTS,
  SpiceProduct,
} from '../data/spices';
import {
  addToCart,
  computeDiscount,
  openCartDrawer,
  openProductModal,
  showToast,
  toggleWishlist,
  useWishlistIds,
} from '../store/shopStore';
import { ResilientImage } from './ResilientImage';

interface ProductCardProps {
  product: SpiceProduct;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [selectedWeight, setSelectedWeight] = useState<PackWeight>('100g');
  const [addedFeedback, setAddedFeedback] = useState(false);
  const wishlistIds = useWishlistIds();
  const isSaved = wishlistIds.includes(product.id);
  const currentPrice = product.pricing[selectedWeight];

  const handleAdd = () => {
    addToCart(product.id, selectedWeight, 1);
    setAddedFeedback(true);
    showToast(`Added ${product.name} (${selectedWeight}) to bag`);
    setTimeout(() => setAddedFeedback(false), 1200);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nowSaved = toggleWishlist(product.id);
    showToast(
      nowSaved
        ? `Saved ${product.name} to your spice list`
        : `Removed ${product.name} from saved list`
    );
  };

  return (
    <article className="group flex flex-col justify-between rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] transition-transform duration-200 hover:-translate-y-0.5">
      <div>
        {/* Product Image Container */}
        <div
          onClick={() => openProductModal(product)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              openProductModal(product);
            }
          }}
          role="button"
          tabIndex={0}
          aria-label={`View specifications for ${product.name}`}
          className="relative aspect-[4/3] w-full cursor-pointer overflow-hidden rounded-t-lg bg-[var(--color-surface-elevated)] border-b border-[var(--color-border)]"
        >
          <ResilientImage
            src={product.image}
            alt={`${product.name} — ${product.originRegion}`}
            fallbackTitle={product.name}
            fallbackSubtitle={product.hindi}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />

          {/* Wishlist Affordance Button (44px touch target) */}
          <button
            type="button"
            onClick={handleToggleWishlist}
            aria-label={isSaved ? `Remove ${product.name} from saved` : `Save ${product.name}`}
            className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-surface)]/95 text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] hover:text-[var(--color-secondary)] transition-colors duration-150 border border-[var(--color-border)] shadow-2xs"
          >
            <Heart
              className={`h-4 w-4 ${
                isSaved ? 'fill-[var(--color-secondary)] text-[var(--color-secondary)]' : ''
              }`}
            />
          </button>
        </div>

        {/* Clean Unboxed Metadata & Title */}
        <div className="p-4 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--color-text-muted)]">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-medium text-[var(--color-secondary)]">{product.hindi}</span>
              <span aria-hidden="true">·</span>
              <span>{product.originRegion}</span>
            </div>
            <span className="font-mono-num text-[11px]">{product.essentialOilRetention}</span>
          </div>

          <div className="mt-2 flex items-baseline justify-between gap-3">
            <h3 className="font-display text-lg sm:text-xl font-semibold text-[var(--color-text)] min-w-0">
              <button
                type="button"
                onClick={() => openProductModal(product)}
                className="text-left hover:text-[var(--color-primary)] transition-colors duration-150"
              >
                {product.name}
              </button>
            </h3>
            <div className="text-right shrink-0">
              <span className="font-mono-num text-lg sm:text-xl font-semibold text-[var(--color-text)]">
                {formatINR(currentPrice)}
              </span>
              <span className="block text-[11px] text-[var(--color-text-muted)]">
                for {selectedWeight}
              </span>
            </div>
          </div>

          <p className="mt-2 text-sm text-[var(--color-text-secondary)] leading-relaxed">
            {product.tagline}
          </p>

          <p className="mt-2.5 text-xs text-[var(--color-text-muted)]">
            Aroma profile:{' '}
            <span className="text-[var(--color-text-secondary)]">{product.aromaNotes}</span>
          </p>
        </div>
      </div>

      {/* Interactive Pack Weight Selector & Purchase Controls */}
      <div className="px-4 pb-4 sm:px-6 sm:pb-6 pt-3 border-t border-[var(--color-border)]/60">
        <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)] mb-2">
          <span>Select Pack Weight</span>
          <span className="font-mono-num">
            Starts at {formatINR(product.pricing['25g'])} (25g)
          </span>
        </div>

        {/* 6 Weight Pack Selector Buttons:
            3x2 comfortable touch grid on mobile/tablet, 6-column on xl desktop */}
        <div
          role="group"
          aria-label={`Select pack weight for ${product.name}`}
          className="grid grid-cols-3 xl:grid-cols-6 gap-1.5"
        >
          {PACK_WEIGHTS.map((weight) => {
            const isSelected = selectedWeight === weight;
            return (
              <button
                key={weight}
                type="button"
                onClick={() => setSelectedWeight(weight)}
                className={`min-h-[46px] rounded border py-1.5 px-2 text-center transition-colors duration-150 flex flex-col items-center justify-center ${
                  isSelected
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white font-semibold'
                    : 'border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-text)]'
                }`}
              >
                <span className="block text-xs leading-tight">{weight}</span>
                <span
                  className={`block font-mono-num text-[11px] leading-tight mt-0.5 ${
                    isSelected ? 'text-white/90' : 'text-[var(--color-text-muted)]'
                  }`}
                >
                  {formatINR(product.pricing[weight])}
                </span>
              </button>
            );
          })}
        </div>

        {/* Action Row (44px+ touch targets) */}
        <div className="mt-4 flex items-center gap-2">
          <button
            type="button"
            onClick={handleAdd}
            className="flex-1 inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg bg-[var(--color-primary)] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[var(--color-primary-dark)] transition-colors duration-150 whitespace-nowrap"
          >
            {addedFeedback ? (
              <>
                <Check className="h-4 w-4 shrink-0" />
                <span>Added {selectedWeight}</span>
              </>
            ) : (
              <>
                <ShoppingBag className="h-3.5 w-3.5 shrink-0" />
                <span>
                  Add to Bag · {formatINR(currentPrice)}
                </span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => openProductModal(product)}
            className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-xs font-semibold text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors duration-150 whitespace-nowrap shrink-0"
          >
            Details
          </button>
        </div>
      </div>
    </article>
  );
};

export const ProductShowcase: React.FC = () => {
  const [filterUse, setFilterUse] = useState<'all' | 'tadka' | 'gravies' | 'daily'>('all');
  const [bundleWeight, setBundleWeight] = useState<PackWeight>('200g');
  const [bundleAdded, setBundleAdded] = useState(false);

  const filteredProducts = SPICE_PRODUCTS.filter((p) => {
    if (filterUse === 'all') return true;
    if (filterUse === 'tadka') return p.id === 4 || p.id === 2;
    if (filterUse === 'gravies') return p.id === 2 || p.id === 3;
    if (filterUse === 'daily') return p.id === 1 || p.id === 3;
    return true;
  });

  // Calculate 4-spice bundle pricing & discount preview
  const bundleSubtotal = SPICE_PRODUCTS.reduce(
    (sum, p) => sum + p.pricing[bundleWeight],
    0
  );
  const bundleDiscount = computeDiscount(bundleSubtotal);
  const bundleNetTotal = bundleSubtotal - bundleDiscount.amount;

  const handleAddCompleteBundle = () => {
    SPICE_PRODUCTS.forEach((p) => {
      addToCart(p.id, bundleWeight, 1);
    });
    setBundleAdded(true);
    showToast(`Added all 4 KBR Spices (${bundleWeight} each) to your bag`);
    setTimeout(() => {
      setBundleAdded(false);
      openCartDrawer();
    }, 900);
  };

  return (
    <section
      id="spices"
      className="scroll-mt-16 border-b border-[var(--color-border)] bg-[var(--color-background)] py-14 sm:py-24"
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        {/* Section Header + Interactive Filter Controls */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between border-b border-[var(--color-border)] pb-6 sm:pb-8">
          <div>
            <p className="text-xs font-medium text-[var(--color-secondary)]">
              01. Single-Origin Spice Collection · शुद्ध मसाले
            </p>
            <h2 className="mt-2 font-display heading-section-fluid font-semibold tracking-tight text-[var(--color-text)]">
              The Four Foundations of the Indian Rasoi
            </h2>
            <p className="mt-2 max-w-2xl text-sm sm:text-base text-[var(--color-text-secondary)]">
              Instead of dozens of diluted blends, we focus exclusively on the four essential
              spices used in every Indian kitchen—milled fresh in 6 pack sizes from ₹8 to ₹500.
            </p>
          </div>

          {/* Interactive Filter Controls:
              2x2 comfortable grid on mobile (<sm), inline segmented bar on sm+ */}
          <div className="w-full sm:w-auto rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-1.5 sm:p-1 self-start lg:self-auto">
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-1.5">
              <span className="hidden md:inline-flex items-center gap-1 px-2.5 text-xs text-[var(--color-text-muted)]">
                <SlidersHorizontal className="h-3 w-3" />
                <span>Filter:</span>
              </span>
              {(
                [
                  { id: 'all', label: 'All 4 Staples' },
                  { id: 'daily', label: 'Daily Dal & Haldi' },
                  { id: 'gravies', label: 'Rich Gravies' },
                  { id: 'tadka', label: 'Ghee Tadka & Chaat' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFilterUse(tab.id)}
                  className={`min-h-[40px] sm:min-h-[36px] rounded-md px-3 py-2 sm:py-1.5 text-xs font-medium transition-colors duration-150 whitespace-nowrap truncate ${
                    filterUse === tab.id
                      ? 'bg-[var(--color-primary)] text-white font-semibold'
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product Grid: 1 column on mobile, 2 columns on md+ */}
        <div className="mt-8 sm:mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Complete 4-Spice Rasoi Pantry Reserve Builder + Tiered Bulk Savings
            Mobile stack order:
            Bundle title -> Haldi -> Lal Mirch -> Dhaniya -> Jeera -> Weight selection -> Discount -> Total -> Add Bundle */}
        <div
          id="reserve"
          className="scroll-mt-20 mt-12 sm:mt-16 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-8 lg:p-10"
        >
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
            {/* Left Column (7 cols on Desktop): Title, Description, Included Spices (Mobile), & Tiered Savings */}
            <div className="lg:col-span-7">
              <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--color-secondary)] font-medium">
                <Sparkles className="h-3.5 w-3.5 shrink-0" />
                <span>Complete Rasoi Pantry Reserve</span>
                <span aria-hidden="true">·</span>
                <span>Haldi + Lal Mirch + Dhaniya + Jeera</span>
              </div>

              <h3 className="mt-2 font-display heading-sub-fluid font-semibold text-[var(--color-text)]">
                Stock all 4 essential spices in one click &amp; unlock automatic tiered savings.
              </h3>

              <p className="mt-2 text-sm text-[var(--color-text-secondary)] leading-relaxed">
                Add one pack each of KBR Haldi, Red Chilli, Dhaniya, and Jeera Powder in your
                preferred household weight. Orders above ₹500 ship free across India, and larger
                pantry orders automatically unlock up to 40% off in your bag.
              </p>

              {/* Included 4 Spices Breakdown List (Shown here on Mobile & Desktop for clear hierarchy) */}
              <div className="mt-5 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-4">
                <p className="text-xs font-semibold text-[var(--color-text)] mb-2.5">
                  Included in Your 4-Spice Pantry Bundle ({bundleWeight} each):
                </p>
                <div className="divide-y divide-[var(--color-border)]/70">
                  {SPICE_PRODUCTS.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between gap-3 py-2.5 text-xs sm:text-sm"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <ResilientImage
                          src={p.image}
                          alt={p.name}
                          className="h-9 w-9 rounded object-cover shrink-0 border border-[var(--color-border)]"
                        />
                        <div className="min-w-0">
                          <p className="font-semibold text-[var(--color-text)] truncate">
                            {p.name}
                          </p>
                          <p className="text-[11px] text-[var(--color-text-muted)]">
                            {p.hindi} · 1 × {bundleWeight} pouch
                          </p>
                        </div>
                      </div>
                      <span className="font-mono-num font-semibold text-[var(--color-text)] shrink-0">
                        {formatINR(p.pricing[bundleWeight])}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tiered Discount Reference Bar (Desktop view) */}
              <div className="hidden lg:grid mt-5 grid-cols-3 gap-3 border-t border-[var(--color-border)] pt-5">
                {DISCOUNT_TIERS.slice()
                  .reverse()
                  .map((tier) => (
                    <div
                      key={tier.min}
                      className="rounded border border-[var(--color-border)] bg-[var(--color-background)] p-3"
                    >
                      <p className="font-mono-num text-sm font-semibold text-[var(--color-primary)]">
                        {tier.pct}% Automatic Off
                      </p>
                      <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">
                        On cart subtotal above {formatINR(tier.min)}
                      </p>
                    </div>
                  ))}
              </div>
            </div>

            {/* Right Column (5 cols on Desktop): Weight Selection -> Discount -> Total -> Add Bundle */}
            <div className="lg:col-span-5 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-4 sm:p-6">
              {/* Step 1: Weight Selection */}
              <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)]">
                <span className="font-semibold text-[var(--color-text)]">
                  Select Pack Weight (× 4 Spices)
                </span>
                <span className="font-mono-num">4 Pouches Total</span>
              </div>

              <div
                role="group"
                aria-label="Select bundle pack weight"
                className="mt-2.5 grid grid-cols-3 gap-2"
              >
                {PACK_WEIGHTS.map((weight) => {
                  const isSelected = bundleWeight === weight;
                  const packSum = SPICE_PRODUCTS.reduce(
                    (acc, p) => acc + p.pricing[weight],
                    0
                  );
                  return (
                    <button
                      key={weight}
                      type="button"
                      onClick={() => setBundleWeight(weight)}
                      className={`min-h-[48px] rounded border py-2 px-2 text-center transition-colors duration-150 flex flex-col items-center justify-center ${
                        isSelected
                          ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white font-semibold'
                          : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)]'
                      }`}
                    >
                      <span className="block text-xs">4 × {weight}</span>
                      <span
                        className={`block font-mono-num text-[11px] mt-0.5 ${
                          isSelected ? 'text-white/90' : 'text-[var(--color-text-muted)]'
                        }`}
                      >
                        {formatINR(packSum)}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Step 2: Discount & Delivery Rules Info */}
              <div className="mt-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-3.5 space-y-2 text-xs">
                <p className="font-semibold text-[var(--color-text)]">
                  Automatic Savings &amp; Delivery Rules:
                </p>
                <div className="space-y-1 text-[var(--color-text-secondary)]">
                  <div className="flex justify-between">
                    <span>Free Pan-India Delivery</span>
                    <span className="font-mono-num font-medium text-[var(--color-primary)]">
                      Orders ≥ ₹500 (₹40 below)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Kitchen Staple Tier</span>
                    <span className="font-mono-num">10% Off &gt; ₹1,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Household Bulk Tier</span>
                    <span className="font-mono-num">30% Off &gt; ₹1,500</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pantry Reserve Tier</span>
                    <span className="font-mono-num">40% Off &gt; ₹2,000</span>
                  </div>
                </div>
              </div>

              {/* Step 3: Total Calculation */}
              <div className="mt-4 border-t border-[var(--color-border)] pt-4 space-y-1.5">
                {bundleDiscount.pct > 0 && (
                  <div className="flex justify-between text-xs text-[var(--color-success)] font-medium">
                    <span>Automatic {bundleDiscount.pct}% Tier Discount</span>
                    <span className="font-mono-num">−{formatINR(bundleDiscount.amount)}</span>
                  </div>
                )}

                <div className="flex items-baseline justify-between gap-2">
                  <div>
                    <span className="text-xs font-semibold text-[var(--color-text)]">
                      4-Spice Bundle Total
                    </span>
                    <span className="block text-[11px] font-medium text-[var(--color-success)]">
                      {bundleNetTotal >= 500
                        ? 'Includes FREE Pan-India Delivery'
                        : 'Add to bag to combine for free delivery ₹500+'}
                    </span>
                  </div>
                  <span className="font-mono-num text-2xl font-semibold text-[var(--color-primary)] shrink-0">
                    {formatINR(bundleNetTotal)}
                  </span>
                </div>
              </div>

              {/* Step 4: Add Bundle Primary CTA */}
              <button
                type="button"
                onClick={handleAddCompleteBundle}
                className="mt-4 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-lg bg-[var(--color-primary)] py-3.5 px-4 text-xs sm:text-sm font-semibold text-white hover:bg-[var(--color-primary-dark)] transition-colors duration-150"
              >
                {bundleAdded ? (
                  <>
                    <Check className="h-4 w-4 shrink-0" />
                    <span>All 4 Spices Added to Bag</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-4 w-4 shrink-0" />
                    <span>
                      Add 4-Spice Bundle ({bundleWeight}) · {formatINR(bundleNetTotal)}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
