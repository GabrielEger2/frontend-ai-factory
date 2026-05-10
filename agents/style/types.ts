import { z } from "zod";
import { PipelineStateSchema, ResearchOutputSchema } from "../shared/types";

/* ------------------------------------------------------------------ */
/*  Style Agent Input                                                  */
/* ------------------------------------------------------------------ */

export const StyleAgentInputSchema = PipelineStateSchema.pick({
  projectId: true,
  status: true,
  companyName: true,
  segment: true,
  description: true,
  brandColor: true,
  colorsToAvoid: true,
  brandToneKeywords: true,
  objectives: true,
}).extend({
  researchOutput: ResearchOutputSchema,
  taskToken: z.string(), // Injected by SFN WaitForTaskToken — NOT part of PipelineState
});

export type StyleAgentInput = z.infer<typeof StyleAgentInputSchema>;
