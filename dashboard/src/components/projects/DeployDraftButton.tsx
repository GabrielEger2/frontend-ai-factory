"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deployProject } from "@/lib/actions/deploy-project";

interface DeployDraftButtonProps {
  projectId: string;
}

export function DeployDraftButton({ projectId }: DeployDraftButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleClick() {
    setError(null);
    startTransition(async () => {
      const result = await deployProject(projectId);
      if ("error" in result) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Deploying..." : "Deploy Site"}
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
