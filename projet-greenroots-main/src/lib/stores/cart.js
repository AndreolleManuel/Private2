import { writable } from "svelte/store";

// ===============================
// INITIALIZATION
// ===============================

// Check if localStorage is available (for SSR safety)
const storedCart =
  typeof localStorage !== "undefined" && localStorage.getItem("cart");

// Initialize the writable store with persisted data (if available)
export const cart = writable(storedCart ? JSON.parse(storedCart) : []);

// ===============================
// LOCAL STORAGE SYNC
// ===============================
// Automatically persist cart state to localStorage whenever it changes
cart.subscribe((value) => {
  if (typeof localStorage !== "undefined") {
    localStorage.setItem("cart", JSON.stringify(value));
  }
});

// ===============================
// ACTIONS
// ===============================

// Add a product (tree) to the cart
// If it already exists, increment its quantity
export function addToCart(tree) {
  cart.update((items) => {
    const existing = items.find((item) => item.id === tree.id);
    if (existing) {
      // Return a new array with updated quantity for the matching item
      return items.map((item) =>
        item.id === tree.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    }
    // Otherwise, add the new tree with quantity = 1
    return [...items, { ...tree, quantity: 1 }];
  });
};

// Remove an item from the cart by its ID
export function removeFromCart(id) {
  cart.update((items) => items.filter((item) => item.id !== id));
};

// Update the quantity of an item in the cart
// Quantity is clamped to a minimum of 1
export function updateQuantity(id, quantity) {
  cart.update((items) =>
    items.map((item) =>
      item.id === id
        ? { ...item, quantity: Math.max(1, quantity) }
        : item
    )
  );
};

// Clear the entire cart
export function clearCart() {
  cart.set([]);
};