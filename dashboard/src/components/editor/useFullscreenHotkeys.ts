"use client";

import { useEffect } from "react";

function isInputFocused() {
  const el =
    typeof document === "undefined"
      ? null
      : (document.activeElement as HTMLElement | null);
  if (!el) return false;
  const tag = el.tagName.toLowerCase();
  return (
    tag === "input" ||
    tag === "textarea" ||
    tag === "select" ||
    el.isContentEditable
  );
}

/**
 * Toggles fullscreen state on `F` (and exits on `Escape`) while honoring
 * focus + dnd-kit safeguards:
 *   - skip when an input/textarea/select/contentEditable is focused
 *   - skip when the event has already been defaultPrevented (dnd-kit
 *     consumes Esc during an active drag)
 */
export function useFullscreenHotkeys(
  isFullscreen: boolean,
  setIsFullscreen: (updater: boolean | ((prev: boolean) => boolean)) => void,
) {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (isInputFocused()) return;
      if (e.defaultPrevented) return;
      if (e.key === "f" || e.key === "F") {
        e.preventDefault();
        setIsFullscreen((prev) => !prev);
      } else if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isFullscreen, setIsFullscreen]);
}
