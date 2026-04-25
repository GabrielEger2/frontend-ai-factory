"use server";

import { apiFetchPublic } from "@/lib/api/client";

interface PostFeedbackInput {
  message: string;
  clientName?: string;
  clientEmail?: string;
}

/**
 * Public (no-seller) feedback submission from the /share/[token] page.
 * Validates the share token server-side; the Lambda also applies a
 * silent honeypot check on the `website` field to reject bots.
 */
export async function postFeedback(
  token: string,
  input: PostFeedbackInput,
): Promise<{ submitted: boolean } | { error: string }> {
  try {
    const res = await apiFetchPublic(`/share/${token}/feedback`, {
      method: "POST",
      body: JSON.stringify(input),
    });

    if (res.ok) {
      return (await res.json()) as { submitted: boolean };
    }

    if (res.status === 404) {
      return { error: "This share link is invalid or has expired" };
    }

    if (res.status === 403) {
      return { error: "This share link is no longer available" };
    }

    if (res.status === 400) {
      const d = await res.json().catch(() => ({}) as { error?: string });
      return {
        error: (d as { error?: string }).error ?? "Invalid feedback",
      };
    }

    return { error: `Unexpected response: ${res.status}` };
  } catch (error) {
    console.error(`Failed to post feedback for token ${token}:`, error);
    return { error: "Failed to submit feedback" };
  }
}
