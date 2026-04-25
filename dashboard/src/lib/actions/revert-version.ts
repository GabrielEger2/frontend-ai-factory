"use server";

import { apiFetch } from "@/lib/api/client";

/**
 * Load a VERSION# snapshot into the project's workingDraft so the
 * seller can review/edit it in the visual editor before redeploying.
 * Does NOT touch the frozen outputs or currentVersionNumber.
 */
export async function revertVersion(
  projectId: string,
  versionNumber: number,
): Promise<{ reverted: boolean; versionNumber: number } | { error: string }> {
  try {
    const res = await apiFetch(
      `/projects/${projectId}/versions/${versionNumber}/revert`,
      {
        method: "POST",
      },
    );

    if (res.ok) {
      return (await res.json()) as {
        reverted: boolean;
        versionNumber: number;
      };
    }

    if (res.status === 404) {
      return { error: "Version not found" };
    }

    return { error: `Unexpected response: ${res.status}` };
  } catch (error) {
    console.error(
      `Failed to revert version ${versionNumber} for ${projectId}:`,
      error,
    );
    return { error: "Failed to revert version" };
  }
}
