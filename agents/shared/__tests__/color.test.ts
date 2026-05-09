import { contrastRatio, deriveContentColor, relativeLuminance } from "../color";

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
