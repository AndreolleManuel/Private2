// ===============================
// CAMPAIGN PROGRESS CALCULATOR
// ===============================

// Calculate the progress percentage of a campaign based on tree stock.
// Each tree object is expected to have:
//   - stock: total number of trees available
//   - quantity: number of trees remaining (or unsold)
//
// Example:
//   If 10 trees in total, 3 left → progress = 70%
export function campaignProgress(trees) {
  // Return 0% if no data
  if (!trees || trees.length === 0) return 0;

  let totalStock = 0;
  let totalSold = 0;

  // Loop through each tree in the campaign
  for (const tree of trees) {
    const stock = tree.stock || 0;     // Total stock for this tree
    const quantity = tree.quantity || 0; // Remaining quantity
    totalStock += stock;
    totalSold += Math.max(0, stock - quantity); // Count only positive sales
  }

  // Return percentage of trees sold, rounded to the nearest integer
  return totalStock > 0
    ? Math.round((totalSold / totalStock) * 100)
    : 0;
};