"use server";

import { apiFetch } from "@/lib/api/client";
import type { WorkingDraft } from "@/types/project";

/**
 * Persist a WorkingDraft mutation on the project item. Called from the
 * visual editor on reorder, swap, palette/typography/density change, and
 * (debounced) inline copy edits. Does NOT trigger reassembly — Deploy
 * is a separate action.
 */
export async function patchDraft(
  projectId: string,
  workingDraft: WorkingDraft,
): Promise<{ updated: boolean } | { error: string }> {
  try {
    const res = await apiFetch(`/projects/${projectId}/draft`, {
      method: "PATCH",
      body: JSON.stringify({ workingDraft }),
    });

    if (res.ok) {
      return (await res.json()) as { updated: boolean };
    }

    if (res.status === 404) {
      return { error: "Project not found" };
    }

    if (res.status === 400) {
      const d = await res.json().catch(() => ({}) as { error?: string });
      return {
        error: (d as { error?: string }).error ?? "Invalid working draft",
      };
    }

    return { error: `Unexpected response: ${res.status}` };
  } catch (error) {
    console.error(`Failed to patch draft for ${projectId}:`, error);
    return { error: "Failed to patch draft" };
  }
}
