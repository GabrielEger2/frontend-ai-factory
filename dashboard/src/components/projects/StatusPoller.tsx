"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProject } from "@/lib/actions/get-project";
import type { ProjectStatus } from "@/types/project";

interface StatusPollerProps {
  projectId: string;
  initialStatus: ProjectStatus;
}

export function StatusPoller({ projectId, initialStatus }: StatusPollerProps) {
  const [status, setStatus] = useState<ProjectStatus>(initialStatus);
  const router = useRouter();

  useEffect(() => {
    if (
      status === "ready_for_review" ||
      status === "deployed" ||
      status === "failed" ||
      status === "qa_failed" ||
      status === "deploy_failed"
    ) {
      return;
    }

    const interval = setInterval(async () => {
      const project = await getProject(projectId);

      if (project && project.status !== status) {
        setStatus(project.status);
        router.refresh();
      }

      if (
        project &&
        (project.status === "ready_for_review" ||
          project.status === "deployed" ||
          project.status === "failed" ||
          project.status === "qa_failed" ||
          project.status === "deploy_failed")
      ) {
        clearInterval(interval);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [projectId, status, router]);

  return null;
}
