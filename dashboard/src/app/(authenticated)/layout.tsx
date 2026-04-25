import { MainContainer } from "@/components/nav/MainContainer";
import { SidebarSwitcher } from "@/components/nav/SidebarSwitcher";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarSwitcher />
      <MainContainer>{children}</MainContainer>
    </div>
  );
}
