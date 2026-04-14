/**
 * Verify a seeded Neo4j graph has the expected nodes, edges, and traversals.
 *
 * Usage:
 *   NEO4J_URI=bolt+s://... NEO4J_PASSWORD=... npx ts-node scripts/verify-graph.ts
 *
 * Runs 13 assertions against the graph and prints PASS/FAIL for each.
 * Exits 0 if all pass, 1 if any fail.
 */

import neo4j, { Driver, Session } from "neo4j-driver";

/* ------------------------------------------------------------------ */
/*  Assertion helpers                                                   */
/* ------------------------------------------------------------------ */

interface AssertionResult {
  name: string;
  passed: boolean;
  actual: number;
  expected: string;
}

const results: AssertionResult[] = [];

function assertGte(name: string, actual: number, minimum: number): void {
  const passed = actual >= minimum;
  results.push({ name, passed, actual, expected: `>= ${minimum}` });
  const status = passed ? "PASS" : "FAIL";
  console.log(`  [${status}] ${name}: ${actual} (expected >= ${minimum})`);
}

function assertEq(name: string, actual: number, expected: number): void {
  const passed = actual === expected;
  results.push({ name, passed, actual, expected: `== ${expected}` });
  const status = passed ? "PASS" : "FAIL";
  console.log(`  [${status}] ${name}: ${actual} (expected == ${expected})`);
}

function assertGt(name: string, actual: number, minimum: number): void {
  const passed = actual > minimum;
  results.push({ name, passed, actual, expected: `> ${minimum}` });
  const status = passed ? "PASS" : "FAIL";
  console.log(`  [${status}] ${name}: ${actual} (expected > ${minimum})`);
}

/* ------------------------------------------------------------------ */
/*  Query helpers                                                      */
/* ------------------------------------------------------------------ */

async function countNodes(session: Session, label: string): Promise<number> {
  const result = await session.run(`MATCH (n:${label}) RETURN count(n) AS cnt`);
  const val = result.records[0]?.get("cnt");
  return typeof val === "object" && val !== null && "toNumber" in val
    ? val.toNumber()
    : Number(val);
}

async function countEdges(session: Session, type: string): Promise<number> {
  const result = await session.run(
    `MATCH ()-[r:${type}]->() RETURN count(r) AS cnt`,
  );
  const val = result.records[0]?.get("cnt");
  return typeof val === "object" && val !== null && "toNumber" in val
    ? val.toNumber()
    : Number(val);
}

async function runCountQuery(session: Session, query: string): Promise<number> {
  const result = await session.run(query);
  const val = result.records[0]?.get("cnt");
  return typeof val === "object" && val !== null && "toNumber" in val
    ? val.toNumber()
    : Number(val);
}

/* ------------------------------------------------------------------ */
/*  Main verification                                                  */
/* ------------------------------------------------------------------ */

async function main(): Promise<void> {
  const uri = process.env.NEO4J_URI;
  const password = process.env.NEO4J_PASSWORD;

  if (!uri || !password) {
    console.error("Error: NEO4J_URI and NEO4J_PASSWORD env vars are required.");
    process.exit(1);
  }

  const driver: Driver = neo4j.driver(uri, neo4j.auth.basic("neo4j", password));
  const session: Session = driver.session();

  try {
    console.log("=== Neo4j Graph Verification ===");
    console.log();

    // --- Node count assertions ---

    console.log("Node counts:");

    const componentCount = await countNodes(session, "Component");
    assertGte("Component count", componentCount, 29);

    const segmentCount = await countNodes(session, "Segment");
    assertEq("Segment count", segmentCount, 18);

    const moodCount = await countNodes(session, "Mood");
    assertEq("Mood count", moodCount, 8);

    const styleCount = await countNodes(session, "Style");
    assertEq("Style count", styleCount, 8);

    const paletteProfileCount = await countNodes(session, "PaletteProfile");
    assertGte("PaletteProfile count", paletteProfileCount, 8);

    console.log();

    // --- Edge count assertions ---

    console.log("Edge counts:");

    const naturallyFeelsCount = await countEdges(session, "NATURALLY_FEELS");
    assertEq("NATURALLY_FEELS edge count", naturallyFeelsCount, 54);

    const expressedAsCount = await countEdges(session, "EXPRESSED_AS");
    assertGte("EXPRESSED_AS edge count", expressedAsCount, 16);

    const hasStyleCount = await countEdges(session, "HAS_STYLE");
    assertGte("HAS_STYLE edge count", hasStyleCount, 29);

    const hasMoodCount = await countEdges(session, "HAS_MOOD");
    assertGte("HAS_MOOD edge count", hasMoodCount, 29);

    const pairsWithCount = await countEdges(session, "PAIRS_WITH");
    assertGt("PAIRS_WITH edge count", pairsWithCount, 0);

    const suggestsPaletteCount = await countEdges(session, "SUGGESTS_PALETTE");
    assertGte("SUGGESTS_PALETTE edge count", suggestsPaletteCount, 8);

    console.log();

    // --- Spot traversal assertions ---

    console.log("Spot traversals:");

    const lawFirmTraversal = await runCountQuery(
      session,
      `MATCH (s:Segment {id:'law-firm'})-[:NATURALLY_FEELS]->(m:Mood)-[:EXPRESSED_AS]->(st:Style)<-[:HAS_STYLE]-(c:Component) RETURN count(c) AS cnt`,
    );
    assertGt(
      "law-firm -> Mood -> Style -> Component traversal",
      lawFirmTraversal,
      0,
    );

    const professionalPalette = await runCountQuery(
      session,
      `MATCH (m:Mood {id:'professional'})-[:SUGGESTS_PALETTE]->(p:PaletteProfile) RETURN count(p) AS cnt`,
    );
    assertGt(
      "professional -> SUGGESTS_PALETTE -> PaletteProfile traversal",
      professionalPalette,
      0,
    );

    console.log();

    // --- Summary ---

    const passed = results.filter((r) => r.passed).length;
    const total = results.length;
    console.log(`=== ${passed}/${total} assertions passed ===`);

    if (passed < total) {
      const failed = results.filter((r) => !r.passed);
      console.log();
      console.log("Failed assertions:");
      for (const f of failed) {
        console.log(`  - ${f.name}: got ${f.actual}, expected ${f.expected}`);
      }
      process.exit(1);
    }
  } finally {
    await session.close();
    await driver.close();
  }
}

main().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
