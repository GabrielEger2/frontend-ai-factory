"use server";

import { apiFetch } from "@/lib/api/client";
import type { StyleOutput } from "@/types/project";

export async function approveStyle(
  projectId: string,
  styleOutput: StyleOutput,
): Promise<{ message: string } | { error: string }> {
  try {
    const res = await apiFetch(`/projects/${projectId}/approve-style`, {
      method: "POST",
      body: JSON.stringify({ styleOutput }),
    });

    if (res.status === 202) {
      return (await res.json()) as { message: string };
    }

    if (res.status === 409) {
      return { error: "Pipeline is not awaiting style approval" };
    }

    if (res.status === 400) {
      const d = await res.json();
      return { error: (d as { error: string }).error ?? "Invalid style data" };
    }

    return { error: `Unexpected response: ${res.status}` };
  } catch (error) {
    console.error(`Failed to approve style for ${projectId}:`, error);
    return { error: "Failed to approve style" };
  }
}
