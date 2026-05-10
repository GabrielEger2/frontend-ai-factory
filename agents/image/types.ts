import { z } from "zod";
import { PipelineStateSchema } from "../shared/types";

/* ------------------------------------------------------------------ */
/*  Image Agent Input                                                  */
/* ------------------------------------------------------------------ */

/**
 * Image Agent input schema.
 *
 * Re-extends PipelineStateSchema to make `humanizerOutput` REQUIRED —
 * the Image Agent runs after the Humanizer and must have access to the
 * finalized component slot data to know which components/slots exist
 * and what (if any) alt text was authored upstream.
 *
 * `composerOutput` and `styleOutput` remain optional from
 * PipelineStateSchema; the resolver handles missing styleOutput by
 * defaulting `vertical=[]` and `mood=[]`.
 */
export const ImageAgentInputSchema = PipelineStateSchema.extend({
  humanizerOutput: z.object({
    components: z.array(
      z.object({
        componentId: z.string(),
        slots: z.record(z.string(), z.unknown()),
      }),
    ),
  }),
});

export type ImageAgentInput = z.infer<typeof ImageAgentInputSchema>;
