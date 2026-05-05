/**
 * Generate 1-2 sentence design-purpose descriptions for every component
 * in the library and write them back to each component's metadata.json.
 *
 * Idempotent: components that already have a non-empty `description` are
 * skipped unless `--force` is passed.
 *
 * Usage:
 *   CLAUDE_API_KEY_SSM_PATH=/sitegen/dev/claude-api-key \
 *     ts-node scripts/describe-components.ts
 *
 *   CLAUDE_API_KEY_SSM_PATH=/sitegen/dev/claude-api-key \
 *     ts-node scripts/describe-components.ts --force
 *
 * Walks components/library/ recursively, finds every metadata.json,
 * calls Claude sequentially (33 calls — no batching, simpler reasoning),
 * and writes the description back into the same metadata.json file
 * preserving existing field order.
 */

import * as fs from "fs";
import * as path from "path";
import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";
import Anthropic from "@anthropic-ai/sdk";

/* ------------------------------------------------------------------ */
/*  CLI flags                                                          */
/* ------------------------------------------------------------------ */

const force = process.argv.includes("--force");

/* ------------------------------------------------------------------ */
/*  Resolve library root                                               */
/* ------------------------------------------------------------------ */

const LIBRARY_ROOT = path.resolve(
  __dirname,
  "..",
  "..",
  "components",
  "library",
);

/* ------------------------------------------------------------------ */
/*  SSM-cached Claude API key                                          */
/*  Mirrors agents/research/handler.ts                                  */
/* ------------------------------------------------------------------ */

const ssmClient = new SSMClient({});

let cachedApiKey: string | undefined;

async function getClaudeApiKey(): Promise<string> {
  if (cachedApiKey) return cachedApiKey;

  const ssmPath = process.env.CLAUDE_API_KEY_SSM_PATH;
  if (!ssmPath) {
    throw new Error("CLAUDE_API_KEY_SSM_PATH environment variable is not set");
  }

  const result = await ssmClient.send(
    new GetParameterCommand({ Name: ssmPath, WithDecryption: true }),
  );

  if (!result.Parameter?.Value) {
    throw new Error(`SSM parameter ${ssmPath} not found or has no value`);
  }

  cachedApiKey = result.Parameter.Value;
  return cachedApiKey;
}

/* ------------------------------------------------------------------ */
/*  Walk directory tree and collect metadata.json paths                */
/* ------------------------------------------------------------------ */

function findMetadataFiles(dir: string): string[] {
  const results: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findMetadataFiles(fullPath));
    } else if (entry.name === "metadata.json") {
      results.push(fullPath);
    }
  }

  return results;
}

/* ------------------------------------------------------------------ */
/*  Local MetadataJson interface                                       */
/*  Mirrors agents/scripts/seed-components.ts::MetadataJson             */
/* ------------------------------------------------------------------ */

interface ComponentVariantEntry {
  id: string;
  name: string;
  density: string;
  colorMode: string;
  styleOverrides: string[];
}

interface MetadataJson {
  id: string;
  name: string;
  category: string;
  style: string[];
  mood: string[];
  purpose: string[];
  acceptsStyleKit: Record<string, boolean>;
  layout: string;
  density: string;
  imageWeight?: number;
  slots: unknown[];
  mobileBehavior: string;
  pairsWell: string[];
  pairsPoorly: string[];
  variants?: ComponentVariantEntry[];
  descriptions?: { descriptive: string; usage: string; audienceFit: string };
}

/* ------------------------------------------------------------------ */
/*  Prompt builders                                                    */
/* ------------------------------------------------------------------ */

const SYSTEM_PROMPT = [
  "You write concise design briefs for UI components in a website builder library.",
  "Given a component's name, category, style tags, mood tags, and purpose tags,",
  "produce a single 1-2 sentence description that captures:",
  "  1. The component's design purpose / what makes its layout distinctive.",
  "  2. The kind of business or use case it best fits.",
  "",
  "Example output:",
  '"A split-layout hero suited for luxury brands and service businesses needing strong photography paired with a bold headline."',
  "",
  "Constraints:",
  "- Output ONLY the description sentence(s). No preamble, no quotes, no markdown, no labels.",
  "- 1 to 2 sentences. Maximum ~280 characters.",
  "- Write in plain English, present tense.",
].join("\n");

function buildUserPrompt(json: MetadataJson): string {
  const styleList = json.style.length > 0 ? json.style.join(", ") : "(none)";
  const moodList = json.mood.length > 0 ? json.mood.join(", ") : "(none)";
  const purposeList =
    json.purpose.length > 0 ? json.purpose.join(", ") : "(none)";

  return [
    `Component name: ${json.name}`,
    `Category: ${json.category}`,
    `Style tags: ${styleList}`,
    `Mood tags: ${moodList}`,
    `Purpose tags: ${purposeList}`,
    "",
    "Write the 1-2 sentence description now.",
  ].join("\n");
}

/* ------------------------------------------------------------------ */
/*  Claude call                                                        */
/* ------------------------------------------------------------------ */

async function generateDescription(json: MetadataJson): Promise<string> {
  const apiKey = await getClaudeApiKey();
  const client = new Anthropic({ apiKey });

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 200,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: buildUserPrompt(json) }],
  });

  const textBlock = response.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("Claude response did not contain a text block");
  }

  return textBlock.text.trim();
}

/* ------------------------------------------------------------------ */
/*  Write metadata.json with description added                         */
/*  Preserves existing field order — JSON.parse + add field +          */
/*  JSON.stringify mirrors the source key ordering, with `description` */
/*  appended at the end if not already present.                         */
/* ------------------------------------------------------------------ */

function writeMetadata(filePath: string, updated: MetadataJson): void {
  const serialized = JSON.stringify(updated, null, 2) + "\n";
  fs.writeFileSync(filePath, serialized, "utf-8");
}

/* ------------------------------------------------------------------ */
/*  Main                                                               */
/* ------------------------------------------------------------------ */

async function main(): Promise<void> {
  console.log(`Library root: ${LIBRARY_ROOT}`);
  console.log(`Force re-describe: ${force}`);
  console.log();

  if (!process.env.CLAUDE_API_KEY_SSM_PATH) {
    console.error(
      "Error: CLAUDE_API_KEY_SSM_PATH env var is required (e.g. /sitegen/dev/claude-api-key).",
    );
    process.exit(1);
  }

  const metadataFiles = findMetadataFiles(LIBRARY_ROOT);

  if (metadataFiles.length === 0) {
    console.error("No metadata.json files found in", LIBRARY_ROOT);
    process.exit(1);
  }

  console.log(`Found ${metadataFiles.length} metadata.json files.`);
  console.log();

  let skipped = 0;
  let described = 0;
  let failed = 0;

  // Sequential — 33 calls, no batching. Keeps reasoning + rate limits simple.
  for (const filePath of metadataFiles) {
    const raw = fs.readFileSync(filePath, "utf-8");
    let json: MetadataJson;
    try {
      json = JSON.parse(raw) as MetadataJson;
    } catch (err) {
      console.error(
        `[fail] ${filePath} — invalid JSON: ${(err as Error).message}`,
      );
      failed += 1;
      continue;
    }

    // Legacy single-description field (pre-Phase C) — checked via cast.
    // This skip/write path is fully rewritten in WI2 to use the new
    // 3-axis `descriptions` object.
    const legacy = (json as MetadataJson & { description?: string })
      .description;
    const hasDescription =
      typeof legacy === "string" && legacy.trim().length > 0;

    if (hasDescription && !force) {
      console.log(`[skip] ${json.id} — description already set`);
      skipped += 1;
      continue;
    }

    try {
      const description = await generateDescription(json);
      const updated: MetadataJson = {
        ...json,
        ...({ description } as Partial<MetadataJson>),
      };
      writeMetadata(filePath, updated);
      console.log(
        `[done] ${json.id} — ${description.substring(0, 80)}${description.length > 80 ? "…" : ""}`,
      );
      described += 1;
    } catch (err) {
      console.error(`[fail] ${json.id} — ${(err as Error).message}`);
      failed += 1;
    }
  }

  console.log();
  console.log(
    `Summary: found=${metadataFiles.length} skipped=${skipped} described=${described} failed=${failed}`,
  );

  if (failed > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("describe-components failed:", err);
  process.exit(1);
});
