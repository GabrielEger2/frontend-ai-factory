import { Handler } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  UpdateCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";
import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";
import Anthropic from "@anthropic-ai/sdk";

import {
  ComposerOutput,
  ComposerOutputSchema,
  ComponentItem,
  StyleOutput,
} from "../shared/types";
import { getEmbedding } from "../shared/embeddings";
import { getQdrantClient } from "../shared/qdrant-client";
import { emitQdrantQueryError } from "../shared/metrics";
import { ComposerAgentInput, ComposerAgentInputSchema } from "./types";
import {
  buildSystemPrompt,
  buildUserPrompt,
  CandidateComponent,
  PairMatrixEntry,
} from "./prompt";
import { runPairPostCheck } from "./post-check";
import { COMPONENT_METADATA } from "../assembler/component-sources.generated";
import { planSkeleton } from "./skeletonPlanner";
import { rerankCandidates, DEFAULT_RERANK_WEIGHTS } from "./rerank";

/* ------------------------------------------------------------------ */
/*  Layout constraint violation                                        */
/* ------------------------------------------------------------------ */

/**
 * Thrown when the composed layout violates a hard rule from the buyer
 * intake form (desired/excluded section categories). SFN composerStep
 * retry policy will re-invoke the agent with the same input; on second
 * failure the Catch routes to the fail handler. This is preferred over
 * deterministic injection because randomly inserting a category disrupts
 * the LLM's ordering decisions and produces worse layouts than a retry.
 */
class LayoutConstraintError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LayoutConstraintError";
  }
}

/* ------------------------------------------------------------------ */
/*  Mandatory navbar/footer enforcement                                */
/* ------------------------------------------------------------------ */

const NAVBAR_ID = "navbar-sticky-01";
const FOOTER_ID = "footer-reveal-01";

/**
 * Ensure every layout begins with the mandatory navbar and ends with the
 * mandatory footer. This is an ID-based comparison: Phase 1 has exactly one
 * navbar (`navbar-sticky-01`) and one footer (`footer-reveal-01`), so direct
 * ID matching is sufficient and avoids a metadata lookup. Upgrade this to a
 * category-based check (`category === "navigation" | "footer"`) when a
 * second navbar or footer component is added.
 */
function enforceNavbarFooter(output: ComposerOutput): ComposerOutput {
  for (const layout of output.layouts) {
    if (layout.components[0] !== NAVBAR_ID) {
      layout.components.unshift(NAVBAR_ID);
    }
    const last = layout.components[layout.components.length - 1];
    if (last !== FOOTER_ID) {
      layout.components.push(FOOTER_ID);
    }
  }
  return output;
}

/**
 * Validates the buyer's section selections against the SELECTED layout.
 *
 * Scope difference vs `enforceNavbarFooter`: this validates ONLY
 * `output.layouts[output.selectedLayout].components`, not all layouts —
 * the seller approves the selected layout, so only that one needs to honor
 * the hard rules. Validating all layouts would reject perfectly good
 * alternates that the seller may never see.
 *
 * Throws `LayoutConstraintError` on violation. Composer SFN retry policy
 * re-invokes with the same input; the prompt's hard-rule sections give the
 * LLM a second chance. On second failure, Catch routes to the fail handler.
 *
 * Category lookup uses the `candidates` array already in scope inside
 * `composeLayouts` (each entry has `.category`). DO NOT re-read manifest.json
 * here — the candidate set is the authoritative source for this run.
 */
function enforceDesiredSections(
  output: ComposerOutput,
  desired: string[],
  candidates: CandidateComponent[],
): ComposerOutput {
  if (desired.length === 0) {
    return output;
  }

  const categoryById = new Map<string, string>();
  for (const c of candidates) {
    categoryById.set(c.id, c.category);
  }

  const selected = output.layouts[output.selectedLayout];
  if (!selected) {
    throw new LayoutConstraintError(
      `Selected layout index ${output.selectedLayout} is out of range (have ${output.layouts.length}).`,
    );
  }

  const presentCategories = new Set<string>();
  for (const id of selected.components) {
    const cat = categoryById.get(id);
    if (cat) presentCategories.add(cat);
  }

  // Required categories must all appear at least once.
  const missing = desired.filter((c) => !presentCategories.has(c));
  if (missing.length > 0) {
    throw new LayoutConstraintError(
      `Selected layout is missing required categories: ${missing.join(", ")}`,
    );
  }

  return output;
}

/* ------------------------------------------------------------------ */
/*  Clients (reused across Lambda invocations)                         */
/* ------------------------------------------------------------------ */

const ddbClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const ssmClient = new SSMClient({});

/* ------------------------------------------------------------------ */
/*  SSM-cached Claude API key                                          */
/* ------------------------------------------------------------------ */

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
/*  DynamoDB fallback — scan ComponentsTable when vector search fails  */
/* ------------------------------------------------------------------ */

async function getDynamoFallbackCandidates(
  styleOutput: StyleOutput,
  imageryDensityScale: number,
): Promise<CandidateComponent[]> {
  const tableName = process.env.COMPONENTS_TABLE_NAME;
  if (!tableName) {
    throw new Error("COMPONENTS_TABLE_NAME environment variable is not set");
  }

  const result = await ddbClient.send(
    new ScanCommand({ TableName: tableName }),
  );

  const items = (result.Items ?? []) as ComponentItem[];

  const approvedMoods = new Set<string>(styleOutput.mood);
  const approvedStyles = new Set<string>(styleOutput.style);

  const candidates: CandidateComponent[] = items
    .map((item) => {
      const moodHits = (item.mood ?? []).filter((m) =>
        approvedMoods.has(m),
      ).length;
      const styleHits = (item.style ?? []).filter((s) =>
        approvedStyles.has(s),
      ).length;

      // Derive a simple pair score from pairsWell array length
      const pairsWellCount = (item.pairsWell ?? []).length;
      const avgPairScore = pairsWellCount > 0 ? 0.65 : 0.5;

      return {
        id: item.id,
        name: item.name,
        category: item.category,
        density:
          (item as unknown as Record<string, string>).density ?? "medium",
        layout: (item as unknown as Record<string, string>).layout ?? "full",
        moodHits,
        styleHits,
        avgPairScore,
        imageWeight: item.imageWeight,
      };
    })
    .filter((c) => c.moodHits > 0 || c.styleHits > 0)
    .sort(
      (a, b) =>
        b.moodHits * 2 +
        b.styleHits +
        b.avgPairScore +
        (b.imageWeight ?? 0) * imageryDensityScale -
        (a.moodHits * 2 +
          a.styleHits +
          a.avgPairScore +
          (a.imageWeight ?? 0) * imageryDensityScale),
    )
    .slice(0, 20);

  return candidates;
}

/* ------------------------------------------------------------------ */
/*  Mark project as "composing" in DynamoDB                            */
/* ------------------------------------------------------------------ */

// On SFN retry this overwrites status from awaiting_layout_approval back to
// composing — same behavior as Style Agent (also overwrites awaiting_style_approval
// on retry). Accepted: the retry path always reaches saveComposerAndToken at the
// end, which restores awaiting_layout_approval before SFN observes the value.
async function markComposingStarted(projectId: string): Promise<void> {
  const tableName = process.env.PROJECTS_TABLE_NAME;
  if (!tableName) {
    throw new Error("PROJECTS_TABLE_NAME environment variable is not set");
  }

  await ddbClient.send(
    new UpdateCommand({
      TableName: tableName,
      Key: { pk: `PROJECT#${projectId}`, sk: `PROJECT#${projectId}` },
      UpdateExpression: "SET #s = :status, updatedAt = :now",
      ExpressionAttributeNames: { "#s": "status" },
      ExpressionAttributeValues: {
        ":status": "composing",
        ":now": new Date().toISOString(),
      },
    }),
  );
}

/* ------------------------------------------------------------------ */
/*  Vector retrieval — per-slot category-filtered Qdrant search        */
/* ------------------------------------------------------------------ */

/**
 * Run three Qdrant cosine-similarity searches restricted to one canonical
 * category — one per named vector axis (`descriptive`, `usage`, `audienceFit`).
 * Results are merged by `componentId`; each candidate's score is the max
 * across the three axes, so the strongest matching axis pulls the component
 * into the top-K.
 *
 * Three independent calls (rather than the batch `searchBatch` API) keeps the
 * code simple and matches the Phase C plan: 3 searches × N slots × M generations
 * is well within Qdrant's request budget for a single-tenant deployment.
 *
 * The `category` field on each Qdrant payload was seeded with the singular
 * canonical value (matching `metadata.json`'s `category`), so the equality
 * match below is sufficient — no payload re-shape required.
 */
async function getVectorCandidatesForSlot(
  queryVector: number[],
  topK: number,
  category: string,
): Promise<CandidateComponent[]> {
  const client = await getQdrantClient();
  const filter = {
    must: [{ key: "category", match: { value: category } }],
  };

  const axes = ["descriptive", "usage", "audienceFit"] as const;
  type Axis = (typeof axes)[number];

  const [descriptiveHits, usageHits, audienceFitHits] = await Promise.all(
    axes.map((axis) =>
      client.search("components", {
        vector: { name: axis, vector: queryVector },
        limit: topK,
        with_payload: true,
        filter,
      }),
    ),
  );

  type Merged = {
    payload: { componentId?: string; name?: string; category?: string };
    scoresByAxis: { descriptive: number; usage: number; audienceFit: number };
  };
  const merged = new Map<string, Merged>();

  const ingest = (
    hits: Awaited<ReturnType<typeof client.search>>,
    axis: Axis,
  ): void => {
    for (const hit of hits) {
      const p = (hit.payload ?? {}) as {
        componentId?: string;
        name?: string;
        category?: string;
      };
      const id = p.componentId ?? String(hit.id);
      const existing = merged.get(id);
      if (existing) {
        existing.scoresByAxis[axis] = Math.max(
          existing.scoresByAxis[axis],
          hit.score,
        );
      } else {
        merged.set(id, {
          payload: p,
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

  const candidates: CandidateComponent[] = [];
  for (const [id, entry] of merged) {
    const maxScore = Math.max(
      entry.scoresByAxis.descriptive,
      entry.scoresByAxis.usage,
      entry.scoresByAxis.audienceFit,
    );
    const meta = COMPONENT_METADATA[id];
    candidates.push({
      id,
      name: entry.payload.name ?? "",
      category: entry.payload.category ?? category,
      density: meta?.density ?? "medium",
      layout: "full",
      moodHits: 0,
      styleHits: 0,
      // Surface the cosine similarity in `avgPairScore` so re-ranker logic
      // operates on a single normalized 0–1 score field.
      avgPairScore: maxScore,
      vectorScore: maxScore,
      vectorScoresByAxis: entry.scoresByAxis,
      imageWeight: meta?.imageWeight,
      style: meta?.style,
      mood: meta?.mood,
      source: "vector" as const,
    });
  }

  candidates.sort((a, b) => b.vectorScore! - a.vectorScore!);
  return candidates.slice(0, topK);
}

/* ------------------------------------------------------------------ */
/*  Call Claude API for layout composition                             */
/* ------------------------------------------------------------------ */

async function composeLayouts(
  input: ReturnType<typeof ComposerAgentInputSchema.parse>,
  candidates: CandidateComponent[],
  source: "vector" | "fallback",
  pairMatrix: PairMatrixEntry[],
): Promise<ComposerOutput> {
  const apiKey = await getClaudeApiKey();
  const client = new Anthropic({ apiKey });

  const systemPrompt = buildSystemPrompt();
  const userPrompt = buildUserPrompt(input, candidates, source, pairMatrix);

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  // Extract text content from response
  const textBlock = response.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("Claude response did not contain a text block");
  }

  // Strip markdown code fences if present
  const rawJson = textBlock.text.trim();
  const jsonString = rawJson
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```\s*$/, "");

  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonString);
  } catch {
    throw new Error(
      `Failed to parse Composer Claude response as JSON: ${jsonString.substring(0, 200)}...`,
    );
  }

  const validated = ComposerOutputSchema.parse(parsed);

  validated.candidateCount = candidates.length;
  // No graph-derived pair matrix in Phase A — `avgScore` is unused until
  // Phase D reintroduces a deterministic adjacency score. Mark explicitly null.
  validated.avgScore = null;

  const enforced = enforceNavbarFooter(validated);

  // Hard-rule validation against buyer-supplied section selections. Throws
  // LayoutConstraintError on violation; SFN retry/Catch handle the failure.
  enforceDesiredSections(enforced, input.desiredSections ?? [], candidates);

  // Deterministic post-LLM passes: sequence, same-category adjacency,
  // pairsPoorly. Warnings are surfaced on the ComposerOutput for the
  // dashboard / learning loop. Pure — does not throw.
  const { result: checked, warnings } = runPairPostCheck(
    enforced,
    candidates,
    COMPONENT_METADATA,
    input.desiredSections ?? [],
  );
  return { ...checked, warnings };
}

/* ------------------------------------------------------------------ */
/*  Save composer output to DynamoDB                                    */
/* ------------------------------------------------------------------ */

/**
 * SFN path: persist composerOutput, the WAIT_FOR_TASK_TOKEN task token, and
 * advance status to `awaiting_layout_approval`. The state machine remains
 * paused until the approve-layout API handler calls SendTaskSuccess.
 *
 * Mirrors `saveStyleAndToken` in `agents/style/handler.ts`.
 */
async function saveComposerAndToken(
  projectId: string,
  composerOutput: ComposerOutput,
  taskToken: string,
): Promise<void> {
  const tableName = process.env.PROJECTS_TABLE_NAME;
  if (!tableName) {
    throw new Error("PROJECTS_TABLE_NAME environment variable is not set");
  }

  await ddbClient.send(
    new UpdateCommand({
      TableName: tableName,
      Key: { pk: `PROJECT#${projectId}`, sk: `PROJECT#${projectId}` },
      UpdateExpression:
        "SET composerOutput = :co, layoutApprovalTaskToken = :token, #s = :status, updatedAt = :now",
      ExpressionAttributeNames: { "#s": "status" },
      ExpressionAttributeValues: {
        ":co": composerOutput,
        ":token": taskToken,
        ":status": "awaiting_layout_approval",
        ":now": new Date().toISOString(),
      },
    }),
  );
}

/**
 * Regenerate path: write composerOutput only. NO token write, NO status
 * change — the SFN execution remains paused on the original task token
 * captured during the initial Composer run; only the seller's eventual
 * approve-layout call releases it.
 *
 * Used by the regenerate-layout API handler when the seller asks for a
 * fresh layout pass.
 */
async function saveComposerOutputOnly(
  projectId: string,
  composerOutput: ComposerOutput,
): Promise<void> {
  const tableName = process.env.PROJECTS_TABLE_NAME;
  if (!tableName) {
    throw new Error("PROJECTS_TABLE_NAME environment variable is not set");
  }

  await ddbClient.send(
    new UpdateCommand({
      TableName: tableName,
      Key: { pk: `PROJECT#${projectId}`, sk: `PROJECT#${projectId}` },
      UpdateExpression: "SET composerOutput = :co, updatedAt = :now",
      ExpressionAttributeValues: {
        ":co": composerOutput,
        ":now": new Date().toISOString(),
      },
    }),
  );
}

/* ------------------------------------------------------------------ */
/*  Lambda Handler                                                     */
/* ------------------------------------------------------------------ */

// SFN WAIT_FOR_TASK_TOKEN: when invoked from the state machine, the input
// includes `taskToken` and the Lambda return value is ignored — the state
// machine resumes only when SendTaskSuccess is called from approve-layout.
//
// Regenerate-layout sync invoke: input has NO `taskToken`. The handler
// persists composerOutput without touching the token or status, and returns
// the new ComposerOutput in the Lambda response payload.
export const handler: Handler<
  ComposerAgentInput,
  ComposerOutput | void
> = async (event) => {
  console.log(
    JSON.stringify({
      agent: "composer",
      projectId: event.projectId,
      segment: event.segment,
      hasTaskToken: Boolean(event.taskToken),
    }),
  );

  // 1. Validate input (taskToken is optional — SFN provides it; regenerate omits it)
  const input = ComposerAgentInputSchema.parse(event);

  // 2. Mark project as "composing" before processing
  await markComposingStarted(input.projectId);

  // Phase B: LLM-driven skeleton planner.
  // planSkeleton uses safeParse and never throws — LLM/validation failures fall
  // back to DEFAULT_SKELETON automatically. Do not wrap in extra try/catch.
  const apiKey = await getClaudeApiKey();
  const skeleton = await planSkeleton(input, apiKey);

  // 3. Per-slot category-filtered vector search with greedy PAIRS_WITH
  //    re-ranking. Each slot in the planner-derived `skeleton` drives one
  //    OpenAI embedding call and one Qdrant search restricted to that
  //    category. Picks are taken left-to-right; previously picked components
  //    bias subsequent rankings via metadata-native pairsWell / pairsPoorly
  //    arrays.
  let allCandidates: CandidateComponent[] = [];
  let source: "vector" | "fallback" = "vector";
  const pickedCandidates: CandidateComponent[] = [];
  const moodTags = (input.styleOutput.mood ?? []).join(", ");
  const SLOT_TOP_K = 5;

  let qdrantHadAnySuccess = false;
  for (const slot of skeleton) {
    const slotQuery = `${slot.category} for ${input.companyName}; mood: ${moodTags}; needs: ${slot.purpose}`;
    let slotQueryVector: number[];
    try {
      slotQueryVector = await getEmbedding(slotQuery);
    } catch (err) {
      console.warn(
        JSON.stringify({
          agent: "composer",
          projectId: input.projectId,
          warning: `Embedding failed for slot ${slot.category}`,
          error: err instanceof Error ? err.message : String(err),
        }),
      );
      continue;
    }
    try {
      const slotCandidates = await getVectorCandidatesForSlot(
        slotQueryVector,
        SLOT_TOP_K,
        slot.category,
      );
      const ranked = rerankCandidates(
        slotCandidates,
        pickedCandidates,
        input.styleOutput,
        DEFAULT_RERANK_WEIGHTS,
      );
      const top = ranked[0];
      if (top) {
        pickedCandidates.push(top);
        const debug = (top as any)._rerankDebug;
        console.log(
          JSON.stringify({
            agent: "composer",
            projectId: input.projectId,
            event: "slot_reranked",
            slot: slot.category,
            pickedId: top.id,
            pickedName: top.name,
            vectorScore: top.vectorScore,
            rerankScore: debug?.rerankScore,
            signals: {
              pairsWithScore: debug?.pairsWithScore,
              styleScore: debug?.styleScore,
              diversityPenalty: debug?.diversityPenalty,
              densityPenalty: debug?.densityPenalty,
            },
          }),
        );
        allCandidates.push(...ranked);
        qdrantHadAnySuccess = true;
      }
    } catch (err) {
      console.warn(
        JSON.stringify({
          agent: "composer",
          projectId: input.projectId,
          warning: `Qdrant slot query failed for ${slot.category}`,
          error: err instanceof Error ? err.message : String(err),
        }),
      );
      emitQdrantQueryError("composer");
    }
  }

  // Dedup by id (same component may surface in multiple slot queries when
  // categories overlap or vectors converge on a versatile candidate).
  const seen = new Set<string>();
  allCandidates = allCandidates.filter((c) => {
    if (seen.has(c.id)) return false;
    seen.add(c.id);
    return true;
  });

  if (!qdrantHadAnySuccess || allCandidates.length === 0) {
    // Pass `0` for imageryDensityScale: with no graph-derived bias, the
    // fallback path treats imagery as neutral. Not perfect, but acceptable
    // for the cold-path failure mode.
    allCandidates = await getDynamoFallbackCandidates(input.styleOutput, 0);
    source = "fallback";
    console.log(
      JSON.stringify({
        agent: "composer",
        projectId: input.projectId,
        candidateSource: "fallback",
        candidateCount: allCandidates.length,
      }),
    );
  } else {
    console.log(
      JSON.stringify({
        agent: "composer",
        projectId: input.projectId,
        candidateSource: "vector",
        candidateCount: allCandidates.length,
        pickedSlots: pickedCandidates.length,
      }),
    );
  }

  if (allCandidates.length === 0) {
    throw new Error(
      `No candidate components found for segment "${input.segment}"`,
    );
  }

  // 4. Call Claude to compose layouts from candidates. `pairMatrix` is
  //    always [] in Phase A — graph-derived pair scores are gone, and
  //    metadata-native pairsWell/pairsPoorly are applied via rerankCandidates
  //    above (not as a separate matrix passed to the LLM). The empty matrix
  //    parameter is preserved on `composeLayouts` for forward compatibility
  //    with Phase D scoring; the prompt's matrix block silently renders nothing
  //    when the array is empty.
  const composerOutput = await composeLayouts(input, allCandidates, source, []);

  console.log(
    JSON.stringify({
      agent: "composer",
      projectId: input.projectId,
      layoutCount: composerOutput.layouts.length,
      selectedLayout: composerOutput.selectedLayout,
      source: composerOutput.source,
      candidateCount: composerOutput.candidateCount,
      avgScore: composerOutput.avgScore,
    }),
  );

  // 5. Branch on taskToken presence:
  //    - SFN path: write composerOutput + token + status=awaiting_layout_approval, return void.
  //    - Regenerate path: write composerOutput only, return it to the API caller.
  if (input.taskToken) {
    await saveComposerAndToken(
      input.projectId,
      composerOutput,
      input.taskToken,
    );
    return;
  }

  await saveComposerOutputOnly(input.projectId, composerOutput);
  return composerOutput;
};
