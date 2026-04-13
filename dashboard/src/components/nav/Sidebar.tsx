import Link from "next/link";
import { LayoutList, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/projects", label: "Projects", icon: LayoutList },
  { href: "/projects/new", label: "New Project", icon: Plus },
];

export function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-slate-50 border-r border-slate-200 p-4 flex flex-col">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-slate-900">SiteGen</h1>
      </div>

      <nav className="flex flex-col gap-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-slate-700",
              "hover:bg-slate-100 transition-colors",
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
