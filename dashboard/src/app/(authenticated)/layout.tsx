import { SidebarSwitcher } from "@/components/nav/SidebarSwitcher";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarSwitcher />
      <main className="flex-1 overflow-y-auto p-6 bg-white">{children}</main>
    </div>
  );
}
