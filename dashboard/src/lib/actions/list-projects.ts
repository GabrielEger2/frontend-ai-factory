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
    if (!res.ok) {
      console.error(`Failed to list projects: ${res.status} ${res.statusText}`);
      return { projects: [], nextCursor: null };
    }
    const data = (await res.json()) as Partial<{
      projects: ProjectSummary[];
      nextCursor: string | null;
    }>;
    return {
      projects: data.projects ?? [],
      nextCursor: data.nextCursor ?? null,
    };
  } catch (error) {
    console.error("Failed to list projects:", error);
    return { projects: [], nextCursor: null };
  }
}
