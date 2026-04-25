interface FormSection {
  id: string;
  label: string;
  state: "done" | "active" | "pending";
}

interface FormProgressSidebarProps {
  sections: FormSection[];
}

export function FormProgressSidebar({ sections }: FormProgressSidebarProps) {
  return (
    <aside className="hidden lg:flex flex-col gap-2 w-56 shrink-0 lg:sticky lg:top-4 lg:self-start">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
        Form sections
      </p>
      <ol className="flex flex-col gap-1.5">
        {sections.map((section) => (
          <li key={section.id} className="flex items-center gap-2">
            <span
              className={[
                "h-2 w-2 rounded-full shrink-0",
                section.state === "done"
                  ? "bg-slate-800"
                  : section.state === "active"
                    ? "bg-slate-400"
                    : "bg-slate-200",
              ].join(" ")}
              aria-hidden
            />
            <span
              className={[
                "text-sm truncate",
                section.state === "done"
                  ? "text-slate-800 font-medium"
                  : section.state === "active"
                    ? "text-slate-700"
                    : "text-slate-400",
              ].join(" ")}
            >
              {section.label}
            </span>
            {section.state === "done" && (
              <span
                className="ml-auto text-xs text-slate-400"
                aria-label="done"
              >
                ✓
              </span>
            )}
          </li>
        ))}
      </ol>
    </aside>
  );
}
