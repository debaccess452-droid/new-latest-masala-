import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Heart,
  ShoppingBag,
  Menu,
  X,
  ArrowUpRight,
  MessageCircle,
  Phone,
} from 'lucide-react';
import { BRAND_CONFIG, formatINR, SPICE_PRODUCTS } from '../data/spices';
import {
  buildWhatsAppUrl,
  closeSearchPopover,
  getCartSummary,
  openCartDrawer,
  openProductModal,
  openWishlistDrawer,
  setMobileMenuOpen,
  toggleSearchPopover,
  useCartItems,
  useUIState,
  useWishlistIds,
} from '../store/shopStore';
import { ResilientImage } from './ResilientImage';

const NAV_LINKS = [
  { label: 'Spices', href: '#spices' },
  { label: 'Reserve Pack', href: '#reserve' },
  { label: 'Cold-Grinding', href: '#craft' },
  { label: 'Pairings', href: '#pairings' },
  { label: 'Reviews', href: '#reviews' },
];

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const { searchOpen, mobileMenuOpen } = useUIState();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileSearchQuery, setMobileSearchQuery] = useState('');
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const cartItems = useCartItems();
  const wishlistIds = useWishlistIds();
  const summary = getCartSummary(cartItems);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 16);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element | null;
      if (target?.closest?.('[data-search-trigger="true"]')) {
        return;
      }
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        closeSearchPopover();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeSearchPopover();
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Lock background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const filterSpices = (query: string) => {
    if (!query.trim()) return SPICE_PRODUCTS;
    const q = query.trim().toLowerCase();
    return SPICE_PRODUCTS.filter((p) =>
      `${p.name} ${p.shortName} ${p.hindi} ${p.originRegion} ${p.aromaNotes}`
        .toLowerCase()
        .includes(q)
    );
  };

  const filteredProducts = filterSpices(searchQuery);
  const mobileFilteredProducts = filterSpices(mobileSearchQuery);

  return (
    <header
      className={`sticky top-0 z-40 w-full pt-safe transition-colors duration-200 ${
        scrolled
          ? 'bg-[var(--color-background)]/95 backdrop-blur-md border-b border-[var(--color-border)]'
          : 'bg-[var(--color-background)] border-b border-[var(--color-border)]/70'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between gap-2 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#top"
          className="font-display text-lg sm:text-2xl font-semibold tracking-tight text-[var(--color-primary)] whitespace-nowrap shrink-0"
        >
          KBR Masale
        </a>

        {/* Zone 2: 5 clean text navigation links (Desktop) */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[var(--color-text-secondary)]"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative py-1 whitespace-nowrap shrink-0 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors duration-150 after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-full after:origin-left after:scale-x-0 after:bg-[var(--color-primary)] after:transition-transform after:duration-200 hover:after:scale-x-100"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Primary actions */}
        <div
          className="flex items-center gap-1.5 sm:gap-2.5 shrink-0"
          ref={searchContainerRef}
        >
          {/* Search Trigger */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                toggleSearchPopover();
              }}
              aria-label={searchOpen ? 'Close spice search' : 'Search spices'}
              aria-expanded={searchOpen}
              className="flex h-11 w-11 sm:h-10 sm:w-10 items-center justify-center rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-text)] transition-colors duration-150"
            >
              {searchOpen ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
            </button>

            {/* Responsive Search Popover: Full-width clamped on mobile, right-anchored on desktop */}
            {searchOpen && (
              <div
                role="dialog"
                aria-label="Search KBR Masale Spices"
                className="fixed inset-x-3 top-[4.25rem] sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 sm:w-[360px] rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-xl z-50"
              >
                <div className="flex items-center gap-2 border-b border-[var(--color-border)] pb-2.5">
                  <Search className="h-4 w-4 text-[var(--color-text-muted)] shrink-0" />
                  <input
                    type="text"
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Haldi, Mirch, Jeera, origin..."
                    aria-label="Search spices by name, Hindi, or origin"
                    className="w-full bg-transparent text-base sm:text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      aria-label="Clear search query"
                      className="px-2 py-1 text-xs font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                    >
                      Clear
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => closeSearchPopover()}
                    aria-label="Close search popover"
                    className="flex h-8 w-8 items-center justify-center rounded text-[var(--color-text-muted)] hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-text)]"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-3 max-h-[60vh] sm:max-h-64 overflow-y-auto divide-y divide-[var(--color-border)]/60">
                  {filteredProducts.length === 0 ? (
                    <p className="py-5 text-center text-xs text-[var(--color-text-muted)]">
                      No matching spices found. Try &ldquo;Haldi&rdquo;, &ldquo;हल्दी&rdquo;, or
                      &ldquo;Unjha&rdquo;.
                    </p>
                  ) : (
                    filteredProducts.map((product) => (
                      <button
                        key={product.id}
                        type="button"
                        onClick={() => {
                          closeSearchPopover();
                          openProductModal(product);
                        }}
                        className="flex w-full items-center gap-3 py-3 px-2 text-left hover:bg-[var(--color-surface-elevated)]/60 rounded transition-colors duration-150 min-h-[52px]"
                      >
                        <ResilientImage
                          src={product.image}
                          alt={product.name}
                          className="h-11 w-11 rounded object-cover shrink-0 border border-[var(--color-border)]"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs sm:text-sm font-semibold text-[var(--color-text)] truncate">
                            {product.name}
                          </p>
                          <p className="text-[11px] text-[var(--color-text-muted)] truncate">
                            {product.hindi} · {product.originRegion}
                          </p>
                        </div>
                        <span className="font-mono-num text-xs font-semibold text-[var(--color-primary)] whitespace-nowrap shrink-0">
                          {formatINR(product.pricing['100g'])}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Saved / Wishlist Button */}
          <button
            type="button"
            onClick={() => {
              openWishlistDrawer();
            }}
            aria-label={`Saved spices (${wishlistIds.length})`}
            className="relative flex h-11 w-11 sm:h-10 sm:w-10 items-center justify-center rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-text)] transition-colors duration-150"
          >
            <Heart
              className={`h-4 w-4 ${
                wishlistIds.length > 0
                  ? 'fill-[var(--color-secondary)] text-[var(--color-secondary)]'
                  : ''
              }`}
            />
            {wishlistIds.length > 0 && (
              <span className="font-mono-num absolute right-1 top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[var(--color-primary)] px-1 text-[10px] font-semibold text-white">
                {wishlistIds.length}
              </span>
            )}
          </button>

          {/* Primary Action: Cart / Bag Button */}
          <button
            type="button"
            onClick={() => {
              openCartDrawer();
            }}
            aria-label={`Open spice bag with ${summary.count} items`}
            className="inline-flex h-11 sm:h-10 items-center gap-1.5 sm:gap-2 rounded-lg bg-[var(--color-primary)] px-3 sm:px-4 py-2 text-xs font-semibold text-white hover:bg-[var(--color-primary-dark)] transition-colors duration-150 whitespace-nowrap shrink-0"
          >
            <ShoppingBag className="h-3.5 w-3.5 shrink-0" />
            <span>Bag</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono-num">{summary.count}</span>
          </button>

          {/* Mobile Hamburger Trigger */}
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            className="flex md:hidden h-11 w-11 items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-surface-elevated)] transition-colors duration-150"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Full-Viewport Mobile Navigation Overlay & Drawer */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 top-16 z-50 md:hidden flex flex-col bg-black/50 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
        >
          <div
            className="fixed inset-0 top-16"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          <div className="relative z-10 max-h-[calc(100dvh-4rem)] w-full overflow-y-auto border-b border-[var(--color-border)] bg-[var(--color-surface)] px-4 pt-4 pb-safe shadow-2xl">
            {/* Top Mobile Menu Header with Explicit Close Button */}
            <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                Menu &amp; Quick Search
              </span>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex h-9 items-center gap-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 text-xs font-semibold text-[var(--color-text)]"
              >
                <span>Close</span>
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Integrated Mobile Search Input */}
            <div className="mt-3">
              <div className="flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2.5">
                <Search className="h-4 w-4 text-[var(--color-text-muted)] shrink-0" />
                <input
                  type="text"
                  value={mobileSearchQuery}
                  onChange={(e) => setMobileSearchQuery(e.target.value)}
                  placeholder="Search Haldi, Lal Mirch, Dhaniya, Jeera..."
                  aria-label="Search spices in mobile menu"
                  className="w-full bg-transparent text-base text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none"
                />
                {mobileSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setMobileSearchQuery('')}
                    className="text-xs font-medium text-[var(--color-text-muted)] px-1.5"
                  >
                    Clear
                  </button>
                )}
              </div>

              {mobileSearchQuery.trim() !== '' && (
                <div className="mt-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] divide-y divide-[var(--color-border)]/60 max-h-48 overflow-y-auto">
                  {mobileFilteredProducts.length === 0 ? (
                    <p className="p-3 text-center text-xs text-[var(--color-text-muted)]">
                      No spices found matching &ldquo;{mobileSearchQuery}&rdquo;
                    </p>
                  ) : (
                    mobileFilteredProducts.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          openProductModal(p);
                        }}
                        className="flex w-full items-center justify-between gap-3 p-3 text-left min-h-[48px]"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <ResilientImage
                            src={p.image}
                            alt={p.name}
                            className="h-9 w-9 rounded object-cover shrink-0 border border-[var(--color-border)]"
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-[var(--color-text)] truncate">
                              {p.name}
                            </p>
                            <p className="text-[11px] text-[var(--color-text-muted)] truncate">
                              {p.hindi} · {p.originRegion}
                            </p>
                          </div>
                        </div>
                        <span className="font-mono-num text-xs font-semibold text-[var(--color-primary)] shrink-0">
                          {formatINR(p.pricing['100g'])}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Section Navigation Links (Large 48px Touch Targets) */}
            <nav
              aria-label="Mobile Section Links"
              className="mt-3 flex flex-col divide-y divide-[var(--color-border)]/60"
            >
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex min-h-[48px] items-center justify-between py-3 text-sm font-semibold text-[var(--color-text)] active:bg-[var(--color-surface-elevated)]/60"
                >
                  <span>{link.label}</span>
                  <ArrowUpRight className="h-4 w-4 text-[var(--color-text-muted)]" />
                </a>
              ))}
            </nav>

            {/* Quick Actions: Cart, Wishlist, WhatsApp */}
            <div className="mt-4 pt-4 border-t border-[var(--color-border)] space-y-2.5">
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openCartDrawer();
                  }}
                  className="flex min-h-[46px] items-center justify-center gap-2 rounded-lg bg-[var(--color-primary)] px-3 py-2.5 text-xs font-semibold text-white"
                >
                  <ShoppingBag className="h-4 w-4 shrink-0" />
                  <span className="truncate">
                    Bag ({summary.count} · {formatINR(summary.total)})
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openWishlistDrawer();
                  }}
                  className="flex min-h-[46px] items-center justify-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2.5 text-xs font-semibold text-[var(--color-text)]"
                >
                  <Heart
                    className={`h-4 w-4 shrink-0 ${
                      wishlistIds.length > 0
                        ? 'fill-[var(--color-secondary)] text-[var(--color-secondary)]'
                        : ''
                    }`}
                  />
                  <span className="truncate">Saved ({wishlistIds.length})</span>
                </button>
              </div>

              <a
                href={buildWhatsAppUrl(
                  'Namaste KBR Masale! I would like to place a spice order.'
                )}
                target="_blank"
                rel="noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2.5 text-xs font-semibold text-[var(--color-success)]"
              >
                <MessageCircle className="h-4 w-4 shrink-0" />
                <span>WhatsApp Order: {BRAND_CONFIG.whatsappDisplay}</span>
              </a>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-[var(--color-text-muted)]">
                <span>Free delivery ₹500+</span>
                <span aria-hidden="true">·</span>
                <a
                  href={`tel:+${BRAND_CONFIG.whatsappNumber}`}
                  className="inline-flex items-center gap-1 font-medium text-[var(--color-text-secondary)]"
                >
                  <Phone className="h-3 w-3" />
                  <span>{BRAND_CONFIG.whatsappDisplay}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
