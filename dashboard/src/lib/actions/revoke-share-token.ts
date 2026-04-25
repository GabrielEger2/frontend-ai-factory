"use server";

import { apiFetch } from "@/lib/api/client";

/**
 * Revoke a share token — sets `revoked=true` on both the
 * ProjectsTable SHARE# row and the ShareTokensTable pk=SHARE#<token>
 * row. Once revoked, the public /share/[token] page returns 403.
 */
export async function revokeShareToken(
  projectId: string,
  tokenId: string,
): Promise<{ revoked: boolean } | { error: string }> {
  try {
    const res = await apiFetch(`/projects/${projectId}/share/${tokenId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      return (await res.json()) as { revoked: boolean };
    }

    if (res.status === 404) {
      return { error: "Share token not found" };
    }

    return { error: `Unexpected response: ${res.status}` };
  } catch (error) {
    console.error(
      `Failed to revoke share token ${tokenId} for ${projectId}:`,
      error,
    );
    return { error: "Failed to revoke share token" };
  }
}
