import { injectStyleKitIntoSlots } from "../style-kit-injector";

describe("injectStyleKitIntoSlots", () => {
  it("preserves highlightWord from Content Agent (no overwrite)", () => {
    const result = injectStyleKitIntoSlots(
      "hero-hero-bold-editorial-01",
      { headline: "Construa algo incrivel", highlightWord: "incrivel" },
      { textDecoration: "highlighter" },
    );
    expect(result.highlightWord).toBe("incrivel");
  });

  it("does not fabricate highlightWord when absent (no first-word fallback)", () => {
    const result = injectStyleKitIntoSlots(
      "hero-hero-bold-editorial-01",
      { headline: "Construa algo incrivel" },
      { textDecoration: "highlighter" },
    );
    expect(result.highlightWord).toBeUndefined();
  });

  it("writes revealDisplayWord (not revealHeadline) for cta-image-backdrop-01", () => {
    const result = injectStyleKitIntoSlots(
      "cta-image-backdrop-01",
      { eyebrow: "Marca de confianca", displayWord: "Confianca" },
      { textDecoration: "reveal" },
    );
    expect(result.revealDisplayWord).toBe(true);
    expect(result.revealHeadline).toBeUndefined();
  });

  it("disables revealDisplayWord on CtaImageBackdrop for textDecoration: none", () => {
    const resultHero = injectStyleKitIntoSlots(
      "hero-hero-bold-editorial-01",
      { headline: "Texto" },
      { textDecoration: "none" },
    );
    expect(resultHero.highlightWord).toBeUndefined();
    expect(resultHero.revealHeadline).toBeUndefined();

    const resultCta = injectStyleKitIntoSlots(
      "cta-image-backdrop-01",
      { eyebrow: "Texto" },
      { textDecoration: "none" },
    );
    expect(resultCta.revealDisplayWord).toBe(false);
  });

  it("writes revealHeadline for newly-wired heroes (smoke check on Wave 1 metadata)", () => {
    const result = injectStyleKitIntoSlots(
      "hero-split-image-01",
      { headline: "Texto qualquer" },
      { textDecoration: "reveal" },
    );
    expect(result.revealHeadline).toBe(true);
  });
});
