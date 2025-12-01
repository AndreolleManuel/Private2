// ===============================
// DATE FORMATTERS
// ===============================

// Format a date string into a human-readable French format.
// Example: "2025-10-10" → "10/10/2025"
// Accepts an optional month format ("2-digit" | "long" | "short" | etc.)
export function formatDateToDisplay(dateString, month = "2-digit") {
  if (!dateString) return ""; // Return empty string if invalid input

  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: month,
    year: "numeric",
  });
};

// Convert a date string to ISO 8601 format.
// Example: "2025-10-10" → "2025-10-10T00:00:00.000Z"
// Useful for metadata (schema.org, datetime attributes, etc.)
export function formatDateToIso(dateString) {
  if (!dateString) return ""; // Guard clause for empty or null input
  return new Date(dateString).toISOString();
};