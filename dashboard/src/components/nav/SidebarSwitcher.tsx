"use client";

import { usePathname } from "next/navigation";
import { SidebarCompact } from "./SidebarCompact";

export function SidebarSwitcher() {
  const pathname = usePathname();
  if (pathname?.endsWith("/edit")) return null;
  return <SidebarCompact />;
}
