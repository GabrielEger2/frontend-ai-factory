"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import {
  Save,
  Rocket,
  ArrowLeft,
  File,
  Folder,
  FolderOpen,
} from "lucide-react";
import { putFiles } from "@/lib/actions/put-files";
import { retryStep } from "@/lib/actions/retry-step";
import { MonacoEditor, getLanguageFromPath } from "./MonacoEditor";

interface EditorShellProps {
  projectId: string;
  initialFiles: Record<string, string>;
}

interface FileTree {
  [dir: string]: string[];
}

function buildFileTree(paths: string[]): FileTree {
  const tree: FileTree = {};

  for (const filePath of paths) {
    const lastSlash = filePath.lastIndexOf("/");
    const dir = lastSlash === -1 ? "." : filePath.slice(0, lastSlash);
    const fileName =
      lastSlash === -1 ? filePath : filePath.slice(lastSlash + 1);

    if (!tree[dir]) {
      tree[dir] = [];
    }
    tree[dir].push(fileName);
  }

  // Sort files within each directory
  for (const dir of Object.keys(tree)) {
    tree[dir].sort();
  }

  return tree;
}

export function EditorShell({ projectId, initialFiles }: EditorShellProps) {
  const [files, setFiles] = useState<Record<string, string>>(initialFiles);
  const sortedPaths = useMemo(() => Object.keys(files).sort(), [files]);
  const [selectedFile, setSelectedFile] = useState<string>(
    sortedPaths[0] ?? "",
  );
  const [isSaving, startSaveTransition] = useTransition();
  const [isDeploying, startDeployTransition] = useTransition();
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const fileTree = useMemo(() => buildFileTree(sortedPaths), [sortedPaths]);
  const sortedDirs = useMemo(() => Object.keys(fileTree).sort(), [fileTree]);

  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(
    () => new Set(sortedDirs),
  );

  function toggleDir(dir: string) {
    setExpandedDirs((prev) => {
      const next = new Set(prev);
      if (next.has(dir)) {
        next.delete(dir);
      } else {
        next.add(dir);
      }
      return next;
    });
  }

  function showMessage(type: "success" | "error", text: string) {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  }

  function handleSave() {
    startSaveTransition(async () => {
      const result = await putFiles(projectId, files);

      if ("message" in result) {
        showMessage("success", "Saved");
      } else {
        showMessage("error", result.error);
      }
    });
  }

  function handleDeploy() {
    startDeployTransition(async () => {
      const result = await retryStep(projectId, "deploy");

      if ("message" in result) {
        showMessage("success", "Deployment started");
      } else {
        showMessage("error", result.error);
      }
    });
  }

  function handleEditorChange(value: string | undefined) {
    setFiles((prev) => ({ ...prev, [selectedFile]: value ?? "" }));
  }

  return (
    <div className="flex flex-col h-[calc(100vh-48px)]">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-2 shrink-0">
        <div className="flex items-center gap-4">
          <Link
            href={`/projects/${projectId}`}
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to project
          </Link>
          <span className="text-sm text-slate-400">|</span>
          <span className="text-sm font-mono text-slate-600">
            {selectedFile}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {message && (
            <span
              className={
                message.type === "success"
                  ? "text-xs text-green-600"
                  : "text-xs text-red-600"
              }
            >
              {message.text}
            </span>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-3.5 w-3.5" />
            {isSaving ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            onClick={handleDeploy}
            disabled={isDeploying}
            className="inline-flex items-center gap-1.5 rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Rocket className="h-3.5 w-3.5" />
            {isDeploying ? "Deploying..." : "Deploy"}
          </button>
        </div>
      </div>

      {/* Main area: sidebar + editor */}
      <div className="flex flex-1 min-h-0">
        {/* File tree sidebar */}
        <aside className="w-[250px] shrink-0 overflow-y-auto border-r border-slate-200 bg-slate-900 text-slate-300 text-sm">
          <div className="p-3">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
              Files
            </p>
            {sortedDirs.map((dir) => (
              <div key={dir} className="mb-1">
                <button
                  type="button"
                  onClick={() => toggleDir(dir)}
                  className="flex items-center gap-1.5 w-full px-1 py-0.5 rounded hover:bg-slate-800 transition-colors text-slate-400"
                >
                  {expandedDirs.has(dir) ? (
                    <FolderOpen className="h-3.5 w-3.5 text-slate-500" />
                  ) : (
                    <Folder className="h-3.5 w-3.5 text-slate-500" />
                  )}
                  <span className="text-xs truncate">{dir}</span>
                </button>
                {expandedDirs.has(dir) && (
                  <div className="ml-4">
                    {fileTree[dir].map((fileName) => {
                      const fullPath =
                        dir === "." ? fileName : `${dir}/${fileName}`;
                      const isSelected = fullPath === selectedFile;
                      return (
                        <button
                          key={fullPath}
                          type="button"
                          onClick={() => setSelectedFile(fullPath)}
                          className={`flex items-center gap-1.5 w-full px-1 py-0.5 rounded text-xs transition-colors ${
                            isSelected
                              ? "bg-slate-700 text-white"
                              : "text-slate-400 hover:bg-slate-800 hover:text-slate-300"
                          }`}
                        >
                          <File className="h-3 w-3 shrink-0" />
                          <span className="truncate">{fileName}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </aside>

        {/* Monaco editor */}
        <div className="flex-1 min-w-0">
          {selectedFile && files[selectedFile] !== undefined ? (
            <MonacoEditor
              value={files[selectedFile]}
              language={getLanguageFromPath(selectedFile)}
              onChange={handleEditorChange}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400 text-sm">
              Select a file to edit
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
