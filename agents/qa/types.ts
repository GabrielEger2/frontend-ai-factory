import { z } from "zod";
import {
  PipelineStateSchema,
  HumanizerOutputSchema,
  AssemblerOutputSchema,
} from "../shared/types";

/* ------------------------------------------------------------------ */
/*  QA Input                                                           */
/* ------------------------------------------------------------------ */

/**
 * The QA handler requires both assemblerOutput (S3 location of the
 * generated site archive) and humanizerOutput (final slot content)
 * from upstream pipeline steps.
 */
export const QAInputSchema = PipelineStateSchema.extend({
  assemblerOutput: AssemblerOutputSchema.extend({}).passthrough(),
  humanizerOutput: HumanizerOutputSchema,
});

export type QAInput = z.infer<typeof QAInputSchema>;
