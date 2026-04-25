"use client";

import { usePathname } from "next/navigation";

export function MainContainer({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isEditor = pathname?.endsWith("/edit") ?? false;
  return (
    <main
      className={`flex-1 overflow-y-auto bg-white ${isEditor ? "p-2" : "p-6"}`}
    >
      {children}
    </main>
  );
}
