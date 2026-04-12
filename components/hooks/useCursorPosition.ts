"use client";

import { useEffect, useState } from "react";

interface CursorPosition {
  x: number;
  y: number;
}

/**
 * Tracks the current mouse cursor position on the page.
 * Returns { x, y } coordinates updated on every mousemove event.
 */
export function useCursorPosition(): CursorPosition {
  const [position, setPosition] = useState<CursorPosition>({ x: 0, y: 0 });

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      setPosition({ x: e.clientX, y: e.clientY });
    }

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return position;
}
