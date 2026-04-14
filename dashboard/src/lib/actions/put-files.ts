"use server";

import { apiFetch } from "@/lib/api/client";

export async function putFiles(
  projectId: string,
  files: Record<string, string>,
): Promise<{ message: string } | { error: string }> {
  try {
    const res = await apiFetch(`/projects/${projectId}/files`, {
      method: "PUT",
      body: JSON.stringify({ files }),
    });

    if (res.ok) {
      return (await res.json()) as { message: string };
    }

    return { error: `Save failed: ${res.status}` };
  } catch (error) {
    console.error(`Failed to save files for ${projectId}:`, error);
    return { error: "Failed to save files" };
  }
}
