import { z } from "zod";
import {
  PipelineStateSchema,
  ResearchOutputSchema,
  StyleOutputSchema,
} from "../shared/types";

/* ------------------------------------------------------------------ */
/*  Composer Agent Input                                               */
/* ------------------------------------------------------------------ */

export const ComposerAgentInputSchema = PipelineStateSchema.pick({
  projectId: true,
  status: true,
  companyName: true,
  segment: true,
  description: true,
}).extend({
  researchOutput: ResearchOutputSchema,
  styleOutput: StyleOutputSchema,
});

export type ComposerAgentInput = z.infer<typeof ComposerAgentInputSchema>;
