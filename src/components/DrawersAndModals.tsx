import React, { useState, useEffect } from 'react';
import {
  X,
  Heart,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  MessageCircle,
  Check,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import {
  BRAND_CONFIG,
  formatINR,
  PACK_WEIGHTS,
  PackWeight,
} from '../data/spices';
import {
  addToCart,
  buildWhatsAppUrl,
  closeCartDrawer,
  closePolicyModal,
  closeProductModal,
  closeWishlistDrawer,
  getCartSummary,
  openCheckoutModal,
  openProductModal,
  removeFromCart,
  showToast,
  toggleWishlist,
  updateCartQty,
  useCartItems,
  useUIState,
  useWishlistIds,
  useWishlistProducts,
} from '../store/shopStore';
import { ResilientImage } from './ResilientImage';

// =========================================================
// 1. PRODUCT QUICK-VIEW & CONTIGUOUS PURCHASE MODAL
// =========================================================
export const ProductDetailModal: React.FC = () => {
  const { productModal } = useUIState();
  const wishlistIds = useWishlistIds();
  const [selectedWeight, setSelectedWeight] = useState<PackWeight>('100g');
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (productModal) {
      setSelectedWeight('100g');
      setQty(1);
    }
  }, [productModal]);

  useEffect(() => {
    if (!productModal) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeProductModal();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [productModal]);

  useEffect(() => {
    if (productModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [productModal]);

  if (!productModal) return null;

  const isSaved = wishlistIds.includes(productModal.id);
  const unitPrice = productModal.pricing[selectedWeight];
  const lineTotal = unitPrice * qty;

  const directWhatsAppMsg = `Namaste KBR Masale! I would like to order:\n• ${productModal.name} (${selectedWeight}) × ${qty} = Rs.${lineTotal}\nPlease share dispatch details.`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-2 sm:p-6 bg-black/60 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-product-title"
    >
      <div
        className="fixed inset-0"
        onClick={closeProductModal}
        aria-hidden="true"
      />

      <div className="relative z-10 flex max-h-[94dvh] sm:max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl sm:rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl">
        {/* Sticky Top Bar for Mobile & Desktop Accessibility */}
        <div className="flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2 text-xs text-[var(--color-secondary)] font-medium min-w-0">
            <span className="truncate">{productModal.hindi}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono-num text-[var(--color-text-muted)]">
              {productModal.batchCode}
            </span>
          </div>
          <button
            type="button"
            onClick={closeProductModal}
            aria-label="Close product details"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)] shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-7">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
            {/* Left Column: Image & Harvest Origin Metadata */}
            <div className="md:col-span-5 flex flex-col justify-between">
              <div className="aspect-[16/11] sm:aspect-square w-full overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-elevated)]">
                <ResilientImage
                  src={productModal.image}
                  alt={productModal.name}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="mt-3.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-3.5 text-xs space-y-1.5">
                <div className="flex justify-between gap-2">
                  <span className="text-[var(--color-text-muted)]">Botanical</span>
                  <span className="italic font-medium text-[var(--color-text)] text-right">
                    {productModal.botanicalName}
                  </span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-[var(--color-text-muted)]">Origin Belt</span>
                  <span className="font-medium text-[var(--color-text)] text-right">
                    {productModal.originRegion}
                  </span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-[var(--color-text-muted)]">Oil Retention</span>
                  <span className="font-mono-num font-medium text-[var(--color-primary)] text-right">
                    {productModal.essentialOilRetention}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Contiguous Purchase Module */}
            <div className="md:col-span-7 flex flex-col justify-between">
              <div>
                <h2
                  id="modal-product-title"
                  className="font-display text-xl sm:text-3xl font-semibold text-[var(--color-text)]"
                >
                  {productModal.name}
                </h2>

                <p className="mt-2 text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  {productModal.description}
                </p>

                <div className="mt-3 text-xs text-[var(--color-text-muted)]">
                  Recommended for:{' '}
                  <span className="text-[var(--color-text)] font-medium">
                    {productModal.culinaryPairings.join(' · ')}
                  </span>
                </div>

                {/* Weight Pack Selector (46px+ touch buttons) */}
                <div className="mt-4 border-t border-[var(--color-border)] pt-4">
                  <span className="block text-xs font-semibold text-[var(--color-text)] mb-2">
                    Select Pack Weight
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {PACK_WEIGHTS.map((w) => {
                      const isSelected = selectedWeight === w;
                      return (
                        <button
                          key={w}
                          type="button"
                          onClick={() => setSelectedWeight(w)}
                          className={`min-h-[46px] rounded border py-2 px-2 text-center transition-colors duration-150 flex flex-col items-center justify-center ${
                            isSelected
                              ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white font-semibold'
                              : 'border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)]'
                          }`}
                        >
                          <span className="block text-xs">{w}</span>
                          <span
                            className={`block font-mono-num text-[11px] mt-0.5 ${
                              isSelected ? 'text-white/90' : 'text-[var(--color-text-muted)]'
                            }`}
                          >
                            {formatINR(productModal.pricing[w])}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Quantity & Line Total */}
                <div className="mt-4 flex items-center justify-between border-t border-[var(--color-border)] pt-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-[var(--color-text)]">
                      Quantity
                    </span>
                    <div className="inline-flex items-center rounded-lg border border-[var(--color-border)] bg-[var(--color-background)]">
                      <button
                        type="button"
                        onClick={() => setQty((q) => Math.max(1, q - 1))}
                        disabled={qty <= 1}
                        aria-label="Decrease quantity"
                        className="flex h-10 w-10 items-center justify-center text-[var(--color-text)] disabled:opacity-40"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="font-mono-num w-9 text-center text-xs font-semibold">
                        {qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQty((q) => q + 1)}
                        aria-label="Increase quantity"
                        className="flex h-10 w-10 items-center justify-center text-[var(--color-text)]"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="block text-[11px] text-[var(--color-text-muted)]">
                      Total Price
                    </span>
                    <span className="font-mono-num text-xl font-semibold text-[var(--color-primary)]">
                      {formatINR(lineTotal)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Bottom CTA Footer inside Modal (Always easy to reach on mobile) */}
        <div className="border-t border-[var(--color-border)] bg-[var(--color-background)] px-4 pt-3 pb-safe-sm sm:px-6 sm:py-4 space-y-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                addToCart(productModal.id, selectedWeight, qty);
                showToast(
                  `Added ${productModal.name} (${selectedWeight}) × ${qty} to bag`
                );
                closeProductModal();
              }}
              className="flex-1 inline-flex min-h-[46px] items-center justify-center gap-2 rounded-lg bg-[var(--color-primary)] px-3 sm:px-4 text-xs font-semibold text-white hover:bg-[var(--color-primary-dark)] transition-colors duration-150 whitespace-nowrap"
            >
              <ShoppingBag className="h-4 w-4 shrink-0" />
              <span>Add to Bag · {formatINR(lineTotal)}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                addToCart(productModal.id, selectedWeight, qty);
                closeProductModal();
                openCheckoutModal();
              }}
              className="inline-flex min-h-[46px] items-center justify-center rounded-lg border border-[var(--color-primary)] bg-[var(--color-surface)] px-3.5 sm:px-4 text-xs font-semibold text-[var(--color-primary)] hover:bg-[var(--color-surface-elevated)] transition-colors duration-150 whitespace-nowrap shrink-0"
            >
              Buy Now
            </button>

            <button
              type="button"
              onClick={() => {
                const saved = toggleWishlist(productModal.id);
                showToast(
                  saved ? 'Saved to your spice list' : 'Removed from saved list'
                );
              }}
              aria-label="Toggle saved spice"
              className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:text-[var(--color-secondary)]"
            >
              <Heart
                className={`h-4 w-4 ${
                  isSaved
                    ? 'fill-[var(--color-secondary)] text-[var(--color-secondary)]'
                    : ''
                }`}
              />
            </button>
          </div>

          <a
            href={buildWhatsAppUrl(directWhatsAppMsg)}
            target="_blank"
            rel="noreferrer"
            className="flex min-h-[42px] w-full items-center justify-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-xs font-semibold text-[var(--color-success)] hover:border-[var(--color-success)] transition-colors duration-150"
          >
            <MessageCircle className="h-4 w-4 shrink-0" />
            <span className="truncate">
              Order Directly on WhatsApp ({BRAND_CONFIG.whatsappDisplay})
            </span>
          </a>
        </div>
      </div>
    </div>
  );
};

// =========================================================
// 2. SLIDE-OVER CART DRAWER
// =========================================================
export const CartDrawer: React.FC = () => {
  const { cartOpen } = useUIState();
  const cartItems = useCartItems();
  const summary = getCartSummary(cartItems);

  useEffect(() => {
    if (!cartOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCartDrawer();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [cartOpen]);

  useEffect(() => {
    if (cartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [cartOpen]);

  if (!cartOpen) return null;

  const quickWhatsAppCartText = [
    `Namaste KBR Masale! I would like to place an order:`,
    ...summary.items.map(
      (i, idx) => `${idx + 1}. ${i.name} (${i.weight}) × ${i.qty} = Rs.${i.lineTotal}`
    ),
    `Subtotal: Rs.${summary.subtotal}`,
    summary.discountPct > 0
      ? `Discount (${summary.discountPct}%): -Rs.${summary.discountAmount}`
      : null,
    `Delivery: Rs.${summary.delivery}`,
    `Grand Total: Rs.${summary.total}`,
  ]
    .filter(Boolean)
    .join('\n');

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Bag"
    >
      <div className="fixed inset-0" onClick={closeCartDrawer} aria-hidden="true" />

      <div className="relative z-10 flex h-full w-full max-w-md flex-col bg-[var(--color-surface)] border-l border-[var(--color-border)] shadow-2xl pt-safe">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 sm:px-5 py-3.5">
          <div className="flex items-center gap-2 min-w-0">
            <ShoppingBag className="h-4 w-4 text-[var(--color-primary)] shrink-0" />
            <h2 className="font-display text-lg font-semibold text-[var(--color-text)] truncate">
              Your Spice Bag
            </h2>
            <span className="font-mono-num text-xs text-[var(--color-text-muted)] shrink-0">
              ({summary.count} {summary.count === 1 ? 'pack' : 'packs'})
            </span>
          </div>
          <button
            type="button"
            onClick={closeCartDrawer}
            aria-label="Close bag"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)] shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Dynamic Free Delivery & Tiered Savings Progress Banner */}
        <div className="border-b border-[var(--color-border)] bg-[var(--color-background)] px-4 sm:px-5 py-3 text-xs">
          {summary.freeDeliveryHint ? (
            <p className="flex items-center gap-1.5 text-[var(--color-text-secondary)]">
              <Truck className="h-3.5 w-3.5 text-[var(--color-secondary)] shrink-0" />
              <span>{summary.freeDeliveryHint}</span>
            </p>
          ) : (
            <p className="flex items-center gap-1.5 font-medium text-[var(--color-success)]">
              <Check className="h-3.5 w-3.5 shrink-0" />
              <span>Unlocked FREE Pan-India Home Delivery!</span>
            </p>
          )}
          {summary.nextDiscountHint && (
            <p className="mt-1 text-[11px] text-[var(--color-text-muted)]">
              {summary.nextDiscountHint}
            </p>
          )}
        </div>

        {/* Items List */}
        {summary.items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center p-6 sm:p-8 text-center">
            <ShoppingBag className="h-10 w-10 text-[var(--color-text-muted)] opacity-50" />
            <h3 className="mt-3 font-display text-lg font-semibold text-[var(--color-text)]">
              Your Spice Bag is Empty
            </h3>
            <p className="mt-1 max-w-xs text-xs text-[var(--color-text-secondary)] leading-relaxed">
              Add cold-ground Haldi, Lal Mirch, Dhaniya, or Jeera packs starting from ₹8.
            </p>
            <button
              type="button"
              onClick={closeCartDrawer}
              className="mt-5 inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-[var(--color-primary)] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[var(--color-primary-dark)]"
            >
              <span>Browse the 4 Core Spices</span>
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto divide-y divide-[var(--color-border)] px-4 sm:px-5">
              {summary.items.map((item) => (
                <div
                  key={`${item.productId}-${item.weight}`}
                  className="flex gap-3.5 py-4"
                >
                  <ResilientImage
                    src={item.image}
                    alt={item.name}
                    className="h-16 w-16 shrink-0 rounded border border-[var(--color-border)] object-cover bg-[var(--color-surface-elevated)]"
                  />
                  <div className="flex flex-1 flex-col justify-between min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-display text-sm font-semibold text-[var(--color-text)] truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-[var(--color-text-muted)]">
                          Pack:{' '}
                          <span className="font-mono-num font-medium">{item.weight}</span> ·{' '}
                          <span className="font-mono-num">{formatINR(item.unitPrice)}</span> each
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.productId, item.weight)}
                        aria-label={`Remove ${item.name} (${item.weight})`}
                        className="flex h-9 w-9 items-center justify-center rounded text-[var(--color-text-muted)] hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-error)] shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-2.5 flex items-center justify-between">
                      <div className="inline-flex items-center rounded-lg border border-[var(--color-border)] bg-[var(--color-background)]">
                        <button
                          type="button"
                          onClick={() =>
                            updateCartQty(item.productId, item.weight, item.qty - 1)
                          }
                          aria-label="Decrease quantity"
                          className="flex h-9 w-9 items-center justify-center text-[var(--color-text)]"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="font-mono-num w-8 text-center text-xs font-semibold">
                          {item.qty}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateCartQty(item.productId, item.weight, item.qty + 1)
                          }
                          aria-label="Increase quantity"
                          className="flex h-9 w-9 items-center justify-center text-[var(--color-text)]"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <span className="font-mono-num text-sm font-semibold text-[var(--color-text)]">
                        {formatINR(item.lineTotal)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Summary & Checkout Trigger */}
            <div className="border-t border-[var(--color-border)] bg-[var(--color-background)] px-4 pt-4 pb-safe sm:p-5 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-[var(--color-text-secondary)]">
                  <span>Subtotal</span>
                  <span className="font-mono-num font-medium">
                    {formatINR(summary.subtotal)}
                  </span>
                </div>

                {summary.discountPct > 0 && (
                  <div className="flex justify-between text-[var(--color-success)] font-medium">
                    <span>Tiered Bulk Discount ({summary.discountPct}% Off)</span>
                    <span className="font-mono-num">
                      −{formatINR(summary.discountAmount)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-[var(--color-text-secondary)]">
                  <span>Pan-India Delivery</span>
                  <span className="font-mono-num font-medium">
                    {summary.delivery === 0 ? 'FREE' : formatINR(summary.delivery)}
                  </span>
                </div>

                <div className="flex justify-between border-t border-[var(--color-border)] pt-2.5 text-sm font-semibold text-[var(--color-text)]">
                  <span>Grand Total</span>
                  <span className="font-mono-num text-base text-[var(--color-primary)]">
                    {formatINR(summary.total)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={openCheckoutModal}
                className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-lg bg-[var(--color-primary)] py-3.5 px-4 text-xs sm:text-sm font-semibold text-white hover:bg-[var(--color-primary-dark)] transition-colors duration-150 whitespace-nowrap"
              >
                <span>Proceed to Checkout ({formatINR(summary.total)})</span>
                <ArrowRight className="h-4 w-4 shrink-0" />
              </button>

              <a
                href={buildWhatsAppUrl(quickWhatsAppCartText)}
                target="_blank"
                rel="noreferrer"
                className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] py-2.5 px-4 text-xs font-semibold text-[var(--color-success)] hover:border-[var(--color-success)] transition-colors duration-150 whitespace-nowrap"
              >
                <MessageCircle className="h-4 w-4 shrink-0" />
                <span>Instant Order via WhatsApp</span>
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// =========================================================
// 3. SAVED / WISHLIST DRAWER
// =========================================================
export const WishlistDrawer: React.FC = () => {
  const { wishlistOpen } = useUIState();
  const savedProducts = useWishlistProducts();

  useEffect(() => {
    if (wishlistOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [wishlistOpen]);

  if (!wishlistOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label="Saved Spices"
    >
      <div className="fixed inset-0" onClick={closeWishlistDrawer} aria-hidden="true" />

      <div className="relative z-10 flex h-full w-full max-w-md flex-col bg-[var(--color-surface)] border-l border-[var(--color-border)] shadow-2xl pt-safe pb-safe">
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 sm:px-5 py-3.5">
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-[var(--color-secondary)] fill-[var(--color-secondary)]" />
            <h2 className="font-display text-lg font-semibold text-[var(--color-text)]">
              Saved Spices ({savedProducts.length})
            </h2>
          </div>
          <button
            type="button"
            onClick={closeWishlistDrawer}
            aria-label="Close saved spices"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-text-secondary)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {savedProducts.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
            <Heart className="h-10 w-10 text-[var(--color-text-muted)] opacity-40" />
            <p className="mt-3 font-display text-base font-semibold text-[var(--color-text)]">
              No Saved Spices Yet
            </p>
            <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
              Tap the heart icon on any spice to keep it handy for your next pantry refill.
            </p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto divide-y divide-[var(--color-border)] px-4 sm:px-5">
            {savedProducts.map((p) => (
              <div key={p.id} className="flex items-center justify-between gap-3 py-4">
                <div className="flex items-center gap-3 min-w-0">
                  <ResilientImage
                    src={p.image}
                    alt={p.name}
                    className="h-14 w-14 shrink-0 rounded border border-[var(--color-border)] object-cover"
                  />
                  <div className="min-w-0">
                    <button
                      type="button"
                      onClick={() => openProductModal(p)}
                      className="font-display text-sm font-semibold text-[var(--color-text)] hover:text-[var(--color-primary)] truncate block"
                    >
                      {p.name}
                    </button>
                    <p className="text-xs text-[var(--color-text-muted)]">
                      {p.hindi} · {formatINR(p.pricing['100g'])} / 100g
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      addToCart(p.id, '100g', 1);
                      showToast(`Added ${p.name} (100g) to bag`);
                    }}
                    className="min-h-[40px] rounded-lg bg-[var(--color-primary)] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[var(--color-primary-dark)] whitespace-nowrap"
                  >
                    + Bag
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleWishlist(p.id)}
                    aria-label={`Remove ${p.name} from saved`}
                    className="flex h-10 w-10 items-center justify-center rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-error)]"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// =========================================================
// 4. POLICY & CUSTOMER TRUST MODAL
// =========================================================
export const PolicyModal: React.FC = () => {
  const { policyModal } = useUIState();
  if (!policyModal) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0" onClick={closePolicyModal} aria-hidden="true" />
      <div className="relative z-10 max-h-[88dvh] w-full max-w-lg overflow-y-auto rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-8 shadow-2xl">
        <button
          type="button"
          onClick={closePolicyModal}
          aria-label="Close policy dialog"
          className="absolute right-3.5 top-3.5 flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-text-secondary)]"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2 text-xs font-semibold text-[var(--color-primary)] pr-10">
          <ShieldCheck className="h-4 w-4 shrink-0" />
          <span>{BRAND_CONFIG.company} Official Guarantee</span>
        </div>

        {policyModal === 'shipping' && (
          <div className="mt-3 space-y-3 text-sm text-[var(--color-text-secondary)]">
            <h3 className="font-display text-xl font-semibold text-[var(--color-text)]">
              Shipping &amp; Pan-India Delivery Policy
            </h3>
            <p>
              KBR Global Ventures dispatches sealed spice pouches across India with full tracking
              and WhatsApp confirmation.
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs leading-relaxed">
              <li>
                <strong>Order Dispatch Time:</strong> 1 to 4 working days from order confirmation.
              </li>
              <li>
                <strong>Estimated Transit Time:</strong> 2 to 5 working days depending on your
                PIN code.
              </li>
              <li>
                <strong>Free Delivery Threshold:</strong> Automatically applied on all orders
                above ₹500.
              </li>
              <li>
                <strong>Orders Below ₹500:</strong> A nominal flat delivery charge of ₹40 applies.
              </li>
            </ul>
          </div>
        )}

        {policyModal === 'returns' && (
          <div className="mt-3 space-y-3 text-sm text-[var(--color-text-secondary)]">
            <h3 className="font-display text-xl font-semibold text-[var(--color-text)]">
              Return, Replacement &amp; Hygiene Policy
            </h3>
            <p>
              Because our spices are food-grade consumables, we maintain strict quality and safety
              protocols:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs leading-relaxed">
              <li>
                <strong>Damaged in Transit or Wrong Item:</strong> Eligible for a 100% free
                replacement—simply message us on WhatsApp ({BRAND_CONFIG.whatsappDisplay}) within
                48 hours of delivery.
              </li>
              <li>
                <strong>Incomplete Package:</strong> Any missing pouch is immediately dispatched at
                zero extra cost.
              </li>
              <li>
                <strong>Food Hygiene Standard:</strong> Opened or partially consumed food packets
                cannot be returned once the moisture seal is broken.
              </li>
            </ul>
          </div>
        )}

        {policyModal === 'privacy' && (
          <div className="mt-3 space-y-3 text-sm text-[var(--color-text-secondary)]">
            <h3 className="font-display text-xl font-semibold text-[var(--color-text)]">
              Privacy &amp; Customer Trust
            </h3>
            <p>At KBR Masale, household trust is the foundation of our business:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs leading-relaxed">
              <li>
                Your mobile number and delivery address are used strictly for order confirmation
                and courier dispatch.
              </li>
              <li>
                We never sell, rent, or share customer data with third-party marketing lists.
              </li>
              <li>
                Direct WhatsApp communication ensures transparent, human support from order to
                kitchen shelf.
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

// =========================================================
// 5. TOAST NOTIFICATION BANNER
// =========================================================
export const ToastBanner: React.FC = () => {
  const { toast } = useUIState();
  if (!toast) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-5 sm:bottom-5 z-50 flex items-center gap-2.5 rounded-lg border border-white/15 bg-[var(--color-primary-dark)] px-4 py-3 text-xs font-semibold text-white shadow-xl"
    >
      <Check className="h-4 w-4 text-[#E5B869] shrink-0" />
      <span className="truncate">{toast.message}</span>
    </div>
  );
};
