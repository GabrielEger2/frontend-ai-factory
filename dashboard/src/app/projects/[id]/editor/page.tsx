import Link from "next/link";
import { getProject } from "@/lib/actions/get-project";
import { getFiles } from "@/lib/actions/get-files";
import { EditorShell } from "@/components/editor/EditorShell";

export default async function EditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [project, files] = await Promise.all([getProject(id), getFiles(id)]);

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-lg text-slate-500 mb-4">Project not found</p>
        <Link
          href="/projects"
          className="text-sm text-slate-600 hover:text-slate-900 underline"
        >
          Back to Projects
        </Link>
      </div>
    );
  }

  if (!files) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-lg text-slate-500 mb-4">No assembled files yet</p>
        <Link
          href={`/projects/${id}`}
          className="text-sm text-slate-600 hover:text-slate-900 underline"
        >
          Back to Project
        </Link>
      </div>
    );
  }

  return <EditorShell projectId={id} initialFiles={files} />;
}
