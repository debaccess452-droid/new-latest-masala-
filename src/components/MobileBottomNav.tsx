import React, { useEffect, useState } from 'react';
import { Home, Search, Flame, MessageCircle, ShoppingBag } from 'lucide-react';
import {
  buildWhatsAppUrl,
  closeCartDrawer,
  closeProductModal,
  closeSearchPopover,
  closeWishlistDrawer,
  getCartSummary,
  openCartDrawer,
  setMobileMenuOpen,
  toggleSearchPopover,
  useCartItems,
  useUIState,
} from '../store/shopStore';

type ActiveTab = 'home' | 'search' | 'spices' | 'whatsapp' | 'cart';

export const MobileBottomNav: React.FC = () => {
  const cartItems = useCartItems();
  const summary = getCartSummary(cartItems);
  const { searchOpen, cartOpen } = useUIState();
  const [scrollSection, setScrollSection] = useState<'home' | 'spices'>('home');

  useEffect(() => {
    const handleScroll = () => {
      const spicesEl = document.getElementById('spices');
      if (!spicesEl) return;
      const rect = spicesEl.getBoundingClientRect();
      // Mark 'spices' active when the Spices catalog section enters the main viewport area
      if (rect.top <= window.innerHeight * 0.45 && rect.bottom >= 140) {
        setScrollSection('spices');
      } else if (window.scrollY < 320) {
        setScrollSection('home');
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Determine the currently active item
  const activeTab: ActiveTab = cartOpen
    ? 'cart'
    : searchOpen
    ? 'search'
    : scrollSection;

  const closeAllOverlays = () => {
    closeSearchPopover();
    closeCartDrawer();
    closeWishlistDrawer();
    closeProductModal();
    setMobileMenuOpen(false);
  };

  const whatsappUrl = buildWhatsAppUrl(
    'Namaste KBR Masale! I would like to place a spice order.'
  );

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden border-t border-[var(--color-border)] bg-[var(--color-surface)]/95 backdrop-blur-md shadow-[0_-4px_18px_rgba(22,24,22,0.06)] pb-[env(safe-area-inset-bottom,0px)]"
    >
      <div className="mx-auto grid h-16 max-w-md grid-cols-5 items-stretch px-1">
        {/* 1. HOME */}
        <a
          href="#top"
          onClick={() => {
            closeAllOverlays();
            setScrollSection('home');
          }}
          aria-label="Home"
          aria-current={activeTab === 'home' ? 'page' : undefined}
          className={`group relative flex min-h-[48px] flex-col items-center justify-center gap-1 px-1 transition-colors duration-150 ${
            activeTab === 'home'
              ? 'text-[var(--color-primary)] font-semibold'
              : 'text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]'
          }`}
        >
          <Home
            className="h-5 w-5 shrink-0 transition-transform duration-150 group-active:scale-95"
            strokeWidth={activeTab === 'home' ? 2.25 : 1.85}
          />
          <span className="text-[11px] leading-none tracking-tight whitespace-nowrap">
            Home
          </span>
          {activeTab === 'home' && (
            <span
              aria-hidden="true"
              className="absolute bottom-1 h-1 w-1 rounded-full bg-[var(--color-primary)]"
            />
          )}
        </a>

        {/* 2. SEARCH */}
        <button
          type="button"
          data-search-trigger="true"
          onClick={() => {
            toggleSearchPopover();
          }}
          aria-label="Search spices"
          aria-expanded={searchOpen}
          className={`group relative flex min-h-[48px] flex-col items-center justify-center gap-1 px-1 transition-colors duration-150 ${
            activeTab === 'search'
              ? 'text-[var(--color-primary)] font-semibold'
              : 'text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]'
          }`}
        >
          <Search
            className="h-5 w-5 shrink-0 transition-transform duration-150 group-active:scale-95"
            strokeWidth={activeTab === 'search' ? 2.25 : 1.85}
          />
          <span className="text-[11px] leading-none tracking-tight whitespace-nowrap">
            Search
          </span>
          {activeTab === 'search' && (
            <span
              aria-hidden="true"
              className="absolute bottom-1 h-1 w-1 rounded-full bg-[var(--color-primary)]"
            />
          )}
        </button>

        {/* 3. SPICES */}
        <a
          href="#spices"
          onClick={() => {
            closeAllOverlays();
            setScrollSection('spices');
          }}
          aria-label="Spices collection"
          aria-current={activeTab === 'spices' ? 'page' : undefined}
          className={`group relative flex min-h-[48px] flex-col items-center justify-center gap-1 px-1 transition-colors duration-150 ${
            activeTab === 'spices'
              ? 'text-[var(--color-primary)] font-semibold'
              : 'text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]'
          }`}
        >
          <Flame
            className={`h-5 w-5 shrink-0 transition-transform duration-150 group-active:scale-95 ${
              activeTab === 'spices' ? 'text-[var(--color-secondary)]' : ''
            }`}
            strokeWidth={activeTab === 'spices' ? 2.25 : 1.85}
          />
          <span className="text-[11px] leading-none tracking-tight whitespace-nowrap">
            Spices
          </span>
          {activeTab === 'spices' && (
            <span
              aria-hidden="true"
              className="absolute bottom-1 h-1 w-1 rounded-full bg-[var(--color-secondary)]"
            />
          )}
        </a>

        {/* 4. WHATSAPP */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          onClick={() => {
            closeSearchPopover();
            setMobileMenuOpen(false);
          }}
          aria-label="Order or chat on WhatsApp"
          className="group relative flex min-h-[48px] flex-col items-center justify-center gap-1 px-1 text-[var(--color-text-secondary)] hover:text-[var(--color-success)] transition-colors duration-150"
        >
          <MessageCircle
            className="h-5 w-5 shrink-0 text-[var(--color-success)] transition-transform duration-150 group-active:scale-95"
            strokeWidth={1.95}
          />
          <span className="text-[11px] leading-none tracking-tight whitespace-nowrap">
            WhatsApp
          </span>
        </a>

        {/* 5. CART */}
        <button
          type="button"
          onClick={() => {
            openCartDrawer();
          }}
          aria-label={`Cart (${summary.count} items)`}
          aria-expanded={cartOpen}
          className={`group relative flex min-h-[48px] flex-col items-center justify-center gap-1 px-1 transition-colors duration-150 ${
            activeTab === 'cart'
              ? 'text-[var(--color-primary)] font-semibold'
              : 'text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]'
          }`}
        >
          <span className="relative inline-flex items-center justify-center">
            <ShoppingBag
              className="h-5 w-5 shrink-0 transition-transform duration-150 group-active:scale-95"
              strokeWidth={activeTab === 'cart' ? 2.25 : 1.85}
            />
            {summary.count > 0 && (
              <span className="font-mono-num absolute -right-2.5 -top-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[var(--color-primary)] px-1 text-[10px] font-semibold leading-none text-white shadow-2xs">
                {summary.count}
              </span>
            )}
          </span>
          <span className="text-[11px] leading-none tracking-tight whitespace-nowrap">
            Cart
          </span>
          {activeTab === 'cart' && (
            <span
              aria-hidden="true"
              className="absolute bottom-1 h-1 w-1 rounded-full bg-[var(--color-primary)]"
            />
          )}
        </button>
      </div>
    </nav>
  );
};
