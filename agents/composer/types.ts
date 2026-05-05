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
  desiredSections: true,
  brandToneKeywords: true,
  objectives: true,
  pageType: true,
}).extend({
  researchOutput: ResearchOutputSchema,
  styleOutput: StyleOutputSchema,
  // Optional: present in the SFN WAIT_FOR_TASK_TOKEN path; absent in the
  // regenerate-layout sync invoke path. The handler branches on its presence.
  taskToken: z.string().optional(),
});

export type ComposerAgentInput = z.infer<typeof ComposerAgentInputSchema>;
