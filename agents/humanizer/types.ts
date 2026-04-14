import { z } from "zod";
import { PipelineStateSchema, ContentOutputSchema } from "../shared/types";

/* ------------------------------------------------------------------ */
/*  Humanizer Agent Input                                              */
/* ------------------------------------------------------------------ */

export const HumanizerInputSchema = PipelineStateSchema.extend({
  contentOutput: ContentOutputSchema,
});

export type HumanizerInput = z.infer<typeof HumanizerInputSchema>;
