"use server";

import { apiFetch } from "@/lib/api/client";
import type { ComposerOutput } from "@/types/project";

export async function regenerateLayout(
  projectId: string,
): Promise<{ composerOutput: ComposerOutput } | { error: string }> {
  try {
    const res = await apiFetch(`/projects/${projectId}/regenerate-layout`, {
      method: "POST",
      body: "{}",
    });

    if (res.status === 202) {
      const data = (await res.json()) as { composerOutput: ComposerOutput };
      return { composerOutput: data.composerOutput };
    }

    if (res.status === 502) {
      return {
        error: "Layout regeneration failed in the agent. Please try again.",
      };
    }

    if (res.status === 504) {
      return { error: "Regeneration timed out. Please try again." };
    }

    if (res.status === 409) {
      return { error: "Project is not awaiting layout approval" };
    }

    return { error: `Unexpected response: ${res.status}` };
  } catch (error) {
    console.error(`Failed to regenerate layout for ${projectId}:`, error);
    return { error: "Failed to regenerate layout" };
  }
}
