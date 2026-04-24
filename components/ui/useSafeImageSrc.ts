import { useState, useEffect } from "react";
import type { ReactEventHandler } from "react";

/* ------------------------------------------------------------------ */
/*  useSafeImageSrc                                                    */
/* ------------------------------------------------------------------ */

/**
 * Resolves an image `src` with layered fallbacks:
 *   1. If `src` is provided, use it as-is.
 *   2. Otherwise, use a seeded Picsum URL at the requested dimensions.
 *   3. If the final URL fails to load, swap to an inline SVG placeholder
 *      (slate-100 background, slate-400 "W×H" label).
 *
 * The returned `{ src, onError }` must be spread onto the `<img>` or
 * `<motion.img>` element; the hook is agnostic to the element type so
 * Framer Motion wrappers keep their motion props intact.
 */
export function useSafeImageSrc(
  src: string | undefined | null,
  seed: string,
  w: number,
  h: number,
): { src: string; onError: ReactEventHandler<HTMLImageElement> } {
  const pickInitial = () =>
    src || `https://picsum.photos/seed/${seed}/${w}/${h}`;

  const [resolved, setResolved] = useState<string>(pickInitial);

  useEffect(() => {
    if (src) {
      setResolved(src);
    } else {
      setResolved(`https://picsum.photos/seed/${seed}/${w}/${h}`);
    }
  }, [src, seed, w, h]);

  const onError: ReactEventHandler<HTMLImageElement> = () => {
    const svg =
      `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">` +
      `<rect width="100%" height="100%" fill="#f1f5f9"/>` +
      `<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" ` +
      `font-family="sans-serif" font-size="14" fill="#94a3b8">${w}×${h}</text>` +
      `</svg>`;
    setResolved(`data:image/svg+xml,${encodeURIComponent(svg)}`);
  };

  return { src: resolved, onError };
}
