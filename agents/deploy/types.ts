import { z } from "zod";
import { PipelineStateSchema, AssemblerOutputSchema } from "../shared/types";
import type { PipelineState } from "../shared/types";

/* ------------------------------------------------------------------ */
/*  Deploy Input                                                       */
/* ------------------------------------------------------------------ */

/**
 * The deploy handler requires assemblerOutput from the upstream
 * Assembler step, containing the S3 location of the site archive.
 */
export const DeployInputSchema = PipelineStateSchema.extend({
  assemblerOutput: AssemblerOutputSchema,
});

export type DeployInput = z.infer<typeof DeployInputSchema>;

/* ------------------------------------------------------------------ */
/*  Deploy Output                                                      */
/* ------------------------------------------------------------------ */

/**
 * The deploy handler adds a previewUrl to the pipeline state after
 * successfully deploying to Vercel.
 */
export type DeployResult = PipelineState & {
  previewUrl: string;
};
