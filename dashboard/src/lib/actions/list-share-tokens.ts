"use server";

import { apiFetch } from "@/lib/api/client";
import type { ShareToken } from "@/types/project";

/**
 * List active (non-revoked) share tokens for a project.
 * Feeds the SharePanel UI on the project detail page.
 */
export async function listShareTokens(
  projectId: string,
): Promise<{ tokens: ShareToken[] } | { error: string }> {
  try {
    const res = await apiFetch(`/projects/${projectId}/shares`);

    if (res.ok) {
      return (await res.json()) as { tokens: ShareToken[] };
    }

    if (res.status === 404) {
      return { error: "Project not found" };
    }

    return { error: `Unexpected response: ${res.status}` };
  } catch (error) {
    console.error(`Failed to list share tokens for ${projectId}:`, error);
    return { error: "Failed to list share tokens" };
  }
}
