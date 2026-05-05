import Anthropic from "@anthropic-ai/sdk";

import { DEFAULT_SKELETON, Skeleton, SkeletonSchema } from "./defaultSkeleton";
import {
  buildSkeletonSystemPrompt,
  buildSkeletonUserPrompt,
} from "./skeletonPlanner.prompt";
import { ComposerAgentInput } from "./types";

/**
 * Plan a page skeleton via Claude given the composer input.
 *
 * Uses safeParse intentionally — must NEVER throw. LLM and validation
 * failures fall back to DEFAULT_SKELETON, by design. Do not switch to
 * .parse() or remove the try/catch — the SFN retry policy must not be
 * triggered by planner failures.
 *
 * Three failure paths each emit a structured CloudWatch-queryable warning
 * before returning DEFAULT_SKELETON:
 *   1. Claude response missing a text block.
 *   2. Text block fails JSON.parse.
 *   3. Parsed JSON fails SkeletonSchema validation.
 *
 * Any other thrown error (network failure, SDK error, etc.) is caught by
 * the outer try/catch and logged via String(err); the function still
 * returns DEFAULT_SKELETON.
 */
export async function planSkeleton(
  input: ComposerAgentInput,
  apiKey: string,
): Promise<Skeleton> {
  try {
    const client = new Anthropic({ apiKey });

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: buildSkeletonSystemPrompt(),
      messages: [
        {
          role: "user",
          content: buildSkeletonUserPrompt(input, input.pageType ?? undefined),
        },
      ],
    });

    const textBlock = response.content.find((block) => block.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      console.warn(
        JSON.stringify({
          agent: "composer",
          warning: "skeletonPlanner: Claude response missing text block",
          projectId: input.projectId,
        }),
      );
      return DEFAULT_SKELETON;
    }

    // Strip markdown code fences defensively even though the prompt
    // tells the LLM not to emit them — mirrors agents/style/handler.ts.
    const rawJson = textBlock.text.trim();
    const jsonString = rawJson
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```\s*$/, "");

    let parsed: unknown;
    try {
      parsed = JSON.parse(jsonString);
    } catch (parseErr) {
      console.warn(
        JSON.stringify({
          agent: "composer",
          warning: "skeletonPlanner: failed to parse Claude response as JSON",
          projectId: input.projectId,
          error:
            parseErr instanceof Error ? parseErr.message : String(parseErr),
          preview: jsonString.substring(0, 200),
        }),
      );
      return DEFAULT_SKELETON;
    }

    const result = SkeletonSchema.safeParse(parsed);
    if (!result.success) {
      console.warn(
        JSON.stringify({
          agent: "composer",
          warning: "skeletonPlanner: SkeletonSchema validation failed",
          projectId: input.projectId,
          error: result.error.message,
        }),
      );
      return DEFAULT_SKELETON;
    }

    return result.data;
  } catch (err) {
    console.warn(
      JSON.stringify({
        agent: "composer",
        warning: "skeletonPlanner: unexpected error, falling back to default",
        projectId: input.projectId,
        error: String(err),
      }),
    );
    return DEFAULT_SKELETON;
  }
}
