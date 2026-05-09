import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { S3Client } from "@aws-sdk/client-s3";
import { QAInputSchema } from "./types";
import type { QAInput } from "./types";
import type { QAOutput, HumanizerOutput } from "../shared/types";
import { fetchAssembledFiles } from "../shared/tar-utils";
import { COMPONENT_METADATA } from "../assembler/component-sources.generated";

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const s3 = new S3Client({});

/* ------------------------------------------------------------------ */
/*  Slot Metadata Types (for type-safe access to COMPONENT_METADATA)   */
/* ------------------------------------------------------------------ */

interface SlotItemSchemaField {
  name?: string;
  type?: string;
  enum?: unknown[];
}

interface SlotItemSchema {
  type?: string;
  fields?: SlotItemSchemaField[];
  [key: string]: unknown;
}

interface SlotMeta {
  name: string;
  type?: string;
  optional?: boolean;
  enum?: unknown[];
  itemSchema?: SlotItemSchema;
}

/* ------------------------------------------------------------------ */
/*  Structural Checks                                                  */
/* ------------------------------------------------------------------ */

interface QAIssue {
  componentId: string;
  slot: string;
  message: string;
}

/**
 * Check 1 — Required slots must have non-empty values.
 *
 * For each component in humanizerOutput, look up its metadata slots.
 * Any slot NOT marked optional:true must have a non-null, non-empty value.
 */
function checkRequiredSlots(humanizerOutput: HumanizerOutput): QAIssue[] {
  const issues: QAIssue[] = [];

  for (const comp of humanizerOutput.components) {
    const meta = COMPONENT_METADATA[comp.componentId];
    if (!meta) continue;

    const slots = meta.slots as SlotMeta[];
    for (const slotDef of slots) {
      if (slotDef.optional === true) continue;

      const value = comp.slots[slotDef.name];
      if (value === null || value === undefined) {
        issues.push({
          componentId: comp.componentId,
          slot: slotDef.name,
          message: `Required slot "${slotDef.name}" is null or undefined`,
        });
      } else if (typeof value === "string" && value.trim() === "") {
        issues.push({
          componentId: comp.componentId,
          slot: slotDef.name,
          message: `Required slot "${slotDef.name}" is an empty string`,
        });
      }
    }
  }

  return issues;
}

/**
 * Check 2 — Enum values must be valid.
 *
 * For slots with an `enum` array in metadata, verify the value is a
 * member of that array. For list-type slots with itemSchema, check
 * enum fields within each item.
 */
function checkEnumValidity(humanizerOutput: HumanizerOutput): QAIssue[] {
  const issues: QAIssue[] = [];

  for (const comp of humanizerOutput.components) {
    const meta = COMPONENT_METADATA[comp.componentId];
    if (!meta) continue;

    const slots = meta.slots as SlotMeta[];
    for (const slotDef of slots) {
      const value = comp.slots[slotDef.name];

      // Direct enum check on the slot
      if (slotDef.enum && value !== null && value !== undefined) {
        if (!slotDef.enum.includes(value)) {
          issues.push({
            componentId: comp.componentId,
            slot: slotDef.name,
            message: `Slot "${slotDef.name}" value "${String(value)}" is not in enum [${slotDef.enum.join(", ")}]`,
          });
        }
      }

      // Check enum fields inside list items
      if (
        slotDef.type === "list" &&
        slotDef.itemSchema &&
        Array.isArray(value)
      ) {
        const fields = slotDef.itemSchema.fields;
        // itemSchema can be { fields: [...] } or a flat object with named keys
        if (fields && Array.isArray(fields)) {
          for (let i = 0; i < value.length; i++) {
            const item = value[i] as Record<string, unknown> | undefined;
            if (!item || typeof item !== "object") continue;
            for (const field of fields) {
              if (field.enum && field.name) {
                const itemValue = item[field.name];
                if (
                  itemValue !== null &&
                  itemValue !== undefined &&
                  !field.enum.includes(itemValue)
                ) {
                  issues.push({
                    componentId: comp.componentId,
                    slot: `${slotDef.name}[${i}].${field.name}`,
                    message: `Value "${String(itemValue)}" is not in enum [${field.enum.join(", ")}]`,
                  });
                }
              }
            }
          }
        } else {
          // Flat itemSchema: keys are field names, values are field defs
          const schemaKeys = Object.keys(slotDef.itemSchema).filter(
            (k) => k !== "type" && k !== "fields",
          );
          for (let i = 0; i < value.length; i++) {
            const item = value[i] as Record<string, unknown> | undefined;
            if (!item || typeof item !== "object") continue;
            for (const fieldName of schemaKeys) {
              const fieldDef = slotDef.itemSchema[fieldName] as
                | SlotItemSchemaField
                | undefined;
              if (fieldDef && fieldDef.enum) {
                const itemValue = item[fieldName];
                if (
                  itemValue !== null &&
                  itemValue !== undefined &&
                  !fieldDef.enum.includes(itemValue)
                ) {
                  issues.push({
                    componentId: comp.componentId,
                    slot: `${slotDef.name}[${i}].${fieldName}`,
                    message: `Value "${String(itemValue)}" is not in enum [${fieldDef.enum.join(", ")}]`,
                  });
                }
              }
            }
          }
        }
      }
    }
  }

  return issues;
}

/**
 * Check 3 — No undefined/null literals in JSX props.
 *
 * Scans page.tsx for `={undefined}` or `={null}` patterns that indicate
 * content slots were not properly populated.
 */
function checkNoUndefinedInJsx(files: Record<string, string>): QAIssue[] {
  const issues: QAIssue[] = [];
  const pageTsx = files["src/app/page.tsx"];
  if (!pageTsx) return issues;

  const undefinedPattern = /=\{undefined\}/g;
  const nullPattern = /=\{null\}/g;

  let match: RegExpExecArray | null;

  while ((match = undefinedPattern.exec(pageTsx)) !== null) {
    const lineNum = pageTsx.substring(0, match.index).split("\n").length;
    issues.push({
      componentId: "page.tsx",
      slot: `line:${lineNum}`,
      message: `Found ={undefined} in JSX at line ${lineNum}`,
    });
  }

  while ((match = nullPattern.exec(pageTsx)) !== null) {
    const lineNum = pageTsx.substring(0, match.index).split("\n").length;
    issues.push({
      componentId: "page.tsx",
      slot: `line:${lineNum}`,
      message: `Found ={null} in JSX at line ${lineNum}`,
    });
  }

  return issues;
}

/**
 * Check 4 — Component imports in page.tsx must resolve.
 *
 * Parse import lines and verify that paths starting with
 * `@/components/` or `../components/` exist in the archive.
 */
function checkImportsResolve(files: Record<string, string>): QAIssue[] {
  const issues: QAIssue[] = [];
  const pageTsx = files["src/app/page.tsx"];
  if (!pageTsx) return issues;

  // Match: import ... from "@/components/..." or "../components/..."
  const importPattern =
    /import\s+(?:[\w{}\s,*]+)\s+from\s+["'](@\/components\/[^"']+|\.\.\/components\/[^"']+)["']/g;

  const fileKeys = new Set(Object.keys(files));

  let match: RegExpExecArray | null;
  while ((match = importPattern.exec(pageTsx)) !== null) {
    const rawPath = match[1];

    // Normalize: @/components/Foo → src/components/Foo
    // Normalize: ../components/Foo → src/components/Foo (page.tsx is in src/app/)
    let normalizedPath: string;
    if (rawPath.startsWith("@/components/")) {
      normalizedPath = rawPath.replace("@/", "src/");
    } else if (rawPath.startsWith("../components/")) {
      normalizedPath = rawPath.replace("../components/", "src/components/");
    } else {
      continue;
    }

    // Try multiple resolutions: exact, .tsx, /index.tsx
    const candidates = [
      normalizedPath,
      `${normalizedPath}.tsx`,
      `${normalizedPath}.ts`,
      `${normalizedPath}/index.tsx`,
      `${normalizedPath}/index.ts`,
    ];

    const resolved = candidates.some((c) => fileKeys.has(c));
    if (!resolved) {
      issues.push({
        componentId: "page.tsx",
        slot: rawPath,
        message: `Import "${rawPath}" does not resolve to any file in the archive`,
      });
    }
  }

  return issues;
}

/**
 * Check 5 — Required files exist in the archive.
 *
 * Both src/app/page.tsx and src/app/layout.tsx must be present.
 */
function checkRequiredFilesExist(files: Record<string, string>): QAIssue[] {
  const issues: QAIssue[] = [];
  const requiredFiles = ["src/app/page.tsx", "src/app/layout.tsx"];

  for (const filePath of requiredFiles) {
    if (!files[filePath]) {
      issues.push({
        componentId: "archive",
        slot: filePath,
        message: `Required file "${filePath}" is missing from the assembled archive`,
      });
    }
  }

  return issues;
}

/**
 * Run all 5 structural checks and return the QA result.
 *
 * Split into:
 *   - issues  → blocking. Hard structural failures (missing files,
 *               broken imports, ={undefined} in JSX, enum violations).
 *               Cause the pipeline to fail and route to QAPipelineFailed.
 *   - warnings → non-blocking. Required-slot-null detections; the
 *                assembler's safety-net pass already filled these with
 *                placeholders so the site renders. Surfaced to the
 *                seller via the dashboard gap-detection panel.
 *
 * The required-slot check is intentionally demoted: components mark
 * image / logo / anchor-URL slots as required, but no upstream agent
 * fabricates those values. Failing the pipeline over them just denies
 * the seller a demo-able site they could otherwise edit later.
 */
function runChecks(
  files: Record<string, string>,
  humanizerOutput: HumanizerOutput,
): QAOutput {
  const issues: QAIssue[] = [
    ...checkRequiredFilesExist(files),
    ...checkEnumValidity(humanizerOutput),
    ...checkNoUndefinedInJsx(files),
    ...checkImportsResolve(files),
  ];

  const warnings: QAIssue[] = [...checkRequiredSlots(humanizerOutput)];

  return {
    passed: issues.length === 0,
    issues,
    warnings,
  };
}

/* ------------------------------------------------------------------ */
/*  DynamoDB Update                                                    */
/* ------------------------------------------------------------------ */

/**
 * Update the project document with QA results.
 *
 * On pass: set status to "ready_for_review" and store qaOutput. The pipeline
 * terminates here — the seller reviews/edits the workingDraft and triggers
 * deploy via the deploy-draft API (POST /projects/{id}/deploy).
 * On fail: set status to "qa_failed", store qaOutput and qaIssues.
 */
async function updateProjectQAResult(
  projectId: string,
  qaOutput: QAOutput,
): Promise<void> {
  const tableName = process.env.PROJECTS_TABLE_NAME;
  if (!tableName) {
    throw new Error("PROJECTS_TABLE_NAME environment variable is not set");
  }

  const now = new Date().toISOString();

  if (qaOutput.passed) {
    await ddb.send(
      new UpdateCommand({
        TableName: tableName,
        Key: {
          pk: `PROJECT#${projectId}`,
          sk: `PROJECT#${projectId}`,
        },
        UpdateExpression:
          "SET #st = :status, qaOutput = :qaOutput, updatedAt = :now",
        ExpressionAttributeNames: { "#st": "status" },
        ExpressionAttributeValues: {
          ":status": "ready_for_review",
          ":qaOutput": qaOutput,
          ":now": now,
        },
      }),
    );
  } else {
    await ddb.send(
      new UpdateCommand({
        TableName: tableName,
        Key: {
          pk: `PROJECT#${projectId}`,
          sk: `PROJECT#${projectId}`,
        },
        UpdateExpression:
          "SET #st = :status, qaOutput = :qaOutput, qaIssues = :qaIssues, updatedAt = :now",
        ExpressionAttributeNames: { "#st": "status" },
        ExpressionAttributeValues: {
          ":status": "qa_failed",
          ":qaOutput": qaOutput,
          ":qaIssues": qaOutput.issues,
          ":now": now,
        },
      }),
    );
  }
}

/* ------------------------------------------------------------------ */
/*  Handler                                                            */
/* ------------------------------------------------------------------ */

/**
 * QA Agent Lambda handler.
 *
 * Deterministic (no LLM calls). Fetches the assembled site archive
 * from S3, runs 5 structural checks against the generated files and
 * slot content, then updates DynamoDB with the result.
 *
 * On failure: writes qa_failed to DDB and throws so Step Functions
 * routes to the dedicated QAPipelineFailed state.
 *
 * On success: writes ready_for_review to DDB and returns updated pipeline
 * state. The pipeline terminates here — no automatic deploy.
 *
 * Invoked by Step Functions after the Assembler step.
 */
export const handler = async (event: unknown): Promise<unknown> => {
  /* ---- Validate input ---- */
  const input: QAInput = QAInputSchema.parse(event);

  console.log(
    JSON.stringify({
      message: "QA started",
      projectId: input.projectId,
      s3Key: input.assemblerOutput.s3Key,
      s3Bucket: input.assemblerOutput.s3Bucket,
      componentCount: input.humanizerOutput.components.length,
    }),
  );

  /* ---- Fetch assembled files from S3 ---- */
  const files = await fetchAssembledFiles(
    s3,
    input.assemblerOutput.s3Key,
    input.assemblerOutput.s3Bucket,
  );

  console.log(
    JSON.stringify({
      message: "Archive fetched and decompressed",
      projectId: input.projectId,
      fileCount: Object.keys(files).length,
    }),
  );

  /* ---- Run structural checks ---- */
  const qaOutput = runChecks(files, input.humanizerOutput);

  console.log(
    JSON.stringify({
      message: "QA checks complete",
      projectId: input.projectId,
      passed: qaOutput.passed,
      issueCount: qaOutput.issues.length,
      issues: qaOutput.issues,
      warningCount: qaOutput.warnings?.length ?? 0,
      warnings: qaOutput.warnings ?? [],
    }),
  );

  /* ---- Update DynamoDB ---- */
  await updateProjectQAResult(input.projectId, qaOutput);

  /* ---- Throw on failure so Step Functions routes to fail state ---- */
  if (!qaOutput.passed) {
    throw new Error(`QA failed with ${qaOutput.issues.length} issue(s)`);
  }

  /* ---- Return updated pipeline state ---- */
  return {
    ...input,
    status: "ready_for_review",
    qaOutput,
  };
};
