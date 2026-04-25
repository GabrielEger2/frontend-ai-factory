"use server";

import { apiFetch } from "@/lib/api/client";
import type { ComposerOutput } from "@/types/project";

export async function swapComponent(
  projectId: string,
  targetComponentId: string,
  newComponentId: string,
): Promise<{ composerOutput: ComposerOutput } | { error: string }> {
  try {
    const res = await apiFetch(`/projects/${projectId}/swap-component`, {
      method: "POST",
      body: JSON.stringify({ targetComponentId, newComponentId }),
    });

    if (res.status === 200) {
      const data = (await res.json()) as { composerOutput: ComposerOutput };
      return { composerOutput: data.composerOutput };
    }

    if (res.status === 409) {
      return {
        error: "Layout was modified by another request. Please refresh.",
      };
    }

    if (res.status === 400) {
      const d = await res.json();
      return {
        error:
          (d as { error: string }).error ?? "Invalid swap-component request",
      };
    }

    return { error: `Unexpected response: ${res.status}` };
  } catch (error) {
    console.error(`Failed to swap component for ${projectId}:`, error);
    return { error: "Failed to swap component" };
  }
}
