import Link from "next/link";
import { ExternalLink } from "lucide-react";

interface AssemblerFileTreeProps {
  projectId: string;
}

export function AssemblerFileTree({ projectId }: AssemblerFileTreeProps) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-slate-600">
        Files assembled and stored in S3.
      </p>
      <Link
        href={`/projects/${projectId}/editor`}
        className="inline-flex items-center gap-1.5 rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800 transition-colors"
      >
        Open Code Editor
        <ExternalLink className="h-3 w-3" />
      </Link>
    </div>
  );
}
