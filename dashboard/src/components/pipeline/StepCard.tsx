"use client";

import { useState, useTransition } from "react";
import { RotateCw } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { retryStep } from "@/lib/actions/retry-step";
import { cn } from "@/lib/utils";

interface StepCardProps {
  stepNumber: number;
  title: string;
  stepName: string;
  projectId: string;
  state: "completed" | "current" | "pending";
  children?: React.ReactNode;
}

export function StepCard({
  stepNumber,
  title,
  stepName,
  projectId,
  state,
  children,
}: StepCardProps) {
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
    <Card
      className={cn(
        state === "pending" && "opacity-50",
        state === "current" && "ring-2 ring-primary",
      )}
    >
      <CardHeader className="flex flex-row items-center gap-3 space-y-0 py-4">
        {/* Step number circle */}
        <span
          className={cn(
            "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
            state === "completed" && "bg-primary text-primary-foreground",
            state === "current" && "bg-primary text-primary-foreground",
            state === "pending" && "bg-muted text-muted-foreground",
          )}
        >
          {stepNumber}
        </span>

        {/* Title */}
        <span
          className={cn(
            "text-sm font-medium",
            state === "pending" && "text-muted-foreground",
          )}
        >
          {title}
        </span>

        {/* State indicator */}
        {state === "current" && (
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            Running
          </span>
        )}

        {/* Right-aligned section: retry message + retry button */}
        {state === "completed" && (
          <div className="ml-auto flex items-center gap-2">
            {retryMessage && (
              <span
                className={cn(
                  "text-xs",
                  retryMessage.type === "success"
                    ? "text-green-600"
                    : "text-red-600",
                )}
              >
                {retryMessage.text}
              </span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleRetry}
              disabled={isPending}
            >
              <RotateCw
                className={cn("h-3 w-3", isPending && "animate-spin")}
              />
              {isPending ? "Retrying..." : "Retry"}
            </Button>
          </div>
        )}
      </CardHeader>

      {state === "completed" && children && (
        <CardContent>{children}</CardContent>
      )}
    </Card>
  );
}
