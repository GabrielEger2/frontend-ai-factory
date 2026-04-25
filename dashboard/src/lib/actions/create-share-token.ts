"use server";

import { apiFetch } from "@/lib/api/client";

/**
 * Mint a new share token for a project. Creates a row in both
 * ProjectsTable (as `SHARE#<tokenId>`) and ShareTokensTable (keyed by
 * the token itself, with DDB TTL). Returns the raw token string that
 * should be embedded in the share URL.
 */
export async function createShareToken(
  projectId: string,
): Promise<
  { token: string; tokenId: string; expiresAt: string } | { error: string }
> {
  try {
    const res = await apiFetch(`/projects/${projectId}/share`, {
      method: "POST",
    });

    if (res.ok) {
      return (await res.json()) as {
        token: string;
        tokenId: string;
        expiresAt: string;
      };
    }

    if (res.status === 404) {
      return { error: "Project not found" };
    }

    return { error: `Unexpected response: ${res.status}` };
  } catch (error) {
    console.error(`Failed to create share token for ${projectId}:`, error);
    return { error: "Failed to create share token" };
  }
}
