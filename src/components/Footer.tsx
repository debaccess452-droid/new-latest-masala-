import React from 'react';
import { MessageCircle, Instagram, Phone, ShieldCheck } from 'lucide-react';
import { BRAND_CONFIG, SPICE_PRODUCTS } from '../data/spices';
import {
  buildWhatsAppUrl,
  openPolicyModal,
  openProductModal,
} from '../store/shopStore';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[var(--color-primary-dark)] text-[#D5DDD8] border-t border-white/10 pb-[calc(5rem+env(safe-area-inset-bottom,0px))] md:pb-0">
      {/* Top Direct Conversion Strip */}
      <div className="border-b border-white/10">
        <div className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6 lg:px-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <p className="text-xs font-medium text-[#E5B869]">
              Direct Kitchen Dispatch · Pan-India Delivery
            </p>
            <h2 className="mt-1 font-display heading-sub-fluid font-semibold text-white">
              Ready to bring single-origin, cold-ground purity to your daily cooking?
            </h2>
            <p className="mt-1.5 text-sm text-[#D5DDD8]">
              Order online with Cash on Delivery or message our team directly on WhatsApp for
              household &amp; bulk pantry orders.
            </p>
          </div>

          {/* Full-width stacked buttons on mobile, inline on sm+ */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 shrink-0">
            <a
              href="#spices"
              className="inline-flex min-h-[46px] items-center justify-center rounded-lg bg-[#E5B869] px-5 py-3 text-xs sm:text-sm font-semibold text-[#11261B] hover:bg-[#d8a955] transition-colors duration-150"
            >
              Shop All 4 Spices
            </a>
            <a
              href={buildWhatsAppUrl(
                'Namaste KBR Masale! I would like to place a spice order.'
              )}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/5 px-5 py-3 text-xs sm:text-sm font-semibold text-white hover:bg-white/10 transition-colors duration-150"
            >
              <MessageCircle className="h-4 w-4 text-[#E5B869] shrink-0" />
              <span>Order on WhatsApp: {BRAND_CONFIG.whatsappDisplay}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Columns:
          Mobile hierarchy: KBR Masale -> About -> Shop -> Customer Support -> Contact -> Social Links -> Legal */}
      <div className="mx-auto max-w-[1280px] px-4 py-10 sm:py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-12 lg:gap-10">
          {/* 1. Brand & About + Contact & Social Links (5 cols on lg) */}
          <div className="lg:col-span-5">
            <a
              href="#top"
              className="font-display text-2xl font-semibold tracking-tight text-white"
            >
              {BRAND_CONFIG.brandName}
            </a>
            <p className="mt-2 text-xs font-medium text-[#E5B869]">
              An authentic initiative by {BRAND_CONFIG.company} · {BRAND_CONFIG.taglineHindi}
            </p>
            <p className="mt-3 max-w-sm text-xs sm:text-sm leading-relaxed text-[#D5DDD8]/85">
              Single-origin Indian kitchen spices procured from audited farms and slow-milled at
              low temperatures so natural essential oils, colour, and aroma reach your kitchen
              untouched.
            </p>

            {/* Contact & Social Links with Touch-Friendly Hitboxes */}
            <div className="mt-5 pt-4 border-t border-white/10 sm:border-t-0 sm:pt-0">
              <p className="text-xs font-semibold text-white tracking-wide mb-2 sm:hidden">
                Contact &amp; Social Links
              </p>
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-white">
                <a
                  href={`tel:+${BRAND_CONFIG.whatsappNumber}`}
                  className="inline-flex min-h-[40px] items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3.5 py-2 sm:border-0 sm:bg-transparent sm:p-0 hover:text-[#E5B869] transition-colors"
                >
                  <Phone className="h-3.5 w-3.5 text-[#E5B869] shrink-0" />
                  <span className="font-mono-num">{BRAND_CONFIG.whatsappDisplay}</span>
                </a>
                <a
                  href={BRAND_CONFIG.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-[40px] items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3.5 py-2 sm:border-0 sm:bg-transparent sm:p-0 hover:text-[#E5B869] transition-colors"
                >
                  <Instagram className="h-3.5 w-3.5 text-[#E5B869] shrink-0" />
                  <span>@kbr_global_spice</span>
                </a>
              </div>
            </div>
          </div>

          {/* 2. Shop / Core Spice Collection (3 cols on lg) */}
          <div className="lg:col-span-3 border-t border-white/10 pt-6 md:border-t-0 md:pt-0">
            <h3 className="text-xs font-semibold text-white tracking-wide uppercase">
              Shop Spices
            </h3>
            <ul className="mt-3 space-y-1.5 text-xs sm:text-sm">
              {SPICE_PRODUCTS.map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => openProductModal(p)}
                    className="flex min-h-[38px] sm:min-h-[32px] w-full items-center text-[#D5DDD8]/85 hover:text-white transition-colors text-left"
                  >
                    {p.name} ({p.hindi})
                  </button>
                </li>
              ))}
              <li>
                <a
                  href="#reserve"
                  className="flex min-h-[38px] sm:min-h-[32px] items-center text-[#E5B869] hover:underline font-medium"
                >
                  4-Spice Rasoi Pantry Bundle
                </a>
              </li>
            </ul>
          </div>

          {/* 3. Customer Support & Policies (4 cols on lg) */}
          <div className="lg:col-span-4 border-t border-white/10 pt-6 lg:border-t-0 lg:pt-0">
            <h3 className="text-xs font-semibold text-white tracking-wide uppercase">
              Customer Support &amp; Policies
            </h3>
            <ul className="mt-3 space-y-1.5 text-xs sm:text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => openPolicyModal('shipping')}
                  className="flex min-h-[38px] sm:min-h-[32px] w-full items-center text-[#D5DDD8]/85 hover:text-white transition-colors text-left"
                >
                  Shipping &amp; Pan-India Delivery Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => openPolicyModal('returns')}
                  className="flex min-h-[38px] sm:min-h-[32px] w-full items-center text-[#D5DDD8]/85 hover:text-white transition-colors text-left"
                >
                  Return, Replacement &amp; Food Safety Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => openPolicyModal('privacy')}
                  className="flex min-h-[38px] sm:min-h-[32px] w-full items-center text-[#D5DDD8]/85 hover:text-white transition-colors text-left"
                >
                  Customer Privacy &amp; Trust Guarantee
                </button>
              </li>
            </ul>

            <div className="mt-5 rounded-lg border border-white/10 bg-white/5 p-3.5 text-xs">
              <div className="flex items-center gap-1.5 text-white font-medium">
                <ShieldCheck className="h-4 w-4 text-[#E5B869] shrink-0" />
                <span>Tiered Savings Automatically Applied</span>
              </div>
              <p className="mt-1 text-[11px] text-[#D5DDD8]/80 font-mono-num">
                10% Off &gt; ₹1,000 · 30% Off &gt; ₹1,500 · 40% Off &gt; ₹2,000
              </p>
            </div>
          </div>
        </div>

        {/* 4. Legal & Copyright Bottom Bar */}
        <div className="mt-10 border-t border-white/10 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#D5DDD8]/70">
          <p>
            © {new Date().getFullYear()} {BRAND_CONFIG.brandName} ({BRAND_CONFIG.company}). All
            rights reserved.
          </p>
          <p>
            Pack sizes: 25g · 50g · 100g · 200g · 500g · 1kg · Free delivery above ₹500
          </p>
        </div>
      </div>
    </footer>
  );
};
