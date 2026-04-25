"use server";

import { revalidatePath } from "next/cache";
import { apiFetch } from "@/lib/api/client";

/**
 * Trigger the deploy-draft Lambda: assemble the current workingDraft,
 * push a new Vercel deployment, persist a VERSION# snapshot, and
 * promote the draft to frozen outputs.
 *
 * Invalidates `/projects/:id` server cache after success so the detail
 * page reflects the new previewUrl, version, and status.
 */
export async function deployProject(
  projectId: string,
): Promise<
  | { versionNumber: number; previewUrl: string; deployedAt: string }
  | { error: string }
> {
  try {
    const res = await apiFetch(`/projects/${projectId}/deploy`, {
      method: "POST",
    });

    if (res.ok) {
      const data = (await res.json()) as {
        versionNumber: number;
        previewUrl: string;
        deployedAt: string;
      };
      revalidatePath("/projects/" + projectId);
      return data;
    }

    if (res.status === 404) {
      return { error: "Project not found" };
    }

    if (res.status === 400) {
      const d = await res.json().catch(() => ({}) as { error?: string });
      return {
        error:
          (d as { error?: string }).error ??
          "Project has no working draft to deploy",
      };
    }

    return { error: `Unexpected response: ${res.status}` };
  } catch (error) {
    console.error(`Failed to deploy project ${projectId}:`, error);
    return { error: "Failed to deploy project" };
  }
}
