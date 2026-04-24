export default function ComponentsPage() {
  return (
    <div className="h-full flex flex-col">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Components</h1>
        <p className="text-sm text-slate-500">
          Storybook preview — run{" "}
          <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-mono">
            npm run components:storybook
          </code>{" "}
          from the project root
        </p>
      </div>

      <div className="flex-1 rounded-lg border border-slate-200 overflow-hidden">
        <iframe
          src="http://localhost:6006"
          className="h-full w-full border-0"
          title="Storybook Components Preview"
        />
      </div>
    </div>
  );
}
