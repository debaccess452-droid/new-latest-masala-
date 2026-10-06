import React, { useState } from 'react';
import { Star, CheckCircle2, Send } from 'lucide-react';
import { SPICE_PRODUCTS } from '../data/spices';
import { addCustomerReview, showToast, useReviews } from '../store/shopStore';

export const ReviewsSection: React.FC = () => {
  const reviews = useReviews();
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [product, setProduct] = useState(SPICE_PRODUCTS[0].name);
  const [rating, setRating] = useState('5');
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const avgRating = (
    reviews.reduce((sum, r) => sum + r.rating, 0) / Math.max(1, reviews.length)
  ).toFixed(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!comment.trim() || comment.trim().length < 10) {
      setError('Please write at least a brief sentence about your experience.');
      return;
    }

    setError('');
    addCustomerReview({
      name: name.trim(),
      roleOrLocation: location.trim()
        ? `Verified Household · ${location.trim()}`
        : 'Verified Kitchen Customer',
      rating: Number(rating),
      comment: comment.trim(),
      product,
      outcomeHighlight: `Verified ${product.replace('KBR ', '')} Experience`,
    });

    setName('');
    setLocation('');
    setComment('');
    setRating('5');
    setSubmittedSuccess(true);
    showToast('Thank you! Your verified review has been published.');
    setTimeout(() => setSubmittedSuccess(false), 4000);
  };

  return (
    <section
      id="reviews"
      className="scroll-mt-16 border-b border-[var(--color-border)] bg-[var(--color-background)] py-14 sm:py-24"
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-[var(--color-border)] pb-6 sm:pb-8">
          <div>
            <p className="text-xs font-medium text-[var(--color-secondary)]">
              04. Household Proof · ग्राहक समीक्षा
            </p>
            <h2 className="mt-2 font-display heading-section-fluid font-semibold tracking-tight text-[var(--color-text)]">
              Trusted by Everyday Indian Kitchens
            </h2>
            <p className="mt-2 max-w-xl text-sm sm:text-base text-[var(--color-text-secondary)]">
              Direct feedback from home cooks and culinary professionals using KBR Haldi, Lal
              Mirch, Dhaniya, and Jeera in their daily meals.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 self-start sm:self-auto">
            <div className="flex items-center text-[var(--color-accent)] shrink-0">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <div className="text-xs">
              <span className="font-mono-num font-semibold text-[var(--color-text)]">
                {avgRating} / 5.0
              </span>
              <span className="text-[var(--color-text-muted)]">
                {' '}
                · {reviews.length} Verified Reviews
              </span>
            </div>
          </div>
        </div>

        {/* Main Grid: Reviews List (7 cols) + Write a Review Form (5 cols) */}
        <div className="mt-8 sm:mt-10 grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-12 lg:items-start">
          {/* Reviews Cards Column (Stacks vertically on mobile) */}
          <div className="lg:col-span-7 space-y-4">
            {reviews.map((rev) => (
              <article
                key={rev.id}
                className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:p-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--color-text-muted)]">
                  <div className="flex items-center gap-2">
                    <div
                      className="flex items-center text-[var(--color-accent)]"
                      aria-label={`${rev.rating} out of 5 stars`}
                    >
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star
                          key={n}
                          className={`h-3.5 w-3.5 ${
                            n <= rev.rating ? 'fill-current' : 'opacity-25'
                          }`}
                        />
                      ))}
                    </div>
                    <span aria-hidden="true">·</span>
                    <span className="font-medium text-[var(--color-success)] inline-flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                      <span>Verified Purchase</span>
                    </span>
                  </div>
                  <span className="text-[11px] sm:text-xs">
                    {rev.product} · {rev.date}
                  </span>
                </div>

                <p className="mt-3 text-sm sm:text-base text-[var(--color-text)] leading-relaxed">
                  &ldquo;{rev.comment}&rdquo;
                </p>

                <div className="mt-4 pt-3 border-t border-[var(--color-border)]/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 text-xs">
                  <div>
                    <span className="font-semibold text-[var(--color-text)]">{rev.name}</span>
                    <span className="text-[var(--color-text-muted)]">
                      {' '}
                      · {rev.roleOrLocation}
                    </span>
                  </div>
                  <span className="text-[var(--color-secondary)] font-medium">
                    {rev.outcomeHighlight}
                  </span>
                </div>
              </article>
            ))}
          </div>

          {/* Write a Review Form Column */}
          <div className="lg:col-span-5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-7">
            <h3 className="font-display text-lg sm:text-xl font-semibold text-[var(--color-text)]">
              Share Your Kitchen Experience
            </h3>
            <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
              Have you cooked with KBR Masale? Let other households know about the aroma, natural
              colour, and packaging.
            </p>

            <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label
                    htmlFor="review-name"
                    className="block text-xs font-semibold text-[var(--color-text)] mb-1.5"
                  >
                    Your Full Name <span className="text-[var(--color-error)]">*</span>
                  </label>
                  <input
                    id="review-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Meenakshi Verma"
                    className="w-full min-h-[44px] rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3.5 py-2 text-base sm:text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)] focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="review-city"
                    className="block text-xs font-semibold text-[var(--color-text)] mb-1.5"
                  >
                    City / State
                  </label>
                  <input
                    id="review-city"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Lucknow, UP"
                    className="w-full min-h-[44px] rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3.5 py-2 text-base sm:text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label
                    htmlFor="review-product"
                    className="block text-xs font-semibold text-[var(--color-text)] mb-1.5"
                  >
                    Spice Purchased
                  </label>
                  <select
                    id="review-product"
                    value={product}
                    onChange={(e) => setProduct(e.target.value)}
                    className="w-full min-h-[44px] rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-base sm:text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                  >
                    {SPICE_PRODUCTS.map((p) => (
                      <option key={p.id} value={p.name}>
                        {p.name}
                      </option>
                    ))}
                    <option value="All 4 KBR Spices Bundle">All 4 KBR Spices Bundle</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="review-rating"
                    className="block text-xs font-semibold text-[var(--color-text)] mb-1.5"
                  >
                    Rating <span className="text-[var(--color-error)]">*</span>
                  </label>
                  <select
                    id="review-rating"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="w-full min-h-[44px] rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-base sm:text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                  >
                    <option value="5">5 Stars — Exceptional Purity</option>
                    <option value="4">4 Stars — Very Good Quality</option>
                    <option value="3">3 Stars — Satisfactory</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="review-comment"
                  className="block text-xs font-semibold text-[var(--color-text)] mb-1.5"
                >
                  Your Feedback <span className="text-[var(--color-error)]">*</span>
                </label>
                <textarea
                  id="review-comment"
                  rows={3}
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Describe how the aroma, colour, or freshness compared in your cooking..."
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-3.5 text-base sm:text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)] focus:outline-none resize-none"
                />
              </div>

              {error && (
                <p role="alert" className="text-xs font-medium text-[var(--color-error)]">
                  {error}
                </p>
              )}

              {submittedSuccess && (
                <p
                  role="status"
                  className="text-xs font-medium text-[var(--color-success)] flex items-center gap-1.5"
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>Your review is now live in the household ledger.</span>
                </p>
              )}

              <button
                type="submit"
                className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-lg bg-[var(--color-primary)] px-5 py-3 text-xs sm:text-sm font-semibold text-white hover:bg-[var(--color-primary-dark)] transition-colors duration-150 whitespace-nowrap"
              >
                <Send className="h-3.5 w-3.5 shrink-0" />
                <span>Publish Verified Review</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
