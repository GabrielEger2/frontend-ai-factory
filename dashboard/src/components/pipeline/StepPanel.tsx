"use client";

import { useState, useTransition } from "react";
import { ChevronDown, ChevronRight, RotateCw } from "lucide-react";
import { retryStep } from "@/lib/actions/retry-step";

interface StepPanelProps {
  title: string;
  stepName: string;
  projectId: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function StepPanel({
  title,
  stepName,
  projectId,
  children,
  defaultOpen = false,
}: StepPanelProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isPending, startTransition] = useTransition();
  const [retryMessage, setRetryMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  function handleRetry() {
    setRetryMessage(null);

    startTransition(async () => {
      const result = await retryStep(projectId, stepName);

      if ("message" in result) {
        setRetryMessage({ type: "success", text: result.message });
      } else {
        setRetryMessage({ type: "error", text: result.error });
      }

      setTimeout(() => setRetryMessage(null), 3000);
    });
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white">
      <div className="flex items-center justify-between px-4 py-3">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
        >
          {isOpen ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
          {title}
        </button>

        <div className="flex items-center gap-2">
          {retryMessage && (
            <span
              className={
                retryMessage.type === "success"
                  ? "text-xs text-green-600"
                  : "text-xs text-red-600"
              }
            >
              {retryMessage.text}
            </span>
          )}
          <button
            type="button"
            onClick={handleRetry}
            disabled={isPending}
            className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RotateCw
              className={`h-3 w-3 ${isPending ? "animate-spin" : ""}`}
            />
            {isPending ? "Retrying..." : "Retry"}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-slate-200 px-4 py-3">{children}</div>
      )}
    </div>
  );
}
