"use server";

import { apiFetch } from "@/lib/api/client";
import type { ProjectVersion } from "@/types/project";

/**
 * Fetch the list of VERSION# snapshots for a project (newest first).
 * Used by the version history page.
 */
export async function listVersions(
  projectId: string,
): Promise<{ versions: ProjectVersion[] } | { error: string }> {
  try {
    const res = await apiFetch(`/projects/${projectId}/versions`);

    if (res.ok) {
      return (await res.json()) as { versions: ProjectVersion[] };
    }

    if (res.status === 404) {
      return { error: "Project not found" };
    }

    return { error: `Unexpected response: ${res.status}` };
  } catch (error) {
    console.error(`Failed to list versions for ${projectId}:`, error);
    return { error: "Failed to list versions" };
  }
}
