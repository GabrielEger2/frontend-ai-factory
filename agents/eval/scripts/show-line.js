#!/usr/bin/env node
/**
 * Show one fixture line's candidates with style/mood/density enriched from
 * the per-component metadata.json on disk. Used by /label interactive flow.
 *
 * Usage: node show-line.js <fixturePath> <fixtureId>
 */
const fs = require("fs");
const path = require("path");

const [, , fixturePath, fixtureId] = process.argv;
if (!fixturePath || !fixtureId) {
  console.error("Usage: node show-line.js <fixturePath> <fixtureId>");
  process.exit(1);
}

const repoRoot = path.resolve(__dirname, "..", "..", "..");
const libRoot = path.join(repoRoot, "components", "library");

const metaCache = new Map();
function findMeta(id) {
  if (metaCache.has(id)) return metaCache.get(id);
  const stack = [libRoot];
  while (stack.length) {
    const dir = stack.pop();
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        stack.push(full);
      } else if (e.name === "metadata.json") {
        try {
          const m = JSON.parse(fs.readFileSync(full, "utf8"));
          metaCache.set(m.id, m);
        } catch {}
      }
    }
  }
  return metaCache.get(id);
}

const lines = fs.readFileSync(fixturePath, "utf8").split(/\r?\n/);
const line = lines.find((l) => l.includes(`"fixtureId":"${fixtureId}"`));
if (!line) {
  console.error("fixtureId not found:", fixtureId);
  process.exit(1);
}
const obj = JSON.parse(line);

console.log(`brief: ${obj.brief}`);
console.log(
  `mood: ${obj.mood.join(" / ")}  style: ${obj.style.join(" / ")}  density: ${obj.density}`,
);
console.log(
  `slot: ${obj.slotCategory}  (skeletonIndex ${obj.skeletonIndex}, source ${obj.captureSource})`,
);
console.log(`prevPicked: [${obj.previouslyPicked.join(", ") || "—"}]`);
console.log(`pickId currently: ${obj.pickId === null ? "null" : obj.pickId}`);
console.log("");
console.log("| # | id | name | style | mood | density | imgW |");
console.log("|---|---|---|---|---|---|---|");
obj.candidates.forEach((c, i) => {
  const meta = findMeta(c.id) || {};
  const style = (c.style || meta.style || []).join(", ");
  const mood = (c.mood || meta.mood || []).join(", ");
  const density = c.density || meta.density || "—";
  const imgW = c.imageWeight ?? meta.imageWeight;
  const imgWStr = typeof imgW === "number" ? imgW.toFixed(2) : "—";
  console.log(
    `| ${i + 1} | \`${c.id}\` | ${c.name} | ${style} | ${mood} | ${density} | ${imgWStr} |`,
  );
});
