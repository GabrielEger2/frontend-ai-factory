// NicePage Importer — Playwright capture + CSS palette extraction
//
// Captures the rendered page at desktop (1280x800) and mobile (375x812)
// breakpoints as JPEG q80 fullPage screenshots, plus the rendered HTML
// and a small CSS palette of the most-used colors derived from
// `getComputedStyle()` of structural/heading/button elements.
//
// IMPORTANT — media_type sync:
//   This module captures JPEG buffers (`type: 'jpeg', quality: 80`).
//   The companion `generate.ts` module passes those buffers to Claude
//   vision with `media_type: "image/jpeg"`. If the screenshot format
//   ever changes here (e.g. to "png"), `generate.ts` MUST change in
//   lockstep — the SDK rejects mismatched media types.
//
// Chromium binary: this module does NOT auto-install. If the binary is
// missing it logs the install command and exits with code 4.

import * as fs from "fs";
import * as path from "path";
import { chromium } from "playwright";

/**
 * Build a URL with the `device` query param overwritten (or appended).
 * Using URL parsing avoids double-`?`, double-`device=`, or hash-stripping
 * bugs that simple string concat would cause.
 */
function withDeviceParam(rawUrl: string, device: "desktop" | "mobile"): string {
  const u = new URL(rawUrl);
  u.searchParams.set("device", device);
  return u.toString();
}

export async function captureNicePage(
  url: string,
  artifactDir: string,
): Promise<{
  desktopJpegBuffer: Buffer;
  mobileJpegBuffer: Buffer;
  html: string;
  cssPalette: string[];
}> {
  try {
    // 1. Detect Chromium binary up front. The Playwright `chromium.executablePath()`
    //    resolves to a path even when the binary is not yet downloaded — gate
    //    on `fs.existsSync` to detect the missing-binary case.
    const exePath = chromium.executablePath();
    if (!exePath || !fs.existsSync(exePath)) {
      console.error("Chromium not found. Run: npx playwright install chromium");
      process.exit(4);
    }

    // 2. Launch the browser. Wrap the rest in try/finally so that the
    //    browser is always closed, even if a navigation/eval throws.
    const browser = await chromium.launch({ headless: true });
    let desktopJpegBuffer: Buffer;
    let mobileJpegBuffer: Buffer;
    let html: string;
    let cssPalette: string[];

    try {
      // 3. Desktop pass — 1280x800 viewport.
      const desktopContext = await browser.newContext({
        viewport: { width: 1280, height: 800 },
      });
      const desktopPage = await desktopContext.newPage();
      await desktopPage.goto(withDeviceParam(url, "desktop"));
      await desktopPage.waitForLoadState("networkidle");
      // 2s buffer to let `u-animate-*` deferred paints settle.
      await desktopPage.waitForTimeout(2000);

      // 4. CSS palette extraction via getComputedStyle() — runs IN the page,
      //    returns a string[] of hex colors sorted by frequency, max 8.
      cssPalette = await desktopPage.evaluate(() => {
        const toHex = (rgb: string): string | null => {
          const m = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/);
          if (!m) return null;
          const [r, g, b] = [+m[1], +m[2], +m[3]];
          return (
            "#" + [r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("")
          );
        };
        const selectors = [
          "body",
          "h1",
          "h2",
          "h3",
          "section",
          "a[href]",
          "button",
        ];
        const colors: Record<string, number> = {};
        selectors.forEach((sel) => {
          document.querySelectorAll(sel).forEach((el) => {
            const cs = getComputedStyle(el);
            [cs.backgroundColor, cs.color].forEach((v) => {
              const hex = toHex(v);
              if (hex && hex !== "#000000" && hex !== "#ffffff") {
                colors[hex] = (colors[hex] || 0) + 1;
              }
            });
          });
        });
        return Object.entries(colors)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 8)
          .map(([c]) => c);
      });

      // 5. Desktop fullPage JPEG q80 — Playwright handles compression natively;
      //    no Sharp dependency required.
      desktopJpegBuffer = await desktopPage.screenshot({
        type: "jpeg",
        quality: 80,
        fullPage: true,
      });
      if (desktopJpegBuffer.length > 4.5 * 1024 * 1024) {
        console.warn(
          `[nicepage-import] desktop screenshot ${(
            desktopJpegBuffer.length /
            1024 /
            1024
          ).toFixed(2)}MB approaches Claude's 5MB per-image cap`,
        );
      }
      fs.writeFileSync(
        path.join(artifactDir, "screenshot-desktop.jpg"),
        desktopJpegBuffer,
      );

      // 6. Capture rendered HTML (post-hydration) and persist it.
      html = await desktopPage.content();
      fs.writeFileSync(path.join(artifactDir, "page.html"), html, "utf-8");

      await desktopContext.close();

      // 7. Mobile pass — 375x812 viewport. No CSS palette re-extraction
      //    here; the desktop palette is sufficient for downstream prompt
      //    building.
      const mobileContext = await browser.newContext({
        viewport: { width: 375, height: 812 },
      });
      const mobilePage = await mobileContext.newPage();
      await mobilePage.goto(withDeviceParam(url, "mobile"));
      await mobilePage.waitForLoadState("networkidle");
      await mobilePage.waitForTimeout(2000);

      mobileJpegBuffer = await mobilePage.screenshot({
        type: "jpeg",
        quality: 80,
        fullPage: true,
      });
      if (mobileJpegBuffer.length > 4.5 * 1024 * 1024) {
        console.warn(
          `[nicepage-import] mobile screenshot ${(
            mobileJpegBuffer.length /
            1024 /
            1024
          ).toFixed(2)}MB approaches Claude's 5MB per-image cap`,
        );
      }
      fs.writeFileSync(
        path.join(artifactDir, "screenshot-mobile.jpg"),
        mobileJpegBuffer,
      );

      await mobileContext.close();
    } finally {
      await browser.close();
    }

    return { desktopJpegBuffer, mobileJpegBuffer, html, cssPalette };
  } catch (err) {
    console.error(`[nicepage-import] capture failed: ${String(err)}`);
    process.exit(4);
  }
}
