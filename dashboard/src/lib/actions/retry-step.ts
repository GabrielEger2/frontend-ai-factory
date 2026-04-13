"use server";

import { apiFetch } from "@/lib/api/client";

export async function retryStep(
  projectId: string,
  stepName: string,
): Promise<{ message: string } | { error: string }> {
  try {
    const res = await apiFetch(
      `/projects/${projectId}/steps/${stepName}/retry`,
      {
        method: "POST",
        body: JSON.stringify({}),
      },
    );

    if (res.status === 202) {
      return (await res.json()) as { message: string };
    }

    if (res.status === 409) {
      return { error: "Pipeline is currently running" };
    }

    return { error: `Unexpected response: ${res.status}` };
  } catch (error) {
    console.error(`Failed to retry step ${stepName} for ${projectId}:`, error);
    return { error: "Failed to retry step" };
  }
}
