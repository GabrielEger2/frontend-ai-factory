import manifest from "@components/library/manifest.json";

/**
 * Returns the set of selectable component categories present in the
 * manifest, excluding `navigation` and `footers` (which are always
 * required and enforced by the Composer Agent — not selectable in the
 * intake form).
 *
 * Categories without any component naturally do not appear here, so the
 * UI hides categories like `testimonials` / `pricing` until at least one
 * component ships.
 */
export function selectableCategories(): string[] {
  const seen = new Set<string>();
  for (const e of manifest as { category?: string }[]) {
    if (e.category && e.category !== "navigation" && e.category !== "footer") {
      seen.add(e.category);
    }
  }
  return [...seen];
}
