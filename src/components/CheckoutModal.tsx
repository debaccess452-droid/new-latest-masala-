import React, { useState, useEffect } from 'react';
import {
  X,
  ArrowLeft,
  CheckCircle2,
  MessageCircle,
  Copy,
  Check,
} from 'lucide-react';
import { formatINR } from '../data/spices';
import {
  buildWhatsAppUrl,
  clearCart,
  closeCheckoutModal,
  formatWhatsAppOrderMessage,
  generateNextOrderId,
  getCartSummary,
  openCartDrawer,
  OrderRecord,
  saveOrderRecord,
  showToast,
  useCartItems,
  useUIState,
} from '../store/shopStore';

interface CustomerFormState {
  name: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  paymentMethod: 'COD' | 'UPI';
}

const INITIAL_FORM: CustomerFormState = {
  name: '',
  phone: '',
  address: '',
  city: '',
  pincode: '',
  paymentMethod: 'COD',
};

export const CheckoutModal: React.FC = () => {
  const { checkoutOpen } = useUIState();
  const cartItems = useCartItems();
  const summary = getCartSummary(cartItems);

  const [step, setStep] = useState<'details' | 'confirm' | 'done'>('details');
  const [form, setForm] = useState<CustomerFormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof CustomerFormState, string>>>({});
  const [completedOrder, setCompletedOrder] = useState<OrderRecord | null>(null);
  const [copiedReceipt, setCopiedReceipt] = useState(false);

  useEffect(() => {
    if (checkoutOpen) {
      setStep('details');
      setErrors({});
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [checkoutOpen]);

  if (!checkoutOpen) return null;

  const validateForm = (): boolean => {
    const nextErrors: Partial<Record<keyof CustomerFormState, string>> = {};
    if (!form.name.trim()) {
      nextErrors.name = 'Please enter your full name';
    }
    const cleanPhone = form.phone.replace(/\s+/g, '').replace(/^\+91/, '');
    if (!/^[0-9]{10}$/.test(cleanPhone)) {
      nextErrors.phone = 'Enter a valid 10-digit Indian mobile number';
    }
    if (!form.address.trim() || form.address.trim().length < 5) {
      nextErrors.address = 'Please enter your complete house/street delivery address';
    }
    if (!form.city.trim()) {
      nextErrors.city = 'City or town is required';
    }
    if (!/^[0-9]{6}$/.test(form.pincode.trim())) {
      nextErrors.pincode = 'Enter a valid 6-digit PIN code';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleProceedToConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (summary.items.length === 0) return;
    if (validateForm()) {
      setStep('confirm');
    }
  };

  const handleFinalizeOrder = (): OrderRecord => {
    const newOrder: OrderRecord = {
      orderId: generateNextOrderId(),
      date: new Date().toLocaleString('en-IN'),
      customer: {
        name: form.name.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        city: form.city.trim(),
        pincode: form.pincode.trim(),
        paymentMethod: form.paymentMethod,
      },
      items: summary.items,
      subtotal: summary.subtotal,
      discountPct: summary.discountPct,
      discountAmount: summary.discountAmount,
      deliveryCharge: summary.delivery,
      grandTotal: summary.total,
      status: 'Confirmed — Preparing Dispatch',
    };
    saveOrderRecord(newOrder);
    setCompletedOrder(newOrder);
    clearCart();
    setStep('done');
    return newOrder;
  };

  const previewOrderForLink: OrderRecord = completedOrder || {
    orderId: 1042,
    date: new Date().toLocaleString('en-IN'),
    customer: {
      name: form.name.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      city: form.city.trim(),
      pincode: form.pincode.trim(),
      paymentMethod: form.paymentMethod,
    },
    items: summary.items,
    subtotal: summary.subtotal,
    discountPct: summary.discountPct,
    discountAmount: summary.discountAmount,
    deliveryCharge: summary.delivery,
    grandTotal: summary.total,
    status: 'Pending',
  };

  const whatsappUrl = buildWhatsAppUrl(formatWhatsAppOrderMessage(previewOrderForLink));

  const handleCopySummary = () => {
    if (!completedOrder) return;
    navigator.clipboard?.writeText(formatWhatsAppOrderMessage(completedOrder));
    setCopiedReceipt(true);
    showToast('Order summary copied to clipboard');
    setTimeout(() => setCopiedReceipt(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-[var(--color-background)]"
      role="dialog"
      aria-modal="true"
      aria-label="KBR Masale Checkout"
    >
      {/* Top Checkout Bar with Safe-Area Support */}
      <header className="sticky top-0 z-10 border-b border-[var(--color-border)] bg-[var(--color-surface)]/95 backdrop-blur-md pt-safe">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between gap-2 px-4 sm:px-6">
          <button
            type="button"
            onClick={() => {
              if (step === 'details') {
                closeCheckoutModal();
                openCartDrawer();
              } else if (step === 'confirm') {
                setStep('details');
              } else {
                closeCheckoutModal();
              }
            }}
            className="inline-flex min-h-[42px] items-center gap-1.5 text-xs font-semibold text-[var(--color-primary)] hover:underline shrink-0"
          >
            <ArrowLeft className="h-4 w-4 shrink-0" />
            <span>
              {step === 'details'
                ? 'Back to Bag'
                : step === 'confirm'
                ? 'Edit Address'
                : 'Return to Store'}
            </span>
          </button>

          <span className="font-display text-base sm:text-lg font-semibold text-[var(--color-text)] truncate">
            KBR Masale Checkout
          </span>

          <button
            type="button"
            onClick={closeCheckoutModal}
            aria-label="Close checkout"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-text-secondary)] shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Step Progress Line */}
        <div className="h-1 w-full bg-[var(--color-border)]">
          <div
            className="h-full bg-[var(--color-primary)] transition-all duration-200"
            style={{
              width: step === 'details' ? '33%' : step === 'confirm' ? '66%' : '100%',
            }}
          />
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 pt-6 pb-safe sm:px-6 sm:py-12">
        {/* STEP 1: DELIVERY ADDRESS & PAYMENT FORM */}
        {step === 'details' && (
          <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-12">
            <form
              onSubmit={handleProceedToConfirm}
              noValidate
              className="lg:col-span-7 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-7 space-y-5"
            >
              <div>
                <p className="text-xs font-medium text-[var(--color-secondary)]">
                  Step 1 of 2 · Direct Home Delivery
                </p>
                <h2 className="mt-1 font-display text-xl sm:text-2xl font-semibold text-[var(--color-text)]">
                  Delivery Address &amp; Contact
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="chk-name"
                    className="block text-xs font-semibold text-[var(--color-text)] mb-1.5"
                  >
                    Full Name <span className="text-[var(--color-error)]">*</span>
                  </label>
                  <input
                    id="chk-name"
                    type="text"
                    required
                    autoComplete="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Ramesh Patel"
                    className="w-full min-h-[46px] rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3.5 py-2.5 text-base sm:text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-[var(--color-error)]">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="chk-phone"
                    className="block text-xs font-semibold text-[var(--color-text)] mb-1.5"
                  >
                    10-Digit Mobile (WhatsApp) <span className="text-[var(--color-error)]">*</span>
                  </label>
                  <input
                    id="chk-phone"
                    type="tel"
                    inputMode="numeric"
                    required
                    autoComplete="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="9876543210"
                    className="w-full min-h-[46px] rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3.5 py-2.5 text-base sm:text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none font-mono-num"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-xs text-[var(--color-error)]">{errors.phone}</p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="chk-address"
                  className="block text-xs font-semibold text-[var(--color-text)] mb-1.5"
                >
                  Complete Street Address &amp; Landmark{' '}
                  <span className="text-[var(--color-error)]">*</span>
                </label>
                <textarea
                  id="chk-address"
                  rows={2}
                  required
                  autoComplete="street-address"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="House/Flat No., Building, Street, Locality / Landmark"
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-3.5 text-base sm:text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none resize-none"
                />
                {errors.address && (
                  <p className="mt-1 text-xs text-[var(--color-error)]">{errors.address}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="chk-city"
                    className="block text-xs font-semibold text-[var(--color-text)] mb-1.5"
                  >
                    City / District <span className="text-[var(--color-error)]">*</span>
                  </label>
                  <input
                    id="chk-city"
                    type="text"
                    required
                    autoComplete="address-level2"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    placeholder="e.g. Jaipur, Delhi, Mumbai"
                    className="w-full min-h-[46px] rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3.5 py-2.5 text-base sm:text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                  />
                  {errors.city && (
                    <p className="mt-1 text-xs text-[var(--color-error)]">{errors.city}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="chk-pincode"
                    className="block text-xs font-semibold text-[var(--color-text)] mb-1.5"
                  >
                    6-Digit PIN Code <span className="text-[var(--color-error)]">*</span>
                  </label>
                  <input
                    id="chk-pincode"
                    type="text"
                    inputMode="numeric"
                    required
                    maxLength={6}
                    autoComplete="postal-code"
                    value={form.pincode}
                    onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                    placeholder="302001"
                    className="w-full min-h-[46px] rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3.5 py-2.5 text-base sm:text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none font-mono-num"
                  />
                  {errors.pincode && (
                    <p className="mt-1 text-xs text-[var(--color-error)]">{errors.pincode}</p>
                  )}
                </div>
              </div>

              {/* Payment Method Selection: Touch-friendly cards with explicit radio state */}
              <div>
                <span className="block text-xs font-semibold text-[var(--color-text)] mb-2">
                  Select Payment Method
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(
                    [
                      {
                        id: 'COD',
                        title: 'Cash on Delivery (COD)',
                        desc: 'Pay cash at your doorstep upon receiving your parcel',
                      },
                      {
                        id: 'UPI',
                        title: 'Online UPI / QR Transfer',
                        desc: 'Instant UPI QR shared on WhatsApp upon confirmation',
                      },
                    ] as const
                  ).map((method) => {
                    const isSelected = form.paymentMethod === method.id;
                    return (
                      <button
                        key={method.id}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        onClick={() => setForm({ ...form, paymentMethod: method.id })}
                        className={`flex items-start gap-3 rounded-lg border p-4 text-left transition-colors duration-150 min-h-[68px] ${
                          isSelected
                            ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/8 ring-1 ring-[var(--color-primary)]'
                            : 'border-[var(--color-border)] bg-[var(--color-background)]'
                        }`}
                      >
                        <span
                          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                            isSelected
                              ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white'
                              : 'border-[var(--color-text-muted)] bg-[var(--color-surface)]'
                          }`}
                        >
                          {isSelected && <Check className="h-3 w-3" />}
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-semibold text-[var(--color-text)]">
                            {method.title}
                          </p>
                          <p className="mt-0.5 text-[11px] text-[var(--color-text-muted)] leading-snug">
                            {method.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                className="flex min-h-[48px] w-full items-center justify-center rounded-lg bg-[var(--color-primary)] py-3.5 px-5 text-xs sm:text-sm font-semibold text-white hover:bg-[var(--color-primary-dark)] transition-colors duration-150"
              >
                Review Order Details ({formatINR(summary.total)})
              </button>
            </form>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6 h-fit">
              <h3 className="font-display text-lg font-semibold text-[var(--color-text)]">
                Order Summary ({summary.count} packs)
              </h3>
              <div className="mt-4 divide-y divide-[var(--color-border)]/60 text-xs">
                {summary.items.map((item) => (
                  <div
                    key={`${item.productId}-${item.weight}`}
                    className="flex justify-between gap-2 py-2.5"
                  >
                    <span className="text-[var(--color-text-secondary)]">
                      {item.name} ({item.weight}) × {item.qty}
                    </span>
                    <span className="font-mono-num font-medium text-[var(--color-text)] shrink-0">
                      {formatINR(item.lineTotal)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 border-t border-[var(--color-border)] pt-4 space-y-2 text-xs">
                <div className="flex justify-between text-[var(--color-text-secondary)]">
                  <span>Subtotal</span>
                  <span className="font-mono-num">{formatINR(summary.subtotal)}</span>
                </div>
                {summary.discountPct > 0 && (
                  <div className="flex justify-between text-[var(--color-success)] font-medium">
                    <span>Discount ({summary.discountPct}% Off)</span>
                    <span className="font-mono-num">
                      −{formatINR(summary.discountAmount)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-[var(--color-text-secondary)]">
                  <span>Delivery Charge</span>
                  <span className="font-mono-num">
                    {summary.delivery === 0 ? 'FREE' : formatINR(summary.delivery)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-[var(--color-border)] pt-2.5 text-sm font-semibold text-[var(--color-text)]">
                  <span>Total Payable</span>
                  <span className="font-mono-num text-lg text-[var(--color-primary)]">
                    {formatINR(summary.total)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: CONFIRMATION & 1-TAP WHATSAPP DISPATCH */}
        {step === 'confirm' && (
          <div className="mx-auto max-w-xl rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-8">
            <p className="text-xs font-medium text-[var(--color-secondary)]">
              Step 2 of 2 · Final Verification
            </p>
            <h2 className="mt-1 font-display text-xl sm:text-2xl font-semibold text-[var(--color-text)]">
              Confirm Your Spice Order
            </h2>

            <div className="mt-5 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-4 text-xs space-y-1.5">
              <p className="font-semibold text-[var(--color-text)]">{form.name}</p>
              <p className="text-[var(--color-text-secondary)]">Phone: {form.phone}</p>
              <p className="text-[var(--color-text-secondary)]">
                Address: {form.address}, {form.city} — {form.pincode}
              </p>
              <p className="text-[var(--color-primary)] font-medium">
                Payment Mode:{' '}
                {form.paymentMethod === 'COD' ? 'Cash on Delivery (COD)' : 'Online UPI / QR'}
              </p>
            </div>

            <div className="mt-5 divide-y divide-[var(--color-border)] text-xs">
              {summary.items.map((item) => (
                <div
                  key={`${item.productId}-${item.weight}`}
                  className="flex justify-between gap-2 py-2"
                >
                  <span>
                    {item.name} ({item.weight}) × {item.qty}
                  </span>
                  <span className="font-mono-num font-medium shrink-0">
                    {formatINR(item.lineTotal)}
                  </span>
                </div>
              ))}
              <div className="flex justify-between pt-3 text-sm font-semibold text-[var(--color-text)]">
                <span>Grand Total</span>
                <span className="font-mono-num text-lg text-[var(--color-primary)]">
                  {formatINR(summary.total)}
                </span>
              </div>
            </div>

            <div className="mt-6 space-y-2.5">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => {
                  handleFinalizeOrder();
                }}
                className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-lg bg-[var(--color-primary)] py-3.5 px-4 text-xs sm:text-sm font-semibold text-white hover:bg-[var(--color-primary-dark)] transition-colors duration-150 text-center"
              >
                <MessageCircle className="h-4 w-4 shrink-0" />
                <span>Confirm Order &amp; Send on WhatsApp (1-Tap)</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  handleFinalizeOrder();
                }}
                className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] py-2.5 px-4 text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text)] text-center"
              >
                <span>Confirm Order Receipt Without Opening WhatsApp</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: ORDER CONFIRMED RECEIPT */}
        {step === 'done' && completedOrder && (
          <div className="mx-auto max-w-xl rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-success)]/10 text-[var(--color-success)]">
              <CheckCircle2 className="h-6 w-6" />
            </div>

            <p className="mt-3 font-mono-num text-xs font-semibold text-[var(--color-success)]">
              Order #{completedOrder.orderId} Confirmed — Preparing Shipment
            </p>
            <h2 className="mt-1 font-display text-xl sm:text-2xl font-semibold text-[var(--color-text)]">
              Thank You, {completedOrder.customer.name}!
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed">
              Your KBR Masale order has been recorded. Our dispatch team will verify your parcel
              for {completedOrder.customer.city} ({completedOrder.customer.pincode}) within 1–4
              working days.
            </p>

            <div className="mt-6 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-4 text-left text-xs space-y-2">
              <div className="flex justify-between border-b border-[var(--color-border)] pb-2">
                <span className="text-[var(--color-text-muted)]">Order Reference</span>
                <span className="font-mono-num font-semibold">
                  #{completedOrder.orderId}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-muted)]">Payment Mode</span>
                <span className="font-medium">{completedOrder.customer.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-muted)]">Total Payable</span>
                <span className="font-mono-num font-semibold text-[var(--color-primary)]">
                  {formatINR(completedOrder.grandTotal)}
                </span>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-2.5">
              <a
                href={buildWhatsAppUrl(formatWhatsAppOrderMessage(completedOrder))}
                target="_blank"
                rel="noreferrer"
                className="flex-1 inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg bg-[var(--color-primary)] py-3 px-4 text-xs sm:text-sm font-semibold text-white hover:bg-[var(--color-primary-dark)]"
              >
                <MessageCircle className="h-4 w-4 shrink-0" />
                <span>Open WhatsApp Order Chat</span>
              </a>

              <button
                type="button"
                onClick={handleCopySummary}
                className="inline-flex min-h-[48px] items-center justify-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] py-3 px-4 text-xs font-semibold text-[var(--color-text)] hover:border-[var(--color-primary)]"
              >
                {copiedReceipt ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-[var(--color-success)]" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy Receipt</span>
                  </>
                )}
              </button>
            </div>

            <button
              type="button"
              onClick={closeCheckoutModal}
              className="mt-5 min-h-[40px] px-4 text-xs font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-text)] underline"
            >
              Continue Browsing KBR Masale
            </button>
          </div>
        )}
      </main>
    </div>
  );
};
