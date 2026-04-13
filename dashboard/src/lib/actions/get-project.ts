"use server";

import { apiFetch } from "@/lib/api/client";
import type { ProjectDetail } from "@/types/project";

export async function getProject(
  projectId: string,
): Promise<ProjectDetail | null> {
  try {
    const res = await apiFetch(`/projects/${projectId}`);

    if (res.status === 404) {
      return null;
    }

    const data = (await res.json()) as ProjectDetail;
    return data;
  } catch (error) {
    console.error(`Failed to get project ${projectId}:`, error);
    return null;
  }
}
