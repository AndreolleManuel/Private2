import { describe, it, expect } from "vitest";
import { formatDateToDisplay } from "./DateFormatter.js";

describe("formatDateToDisplay", () => {
  it("retourne une date formatée en français (par défaut mois sur 2 chiffres)", () => {
    const date = "2025-10-10";
    const result = formatDateToDisplay(date);
    expect(result).toBe("10/10/2025");
  });

  it("retourne une date avec le mois en toutes lettres si 'long' est passé", () => {
    const date = "2025-03-15";
    const result = formatDateToDisplay(date, "long");
    expect(result).toMatch(/15 mars 2025/i);
  });

  it("retourne une chaîne vide si la date est invalide", () => {
    expect(formatDateToDisplay("")).toBe("");
    expect(formatDateToDisplay(null)).toBe("");
    expect(formatDateToDisplay(undefined)).toBe("");
  });
});