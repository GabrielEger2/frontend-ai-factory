import { buildQuery, buildCacheKey } from "../resolver";
import { SKIP_PATTERN, ASPECT_TO_ORIENTATION } from "../slot-keywords";

/* ------------------------------------------------------------------ */
/*  buildQuery                                                          */
/* ------------------------------------------------------------------ */

describe("buildQuery", () => {
  it("concatenates vertical + slot + mood with single spaces", () => {
    expect(buildQuery("bakery cafe", "storefront exterior", "elegant")).toBe(
      "bakery cafe storefront exterior elegant",
    );
  });

  it("omits the leading vertical when empty (no leading space)", () => {
    expect(buildQuery("", "storefront", "elegant")).toBe("storefront elegant");
  });

  it("omits the trailing mood when empty (no trailing space)", () => {
    expect(buildQuery("bakery cafe", "storefront", "")).toBe(
      "bakery cafe storefront",
    );
  });
});

/* ------------------------------------------------------------------ */
/*  buildCacheKey                                                       */
/* ------------------------------------------------------------------ */

describe("buildCacheKey", () => {
  it("produces the same hash for identical inputs (deterministic)", () => {
    const a = buildCacheKey("bakery storefront elegant", "landscape", "photo");
    const b = buildCacheKey("bakery storefront elegant", "landscape", "photo");
    expect(a).toBe(b);
    // SHA256 hex is 64 chars
    expect(a).toHaveLength(64);
  });

  it("produces different hashes for different orientation values", () => {
    const landscape = buildCacheKey(
      "bakery storefront elegant",
      "landscape",
      "photo",
    );
    const portrait = buildCacheKey(
      "bakery storefront elegant",
      "portrait",
      "photo",
    );
    expect(landscape).not.toBe(portrait);
  });
});

/* ------------------------------------------------------------------ */
/*  SKIP_PATTERN                                                        */
/* ------------------------------------------------------------------ */

describe("SKIP_PATTERN", () => {
  it("matches companyLogo (case-insensitive)", () => {
    expect(SKIP_PATTERN.test("companyLogo")).toBe(true);
  });

  it("does NOT match heroImage", () => {
    expect(SKIP_PATTERN.test("heroImage")).toBe(false);
  });

  it("does NOT match authorImage (resolves as showcase portrait)", () => {
    expect(SKIP_PATTERN.test("authorImage")).toBe(false);
  });

  it("does NOT match memberPhoto (resolves as showcase portrait)", () => {
    expect(SKIP_PATTERN.test("memberPhoto")).toBe(false);
  });

  it("matches avatar slot names", () => {
    expect(SKIP_PATTERN.test("clientAvatar")).toBe(true);
  });
});

/* ------------------------------------------------------------------ */
/*  ASPECT_TO_ORIENTATION                                               */
/* ------------------------------------------------------------------ */

describe("ASPECT_TO_ORIENTATION", () => {
  it("maps 16:9 to landscape", () => {
    expect(ASPECT_TO_ORIENTATION["16:9"]).toBe("landscape");
  });

  it("maps 1:1 to square", () => {
    expect(ASPECT_TO_ORIENTATION["1:1"]).toBe("square");
  });

  it("maps auto to undefined (no orientation filter)", () => {
    expect(ASPECT_TO_ORIENTATION["auto"]).toBeUndefined();
  });
});
