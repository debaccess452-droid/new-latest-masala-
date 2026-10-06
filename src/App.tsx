/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ProductShowcase } from './components/ProductShowcase';
import { CraftAndCulinarySection } from './components/CraftAndCulinarySection';
import { ReviewsSection } from './components/ReviewsSection';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';
import {
  CartDrawer,
  PolicyModal,
  ProductDetailModal,
  ToastBanner,
  WishlistDrawer,
} from './components/DrawersAndModals';
import { CheckoutModal } from './components/CheckoutModal';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-background)] text-[var(--color-text)]">
      {/* Accessible Skip Link */}
      <a
        href="#spices"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-[var(--color-primary)] focus:px-4 focus:py-2 focus:text-xs focus:font-semibold focus:text-white"
      >
        Skip to spice collection
      </a>

      {/* Top Bar Contract Navigation */}
      <Navbar />

      {/* Main Content Flow */}
      <main className="flex-1">
        <HeroSection />
        <ProductShowcase />
        <CraftAndCulinarySection />
        <ReviewsSection />
      </main>

      {/* Architectural Footer */}
      <Footer />

      {/* Mobile-Only Fixed 5-Item Bottom Navigation */}
      <MobileBottomNav />

      {/* Interactive Drawers & Modals */}
      <ProductDetailModal />
      <CartDrawer />
      <WishlistDrawer />
      <CheckoutModal />
      <PolicyModal />
      <ToastBanner />
    </div>
  );
}
