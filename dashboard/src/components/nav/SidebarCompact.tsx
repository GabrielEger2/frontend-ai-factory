import Link from "next/link";
import { LayoutList, Plus, Blocks } from "lucide-react";

const navItems = [
  { href: "/projects", label: "Projects", icon: LayoutList },
  { href: "/projects/new", label: "New Project", icon: Plus },
  { href: "/components", label: "Components", icon: Blocks },
];

export function SidebarCompact() {
  return (
    <aside className="w-14 h-full bg-slate-50 border-r border-slate-200 flex flex-col shrink-0 items-center py-4 gap-6">
      <div className="mb-4">
        <span className="text-base font-black text-slate-900">S</span>
      </div>

      <nav className="flex flex-col gap-1 items-center">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            title={item.label}
            className="flex h-10 w-10 items-center justify-center rounded-md text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <item.icon className="h-4 w-4" />
          </Link>
        ))}
      </nav>
    </aside>
  );
}
