import {
  blendHex,
  contrastRatio,
  deriveContentColor,
  relativeLuminance,
} from "../color";

const CONTENT_WHITE_OKLCH = "0.98 0.005 264.38";
const CONTENT_NEAR_BLACK_OKLCH = "0.15 0.01 264.38";

describe("contrastRatio", () => {
  it("returns 1 for identical white-on-white", () => {
    expect(contrastRatio("#ffffff", "#ffffff")).toBe(1);
  });

  it("returns 21 for pure black on pure white (WCAG max)", () => {
    expect(contrastRatio("#000000", "#ffffff")).toBe(21);
  });

  it("returns < 1.1 for near-white on white (legal-luxe failure)", () => {
    expect(contrastRatio("#F8F6F2", "#ffffff")).toBeLessThan(1.1);
  });
});

describe("deriveContentColor", () => {
  it("returns near-black OKLCH for a light background (#F8F6F2)", () => {
    expect(deriveContentColor("#F8F6F2")).toBe(CONTENT_NEAR_BLACK_OKLCH);
  });

  it("returns white OKLCH for a dark background (#0F0F0F)", () => {
    expect(deriveContentColor("#0F0F0F")).toBe(CONTENT_WHITE_OKLCH);
  });

  it("returns white OKLCH for a mid-gray background (#4A4A4A)", () => {
    // White-on-#4A4A4A passes AA (~7.6:1); near-black on #4A4A4A fails (~2.7:1).
    expect(deriveContentColor("#4A4A4A")).toBe(CONTENT_WHITE_OKLCH);
  });
});

describe("relativeLuminance", () => {
  it("returns 0.5 fallback for malformed input without throwing", () => {
    expect(relativeLuminance("notacolor")).toBe(0.5);
  });
});

describe("blendHex", () => {
  it("returns hex1 exactly when t=0", () => {
    expect(blendHex("#000000", "#ffffff", 0)).toBe("#000000");
  });

  it("returns hex2 exactly when t=1", () => {
    expect(blendHex("#000000", "#ffffff", 1)).toBe("#ffffff");
  });

  it("blends black-and-white at t=0.5 in linear-RGB space (~#bcbcbc, NOT #808080)", () => {
    const result = blendHex("#000000", "#ffffff", 0.5);
    // Strip leading "#" then parse byte-pair channels.
    expect(result).toMatch(/^#[0-9a-f]{6}$/);
    const r = parseInt(result.slice(1, 3), 16);
    const g = parseInt(result.slice(3, 5), 16);
    const b = parseInt(result.slice(5, 7), 16);
    // Linear-RGB midpoint of (0, 1) → linear 0.5 → sRGB ≈ 0.7354 → byte ≈ 188 (0xbc).
    // Tolerance ±2 per channel covers rounding drift across the round-trip.
    expect(Math.abs(r - 0xbc)).toBeLessThanOrEqual(2);
    expect(Math.abs(g - 0xbc)).toBeLessThanOrEqual(2);
    expect(Math.abs(b - 0xbc)).toBeLessThanOrEqual(2);
    // Sanity: must NOT be the naive sRGB midpoint #808080.
    expect(r).toBeGreaterThan(0x90);
  });

  it("at t=0.15 darkens an off-white toward near-black but stays light", () => {
    const result = blendHex("#F5F4F0", "#0F0F0F", 0.15);
    expect(result).toMatch(/^#[0-9a-f]{6}$/);
    const r = parseInt(result.slice(1, 3), 16);
    const g = parseInt(result.slice(3, 5), 16);
    const b = parseInt(result.slice(5, 7), 16);
    // Each channel must be visibly darker than the off-white source (0xF5/0xF4/0xF0)
    // but still firmly in light range (< 240).
    expect(r).toBeLessThan(0xf5);
    expect(g).toBeLessThan(0xf4);
    expect(b).toBeLessThan(0xf0);
    expect(r).toBeLessThan(240);
    expect(g).toBeLessThan(240);
    expect(b).toBeLessThan(240);
  });
});
