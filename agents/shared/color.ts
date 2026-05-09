/**
 * Color utilities for WCAG AA contrast checks.
 *
 * Pure functions only — no side effects, no external imports.
 * MUST NOT import from `agents/assembler/` (assembler imports from here).
 *
 * Formulas:
 *  - sRGB → linear-RGB: WCAG 2.1 standard transfer function
 *  - Relative luminance Y: 0.2126*R + 0.7152*G + 0.0722*B (WCAG 2.1 § 1.4.3)
 *  - Contrast ratio: (max(L1,L2) + 0.05) / (min(L1,L2) + 0.05)
 */

/**
 * Convert an sRGB channel in [0..1] to a linear-RGB channel.
 * Copied verbatim from agents/assembler/core.ts:552-553 to keep this module
 * free of cross-workspace imports.
 */
function srgbToLinear(c: number): number {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

/**
 * Parse a 6-digit hex string like "#1A2B3C" or "1a2b3c" into [r,g,b]
 * channels in [0..255]. Returns null on malformed input (caller decides
 * the safe fallback).
 */
function parseHex(hex: string): [number, number, number] | null {
  if (typeof hex !== "string") return null;
  const cleaned = hex.trim().replace(/^#/, "");
  if (!/^[0-9a-fA-F]{6}$/.test(cleaned)) return null;
  const r = parseInt(cleaned.slice(0, 2), 16);
  const g = parseInt(cleaned.slice(2, 4), 16);
  const b = parseInt(cleaned.slice(4, 6), 16);
  return [r, g, b];
}

/**
 * WCAG 2.1 relative luminance for a 6-digit hex color.
 * Returns 0.5 (neutral mid-gray) on malformed input — mirrors the fail-safe
 * philosophy of `hexToOklch` in agents/assembler/core.ts which returns a
 * neutral gray OKLCH for bad hex.
 */
export function relativeLuminance(hex: string): number {
  const rgb = parseHex(hex);
  if (rgb === null) return 0.5;
  const [r, g, b] = rgb;
  const R = srgbToLinear(r / 255);
  const G = srgbToLinear(g / 255);
  const B = srgbToLinear(b / 255);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

/**
 * WCAG 2.1 § 1.4.3 contrast ratio between two hex colors.
 * Returns a value in [1, 21]. Order-independent.
 */
export function contrastRatio(hex1: string, hex2: string): number {
  const l1 = relativeLuminance(hex1);
  const l2 = relativeLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * DaisyUI-compatible OKLCH triplet (no `oklch()` wrapper) for a near-white
 * content color. Visually matches `hexToOklch("#ffffff")` from the assembler.
 */
const CONTENT_WHITE_OKLCH = "0.98 0.005 264.38";

/**
 * DaisyUI-compatible OKLCH triplet (no `oklch()` wrapper) for a near-black
 * content color. Visually matches `hexToOklch("#1a1a1a")` from the assembler.
 */
const CONTENT_NEAR_BLACK_OKLCH = "0.15 0.01 264.38";

/**
 * Pick the content color (white vs near-black) that achieves the higher
 * contrast against `bgHex`. Returns a DaisyUI-compatible OKLCH triplet
 * string (no `oklch()` wrapper) suitable for direct interpolation into a
 * CSS custom-property value.
 *
 * Inline OKLCH constants are used (rather than calling `hexToOklch`) to
 * keep this module free of any assembler imports — assembler imports from
 * here, so a back-edge would create a circular dependency.
 */
export function deriveContentColor(bgHex: string): string {
  const whiteContrast = contrastRatio(bgHex, "#ffffff");
  const blackContrast = contrastRatio(bgHex, "#1a1a1a");
  return whiteContrast >= blackContrast
    ? CONTENT_WHITE_OKLCH
    : CONTENT_NEAR_BLACK_OKLCH;
}

/**
 * Inverse of `srgbToLinear` — convert a linear-RGB channel in [0..1] back to
 * an sRGB channel in [0..1]. WCAG 2.1 standard inverse transfer function.
 */
function linearToSrgb(c: number): number {
  return c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
}

/**
 * Linearly interpolate between two hex colors in **linear-RGB space**
 * (gamma-corrected), then convert the result back to sRGB hex.
 *
 * `t = 0` returns `hex1` exactly (verbatim 6-digit hex, lowercased).
 * `t = 1` returns `hex2` exactly.
 * Intermediate `t` values blend in linear-RGB to avoid the gamma skew that
 * sRGB-space midpoints suffer from (e.g. blending #000 with #fff at t=0.5
 * yields ~#bcbcbc in linear space, NOT the perceptually-darker #808080
 * that naive sRGB averaging produces).
 *
 * Returns 6-digit lowercase hex prefixed with `#`. On malformed input,
 * returns `hex1` lowercased (same fail-safe philosophy as
 * `relativeLuminance`).
 */
export function blendHex(hex1: string, hex2: string, t: number): string {
  // Pure endpoint short-circuits — guarantees t=0 returns hex1 verbatim and
  // t=1 returns hex2 verbatim, regardless of any rounding drift through the
  // sRGB → linear → sRGB roundtrip.
  if (t === 0) return normalizeHex(hex1);
  if (t === 1) return normalizeHex(hex2);

  const rgb1 = parseHex(hex1);
  const rgb2 = parseHex(hex2);
  if (rgb1 === null || rgb2 === null) return normalizeHex(hex1);

  const [r1, g1, b1] = rgb1;
  const [r2, g2, b2] = rgb2;

  // sRGB → linear
  const lr1 = srgbToLinear(r1 / 255);
  const lg1 = srgbToLinear(g1 / 255);
  const lb1 = srgbToLinear(b1 / 255);
  const lr2 = srgbToLinear(r2 / 255);
  const lg2 = srgbToLinear(g2 / 255);
  const lb2 = srgbToLinear(b2 / 255);

  // Linear-space lerp
  const lr = lr1 + (lr2 - lr1) * t;
  const lg = lg1 + (lg2 - lg1) * t;
  const lb = lb1 + (lb2 - lb1) * t;

  // Linear → sRGB → 8-bit
  const r = Math.round(Math.max(0, Math.min(1, linearToSrgb(lr))) * 255);
  const g = Math.round(Math.max(0, Math.min(1, linearToSrgb(lg))) * 255);
  const b = Math.round(Math.max(0, Math.min(1, linearToSrgb(lb))) * 255);

  return `#${toHexByte(r)}${toHexByte(g)}${toHexByte(b)}`;
}

function toHexByte(n: number): string {
  return n.toString(16).padStart(2, "0");
}

function normalizeHex(hex: string): string {
  const rgb = parseHex(hex);
  if (rgb === null) return typeof hex === "string" ? hex.toLowerCase() : hex;
  const [r, g, b] = rgb;
  return `#${toHexByte(r)}${toHexByte(g)}${toHexByte(b)}`;
}
