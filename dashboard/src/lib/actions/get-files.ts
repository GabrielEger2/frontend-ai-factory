"use server";

import { apiFetch } from "@/lib/api/client";

export async function getFiles(
  projectId: string,
): Promise<Record<string, string> | null> {
  try {
    const res = await apiFetch(`/projects/${projectId}/files`);

    if (!res.ok) {
      return null;
    }

    const data = (await res.json()) as { files: Record<string, string> };
    return data.files;
  } catch (error) {
    console.error(`Failed to get files for ${projectId}:`, error);
    return null;
  }
}
