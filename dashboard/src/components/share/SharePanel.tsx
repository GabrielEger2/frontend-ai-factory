"use client";

import { useMemo, useState, useTransition } from "react";
import { createShareToken } from "@/lib/actions/create-share-token";
import { revokeShareToken } from "@/lib/actions/revoke-share-token";
import type { ShareToken } from "@/types/project";

interface SharePanelProps {
  projectId: string;
  initialTokens: ShareToken[];
}

/**
 * Share-link manager. Lists active tokens as copyable URLs with expiry
 * dates and a revoke button; generate-new creates a fresh token via
 * createShareTokenAction and optimistically appends it to the list. All
 * revoked tokens are filtered out of the active view.
 *
 * The share URL is constructed on the client as `window.location.origin
 * + "/share/" + token` so the copy-to-clipboard value matches wherever
 * the dashboard is hosted.
 */
export function SharePanel({ projectId, initialTokens }: SharePanelProps) {
  const [tokens, setTokens] = useState<ShareToken[]>(initialTokens);
  const [highlighted, setHighlighted] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const activeTokens = useMemo(
    () => tokens.filter((t) => !t.revoked),
    [tokens],
  );

  function shareUrl(token: string): string {
    if (typeof window === "undefined") return `/share/${token}`;
    return `${window.location.origin}/share/${token}`;
  }

  async function copyToClipboard(token: string) {
    const url = shareUrl(token);
    try {
      if (navigator?.clipboard) {
        await navigator.clipboard.writeText(url);
        setCopied(token);
        setTimeout(() => setCopied((c) => (c === token ? null : c)), 1500);
      }
    } catch {
      // Clipboard not available (e.g. insecure context); silent no-op.
    }
  }

  function handleCreate() {
    setError(null);
    startTransition(async () => {
      const result = await createShareToken(projectId);
      if ("error" in result) {
        setError(result.error);
        return;
      }
      const newToken: ShareToken = {
        // pk/sk aren't returned by the create action; we synthesize
        // placeholder keys so the row renders. A page refresh replaces
        // these with the canonical values from list-share-tokens.
        pk: `PROJECT#${projectId}`,
        sk: `SHARE#${result.tokenId}`,
        token: result.token,
        projectId,
        sellerId: "",
        createdAt: new Date().toISOString(),
        expiresAt: Math.floor(new Date(result.expiresAt).getTime() / 1000),
        revoked: false,
      };
      setTokens((prev) => [newToken, ...prev]);
      setHighlighted(result.token);
      void copyToClipboard(result.token);
    });
  }

  function handleRevoke(token: ShareToken) {
    const tokenId = extractTokenId(token.sk);
    if (!tokenId) return;
    setError(null);
    startTransition(async () => {
      const result = await revokeShareToken(projectId, tokenId);
      if ("error" in result) {
        setError(result.error);
        return;
      }
      setTokens((prev) =>
        prev.map((t) => (t.sk === token.sk ? { ...t, revoked: true } : t)),
      );
    });
  }

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Share links</h3>
          <p className="text-xs text-slate-500">
            Generate a public preview link for clients. Links expire after 7
            days.
          </p>
        </div>
        <button
          type="button"
          onClick={handleCreate}
          disabled={isPending}
          className="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "Generating..." : "Generate Share Link"}
        </button>
      </div>

      {error && (
        <p
          role="alert"
          className="rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700"
        >
          {error}
        </p>
      )}

      {activeTokens.length === 0 ? (
        <p className="text-xs text-slate-500">No active share links yet.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {activeTokens.map((t) => {
            const url = shareUrl(t.token);
            const isHighlighted = highlighted === t.token;
            return (
              <li
                key={t.sk}
                className={
                  "flex flex-col gap-1 rounded border px-3 py-2 " +
                  (isHighlighted
                    ? "border-green-300 bg-green-50"
                    : "border-slate-200")
                }
              >
                <div className="flex items-center gap-2">
                  <code className="flex-1 truncate text-xs text-slate-700">
                    {url}
                  </code>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(t.token)}
                    className="rounded border border-slate-200 px-2 py-0.5 text-[11px] text-slate-600 hover:bg-slate-50"
                  >
                    {copied === t.token ? "Copied" : "Copy"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRevoke(t)}
                    disabled={isPending}
                    className="rounded border border-red-200 px-2 py-0.5 text-[11px] text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Revoke
                  </button>
                </div>
                <p className="text-[11px] text-slate-500">
                  Expires {formatEpoch(t.expiresAt)}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function extractTokenId(sk: string): string | null {
  // `SHARE#<tokenId>` — strip the prefix.
  const parts = sk.split("#");
  if (parts.length < 2) return null;
  return parts.slice(1).join("#");
}

function formatEpoch(epochSeconds: number): string {
  try {
    const d = new Date(epochSeconds * 1000);
    if (isNaN(d.getTime())) return "unknown";
    return d.toLocaleString();
  } catch {
    return "unknown";
  }
}
