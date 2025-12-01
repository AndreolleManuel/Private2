// ===============================
// PRICE FORMATTER
// ===============================

// Convert a price in cents to a formatted Euro currency string.
// Example: 1299 → "12,99 €"
// Uses the French locale ("fr-FR") for correct decimal and spacing.
export function formatPriceToDisplay(priceInCents) {
  // Convert cents to euros (e.g. 1299 → 12.99)
  const priceInEuros = priceInCents / 100;

  // Format as Euro currency using Intl API
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(priceInEuros);
};