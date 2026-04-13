"use server";

import { apiFetch } from "@/lib/api/client";
import type { CreateProjectInput } from "@/types/project";

export async function createProject(
  input: CreateProjectInput,
): Promise<{ projectId: string } | { error: string }> {
  try {
    const res = await apiFetch("/projects", {
      method: "POST",
      body: JSON.stringify(input),
    });

    if (res.status === 201 || res.status === 200) {
      const data = (await res.json()) as { projectId: string };
      return { projectId: data.projectId };
    }

    if (res.status === 400) {
      const data = (await res.json()) as { message?: string };
      return { error: data.message ?? "Invalid request" };
    }

    return { error: `Unexpected response: ${res.status}` };
  } catch (error) {
    console.error("Failed to create project:", error);
    return { error: "Failed to create project. Please try again." };
  }
}
