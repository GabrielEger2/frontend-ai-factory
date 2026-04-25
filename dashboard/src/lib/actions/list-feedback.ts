"use server";

import { apiFetch } from "@/lib/api/client";
import type { FeedbackItem } from "@/types/project";

/**
 * List FEEDBACK# items for a project (newest first). Rendered in the
 * Feedback section of the project detail page.
 */
export async function listFeedback(
  projectId: string,
): Promise<{ feedback: FeedbackItem[] } | { error: string }> {
  try {
    const res = await apiFetch(`/projects/${projectId}/feedback`);

    if (res.ok) {
      return (await res.json()) as { feedback: FeedbackItem[] };
    }

    if (res.status === 404) {
      return { error: "Project not found" };
    }

    return { error: `Unexpected response: ${res.status}` };
  } catch (error) {
    console.error(`Failed to list feedback for ${projectId}:`, error);
    return { error: "Failed to list feedback" };
  }
}
