// NicePage Importer — Claude vision generation module
//
// Sends the dual-breakpoint screenshots + structural signals + CSS
// palette to Claude (`claude-opus-4-7`) and validates the response
// against `ClaudeResponseSchema`. The response carries the full source
// code for `index.tsx` and `<Name>.stories.tsx` plus all metadata
// fields except `id` — the writer module computes `id` after the
// response is validated.
//
// IMPORTANT — media_type sync:
//   The companion `browser.ts` module captures JPEG buffers
//   (`type: 'jpeg', quality: 80`). This module passes those buffers to
//   Claude vision with `media_type: "image/jpeg"`. If `browser.ts` ever
//   switches to PNG/WebP, this `media_type` MUST change in lockstep —
//   the SDK rejects mismatched media types.
//
// On JSON parse failure: writes raw text to <artifactDir>/raw-response.json,
// logs, and exits 1.
// On Zod validation failure: writes parsed JSON to <artifactDir>/raw-response.json,
// logs the formatted Zod error, and exits 2.
// On success: writes the validated payload to <artifactDir>/brief.json
// and returns it.

import * as fs from "fs";
import * as path from "path";
import Anthropic from "@anthropic-ai/sdk";

import { ClaudeResponse, ClaudeResponseSchema } from "./types";

export async function generateComponent(
  brief: {
    desktopJpegBuffer: Buffer;
    mobileJpegBuffer: Buffer;
    signals: object;
    cssPalette: string[];
  },
  systemPrompt: string,
  artifactDir: string,
): Promise<ClaudeResponse> {
  // 1. Resolve the API key. Either ANTHROPIC_API_KEY or CLAUDE_API_KEY is
  //    accepted; the Anthropic SDK auto-reads ANTHROPIC_API_KEY but we
  //    still validate explicitly so we can emit a friendly error message
  //    instead of letting the SDK throw a less obvious one.
  const apiKey = process.env.ANTHROPIC_API_KEY ?? process.env.CLAUDE_API_KEY;
  if (!apiKey) {
    console.error("Set ANTHROPIC_API_KEY in your environment");
    process.exit(1);
  }

  const client = new Anthropic({ apiKey });

  // 2. Build the textual brief — JSON-stringified signals + palette plus
  //    a one-line cost-band prefix so the model sees that this is a
  //    high-cost call and should produce complete output.
  const textualBrief =
    "Model: claude-opus-4-7 (~$0.05–0.15 per import). Generate the full SiteGen component now.\n\n" +
    JSON.stringify(
      { signals: brief.signals, cssPalette: brief.cssPalette },
      null,
      2,
    );

  // 3. Call Claude vision with the dual-breakpoint screenshots + textual
  //    brief. `media_type: "image/jpeg"` matches the JPEG capture in
  //    `browser.ts` — see note at top of file.
  const response = await client.messages.create({
    model: "claude-opus-4-7",
    max_tokens: 8192,
    system: systemPrompt,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: "image/jpeg",
              data: brief.desktopJpegBuffer.toString("base64"),
            },
          },
          {
            type: "image",
            source: {
              type: "base64",
              media_type: "image/jpeg",
              data: brief.mobileJpegBuffer.toString("base64"),
            },
          },
          { type: "text", text: textualBrief },
        ],
      },
    ],
  });

  // 4. Extract the text block from the response.
  const textBlock = response.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("Claude response did not contain a text block");
  }

  // 5. Strip markdown code fences defensively — mirrors the pattern in
  //    `agents/research/handler.ts`. Claude sometimes wraps JSON in
  //    ```json fences even when asked not to.
  const stripped = textBlock.text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```\s*$/, "");

  // 6. JSON.parse — on failure, persist the raw response for debugging
  //    and exit 1.
  let parsed: unknown;
  try {
    parsed = JSON.parse(stripped);
  } catch (err) {
    fs.writeFileSync(
      path.join(artifactDir, "raw-response.json"),
      textBlock.text,
    );
    console.error(
      "[nicepage-import] JSON parse failed; raw response saved to raw-response.json",
      err,
    );
    process.exit(1);
  }

  // 7. Zod validation. On failure, persist the parsed JSON (more readable
  //    than the raw text) and exit 2.
  const result = ClaudeResponseSchema.safeParse(parsed);
  if (!result.success) {
    fs.writeFileSync(
      path.join(artifactDir, "raw-response.json"),
      JSON.stringify(parsed, null, 2),
    );
    console.error(
      "[nicepage-import] Zod validation failed:",
      result.error.format(),
    );
    process.exit(2);
  }

  // 8. Persist the validated payload as brief.json — the executor uses
  //    this for inspection during the dry-run smoke test.
  fs.writeFileSync(
    path.join(artifactDir, "brief.json"),
    JSON.stringify(result.data, null, 2),
  );

  return result.data;
}
