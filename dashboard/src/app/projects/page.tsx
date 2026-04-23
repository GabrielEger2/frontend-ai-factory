import Link from "next/link";
import { listProjects } from "@/lib/actions/list-projects";
import { ProjectsTable } from "@/components/projects/ProjectsTable";

export default async function ProjectsPage() {
  const { projects } = await listProjects();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Projects</h1>
        <Link
          href="/projects/new"
          className="bg-slate-900 text-white px-4 py-2 rounded-md hover:bg-slate-800 transition-colors text-sm font-medium"
        >
          New Project
        </Link>
      </div>

      {projects.length > 0 ? (
        <ProjectsTable projects={projects} />
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-lg text-slate-500 mb-2">No projects yet</p>
          <p className="text-sm text-slate-400 mb-6">
            Create your first website
          </p>
          <Link
            href="/projects/new"
            className="bg-slate-900 text-white px-4 py-2 rounded-md hover:bg-slate-800 transition-colors text-sm font-medium"
          >
            New Project
          </Link>
        </div>
      )}
    </div>
  );
}
