/**
 * Seed ComponentsTable from component library metadata.json files.
 *
 * Usage:
 *   COMPONENTS_TABLE_NAME=SitegenDev-ComponentsTable ts-node scripts/seed-components.ts
 *   ts-node scripts/seed-components.ts MyComponentsTableName
 *
 * Walks components/library/ recursively, finds every metadata.json,
 * builds a DynamoDB item per component, and BatchWrites in chunks of 25.
 */

import * as fs from "fs";
import * as path from "path";
import {
  DynamoDBClient,
  BatchWriteItemCommand,
  WriteRequest,
} from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";

/* ------------------------------------------------------------------ */
/*  Resolve table name                                                 */
/* ------------------------------------------------------------------ */

const resolvedTableName = process.argv[2] || process.env.COMPONENTS_TABLE_NAME;

if (!resolvedTableName) {
  console.error(
    "Error: table name required. Pass as CLI arg or set COMPONENTS_TABLE_NAME env var.",
  );
  process.exit(1);
}

const TABLE_NAME: string = resolvedTableName;

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
/*  Build DynamoDB item from metadata                                  */
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
  description?: string;
}

interface ComponentSeedItem {
  pk: string;
  id: string;
  name: string;
  category: string;
  componentName: string;
  categoryPath: string;
  style: string[];
  mood: string[];
  purpose: string[];
  acceptsStyleKit: Record<string, boolean>;
  layout: string;
  density: string;
  imageWeight: number;
  slots: unknown[];
  mobileBehavior: string;
  pairsWell: string[];
  pairsPoorly: string[];
  variants?: ComponentVariantEntry[];
}

function buildItem(
  metadataPath: string,
  json: MetadataJson,
): ComponentSeedItem {
  // componentName = the directory containing metadata.json (e.g. "HeroSplitImage")
  const componentDir = path.dirname(metadataPath);
  const componentName = path.basename(componentDir);

  // categoryPath = relative path from library root to the component directory's parent
  // e.g. "heroes" or "layouts/grid"
  const parentDir = path.dirname(componentDir);
  const categoryPath = path
    .relative(LIBRARY_ROOT, parentDir)
    .replace(/\\/g, "/");

  return {
    pk: `COMP#${json.id}`,
    id: json.id,
    name: json.name,
    category: json.category,
    componentName,
    categoryPath,
    style: json.style ?? [],
    mood: json.mood ?? [],
    purpose: json.purpose ?? [],
    acceptsStyleKit: json.acceptsStyleKit ?? {},
    layout: json.layout ?? "unknown",
    density: json.density ?? "medium",
    imageWeight: json.imageWeight ?? 0,
    slots: json.slots ?? [],
    mobileBehavior: json.mobileBehavior ?? "stack",
    pairsWell: json.pairsWell ?? [],
    pairsPoorly: json.pairsPoorly ?? [],
    variants: json.variants,
  };
}

/* ------------------------------------------------------------------ */
/*  Batch write to DynamoDB                                            */
/* ------------------------------------------------------------------ */

const client = new DynamoDBClient({});

async function batchWrite(items: ComponentSeedItem[]): Promise<void> {
  const BATCH_SIZE = 25;

  for (let i = 0; i < items.length; i += BATCH_SIZE) {
    const batch = items.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;

    const requests: WriteRequest[] = batch.map((item) => ({
      PutRequest: {
        Item: marshall(item, {
          removeUndefinedValues: true,
          convertClassInstanceToMap: true,
        }),
      },
    }));

    const command = new BatchWriteItemCommand({
      RequestItems: {
        [TABLE_NAME]: requests,
      },
    });

    const response = await client.send(command);

    // Handle unprocessed items with a simple retry
    const unprocessed = response.UnprocessedItems?.[TABLE_NAME];
    if (unprocessed && unprocessed.length > 0) {
      console.warn(
        `  Batch ${batchNum}: ${unprocessed.length} unprocessed items, retrying...`,
      );
      const retryCommand = new BatchWriteItemCommand({
        RequestItems: { [TABLE_NAME]: unprocessed },
      });
      await client.send(retryCommand);
    }

    console.log(`  Batch ${batchNum}: ${batch.length} items written`);
  }
}

/* ------------------------------------------------------------------ */
/*  Main                                                               */
/* ------------------------------------------------------------------ */

async function main(): Promise<void> {
  console.log(`Library root: ${LIBRARY_ROOT}`);
  console.log(`Target table: ${TABLE_NAME}`);
  console.log();

  const metadataFiles = findMetadataFiles(LIBRARY_ROOT);

  if (metadataFiles.length === 0) {
    console.error("No metadata.json files found in", LIBRARY_ROOT);
    process.exit(1);
  }

  console.log(`Seeding ${metadataFiles.length} components...`);

  const items: ComponentSeedItem[] = [];

  for (const filePath of metadataFiles) {
    const raw = fs.readFileSync(filePath, "utf-8");
    const json: MetadataJson = JSON.parse(raw);
    const item = buildItem(filePath, json);
    items.push(item);
  }

  await batchWrite(items);

  console.log();
  console.log(`Done. ${items.length} components seeded to ${TABLE_NAME}.`);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
