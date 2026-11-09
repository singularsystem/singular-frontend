"use client";

import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardNav } from "@/components/dashboard-nav";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AuthGuard } from "./protected-route";

export function LayoutWithSidebar({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const pathname = usePathname() ?? "";
  const isPublic = ["/login", "/cadastro", "/"].includes(pathname);
  const isFirstAccess = pathname === "/primeiro-acesso";

  if (isPublic) return children;
  if (isFirstAccess) return <AuthGuard>{children}</AuthGuard>;

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 flex">
        <DashboardNav
          isCollapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <DashboardHeader
            onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
          <main id="main-content" className="p-4">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
