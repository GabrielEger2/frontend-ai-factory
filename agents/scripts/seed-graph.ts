/**
 * Seed Neo4j graph from component metadata and graph-seed.json.
 *
 * Usage:
 *   NEO4J_URI=bolt+s://... NEO4J_PASSWORD=... npx ts-node scripts/seed-graph.ts
 *
 * Seeds Segment, Mood, Style, and Component nodes plus
 * NATURALLY_FEELS, EXPRESSED_AS, HAS_STYLE, HAS_MOOD, and PAIRS_WITH
 * relationships. Uses MERGE everywhere for idempotent re-seeding.
 *
 * After seeding, runs verification queries and prints counts.
 */

import * as fs from "fs";
import * as path from "path";
import neo4j, { Driver, Session } from "neo4j-driver";

/* ------------------------------------------------------------------ */
/*  Seed data types                                                    */
/* ------------------------------------------------------------------ */

interface SegmentEntry {
  id: string;
  name: string;
}

interface NaturallyFeelsEntry {
  segment: string;
  moods: string[];
}

interface ExpressedAsEntry {
  mood: string;
  styles: string[];
}

interface PaletteProfileEntry {
  id: string;
  name: string;
  temperatureRange: string;
  contrastLevel: string;
  saturationRange: string;
}

interface SuggestsPaletteEntry {
  mood: string;
  palettes: string[];
}

interface GraphSeedData {
  segments: SegmentEntry[];
  naturallyFeels: NaturallyFeelsEntry[];
  expressedAs: ExpressedAsEntry[];
  paletteProfiles: PaletteProfileEntry[];
  suggestsPalette: SuggestsPaletteEntry[];
}

/* ------------------------------------------------------------------ */
/*  Component metadata types (from seed-components.ts)                 */
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
}

/* ------------------------------------------------------------------ */
/*  Resolve paths                                                      */
/* ------------------------------------------------------------------ */

const LIBRARY_ROOT = path.resolve(
  __dirname,
  "..",
  "..",
  "components",
  "library",
);

const SEED_DATA_PATH = path.resolve(__dirname, "seed-data", "graph-seed.json");
const PAIRS_SCORES_PATH = path.resolve(
  __dirname,
  "seed-data",
  "pairs-scores.json",
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
/*  Load component metadata                                            */
/* ------------------------------------------------------------------ */

function loadComponents(): MetadataJson[] {
  const metadataFiles = findMetadataFiles(LIBRARY_ROOT);
  const components: MetadataJson[] = [];

  for (const filePath of metadataFiles) {
    const raw = fs.readFileSync(filePath, "utf-8");
    const json: MetadataJson = JSON.parse(raw);
    components.push(json);
  }

  return components;
}

/* ------------------------------------------------------------------ */
/*  Create uniqueness constraints                                      */
/* ------------------------------------------------------------------ */

async function createConstraints(session: Session): Promise<void> {
  console.log("Creating uniqueness constraints...");

  await session.run(
    "CREATE CONSTRAINT IF NOT EXISTS FOR (n:Segment) REQUIRE n.id IS UNIQUE",
  );
  await session.run(
    "CREATE CONSTRAINT IF NOT EXISTS FOR (n:Mood) REQUIRE n.id IS UNIQUE",
  );
  await session.run(
    "CREATE CONSTRAINT IF NOT EXISTS FOR (n:Style) REQUIRE n.id IS UNIQUE",
  );
  await session.run(
    "CREATE CONSTRAINT IF NOT EXISTS FOR (n:Component) REQUIRE n.id IS UNIQUE",
  );
  await session.run(
    "CREATE CONSTRAINT IF NOT EXISTS FOR (n:PaletteProfile) REQUIRE n.id IS UNIQUE",
  );
  await session.run(
    "CREATE CONSTRAINT IF NOT EXISTS FOR (n:Variant) REQUIRE n.id IS UNIQUE",
  );

  console.log("  Constraints created.");
}

/* ------------------------------------------------------------------ */
/*  Seed Segment nodes                                                 */
/* ------------------------------------------------------------------ */

async function seedSegments(
  session: Session,
  segments: SegmentEntry[],
): Promise<void> {
  console.log(`Seeding ${segments.length} Segment nodes...`);

  for (const seg of segments) {
    await session.run("MERGE (s:Segment {id: $id}) SET s.name = $name", {
      id: seg.id,
      name: seg.name,
    });
  }

  console.log("  Segment nodes seeded.");
}

/* ------------------------------------------------------------------ */
/*  Seed Mood nodes                                                    */
/* ------------------------------------------------------------------ */

const MOODS = [
  "professional",
  "elegant",
  "fun",
  "serious",
  "friendly",
  "energetic",
  "calm",
  "trustworthy",
];

async function seedMoods(session: Session): Promise<void> {
  console.log(`Seeding ${MOODS.length} Mood nodes...`);

  for (const mood of MOODS) {
    await session.run("MERGE (m:Mood {id: $id})", { id: mood });
  }

  console.log("  Mood nodes seeded.");
}

/* ------------------------------------------------------------------ */
/*  Seed Style nodes                                                   */
/* ------------------------------------------------------------------ */

const STYLES = [
  "modern",
  "classic",
  "editorial",
  "luxury",
  "playful",
  "minimal",
  "bold",
  "corporate",
];

async function seedStyles(session: Session): Promise<void> {
  console.log(`Seeding ${STYLES.length} Style nodes...`);

  for (const style of STYLES) {
    await session.run("MERGE (s:Style {id: $id})", { id: style });
  }

  console.log("  Style nodes seeded.");
}

/* ------------------------------------------------------------------ */
/*  Seed Component nodes                                               */
/* ------------------------------------------------------------------ */

async function seedComponents(
  session: Session,
  components: MetadataJson[],
): Promise<void> {
  console.log(`Seeding ${components.length} Component nodes...`);

  for (const comp of components) {
    await session.run(
      `MERGE (c:Component {id: $id})
       SET c.name = $name,
           c.category = $category,
           c.density = $density,
           c.layout = $layout,
           c.imageWeight = $imageWeight`,
      {
        id: comp.id,
        name: comp.name,
        category: comp.category,
        density: comp.density,
        layout: comp.layout,
        imageWeight: comp.imageWeight ?? 0,
      },
    );
  }

  console.log("  Component nodes seeded.");
}

/* ------------------------------------------------------------------ */
/*  Seed PaletteProfile nodes                                          */
/* ------------------------------------------------------------------ */

async function seedPaletteProfiles(
  session: Session,
  profiles: PaletteProfileEntry[],
): Promise<void> {
  console.log(`Seeding ${profiles.length} PaletteProfile nodes...`);

  for (const p of profiles) {
    await session.run(
      `MERGE (pp:PaletteProfile {id: $id})
       SET pp.name = $name,
           pp.temperatureRange = $temperatureRange,
           pp.contrastLevel = $contrastLevel,
           pp.saturationRange = $saturationRange`,
      {
        id: p.id,
        name: p.name,
        temperatureRange: p.temperatureRange,
        contrastLevel: p.contrastLevel,
        saturationRange: p.saturationRange,
      },
    );
  }

  console.log("  PaletteProfile nodes seeded.");
}

/* ------------------------------------------------------------------ */
/*  Seed NATURALLY_FEELS relationships (Segment -> Mood)               */
/* ------------------------------------------------------------------ */

async function seedNaturallyFeels(
  session: Session,
  naturallyFeels: NaturallyFeelsEntry[],
): Promise<void> {
  console.log("Seeding NATURALLY_FEELS relationships...");

  for (const entry of naturallyFeels) {
    for (const mood of entry.moods) {
      await session.run(
        `MATCH (s:Segment {id: $segmentId})
         MATCH (m:Mood {id: $moodId})
         MERGE (s)-[:NATURALLY_FEELS]->(m)`,
        { segmentId: entry.segment, moodId: mood },
      );
    }
  }

  console.log("  NATURALLY_FEELS relationships seeded.");
}

/* ------------------------------------------------------------------ */
/*  Seed EXPRESSED_AS relationships (Mood -> Style)                    */
/* ------------------------------------------------------------------ */

async function seedExpressedAs(
  session: Session,
  expressedAs: ExpressedAsEntry[],
): Promise<void> {
  console.log("Seeding EXPRESSED_AS relationships...");

  for (const entry of expressedAs) {
    for (const style of entry.styles) {
      await session.run(
        `MATCH (m:Mood {id: $moodId})
         MATCH (s:Style {id: $styleId})
         MERGE (m)-[:EXPRESSED_AS]->(s)`,
        { moodId: entry.mood, styleId: style },
      );
    }
  }

  console.log("  EXPRESSED_AS relationships seeded.");
}

/* ------------------------------------------------------------------ */
/*  Seed SUGGESTS_PALETTE relationships (Mood -> PaletteProfile)       */
/* ------------------------------------------------------------------ */

async function seedSuggestsPalette(
  session: Session,
  suggestsPalette: SuggestsPaletteEntry[],
): Promise<void> {
  console.log("Seeding SUGGESTS_PALETTE relationships...");

  for (const entry of suggestsPalette) {
    for (const paletteId of entry.palettes) {
      await session.run(
        `MATCH (m:Mood {id: $moodId})
         MATCH (pp:PaletteProfile {id: $paletteId})
         MERGE (m)-[:SUGGESTS_PALETTE]->(pp)`,
        { moodId: entry.mood, paletteId },
      );
    }
  }

  console.log("  SUGGESTS_PALETTE relationships seeded.");
}

/* ------------------------------------------------------------------ */
/*  Seed HAS_STYLE relationships (Component -> Style)                  */
/* ------------------------------------------------------------------ */

async function seedHasStyle(
  session: Session,
  components: MetadataJson[],
): Promise<void> {
  console.log("Seeding HAS_STYLE relationships...");

  for (const comp of components) {
    for (const style of comp.style ?? []) {
      await session.run(
        `MATCH (c:Component {id: $compId})
         MATCH (s:Style {id: $styleId})
         MERGE (c)-[:HAS_STYLE]->(s)`,
        { compId: comp.id, styleId: style },
      );
    }
  }

  console.log("  HAS_STYLE relationships seeded.");
}

/* ------------------------------------------------------------------ */
/*  Seed HAS_MOOD relationships (Component -> Mood)                    */
/* ------------------------------------------------------------------ */

async function seedHasMood(
  session: Session,
  components: MetadataJson[],
): Promise<void> {
  console.log("Seeding HAS_MOOD relationships...");

  for (const comp of components) {
    for (const mood of comp.mood ?? []) {
      await session.run(
        `MATCH (c:Component {id: $compId})
         MATCH (m:Mood {id: $moodId})
         MERGE (c)-[:HAS_MOOD]->(m)`,
        { compId: comp.id, moodId: mood },
      );
    }
  }

  console.log("  HAS_MOOD relationships seeded.");
}

/* ------------------------------------------------------------------ */
/*  Seed Variant nodes + VARIANT_OF relationships                      */
/* ------------------------------------------------------------------ */

async function seedVariants(
  session: Session,
  components: MetadataJson[],
): Promise<void> {
  console.log("Seeding Variant nodes and VARIANT_OF relationships...");

  let variantCount = 0;

  for (const comp of components) {
    for (const v of comp.variants ?? []) {
      await session.run(
        `MERGE (var:Variant {id: $id})
         SET var.name = $name,
             var.density = $density,
             var.colorMode = $colorMode,
             var.styleOverrides = $styleOverrides
         WITH var
         MATCH (c:Component {id: $compId})
         MERGE (var)-[:VARIANT_OF]->(c)`,
        {
          id: v.id,
          name: v.name,
          density: v.density,
          colorMode: v.colorMode,
          styleOverrides: v.styleOverrides,
          compId: comp.id,
        },
      );
      variantCount++;
    }
  }

  console.log(
    `  ${variantCount} Variant nodes and VARIANT_OF relationships seeded.`,
  );
}

/* ------------------------------------------------------------------ */
/*  Seed PAIRS_WITH relationships (Component <-> Component)            */
/* ------------------------------------------------------------------ */

async function seedPairsWith(
  session: Session,
  pairsScores: { a: string; b: string; score: number }[],
  knownIds: Set<string>,
): Promise<void> {
  console.log(
    `Seeding PAIRS_WITH relationships from ${pairsScores.length} pair scores...`,
  );

  let seeded = 0;
  let skipped = 0;

  for (const pair of pairsScores) {
    if (!knownIds.has(pair.a) || !knownIds.has(pair.b)) {
      console.warn(
        `  Skipping unknown component in pair: ${pair.a} <-> ${pair.b}`,
      );
      skipped++;
      continue;
    }

    await session.run(
      `MATCH (a:Component {id: $aId})
       MATCH (b:Component {id: $bId})
       MERGE (a)-[r:PAIRS_WITH]->(b)
       SET r.score = $score
       MERGE (b)-[r2:PAIRS_WITH]->(a)
       SET r2.score = $score`,
      { aId: pair.a, bId: pair.b, score: pair.score },
    );
    seeded++;
  }

  console.log(
    `  PAIRS_WITH relationships seeded (${seeded} pairs, ${skipped} skipped).`,
  );
}

/* ------------------------------------------------------------------ */
/*  Verification phase                                                 */
/* ------------------------------------------------------------------ */

async function verify(session: Session): Promise<void> {
  console.log();
  console.log("=== Verification ===");
  console.log();

  // Node counts by label
  console.log("Node counts by label:");
  const nodeCountResult = await session.run(
    "MATCH (n) RETURN labels(n)[0] AS label, count(n) AS count ORDER BY label",
  );
  for (const record of nodeCountResult.records) {
    const label = record.get("label") as string;
    const count = record.get("count");
    console.log(`  ${label}: ${count}`);
  }
  console.log();

  // Relationship counts by type
  console.log("Relationship counts by type:");
  const relCountResult = await session.run(
    "MATCH ()-[r]->() RETURN type(r) AS type, count(r) AS count ORDER BY type",
  );
  for (const record of relCountResult.records) {
    const type = record.get("type") as string;
    const count = record.get("count");
    console.log(`  ${type}: ${count}`);
  }
  console.log();

  // Spot-check: pet-shop -> moods
  console.log("Spot-check: pet-shop -> NATURALLY_FEELS -> moods:");
  const spotCheckResult = await session.run(
    "MATCH (s:Segment {id: 'pet-shop'})-[:NATURALLY_FEELS]->(m:Mood) RETURN m.id AS mood",
  );
  const moods = spotCheckResult.records.map((r) => r.get("mood") as string);
  console.log(`  Moods: ${moods.join(", ")}`);
  console.log();

  // PaletteProfile count
  console.log("PaletteProfile count:");
  const ppCountResult = await session.run(
    "MATCH (pp:PaletteProfile) RETURN count(pp) AS count",
  );
  const ppCount = ppCountResult.records[0]?.get("count");
  console.log(`  PaletteProfile: ${ppCount}`);
  console.log();

  // Spot-check: professional -> SUGGESTS_PALETTE -> PaletteProfile
  console.log(
    "Spot-check: professional -> SUGGESTS_PALETTE -> PaletteProfile:",
  );
  const paletteSpotCheck = await session.run(
    "MATCH (m:Mood {id: 'professional'})-[:SUGGESTS_PALETTE]->(pp:PaletteProfile) RETURN pp.id AS palette",
  );
  const palettes = paletteSpotCheck.records.map(
    (r) => r.get("palette") as string,
  );
  console.log(`  Palettes: ${palettes.join(", ")}`);
  console.log();
}

/* ------------------------------------------------------------------ */
/*  Main                                                               */
/* ------------------------------------------------------------------ */

async function main(): Promise<void> {
  const uri = process.env.NEO4J_URI;
  const password = process.env.NEO4J_PASSWORD;

  if (!uri || !password) {
    console.error("Error: NEO4J_URI and NEO4J_PASSWORD env vars are required.");
    process.exit(1);
  }

  if (!fs.existsSync(PAIRS_SCORES_PATH)) {
    console.error(
      `Error: ${PAIRS_SCORES_PATH} not found. Run generate-pair-scores.ts first.`,
    );
    process.exit(1);
  }

  // Load seed data
  console.log(`Seed data: ${SEED_DATA_PATH}`);
  const seedRaw = fs.readFileSync(SEED_DATA_PATH, "utf-8");
  const seedData: GraphSeedData = JSON.parse(seedRaw);

  // Load pairs-scores.json (generated by generate-pair-scores.ts — do not hand-edit)
  console.log(`Pair scores: ${PAIRS_SCORES_PATH}`);
  const pairsRaw = fs.readFileSync(PAIRS_SCORES_PATH, "utf-8");
  const pairsData: { pairs: { a: string; b: string; score: number }[] } =
    JSON.parse(pairsRaw);

  // Load component metadata
  console.log(`Library root: ${LIBRARY_ROOT}`);
  const components = loadComponents();

  if (components.length === 0) {
    console.error("No metadata.json files found in", LIBRARY_ROOT);
    process.exit(1);
  }

  console.log(`Found ${components.length} components.`);
  console.log(`Found ${pairsData.pairs.length} pair scores.`);
  console.log();

  // Connect to Neo4j. Aura Free assigns instance-id as username/database;
  // older Aura and self-hosted default to "neo4j".
  const username = process.env.NEO4J_USERNAME ?? "neo4j";
  const database = process.env.NEO4J_DATABASE ?? "neo4j";
  const driver: Driver = neo4j.driver(
    uri,
    neo4j.auth.basic(username, password),
  );
  const session: Session = driver.session({ database });

  try {
    // Create constraints
    await createConstraints(session);
    console.log();

    // Seed nodes
    await seedSegments(session, seedData.segments);
    await seedMoods(session);
    await seedStyles(session);
    await seedComponents(session, components);
    await seedPaletteProfiles(session, seedData.paletteProfiles);
    console.log();

    // Seed relationships
    await seedNaturallyFeels(session, seedData.naturallyFeels);
    await seedExpressedAs(session, seedData.expressedAs);
    await seedSuggestsPalette(session, seedData.suggestsPalette);
    await seedHasStyle(session, components);
    await seedHasMood(session, components);
    await seedVariants(session, components);

    const knownIds = new Set(components.map((c) => c.id));
    await seedPairsWith(session, pairsData.pairs, knownIds);

    // Verification
    await verify(session);

    console.log("Done. Graph seeded successfully.");
  } finally {
    await session.close();
    await driver.close();
  }
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
