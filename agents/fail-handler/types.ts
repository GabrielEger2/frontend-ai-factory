import { z } from "zod";

/* ------------------------------------------------------------------ */
/*  Fail Handler Input Schema                                          */
/* ------------------------------------------------------------------ */

/**
 * Input shape for the fail-handler Lambda.
 *
 * Step Functions `addCatch` with `resultPath: "$.error"` merges the
 * error object at `$.error` while keeping the rest of the pipeline
 * state (projectId, etc.) at the top level.
 */
export const FailHandlerInputSchema = z
  .object({
    projectId: z.string(),
    error: z
      .object({
        Error: z.string().optional(),
        Cause: z.string().optional(),
      })
      .optional(),
  })
  .passthrough(); // allow other pipeline state fields

export type FailHandlerInput = z.infer<typeof FailHandlerInputSchema>;
