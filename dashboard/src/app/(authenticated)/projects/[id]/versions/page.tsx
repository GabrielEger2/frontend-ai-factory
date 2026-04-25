import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject } from "@/lib/actions/get-project";
import { listVersions } from "@/lib/actions/list-versions";
import { VersionHistory } from "@/components/versions/VersionHistory";

/**
 * Version history page — lists VERSION# snapshots for a project (newest
 * first) via the list-versions Lambda. Each row offers a "Load into
 * Editor" action that reverts workingDraft to that snapshot and routes
 * to the visual editor so the seller can review/redeploy.
 */
export default async function VersionsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProject(id);

  if (!project) {
    notFound();
  }

  const result = await listVersions(id);
  const versions = "versions" in result ? result.versions : [];
  const error = "error" in result ? result.error : null;

  return (
    <div>
      <Link
        href={`/projects/${id}`}
        className="mb-4 inline-block text-sm text-slate-500 transition-colors hover:text-slate-700"
      >
        &larr; Back to Project
      </Link>

      <h1 className="mb-6 text-2xl font-bold text-slate-900">
        Version History
      </h1>

      {error && (
        <p
          role="alert"
          className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      <VersionHistory projectId={id} versions={versions} />
    </div>
  );
}
