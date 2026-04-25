"use server";

import { apiFetchPublic } from "@/lib/api/client";
import type { WorkingDraft } from "@/types/project";

/**
 * Public (no-seller) fetch for the /share/[token] page. Validates the
 * share token at the Lambda level (TTL + not-revoked) and returns the
 * underlying project's workingDraft for read-only preview.
 */
export async function getShare(
  token: string,
): Promise<
  | {
      workingDraft: WorkingDraft | null;
      companyName: string;
      projectId: string;
    }
  | { error: string }
> {
  try {
    const res = await apiFetchPublic(`/share/${token}`);

    if (res.ok) {
      return (await res.json()) as {
        workingDraft: WorkingDraft | null;
        companyName: string;
        projectId: string;
      };
    }

    if (res.status === 404) {
      return { error: "This share link is invalid or has expired" };
    }

    if (res.status === 403) {
      return { error: "This share link is no longer available" };
    }

    return { error: `Unexpected response: ${res.status}` };
  } catch (error) {
    console.error(`Failed to fetch share for token ${token}:`, error);
    return { error: "Failed to load share" };
  }
}
