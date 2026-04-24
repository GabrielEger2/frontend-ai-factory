import { getShare } from "@/lib/actions/get-share";
import { BlueprintPreview } from "@/components/editor/BlueprintPreview";
import { FeedbackForm } from "@/components/preview/FeedbackForm";

/**
 * Public share preview. Lives outside the (authenticated) route group so
 * it inherits the bare root layout — no sidebar, no seller auth. The
 * get-share Lambda validates the token + TTL + revoked flag behind an
 * API-key-only gateway, so we only ever surface a neutral "expired"
 * message on failure.
 *
 * Rendered content: the project's working draft (WIP) via a read-only
 * BlueprintPreview, plus a FeedbackForm that posts back through the
 * public post-feedback endpoint.
 */
export default async function SharePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const result = await getShare(token);

  if ("error" in result || !result.workingDraft) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 py-24 text-center">
        <h1 className="mb-2 text-2xl font-semibold text-slate-900">
          Preview unavailable
        </h1>
        <p className="max-w-md text-sm text-slate-600">
          This preview link has expired or was revoked.
        </p>
      </main>
    );
  }

  const { workingDraft, companyName } = result;

  return (
    <main className="flex min-h-screen flex-col bg-slate-50">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3">
        <h1 className="text-base font-semibold text-slate-900">
          {companyName}
        </h1>
        <p className="text-xs text-slate-500">Powered by SiteGen</p>
      </header>

      <div className="flex w-full flex-col items-center gap-8 px-4 py-8">
        <div className="w-full max-w-[1280px]">
          <BlueprintPreview draft={workingDraft} interactive={false} />
        </div>
        <FeedbackForm token={token} />
      </div>
    </main>
  );
}
