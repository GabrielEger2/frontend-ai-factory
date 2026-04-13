import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Sidebar } from "@/components/nav/Sidebar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SiteGen",
  description: "AI-Powered Website Generator",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <div className="flex">
          <Sidebar />
          <main className="flex-1 overflow-y-auto p-6 bg-white min-h-screen">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
