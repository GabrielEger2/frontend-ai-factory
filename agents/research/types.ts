import { z } from "zod";
import { PipelineStateSchema } from "../shared/types";

/* ------------------------------------------------------------------ */
/*  Research Agent Input                                               */
/* ------------------------------------------------------------------ */

export const ResearchAgentInputSchema = PipelineStateSchema.pick({
  projectId: true,
  status: true,
  companyName: true,
  segment: true,
  description: true,
});

export type ResearchAgentInput = z.infer<typeof ResearchAgentInputSchema>;
