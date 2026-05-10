"use client";

import {
  type CSSProperties,
  type ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

interface PreviewIframeProps {
  /** CSS pixel width of the simulated viewport (375 / 768 / 1920 / etc.). */
  width: number;
  /**
   * CSS pixel height of the simulated viewport. Drives `100vh` /
   * `min-h-screen` resolution inside the iframe — must be a fixed number to
   * avoid the auto-size loop with library sections that use viewport-height
   * units.
   */
  height: number;
  /** Custom properties applied to the iframe body (palette + typography vars). */
  cssVars: CSSProperties;
  /** When false, all pointer events through the iframe are disabled. */
  interactive: boolean;
  /** Library component tree to render inside the iframe document. */
  children: ReactNode;
}

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Portals children into a same-origin <iframe> so the library components
 * render against an isolated CSS viewport. This is the only way Tailwind's
 * `lg:`/`xl:` breakpoints, `100vh`, and `position: fixed` evaluate against
 * the seller-chosen preview width (375 / 768 / 1920) instead of the
 * dashboard's browser window.
 *
 * Stylesheet sync: every <link rel="stylesheet"> and <style> in the parent
 * document is cloned into the iframe head on mount and re-cloned whenever
 * document.head mutates (covers Next.js HMR style injection in dev mode).
 *
 * Font: the dashboard's <body> wears `Inter` via next/font's hashed class.
 * We don't propagate that — library components use `font-sans` / `font-serif`
 * which resolve to `var(--font-sans)` / `var(--font-serif)` set by
 * paletteToCssVars (the seller's typography). A neutral system stack on the
 * iframe body covers any element that opts out of `font-sans`.
 */
export function PreviewIframe({
  width,
  height,
  cssVars,
  interactive,
  children,
}: PreviewIframeProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [body, setBody] = useState<HTMLElement | null>(null);

  useIsoLayoutEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const doc = iframe.contentDocument;
    if (!doc) return;

    // Reset the iframe document to a known empty shell.
    doc.open();
    doc.write(
      '<!doctype html><html><head><meta charset="utf-8"></head><body></body></html>',
    );
    doc.close();

    // Initial style sync, then watch parent <head> for HMR-injected styles.
    syncStyles(doc);
    const observer = new MutationObserver(() => syncStyles(doc));
    observer.observe(document.head, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    setBody(doc.body);

    return () => observer.disconnect();
  }, []);

  useIsoLayoutEffect(() => {
    if (!body) return;
    body.style.margin = "0";
    body.style.fontFamily =
      'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
    for (const [key, value] of Object.entries(cssVars)) {
      if (typeof value === "string" || typeof value === "number") {
        body.style.setProperty(key, String(value));
      }
    }
  }, [body, cssVars]);

  return (
    <iframe
      ref={iframeRef}
      title="Site preview"
      style={{
        width,
        height,
        border: "0",
        display: "block",
        background: "white",
        pointerEvents: interactive ? "auto" : "none",
      }}
    >
      {body && createPortal(children, body)}
    </iframe>
  );
}

function syncStyles(targetDoc: Document) {
  targetDoc.head
    .querySelectorAll('[data-preview-sync="true"]')
    .forEach((node) => node.remove());

  const sources = document.head.querySelectorAll(
    'link[rel="stylesheet"], style',
  );
  for (const node of Array.from(sources)) {
    const clone = node.cloneNode(true) as HTMLElement;
    clone.setAttribute("data-preview-sync", "true");
    targetDoc.head.appendChild(clone);
  }
}
