// ===============================
// TREE PROGRESS CALCULATOR
// ===============================

// Calculate the percentage of trees sold for a single tree type.
//
// Parameters:
//   stock (number)   → total initial stock of trees
//   quantity (number) → number of trees remaining (unsold)
//
// Returns:
//   A rounded percentage (0–100) representing how much stock has been sold.
//
// Example:
//   treeProgress(100, 25) → 75
export function treeProgress(stock, quantity) {
  // Validate input — ensure both are numbers and stock is positive
  if (typeof stock !== "number" || typeof quantity !== "number" || stock <= 0) {
    return 0; // Return 0% if invalid input or no stock
  }

  // Calculate the number of trees sold
  const sold = stock - quantity;

  // Return the percentage sold, ensuring it’s never negative
  return Math.max(0, Math.round((sold / stock) * 100));
}