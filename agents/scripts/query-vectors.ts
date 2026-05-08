/**
 * Demo: query the Qdrant `components` collection per skeleton slot.
 *
 * Usage:
 *   ts-node scripts/query-vectors.ts "<brief>" [flags]
 *
 * Flags (all optional — defaults preserve original SaaS-shaped mock):
 *   --mood    <comma-list>   e.g. "elegant,warm,friendly"  (default: professional)
 *   --style   <comma-list>   e.g. "editorial,luxury"       (default: modern)
 *   --density <low|medium|high>                            (default: medium)
 *
 * Required env vars (point to SSM parameter names, not raw secrets):
 *   QDRANT_ENDPOINT_SSM_PATH   — e.g. /sitegen/dev/qdrant-endpoint
 *   QDRANT_API_KEY_SSM_PATH    — e.g. /sitegen/dev/qdrant-api-key
 *   OPENAI_API_KEY_SSM_PATH    — e.g. /sitegen/dev/openai-api-key
 *
 * For each slot in DEFAULT_SKELETON, embeds a per-slot query string via
 * OpenAI text-embedding-3-small (1536-d), runs three category-filtered
 * cosine similarity searches against the `components` collection — one per
 * named-vector axis (`descriptive`, `usage`, `audienceFit`) — merges results
 * by componentId taking the max axis score, and prints the top-3 hits per
 * slot as a markdown table. The slotQuery phrasing mirrors the Composer
 * handler exactly: `${category} for ${brief}; mood: ${mood}; needs:
 * ${purpose}`, so the mood override flows into the embedding too — not just
 * rerank.
 *
 * After printing the top-3 table, the script also runs the deterministic
 * Phase D `rerankCandidates` four-signal combiner (PAIRS_WITH + style
 * overlap + diversity + density) and prints a per-signal score breakdown
 * for the winning candidate per slot. This enables empirical weight
 * tuning for Stage 4 of the composer eval loop.
 */

import * as fs from "fs";
import * as path from "path";
import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";
import { getEmbedding } from "../shared/embeddings";
import { getQdrantClient } from "../shared/qdrant-client";
import { DEFAULT_SKELETON, type Skeleton } from "../composer/defaultSkeleton";
import { rerankCandidates, DEFAULT_RERANK_WEIGHTS } from "../composer/rerank";
import { planSkeleton } from "../composer/skeletonPlanner";
import type { ComposerAgentInput } from "../composer/types";
import { COMPONENT_METADATA } from "../assembler/component-sources.generated";
import type { CandidateComponent } from "../composer/prompt";
import type { StyleOutput } from "../shared/types";

/**
 * Hardcoded per-brief skeletons used when --offline is passed or when the
 * LLM planner falls back. All entries exclude `navigation` (the capture
 * loop skips it). Categories must come from SkeletonSlotSchema.
 *
 * Note: agencia-marketing-b2b intentionally has two `content` slots
 * (services + case studies). Both produce fixtureId
 * `agencia-marketing-b2b__content` — the second silently overrides the
 * first in the transplant map. Acceptable per locked decision User-Q3.
 */
const FALLBACK_SKELETONS: Record<string, Skeleton> = {
  "padaria-luxo-sp": [
    { category: "hero", purpose: "brand visual hook, artisan breads" },
    { category: "products", purpose: "signature breads and pastries showcase" },
    { category: "gallery", purpose: "craftsmanship and shop imagery" },
    { category: "content", purpose: "heritage and artisan philosophy" },
    { category: "testimonial", purpose: "loyal customer love" },
    { category: "cta", purpose: "order or visit" },
    { category: "contact", purpose: "store location, hours, map" },
    { category: "footer", purpose: "navigation and social" },
  ],
  "advocacia-tributaria-bh": [
    {
      category: "hero",
      purpose: "authority brand statement, tax law expertise",
    },
    { category: "content", purpose: "practice areas overview" },
    { category: "stats", purpose: "results: cases won, clients served, years" },
    { category: "team", purpose: "lead attorneys and specializations" },
    { category: "faq", purpose: "common tax questions answered" },
    { category: "testimonial", purpose: "client outcomes" },
    { category: "cta", purpose: "schedule a consultation" },
    { category: "contact", purpose: "office address, phone, intake" },
    { category: "footer", purpose: "navigation and legal links" },
  ],
  "crossfit-rj": [
    {
      category: "hero",
      purpose: "high-energy brand hook, community in action",
    },
    { category: "content", purpose: "programs and class schedule" },
    { category: "gallery", purpose: "community photos and WOD action shots" },
    { category: "stats", purpose: "members, classes per week, coaches" },
    { category: "testimonial", purpose: "transformation stories" },
    { category: "cta", purpose: "book a free trial class" },
    { category: "contact", purpose: "location, hours, arrival" },
    { category: "footer", purpose: "navigation and social" },
  ],
  "agencia-marketing-b2b": [
    { category: "hero", purpose: "positioning, B2B growth results" },
    {
      category: "content",
      purpose: "services overview: SEO, paid media, content",
    },
    { category: "stats", purpose: "client results, ROI, campaigns" },
    { category: "content", purpose: "case studies, specific transformations" },
    { category: "team", purpose: "strategists and specialists" },
    { category: "testimonial", purpose: "client praise and outcomes" },
    { category: "cta", purpose: "request a free audit or strategy call" },
    { category: "contact", purpose: "intake form, email, LinkedIn" },
    { category: "footer", purpose: "navigation and social" },
  ],
  "restaurante-japones": [
    { category: "hero", purpose: "editorial atmosphere hook, omakase" },
    { category: "content", purpose: "menu story and chef philosophy" },
    { category: "gallery", purpose: "dishes, plating, ambiance" },
    { category: "testimonial", purpose: "guest experiences and critic praise" },
    { category: "cta", purpose: "reserve a table" },
    { category: "contact", purpose: "address, hours, reservation policy" },
    { category: "footer", purpose: "navigation and social" },
  ],
  "clinica-odontologica": [
    { category: "hero", purpose: "welcoming family-care statement" },
    {
      category: "content",
      purpose: "services: cleanings, ortho, cosmetic, pediatric",
    },
    { category: "team", purpose: "dentists and specialists with credentials" },
    { category: "faq", purpose: "procedures, insurance, payment, anxiety" },
    { category: "stats", purpose: "patients served, success rate, years" },
    { category: "testimonial", purpose: "happy patients and outcomes" },
    { category: "cta", purpose: "book an appointment" },
    { category: "contact", purpose: "clinic address, phone, booking" },
    { category: "footer", purpose: "navigation" },
  ],
  "atelie-moda": [
    {
      category: "hero",
      purpose: "editorial brand identity, handcrafted fashion",
    },
    { category: "gallery", purpose: "latest collection and lookbook" },
    { category: "products", purpose: "collection pieces available for order" },
    { category: "content", purpose: "brand story and atelier philosophy" },
    { category: "testimonial", purpose: "client feedback" },
    { category: "cta", purpose: "schedule a fitting or commission" },
    { category: "contact", purpose: "atelier location and booking" },
    { category: "footer", purpose: "navigation and Instagram" },
  ],
  "consultoria-financeira": [
    { category: "hero", purpose: "financial-clarity statement" },
    {
      category: "content",
      purpose: "services: budgeting, investing, debt, retirement",
    },
    {
      category: "stats",
      purpose: "clients helped, savings improvement, years",
    },
    { category: "testimonial", purpose: "transformation stories" },
    { category: "faq", purpose: "methodology, process, fees" },
    { category: "cta", purpose: "book a free financial diagnosis" },
    { category: "contact", purpose: "form, email, WhatsApp" },
    { category: "footer", purpose: "navigation and regulatory disclaimer" },
  ],
};

interface BriefData {
  companyName: string;
  segment: string;
  toneKeywords: string[];
  targetAudience: string;
}

const CAPTURE_BRIEFS: Record<string, BriefData> = {
  "padaria-luxo-sp": {
    companyName: "Padaria de Luxo SP",
    segment: "padaria artesanal de luxo",
    toneKeywords: ["artisanal", "premium", "warm"],
    targetAudience: "food lovers and premium consumers in São Paulo",
  },
  "advocacia-tributaria-bh": {
    companyName: "Advocacia Tributária BH",
    segment: "advocacia tributária",
    toneKeywords: ["authoritative", "professional", "reliable"],
    targetAudience:
      "businesses and entrepreneurs in Belo Horizonte facing tax issues",
  },
  "crossfit-rj": {
    companyName: "CrossFit RJ",
    segment: "academia de crossfit",
    toneKeywords: ["energetic", "motivating", "community"],
    targetAudience: "fitness enthusiasts in Rio de Janeiro",
  },
  "agencia-marketing-b2b": {
    companyName: "Agência Marketing B2B",
    segment: "agência de marketing digital B2B",
    toneKeywords: ["strategic", "results-driven", "innovative"],
    targetAudience: "B2B companies seeking digital growth",
  },
  "restaurante-japones": {
    companyName: "Restaurante Japonês",
    segment: "restaurante japonês alta gastronomia",
    toneKeywords: ["elegant", "refined", "immersive"],
    targetAudience: "food enthusiasts seeking fine Japanese dining",
  },
  "clinica-odontologica": {
    companyName: "Clínica Odontológica",
    segment: "clínica odontológica família",
    toneKeywords: ["caring", "trustworthy", "professional"],
    targetAudience: "families and individuals seeking dental care",
  },
  "atelie-moda": {
    companyName: "Ateliê de Moda Autoral",
    segment: "ateliê de moda autoral",
    toneKeywords: ["creative", "exclusive", "artistic"],
    targetAudience: "fashion-conscious buyers seeking unique pieces",
  },
  "consultoria-financeira": {
    companyName: "Consultoria Financeira",
    segment: "consultoria financeira pessoal",
    toneKeywords: ["clear", "trustworthy", "empowering"],
    targetAudience: "individuals seeking financial clarity and planning",
  },
};

/* ------------------------------------------------------------------ */
/*  Resolve query brief + style overrides                              */
/* ------------------------------------------------------------------ */

const argv = process.argv.slice(2);

let brief: string | undefined;
let moodOverride: string[] | undefined;
let styleOverride: string[] | undefined;
let densityOverride: string | undefined;
let captureSlug: string | undefined;
let offlineMode = false;
let replanMode = false;

const splitCsv = (raw: string): string[] =>
  raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

for (let i = 0; i < argv.length; i++) {
  const arg = argv[i];
  if (arg === "--mood" && i + 1 < argv.length) {
    moodOverride = splitCsv(argv[++i]);
  } else if (arg === "--style" && i + 1 < argv.length) {
    styleOverride = splitCsv(argv[++i]);
  } else if (arg === "--density" && i + 1 < argv.length) {
    densityOverride = argv[++i].trim();
  } else if (arg === "--capture" && i + 1 < argv.length) {
    captureSlug = argv[++i];
  } else if (arg === "--offline" || arg === "--no-llm") {
    offlineMode = true;
  } else if (arg === "--replan") {
    replanMode = true;
  } else if (!arg.startsWith("--") && brief === undefined) {
    brief = arg;
  }
}

if (!brief) {
  console.error(
    'Usage: ts-node scripts/query-vectors.ts "<brief>" [--mood a,b,c] [--style a,b,c] [--density low|medium|high] [--capture <slug>] [--offline|--no-llm] [--replan]',
  );
  process.exit(1);
}

const captureMode = captureSlug !== undefined;
const fixturePath = captureMode
  ? path.resolve(__dirname, "../eval/fixtures", `${captureSlug}.jsonl`)
  : undefined;
if (fixturePath) {
  fs.mkdirSync(path.dirname(fixturePath), { recursive: true });
}

/* ------------------------------------------------------------------ */
/*  Verify required env vars                                           */
/* ------------------------------------------------------------------ */

const REQUIRED_ENV_VARS = [
  "QDRANT_ENDPOINT_SSM_PATH",
  "QDRANT_API_KEY_SSM_PATH",
  "OPENAI_API_KEY_SSM_PATH",
] as const;

for (const name of REQUIRED_ENV_VARS) {
  if (!process.env[name]) {
    console.error(`Error: ${name} environment variable is not set`);
    process.exit(1);
  }
}

const llmMode = captureMode && !offlineMode;
if (llmMode && !process.env.CLAUDE_API_KEY_SSM_PATH) {
  console.error(
    "Error: CLAUDE_API_KEY_SSM_PATH is required for LLM skeleton planning. Pass --offline to use fallback archetypes.",
  );
  process.exit(1);
}

/* ------------------------------------------------------------------ */
/*  SSM-cached Claude API key                                          */
/*  Mirrors agents/scripts/describe-components.ts                       */
/* ------------------------------------------------------------------ */

const ssmClient = new SSMClient({});

let cachedClaudeApiKey: string | undefined;

async function getClaudeApiKey(): Promise<string> {
  if (cachedClaudeApiKey) return cachedClaudeApiKey;
  const ssmPath = process.env.CLAUDE_API_KEY_SSM_PATH;
  if (!ssmPath) {
    throw new Error("CLAUDE_API_KEY_SSM_PATH is not set");
  }
  const result = await ssmClient.send(
    new GetParameterCommand({ Name: ssmPath, WithDecryption: true }),
  );
  const value = result.Parameter?.Value;
  if (!value) {
    throw new Error(`SSM parameter ${ssmPath} returned no value`);
  }
  cachedClaudeApiKey = value;
  return value;
}

/* ------------------------------------------------------------------ */
/*  Payload shape (mirrors what seed-vectors.ts writes)                */
/* ------------------------------------------------------------------ */

interface ComponentPayload {
  componentId?: string;
  name?: string;
  category?: string;
  style?: string[];
  mood?: string[];
  purpose?: string[];
}

/* ------------------------------------------------------------------ */
/*  StyleOutput for the re-ranker (CLI-overridable)                    */
/* ------------------------------------------------------------------ */

/**
 * Debug approximation only. The real composer pipeline feeds the Style
 * Agent's StyleOutput into rerankCandidates; this script lacks an upstream
 * style run, so we hand-roll a minimal object with just the fields the
 * style-overlap scorer actually reads (`style`, `mood`) plus `density` for
 * the density penalty. Other StyleOutput fields (palette, typography, etc.)
 * are unused by rerank.ts, so we cast through `unknown` rather than
 * fabricate plausible values. Stage 4 will thread real StyleOutput from a
 * captured pipeline run.
 *
 * The defaults below preserve the original SaaS-shaped mock so existing
 * runs reproduce; the CLI flags let callers override per brief.
 */
const STYLE_OUTPUT = {
  mood: moodOverride ?? ["professional"],
  style: styleOverride ?? ["modern"],
  density: densityOverride ?? "medium",
} as unknown as StyleOutput;

/* ------------------------------------------------------------------ */
/*  Label transplant helper                                            */
/* ------------------------------------------------------------------ */

function transplantLabels(oldPath: string, newLines: object[]): object[] {
  const transplantMap = new Map<string, string>();
  if (fs.existsSync(oldPath)) {
    const raw = fs.readFileSync(oldPath, "utf-8").trim();
    if (raw) {
      for (const line of raw.split("\n").filter(Boolean)) {
        try {
          const obj = JSON.parse(line);
          if (
            obj?.fixtureId &&
            obj.pickId !== null &&
            obj.pickId !== undefined
          ) {
            transplantMap.set(obj.fixtureId, obj.pickId);
          }
        } catch {
          // skip malformed lines
        }
      }
    }
  }
  return newLines.map((line) => {
    const l = line as {
      fixtureId?: string;
      candidates?: { id: string }[];
      pickId: string | null;
    };
    const saved = l.fixtureId ? transplantMap.get(l.fixtureId) : undefined;
    if (!saved) return line;
    const candidateIds = new Set((l.candidates ?? []).map((c) => c.id));
    if (!candidateIds.has(saved)) {
      console.warn(
        `[transplant] pickId ${saved} not in new candidates for ${l.fixtureId} — dropping label`,
      );
      return line;
    }
    return { ...line, pickId: saved };
  });
}

/* ------------------------------------------------------------------ */
/*  Per-brief skeleton resolver (cache + LLM + fallback)               */
/* ------------------------------------------------------------------ */

/**
 * Resolves the skeleton to use for --capture mode. Order of preference:
 * 1. If --replan: delete cache for this slug, then proceed.
 * 2. If cached skeleton JSON exists at agents/eval/skeletons/<slug>.json
 *    AND not --offline: read and return.
 * 3. If !offline: call planSkeleton (LLM), write cache, return result.
 * 4. Fallback: FALLBACK_SKELETONS[slug] ?? DEFAULT_SKELETON.
 *
 * Note: planSkeleton never throws — it returns DEFAULT_SKELETON on
 * error. If you suspect a bad cache from a failed LLM call, run
 * with --replan. To clear all caches: rm agents/eval/skeletons/*.json
 */
async function resolveSkeletonForCapture(
  slug: string,
  queryText: string,
  styleOutput: StyleOutput,
  opts: { offline: boolean; replan: boolean },
): Promise<Skeleton> {
  const cacheDir = path.resolve(__dirname, "../eval/skeletons");
  const cacheFile = path.join(cacheDir, `${slug}.json`);

  if (opts.replan && fs.existsSync(cacheFile)) {
    fs.rmSync(cacheFile, { force: true });
    console.log(`[skeleton] cleared cache for ${slug} (--replan)`);
  }

  if (!opts.offline && fs.existsSync(cacheFile)) {
    try {
      const cached = JSON.parse(
        fs.readFileSync(cacheFile, "utf-8"),
      ) as Skeleton;
      if (Array.isArray(cached) && cached.length > 0) {
        console.log(
          `[skeleton] using cached skeleton for ${slug} (${cached.length} slots)`,
        );
        return cached;
      }
    } catch {
      console.warn(
        `[skeleton] cached skeleton for ${slug} unreadable; will re-plan`,
      );
    }
  }

  if (!opts.offline) {
    try {
      const apiKey = await getClaudeApiKey();
      const briefData = CAPTURE_BRIEFS[slug];
      const composerInput = {
        projectId: `capture__${slug}`,
        status: "composing",
        companyName: briefData?.companyName ?? slug,
        segment: briefData?.segment ?? queryText,
        description: queryText,
        desiredSections: null,
        brandToneKeywords: briefData?.toneKeywords ?? [],
        objectives: null,
        pageType: undefined,
        researchOutput: {
          segment: briefData?.segment ?? queryText,
          targetAudience: briefData?.targetAudience ?? "",
          toneKeywords: briefData?.toneKeywords ?? [],
          competitorInsights: "",
          differentiators: [],
          companySummary: queryText,
        },
        styleOutput,
      } as unknown as ComposerAgentInput;

      const skeleton = await planSkeleton(composerInput, apiKey);
      fs.mkdirSync(cacheDir, { recursive: true });
      fs.writeFileSync(cacheFile, JSON.stringify(skeleton, null, 2), "utf-8");
      console.log(
        `[skeleton] LLM-planned ${skeleton.length} slots for ${slug} → cached at ${cacheFile}`,
      );
      return skeleton;
    } catch (err) {
      console.warn(
        `[skeleton] LLM call failed for ${slug}: ${(err as Error).message}; using fallback`,
      );
    }
  }

  const fallback = FALLBACK_SKELETONS[slug] ?? DEFAULT_SKELETON;
  console.log(
    `[skeleton] using fallback archetype for ${slug} (${fallback.length} slots, ${opts.offline ? "offline" : "no-cache"})`,
  );
  return fallback;
}

/* ------------------------------------------------------------------ */
/*  Main                                                               */
/* ------------------------------------------------------------------ */

async function main(): Promise<void> {
  // brief is non-undefined here (we exit above when it is missing) but TS
  // narrowing across module-level checks is unreliable, so re-assert.
  const queryText: string = brief as string;

  const client = await getQdrantClient();

  const escapedBrief = queryText.replace(/"/g, '\\"');
  console.log();
  console.log(`> Query: "${escapedBrief}"`);
  console.log(
    `> Style: mood=[${(STYLE_OUTPUT.mood ?? []).join(", ")}] style=[${(STYLE_OUTPUT.style ?? []).join(", ")}] density=${STYLE_OUTPUT.density}`,
  );

  const moodTags = (STYLE_OUTPUT.mood ?? []).join(", ");

  const skeleton: Skeleton =
    captureMode && captureSlug
      ? await resolveSkeletonForCapture(captureSlug, queryText, STYLE_OUTPUT, {
          offline: offlineMode,
          replan: replanMode,
        })
      : DEFAULT_SKELETON;

  const newFixtureLines: object[] = [];

  const axes = ["descriptive", "usage", "audienceFit"] as const;
  type Axis = (typeof axes)[number];

  // Track picked candidates across slots so the diversity / density signals
  // see real prior picks (mirrors the handler's greedy loop).
  const pickedCandidates: CandidateComponent[] = [];

  for (let skeletonIdx = 0; skeletonIdx < skeleton.length; skeletonIdx++) {
    const slot = skeleton[skeletonIdx];
    if (captureMode && slot.category === "navigation") continue;
    // Mirrors agents/composer/handler.ts:564 phrasing exactly so debug runs
    // produce the same embeddings the production composer would.
    const slotQuery = `${slot.category} for ${queryText}; mood: ${moodTags}; needs: ${slot.purpose}`;
    const slotVector = await getEmbedding(slotQuery);

    const filter = {
      must: [{ key: "category", match: { value: slot.category } }],
    };

    // The Qdrant SDK exposes options in snake_case (`with_payload`),
    // matching the underlying REST schema — verified against
    // @qdrant/js-client-rest qdrant-client.d.ts. Named-vector search uses
    // `vector: { name, vector }` (NamedVectorStruct).
    const [descriptiveHits, usageHits, audienceFitHits] = await Promise.all(
      axes.map((axis) =>
        client.search("components", {
          vector: { name: axis, vector: slotVector },
          limit: captureMode ? 5 : 3,
          with_payload: true,
          filter,
        }),
      ),
    );

    type Merged = {
      payload: ComponentPayload;
      scoresByAxis: Record<Axis, number>;
    };
    const merged = new Map<string, Merged>();

    const ingest = (
      hits: Awaited<ReturnType<typeof client.search>>,
      axis: Axis,
    ): void => {
      for (const hit of hits) {
        const payload = (hit.payload ?? {}) as ComponentPayload;
        const id = payload.componentId ?? String(hit.id);
        const existing = merged.get(id);
        if (existing) {
          existing.scoresByAxis[axis] = Math.max(
            existing.scoresByAxis[axis],
            hit.score,
          );
        } else {
          merged.set(id, {
            payload,
            scoresByAxis: {
              descriptive: 0,
              usage: 0,
              audienceFit: 0,
              [axis]: hit.score,
            },
          });
        }
      }
    };

    ingest(descriptiveHits, "descriptive");
    ingest(usageHits, "usage");
    ingest(audienceFitHits, "audienceFit");

    type Ranked = {
      id: string;
      name: string;
      score: number;
      axis: Axis;
    };
    const ranked: Ranked[] = [];
    for (const [id, entry] of merged) {
      let bestAxis: Axis = "descriptive";
      let bestScore = entry.scoresByAxis.descriptive;
      for (const axis of axes) {
        if (entry.scoresByAxis[axis] > bestScore) {
          bestScore = entry.scoresByAxis[axis];
          bestAxis = axis;
        }
      }
      ranked.push({
        id,
        name: entry.payload.name ?? "—",
        score: bestScore,
        axis: bestAxis,
      });
    }
    ranked.sort((a, b) => b.score - a.score);
    const topRanked = ranked.slice(0, 3);

    console.log();
    console.log(`## Slot: ${slot.category} (needs: ${slot.purpose})`);
    console.log();
    console.log("| Rank | ID | Name | Score | Axis |");
    console.log("|---|---|---|---|---|");

    topRanked.forEach((row, idx) => {
      const score = row.score.toFixed(4);
      console.log(
        `| ${idx + 1} | ${row.id} | ${row.name} | ${score} | ${row.axis} |`,
      );
    });

    /* -------------------------------------------------------------- */
    /*  Phase D: build CandidateComponent[] and re-rank                */
    /* -------------------------------------------------------------- */

    // Backfill density / imageWeight / style / mood from COMPONENT_METADATA
    // so the re-ranker signals operate on real values rather than sentinels.
    // Mirrors handler.ts::getVectorCandidatesForSlot.
    const slotCandidates: CandidateComponent[] = [];
    for (const [id, entry] of merged) {
      const maxScore = Math.max(
        entry.scoresByAxis.descriptive,
        entry.scoresByAxis.usage,
        entry.scoresByAxis.audienceFit,
      );
      const meta = COMPONENT_METADATA[id];
      slotCandidates.push({
        id,
        name: entry.payload.name ?? "",
        category: entry.payload.category ?? slot.category,
        density: meta?.density ?? "medium",
        layout: "full",
        moodHits: 0,
        styleHits: 0,
        avgPairScore: maxScore,
        vectorScore: maxScore,
        vectorScoresByAxis: entry.scoresByAxis,
        imageWeight: meta?.imageWeight,
        style: meta?.style,
        mood: meta?.mood,
        source: "vector" as const,
      });
    }

    if (slotCandidates.length === 0) continue;

    const reranked = rerankCandidates(
      slotCandidates,
      pickedCandidates,
      STYLE_OUTPUT,
      DEFAULT_RERANK_WEIGHTS,
    );
    const top = reranked[0];
    if (!top) continue;

    if (captureMode && fixturePath) {
      const captureSource: "vector" | "fallback" = slotCandidates.every(
        (c) => c.source === "vector",
      )
        ? "vector"
        : "fallback";

      const fixtureLine = {
        fixtureId: `${captureSlug}__${slot.category}`,
        brief: queryText,
        mood: STYLE_OUTPUT.mood ?? [],
        style: STYLE_OUTPUT.style ?? [],
        density: STYLE_OUTPUT.density ?? "medium",
        slotCategory: slot.category,
        skeletonIndex: skeletonIdx,
        captureSource,
        candidates: slotCandidates,
        previouslyPicked: pickedCandidates.map((c) => c.id),
        pickId: null,
      };

      newFixtureLines.push(fixtureLine);
      console.log(
        `[capture] wrote fixture line for slot=${slot.category} → ${fixturePath}`,
      );
    }

    // _rerankDebug is attached via a type cast inside rerank.ts so it does
    // not leak into the LLM-facing CandidateComponent interface.
    const debug = (
      top as unknown as {
        _rerankDebug?: {
          pairsWithScore: number;
          styleScore: number;
          diversityPenalty: number;
          densityPenalty: number;
          rerankScore: number;
        };
      }
    )._rerankDebug;

    const fmt = (n: number | undefined): string =>
      typeof n === "number" ? n.toFixed(3) : "—";

    console.log();
    console.log(
      `### Re-rank winner: ${top.id}${top.name ? ` — ${top.name}` : ""}`,
    );
    console.log();
    console.log("| Signal           | Score |");
    console.log("|---|---|");
    console.log(`| vectorScore      | ${fmt(top.vectorScore)} |`);
    console.log(`| pairsWithScore   | ${fmt(debug?.pairsWithScore)} |`);
    console.log(`| styleScore       | ${fmt(debug?.styleScore)} |`);
    console.log(`| diversityPenalty | ${fmt(debug?.diversityPenalty)} |`);
    console.log(`| densityPenalty   | ${fmt(debug?.densityPenalty)} |`);
    console.log(`| rerankScore      | ${fmt(debug?.rerankScore)} |`);

    pickedCandidates.push(top);
  }

  if (captureMode && fixturePath) {
    const transplanted = transplantLabels(fixturePath, newFixtureLines);
    fs.writeFileSync(
      fixturePath,
      transplanted.map((l) => JSON.stringify(l)).join("\n") + "\n",
      "utf-8",
    );
    console.log(
      `[capture] wrote ${transplanted.length} fixture lines → ${fixturePath}`,
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
