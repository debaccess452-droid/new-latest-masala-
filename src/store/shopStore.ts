import { useSyncExternalStore } from 'react';
import {
  BRAND_CONFIG,
  CustomerReview,
  DISCOUNT_TIERS,
  getProductById,
  INITIAL_REVIEWS,
  PackWeight,
  SpiceProduct,
  SPICE_PRODUCTS,
} from '../data/spices';

export interface CartItem {
  productId: number;
  weight: PackWeight;
  qty: number;
}

export interface EnrichedCartItem extends CartItem {
  name: string;
  shortName: string;
  hindi: string;
  image: string;
  unitPrice: number;
  lineTotal: number;
  batchCode: string;
}

export interface CartSummary {
  items: EnrichedCartItem[];
  subtotal: number;
  discountPct: number;
  discountAmount: number;
  delivery: number;
  total: number;
  count: number;
  nextDiscountHint: string | null;
  freeDeliveryHint: string | null;
}

export interface OrderRecord {
  orderId: number;
  date: string;
  customer: {
    name: string;
    phone: string;
    address: string;
    city: string;
    pincode: string;
    paymentMethod: 'COD' | 'UPI';
  };
  items: EnrichedCartItem[];
  subtotal: number;
  discountPct: number;
  discountAmount: number;
  deliveryCharge: number;
  grandTotal: number;
  status: string;
}

export type PolicyModalType = 'shipping' | 'returns' | 'privacy' | null;

interface UIState {
  productModal: SpiceProduct | null;
  cartOpen: boolean;
  wishlistOpen: boolean;
  checkoutOpen: boolean;
  searchOpen: boolean;
  mobileMenuOpen: boolean;
  policyModal: PolicyModalType;
  toast: { id: number; message: string } | null;
}

// ==========================================
// 1. CART STORE (kbr_cart_v2)
// ==========================================
const CART_STORAGE_KEY = 'kbr_cart_v2';

function loadInitialCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item: CartItem) =>
        item &&
        typeof item.productId === 'number' &&
        getProductById(item.productId) &&
        typeof item.qty === 'number' &&
        item.qty > 0
    );
  } catch {
    return [];
  }
}

let cartItems: CartItem[] = loadInitialCart();
const cartListeners = new Set<() => void>();

function notifyCart() {
  cartListeners.forEach((listener) => listener());
}

function saveCart() {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  } catch {
    // ignore storage errors
  }
}

function subscribeCart(listener: () => void) {
  cartListeners.add(listener);
  return () => {
    cartListeners.delete(listener);
  };
}

function getCartSnapshot() {
  return cartItems;
}

export function useCartItems(): CartItem[] {
  return useSyncExternalStore(subscribeCart, getCartSnapshot);
}

export function addToCart(productId: number, weight: PackWeight = '100g', qty = 1) {
  const existing = cartItems.find((item) => item.productId === productId && item.weight === weight);
  if (existing) {
    cartItems = cartItems.map((item) =>
      item === existing ? { ...item, qty: item.qty + qty } : item
    );
  } else {
    cartItems = [...cartItems, { productId, weight, qty }];
  }
  saveCart();
  notifyCart();
}

export function updateCartQty(productId: number, weight: PackWeight, qty: number) {
  if (qty <= 0) {
    cartItems = cartItems.filter((item) => !(item.productId === productId && item.weight === weight));
  } else {
    cartItems = cartItems.map((item) =>
      item.productId === productId && item.weight === weight ? { ...item, qty } : item
    );
  }
  saveCart();
  notifyCart();
}

export function removeFromCart(productId: number, weight: PackWeight) {
  cartItems = cartItems.filter((item) => !(item.productId === productId && item.weight === weight));
  saveCart();
  notifyCart();
}

export function clearCart() {
  cartItems = [];
  saveCart();
  notifyCart();
}

export function computeDiscount(subtotal: number): { pct: number; amount: number } {
  const matchedTier = DISCOUNT_TIERS.find((tier) => subtotal > tier.min);
  const pct = matchedTier ? matchedTier.pct : 0;
  return {
    pct,
    amount: Math.round((subtotal * pct) / 100),
  };
}

export function computeDelivery(subtotal: number): number {
  return subtotal > 0 && subtotal < BRAND_CONFIG.freeDeliveryMin
    ? BRAND_CONFIG.deliveryCharge
    : 0;
}

export function getNextDiscountHint(subtotal: number): string | null {
  const nextTier = [...DISCOUNT_TIERS].reverse().find((tier) => subtotal <= tier.min);
  if (!nextTier) return null;
  const diff = nextTier.min + 1 - subtotal;
  return `Add ₹${diff.toLocaleString('en-IN')} more to unlock ${nextTier.pct}% automatic discount`;
}

export function getFreeDeliveryHint(subtotal: number): string | null {
  if (subtotal <= 0) return `Free pan-India delivery on orders ₹${BRAND_CONFIG.freeDeliveryMin}+`;
  if (subtotal < BRAND_CONFIG.freeDeliveryMin) {
    const diff = BRAND_CONFIG.freeDeliveryMin - subtotal;
    return `Add ₹${diff.toLocaleString('en-IN')} more for FREE home delivery`;
  }
  return null;
}

export function getCartSummary(items: CartItem[]): CartSummary {
  const enriched: EnrichedCartItem[] = items.flatMap((item) => {
    const product = getProductById(item.productId);
    if (!product) return [];
    const unitPrice = product.pricing[item.weight] ?? product.pricing['100g'];
    return [
      {
        ...item,
        name: product.name,
        shortName: product.shortName,
        hindi: product.hindi,
        image: product.image,
        unitPrice,
        lineTotal: unitPrice * item.qty,
        batchCode: product.batchCode,
      },
    ];
  });

  const subtotal = enriched.reduce((acc, item) => acc + item.lineTotal, 0);
  const { pct: discountPct, amount: discountAmount } = computeDiscount(subtotal);
  const delivery = computeDelivery(subtotal);
  const total = subtotal - discountAmount + delivery;
  const count = enriched.reduce((acc, item) => acc + item.qty, 0);

  return {
    items: enriched,
    subtotal,
    discountPct,
    discountAmount,
    delivery,
    total,
    count,
    nextDiscountHint: getNextDiscountHint(subtotal),
    freeDeliveryHint: getFreeDeliveryHint(subtotal),
  };
}

// ==========================================
// 2. WISHLIST STORE (kbr_wishlist_v2)
// ==========================================
const WISHLIST_STORAGE_KEY = 'kbr_wishlist_v2';

function loadInitialWishlist(): number[] {
  try {
    const raw = localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((id: number) => Boolean(getProductById(id)));
  } catch {
    return [];
  }
}

let wishlistIds: number[] = loadInitialWishlist();
const wishlistListeners = new Set<() => void>();

function notifyWishlist() {
  wishlistListeners.forEach((l) => l());
}

function saveWishlist() {
  try {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistIds));
  } catch {
    // ignore
  }
}

function subscribeWishlist(listener: () => void) {
  wishlistListeners.add(listener);
  return () => {
    wishlistListeners.delete(listener);
  };
}

function getWishlistSnapshot() {
  return wishlistIds;
}

export function useWishlistIds(): number[] {
  return useSyncExternalStore(subscribeWishlist, getWishlistSnapshot);
}

export function useWishlistProducts(): SpiceProduct[] {
  const ids = useWishlistIds();
  return SPICE_PRODUCTS.filter((p) => ids.includes(p.id));
}

export function isProductWishlisted(productId: number): boolean {
  return wishlistIds.includes(productId);
}

export function toggleWishlist(productId: number): boolean {
  const exists = wishlistIds.includes(productId);
  wishlistIds = exists
    ? wishlistIds.filter((id) => id !== productId)
    : [...wishlistIds, productId];
  saveWishlist();
  notifyWishlist();
  return !exists;
}

// ==========================================
// 3. REVIEWS STORE (kbr_reviews_custom_v2)
// ==========================================
const REVIEWS_STORAGE_KEY = 'kbr_reviews_custom_v2';

function loadCustomReviews(): CustomerReview[] {
  try {
    const raw = localStorage.getItem(REVIEWS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

let allReviews: CustomerReview[] = [...loadCustomReviews(), ...INITIAL_REVIEWS];
const reviewListeners = new Set<() => void>();

function notifyReviews() {
  reviewListeners.forEach((l) => l());
}

function subscribeReviews(listener: () => void) {
  reviewListeners.add(listener);
  return () => {
    reviewListeners.delete(listener);
  };
}

function getReviewsSnapshot() {
  return allReviews;
}

export function useReviews(): CustomerReview[] {
  return useSyncExternalStore(subscribeReviews, getReviewsSnapshot);
}

export function addCustomerReview(review: Omit<CustomerReview, 'id' | 'date'>) {
  const newEntry: CustomerReview = {
    ...review,
    id: `custom-${Date.now()}`,
    date: 'Just Verified',
  };
  allReviews = [newEntry, ...allReviews];
  try {
    const customOnly = allReviews.filter(
      (r) => !INITIAL_REVIEWS.some((init) => init.id === r.id)
    );
    localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(customOnly));
  } catch {
    // ignore
  }
  notifyReviews();
}

// ==========================================
// 4. ORDER GENERATION & WHATSAPP FORMATTING
// ==========================================
export function generateNextOrderId(): number {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const lastDate = localStorage.getItem('kbr_last_order_date');
    let counter = parseInt(localStorage.getItem('kbr_order_counter') || '1040', 10);
    if (lastDate !== today) {
      counter = 1041;
      localStorage.setItem('kbr_last_order_date', today);
    } else {
      counter = (counter % 10000) + 1;
    }
    localStorage.setItem('kbr_order_counter', String(counter));
    return counter;
  } catch {
    return Math.floor(1000 + Math.random() * 8999);
  }
}

export function saveOrderRecord(order: OrderRecord) {
  try {
    const raw = localStorage.getItem('kbr_orders');
    const existing = raw ? JSON.parse(raw) : [];
    existing.unshift(order);
    localStorage.setItem('kbr_orders', JSON.stringify(existing));
  } catch {
    // ignore
  }
}

export function formatWhatsAppOrderMessage(order: OrderRecord): string {
  const itemLines = order.items
    .map(
      (item, idx) =>
        `${idx + 1}. ${item.name} (${item.weight}) x ${item.qty} = Rs.${item.lineTotal}`
    )
    .join('\n');

  return [
    `*NEW ORDER RECEIVED - KBR MASALE*`,
    `*Order ID:* #${order.orderId}`,
    `--------------------------------`,
    `*Customer Details:*`,
    `Name: ${order.customer.name}`,
    `Phone: ${order.customer.phone}`,
    `Address: ${order.customer.address}, ${order.customer.city} - ${order.customer.pincode}`,
    `Payment Method: ${order.customer.paymentMethod}`,
    `--------------------------------`,
    `*Order Items:*`,
    itemLines,
    `--------------------------------`,
    `Subtotal: Rs.${order.subtotal}`,
    `Discount (${order.discountPct}%): -Rs.${order.discountAmount}`,
    `Delivery Fee: Rs.${order.deliveryCharge}`,
    `*Grand Total: Rs.${order.grandTotal}*`,
    `--------------------------------`,
    `Delivery Time: 2-5 Working Days`,
  ].join('\n');
}

export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${BRAND_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

// ==========================================
// 5. UI MODAL & TOAST STORE
// ==========================================
let uiState: UIState = {
  productModal: null,
  cartOpen: false,
  wishlistOpen: false,
  checkoutOpen: false,
  searchOpen: false,
  mobileMenuOpen: false,
  policyModal: null,
  toast: null,
};

const uiListeners = new Set<() => void>();
let toastTimeout: ReturnType<typeof setTimeout> | null = null;
let toastSequence = 0;

function updateUIState(partial: Partial<UIState>) {
  uiState = { ...uiState, ...partial };
  uiListeners.forEach((l) => l());
}

function subscribeUI(listener: () => void) {
  uiListeners.add(listener);
  return () => {
    uiListeners.delete(listener);
  };
}

function getUISnapshot() {
  return uiState;
}

export function useUIState(): UIState {
  return useSyncExternalStore(subscribeUI, getUISnapshot);
}

export function openProductModal(product: SpiceProduct) {
  updateUIState({
    productModal: product,
    cartOpen: false,
    wishlistOpen: false,
    searchOpen: false,
    mobileMenuOpen: false,
  });
}

export function closeProductModal() {
  updateUIState({ productModal: null });
}

export function openCartDrawer() {
  updateUIState({
    cartOpen: true,
    wishlistOpen: false,
    productModal: null,
    searchOpen: false,
    mobileMenuOpen: false,
  });
}

export function closeCartDrawer() {
  updateUIState({ cartOpen: false });
}

export function openWishlistDrawer() {
  updateUIState({
    wishlistOpen: true,
    cartOpen: false,
    searchOpen: false,
    mobileMenuOpen: false,
  });
}

export function closeWishlistDrawer() {
  updateUIState({ wishlistOpen: false });
}

export function openCheckoutModal() {
  updateUIState({
    checkoutOpen: true,
    cartOpen: false,
    productModal: null,
    wishlistOpen: false,
    searchOpen: false,
    mobileMenuOpen: false,
  });
}

export function closeCheckoutModal() {
  updateUIState({ checkoutOpen: false });
}

export function openSearchPopover() {
  updateUIState({
    searchOpen: true,
    mobileMenuOpen: false,
    cartOpen: false,
    wishlistOpen: false,
  });
}

export function closeSearchPopover() {
  updateUIState({ searchOpen: false });
}

export function toggleSearchPopover() {
  updateUIState({
    searchOpen: !uiState.searchOpen,
    mobileMenuOpen: false,
    cartOpen: false,
    wishlistOpen: false,
  });
}

export function setMobileMenuOpen(open: boolean) {
  updateUIState({
    mobileMenuOpen: open,
    ...(open ? { searchOpen: false, cartOpen: false, wishlistOpen: false } : {}),
  });
}

export function openPolicyModal(policy: PolicyModalType) {
  updateUIState({ policyModal: policy });
}

export function closePolicyModal() {
  updateUIState({ policyModal: null });
}

export function showToast(message: string) {
  if (toastTimeout) clearTimeout(toastTimeout);
  toastSequence += 1;
  updateUIState({ toast: { id: toastSequence, message } });
  toastTimeout = setTimeout(() => {
    updateUIState({ toast: null });
  }, 2800);
}
