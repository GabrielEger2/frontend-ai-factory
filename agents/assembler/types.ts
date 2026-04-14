import { z } from "zod";
import {
  PipelineStateSchema,
  HumanizerOutputSchema,
  AssemblerOutputSchema,
} from "../shared/types";
import type { PipelineState } from "../shared/types";

/* ------------------------------------------------------------------ */
/*  Assembler Input                                                    */
/* ------------------------------------------------------------------ */

/**
 * The assembler requires humanizerOutput from the upstream Humanizer Agent.
 * All other PipelineState fields are carried forward.
 */
export const AssemblerInputSchema = PipelineStateSchema.extend({
  humanizerOutput: HumanizerOutputSchema,
});

export type AssemblerInput = z.infer<typeof AssemblerInputSchema>;

/* ------------------------------------------------------------------ */
/*  Assembler Output                                                   */
/* ------------------------------------------------------------------ */

/**
 * The assembler adds assemblerOutput with the S3 location of the
 * generated Next.js site archive.
 */
export type AssemblerResult = PipelineState & {
  assemblerOutput: z.infer<typeof AssemblerOutputSchema>;
};
