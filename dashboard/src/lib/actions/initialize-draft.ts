"use server";

import { apiFetch } from "@/lib/api/client";
import type { WorkingDraft } from "@/types/project";

/**
 * Bootstrap or fetch the project's workingDraft.
 *
 * Called from the visual editor page before rendering the shell. If the
 * project already has a workingDraft, the handler returns it unchanged
 * (idempotent). Otherwise it builds one from the frozen pipeline outputs
 * and persists it.
 */
export async function initializeDraft(
  projectId: string,
): Promise<{ workingDraft: WorkingDraft } | { error: string }> {
  try {
    const res = await apiFetch(`/projects/${projectId}/init-draft`, {
      method: "POST",
    });

    if (res.status === 200) {
      return (await res.json()) as { workingDraft: WorkingDraft };
    }

    if (res.status === 404) {
      return { error: "Project not found" };
    }

    if (res.status === 400) {
      const d = await res.json().catch(() => ({}) as { error?: string });
      return {
        error:
          (d as { error?: string }).error ??
          "Project is not ready for the visual editor",
      };
    }

    return { error: `Unexpected response: ${res.status}` };
  } catch (error) {
    console.error(`Failed to initialize draft for ${projectId}:`, error);
    return { error: "Failed to initialize draft" };
  }
}
