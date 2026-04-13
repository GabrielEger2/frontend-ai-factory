"use server";

import { apiFetch } from "@/lib/api/client";
import type { ProjectSummary } from "@/types/project";

export async function listProjects(): Promise<ProjectSummary[]> {
  try {
    const res = await apiFetch("/projects");
    const data = (await res.json()) as { projects: ProjectSummary[] };
    return data.projects;
  } catch (error) {
    console.error("Failed to list projects:", error);
    return [];
  }
}
