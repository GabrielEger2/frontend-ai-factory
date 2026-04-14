import { z } from "zod";
import { ContentOutputSchema, ComposerOutputSchema } from "../shared/types";

/* ------------------------------------------------------------------ */
/*  Content Agent Input                                                */
/* ------------------------------------------------------------------ */

export const ContentAgentInputSchema = z.object({
  projectId: z.string(),
  status: z.string(),
  companyName: z.string(),
  segment: z.string(),
  description: z.string(),
  composerOutput: ComposerOutputSchema.optional(),
});

export type ContentAgentInput = z.infer<typeof ContentAgentInputSchema>;

/* ------------------------------------------------------------------ */
/*  Content Agent Output                                               */
/* ------------------------------------------------------------------ */

export const ContentAgentOutputSchema = ContentAgentInputSchema.extend({
  contentOutput: ContentOutputSchema,
});

export type ContentAgentOutput = z.infer<typeof ContentAgentOutputSchema>;

/* ------------------------------------------------------------------ */
/*  Component Slot Schema — describes slot metadata sent to the prompt */
/* ------------------------------------------------------------------ */

export interface SlotItemSchema {
  type: string;
  maxLength?: number;
  [key: string]: unknown;
}

export interface ComponentSlot {
  name: string;
  type: string;
  maxLength?: number;
  optional?: boolean;
  maxItems?: number;
  enum?: unknown[];
  itemSchema?: SlotItemSchema | Record<string, SlotItemSchema>;
}

export interface ComponentSlotDescriptor {
  componentId: string;
  componentName: string;
  category: string;
  slots: ComponentSlot[];
}
