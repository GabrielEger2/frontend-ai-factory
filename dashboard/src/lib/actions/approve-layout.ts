"use server";

import { apiFetch } from "@/lib/api/client";

export async function approveLayout(
  projectId: string,
): Promise<{ message: string } | { error: string }> {
  try {
    const res = await apiFetch(`/projects/${projectId}/approve-layout`, {
      method: "POST",
      body: "{}",
    });

    if (res.status === 202) {
      return (await res.json()) as { message: string };
    }

    if (res.status === 409) {
      return { error: "Layout approval already processed" };
    }

    if (res.status === 400) {
      const d = await res.json();
      return {
        error:
          (d as { error: string }).error ?? "Invalid approve-layout request",
      };
    }

    return { error: `Unexpected response: ${res.status}` };
  } catch (error) {
    console.error(`Failed to approve layout for ${projectId}:`, error);
    return { error: "Failed to approve layout" };
  }
}
