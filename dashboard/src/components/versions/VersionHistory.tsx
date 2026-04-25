"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { revertVersion } from "@/lib/actions/revert-version";
import type { ProjectVersion } from "@/types/project";

interface VersionHistoryProps {
  projectId: string;
  versions: ProjectVersion[];
}

/**
 * Table of VERSION# snapshots for a project, newest first. Each row
 * exposes a "Load into Editor" action that calls revertVersionAction
 * (populates workingDraft from the snapshot) and then routes the
 * seller to the visual editor so they can review/redeploy.
 *
 * The top row is flagged "Current" — versions are returned newest first
 * by the list-versions Lambda, so position 0 is the currently deployed
 * version. No pagination in v1 (Deploy-triggered only, low volume).
 */
export function VersionHistory({ projectId, versions }: VersionHistoryProps) {
  const router = useRouter();
  const [pendingVersion, setPendingVersion] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleLoad(versionNumber: number) {
    setError(null);
    setPendingVersion(versionNumber);
    startTransition(async () => {
      const result = await revertVersion(projectId, versionNumber);
      setPendingVersion(null);
      if ("error" in result) {
        setError(result.error);
        return;
      }
      router.push(`/projects/${projectId}/edit`);
    });
  }

  if (versions.length === 0) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-500">
        No versions yet. Deploy from the editor to create the first version.
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white">
      {error && (
        <p
          role="alert"
          className="border-b border-red-100 bg-red-50 px-4 py-2 text-sm text-red-700"
        >
          {error}
        </p>
      )}
      <table className="w-full text-left text-sm">
        <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-2">Version</th>
            <th className="px-4 py-2">Deployed At</th>
            <th className="px-4 py-2">Vercel Deployment</th>
            <th className="px-4 py-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {versions.map((v, idx) => {
            const isCurrent = idx === 0;
            const isRowPending =
              pendingVersion === v.versionNumber && isPending;
            return (
              <tr
                key={`${v.pk}-${v.sk}`}
                className="border-b border-slate-100 last:border-b-0"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-900">
                      v{v.versionNumber}
                    </span>
                    {isCurrent && (
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-green-800">
                        Current
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-700">
                  {formatDate(v.deployedAt)}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {v.vercelDeploymentId ? (
                    <code className="text-xs">{v.vercelDeploymentId}</code>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => handleLoad(v.versionNumber)}
                    disabled={isPending}
                    className="rounded border border-slate-200 px-3 py-1 text-xs text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isRowPending ? "Loading..." : "Load into Editor"}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleString();
  } catch {
    return iso;
  }
}
