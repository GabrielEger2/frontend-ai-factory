"use server";

import { apiFetch } from "@/lib/api/client";
import type { ProjectSummary } from "@/types/project";

export async function listProjects(
  cursor?: string,
): Promise<{ projects: ProjectSummary[]; nextCursor: string | null }> {
  try {
    const path = cursor
      ? `/projects?cursor=${encodeURIComponent(cursor)}`
      : "/projects";
    const res = await apiFetch(path);
    const data = (await res.json()) as {
      projects: ProjectSummary[];
      nextCursor: string | null;
    };
    return data;
  } catch (error) {
    console.error("Failed to list projects:", error);
    return { projects: [], nextCursor: null };
  }
}
