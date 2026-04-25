"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { RotateCw } from "lucide-react";
import { restartPipeline } from "@/lib/actions/restart-pipeline";

interface RestartPipelineButtonProps {
  projectId: string;
}

export function RestartPipelineButton({
  projectId,
}: RestartPipelineButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleClick() {
    setError(null);
    startTransition(async () => {
      const result = await restartPipeline(projectId);
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
        className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <RotateCw className={isPending ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
        {isPending ? "Restarting..." : "Retry pipeline from start"}
      </button>
      {error && <p className="text-sm text-red-700">{error}</p>}
    </div>
  );
}
