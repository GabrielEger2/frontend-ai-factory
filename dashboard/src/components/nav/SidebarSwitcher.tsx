"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { SidebarCompact } from "./SidebarCompact";

export function SidebarSwitcher() {
  const pathname = usePathname();
  return pathname?.endsWith("/edit") ? <SidebarCompact /> : <Sidebar />;
}
