// ===============================
// STRIPE CLIENT INITIALIZER
// ===============================

// Import Stripe loader for frontend usage
import { loadStripe } from "@stripe/stripe-js";
import { PUBLIC_STRIPE_PUBLISHABLE_KEY } from "$env/static/public";

// Cache the Stripe instance to avoid re-initializing on every call
let stripePromise = null;

/**
 * Retrieve a singleton instance of Stripe.js.
 *
 * - Loads Stripe only once and caches the result in `stripePromise`
 * - Uses the public key from environment variables
 * - Returns a Promise resolving to a Stripe instance, or null if key is missing
 */
export function getStripe() {
  // Initialize Stripe only if it hasn't been created yet
  if (!stripePromise) {
    // Check if public key is provided
    if (!PUBLIC_STRIPE_PUBLISHABLE_KEY) {
      console.error(
        "PUBLIC_STRIPE_PUBLISHABLE_KEY is missing. Check your .env file and restart the dev server."
      );
      return null;
    }

    // Load and cache the Stripe instance (returns a Promise)
    stripePromise = loadStripe(PUBLIC_STRIPE_PUBLISHABLE_KEY);
  }

  // Return the cached instance (Promise)
  return stripePromise;
};