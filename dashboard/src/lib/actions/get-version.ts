"use server";

import { apiFetch } from "@/lib/api/client";
import type { ProjectVersion } from "@/types/project";

/**
 * Fetch a single VERSION# snapshot by version number.
 */
export async function getVersion(
  projectId: string,
  versionNumber: number,
): Promise<ProjectVersion | { error: string }> {
  try {
    const res = await apiFetch(
      `/projects/${projectId}/versions/${versionNumber}`,
    );

    if (res.ok) {
      return (await res.json()) as ProjectVersion;
    }

    if (res.status === 404) {
      return { error: "Version not found" };
    }

    return { error: `Unexpected response: ${res.status}` };
  } catch (error) {
    console.error(
      `Failed to get version ${versionNumber} for ${projectId}:`,
      error,
    );
    return { error: "Failed to get version" };
  }
}
