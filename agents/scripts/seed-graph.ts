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

interface GraphSeedData {
  segments: SegmentEntry[];
  naturallyFeels: NaturallyFeelsEntry[];
  expressedAs: ExpressedAsEntry[];
}

/* ------------------------------------------------------------------ */
/*  Component metadata types (from seed-components.ts)                 */
/* ------------------------------------------------------------------ */

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
  slots: unknown[];
  mobileBehavior: string;
  pairsWell: string[];
  pairsPoorly: string[];
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
           c.layout = $layout`,
      {
        id: comp.id,
        name: comp.name,
        category: comp.category,
        density: comp.density,
        layout: comp.layout,
      },
    );
  }

  console.log("  Component nodes seeded.");
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
/*  Seed PAIRS_WITH relationships (Component <-> Component)            */
/* ------------------------------------------------------------------ */

async function seedPairsWith(
  session: Session,
  components: MetadataJson[],
): Promise<void> {
  console.log("Seeding PAIRS_WITH relationships...");

  const knownIds = new Set(components.map((c) => c.id));

  for (const comp of components) {
    // pairsWell -> score 0.85 (bidirectional)
    for (const targetId of comp.pairsWell ?? []) {
      if (!knownIds.has(targetId)) {
        console.warn(`  Skipping unknown component: ${targetId}`);
        continue;
      }
      await session.run(
        `MATCH (a:Component {id: $fromId})
         MATCH (b:Component {id: $toId})
         MERGE (a)-[r:PAIRS_WITH]->(b)
         SET r.score = $score
         MERGE (b)-[r2:PAIRS_WITH]->(a)
         SET r2.score = $score`,
        { fromId: comp.id, toId: targetId, score: 0.85 },
      );
    }

    // pairsPoorly -> score 0.15 (bidirectional)
    for (const targetId of comp.pairsPoorly ?? []) {
      if (!knownIds.has(targetId)) {
        console.warn(`  Skipping unknown component: ${targetId}`);
        continue;
      }
      await session.run(
        `MATCH (a:Component {id: $fromId})
         MATCH (b:Component {id: $toId})
         MERGE (a)-[r:PAIRS_WITH]->(b)
         SET r.score = $score
         MERGE (b)-[r2:PAIRS_WITH]->(a)
         SET r2.score = $score`,
        { fromId: comp.id, toId: targetId, score: 0.15 },
      );
    }
  }

  console.log("  PAIRS_WITH relationships seeded.");
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

  // Load seed data
  console.log(`Seed data: ${SEED_DATA_PATH}`);
  const seedRaw = fs.readFileSync(SEED_DATA_PATH, "utf-8");
  const seedData: GraphSeedData = JSON.parse(seedRaw);

  // Load component metadata
  console.log(`Library root: ${LIBRARY_ROOT}`);
  const components = loadComponents();

  if (components.length === 0) {
    console.error("No metadata.json files found in", LIBRARY_ROOT);
    process.exit(1);
  }

  console.log(`Found ${components.length} components.`);
  console.log();

  // Connect to Neo4j
  const driver: Driver = neo4j.driver(uri, neo4j.auth.basic("neo4j", password));
  const session: Session = driver.session();

  try {
    // Create constraints
    await createConstraints(session);
    console.log();

    // Seed nodes
    await seedSegments(session, seedData.segments);
    await seedMoods(session);
    await seedStyles(session);
    await seedComponents(session, components);
    console.log();

    // Seed relationships
    await seedNaturallyFeels(session, seedData.naturallyFeels);
    await seedExpressedAs(session, seedData.expressedAs);
    await seedHasStyle(session, components);
    await seedHasMood(session, components);
    await seedPairsWith(session, components);

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
