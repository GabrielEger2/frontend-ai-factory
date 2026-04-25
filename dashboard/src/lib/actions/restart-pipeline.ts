"use server";

import { apiFetch } from "@/lib/api/client";

export async function restartPipeline(
  projectId: string,
): Promise<{ message: string } | { error: string }> {
  try {
    const res = await apiFetch(`/projects/${projectId}/restart`, {
      method: "POST",
      body: "{}",
    });

    if (res.status === 202) {
      return (await res.json()) as { message: string };
    }

    if (res.status === 409) {
      return { error: "Project is not in failed status" };
    }

    if (res.status === 404) {
      return { error: "Project not found" };
    }

    return { error: `Unexpected response: ${res.status}` };
  } catch (error) {
    console.error(`Failed to restart pipeline for ${projectId}:`, error);
    return { error: "Failed to restart pipeline" };
  }
}
