/**
 * Generate 3-axis structured descriptions for every component in the
 * library and write them back to each component's metadata.json under
 * the `descriptions` object.
 *
 * Idempotent: components that already have all three axes populated
 * (descriptive, usage, audienceFit) are skipped unless `--force` is
 * passed.
 *
 * Usage:
 *   CLAUDE_API_KEY_SSM_PATH=/sitegen/dev/claude-api-key \
 *     ts-node scripts/describe-components.ts
 *
 *   CLAUDE_API_KEY_SSM_PATH=/sitegen/dev/claude-api-key \
 *     ts-node scripts/describe-components.ts --force
 *
 * Walks components/library/ recursively, finds every metadata.json,
 * calls Claude sequentially (one structured-output call per component
 * returns all three axes), and writes the descriptions back into the
 * same metadata.json file preserving existing field order.
 */

import * as fs from "fs";
import * as path from "path";
import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";

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
  "produce a JSON object with exactly three string fields capturing the component",
  "from three distinct angles:",
  "",
  '  "descriptive": What the layout looks like and its visual personality.',
  "                 Anchor on the style[] and mood[] tags. Describe shape, density,",
  "                 imagery weight, and overall feel.",
  '  "usage":       When to use this component and what need it solves.',
  "                 Anchor on the purpose[] tags and the canonical category.",
  "                 Describe the page role and the user goal it addresses.",
  '  "audienceFit": What kind of business or audience resonates with this look.',
  "                 Interpret style[]/mood[]/purpose[] as audience signals.",
  "                 Describe verticals, brand maturity, or customer profile.",
  "",
  "Canonical categories (the value of `category`):",
  "hero | testimonial | footer | cta | faq | contact | navigation | stats |",
  "content | pricing | team | gallery",
  "",
  "Canonical purpose tokens (the values inside `purpose[]`):",
  "hero, navigation, footer, faq, contact, testimonials, stats,",
  "features, services, products, about, team, process, benefits,",
  "portfolio, showcase, cta, lead-capture, brand-statement, story,",
  "location-display, magazine-opener, pricing, gallery, comparison",
  "",
  "Constraints:",
  "- Output ONLY a single JSON object. No preamble, no markdown fences, no labels.",
  "- Exactly three keys: descriptive, usage, audienceFit. All non-empty strings.",
  "- Each field is at most 280 characters. Plain English, present tense.",
  "- Do not repeat the same sentence across axes — each angle must add new signal.",
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
    "Return the JSON object now.",
  ].join("\n");
}

/* ------------------------------------------------------------------ */
/*  Claude call + Zod-validated structured output                      */
/* ------------------------------------------------------------------ */

const DescriptionsSchema = z.object({
  descriptive: z.string().min(1).max(400),
  usage: z.string().min(1).max(400),
  audienceFit: z.string().min(1).max(400),
});

type Descriptions = z.infer<typeof DescriptionsSchema>;

async function callClaudeOnce(json: MetadataJson): Promise<Descriptions> {
  const apiKey = await getClaudeApiKey();
  const client = new Anthropic({ apiKey });

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 400,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: buildUserPrompt(json) }],
  });

  const textBlock = response.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("Claude response did not contain a text block");
  }

  const parsed = JSON.parse(textBlock.text);
  return DescriptionsSchema.parse(parsed);
}

async function generateDescriptions(json: MetadataJson): Promise<Descriptions> {
  try {
    return await callClaudeOnce(json);
  } catch (firstErr) {
    console.warn(
      `[retry] ${json.id} — first attempt failed: ${(firstErr as Error).message}`,
    );
    return await callClaudeOnce(json);
  }
}

/* ------------------------------------------------------------------ */
/*  Write metadata.json with descriptions added                        */
/*  Preserves existing field order — JSON.parse + spread + stringify   */
/*  appends `descriptions` at the end if not already present.          */
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

    const hasAllAxes =
      !!json.descriptions?.descriptive &&
      !!json.descriptions?.usage &&
      !!json.descriptions?.audienceFit;

    if (hasAllAxes && !force) {
      console.log(`[skip] ${json.id} — descriptions already complete`);
      skipped += 1;
      continue;
    }

    try {
      const descriptions = await generateDescriptions(json);
      const updated: MetadataJson = { ...json, descriptions };
      writeMetadata(filePath, updated);
      const preview = descriptions.descriptive;
      console.log(
        `[done] ${json.id} — ${preview.substring(0, 80)}${preview.length > 80 ? "…" : ""}`,
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
