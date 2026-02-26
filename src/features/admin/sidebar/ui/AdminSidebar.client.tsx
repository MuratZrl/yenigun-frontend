// src/features/admin/sidebar/ui/AdminSidebar.client.tsx
"use client";

import React from "react";

import type { AdminSidebarProps } from "../lib/types";
import { cn } from "../lib/types";
import { useSidebarController } from "../hooks/useSidebarController";

import SidebarSkeleton from "./components/SidebarSkeleton";
import SidebarHeader from "./components/SidebarHeader";
import SidebarUserInfo from "./components/SidebarUserInfo";
import SidebarNav from "./components/SidebarNav";
import SidebarFooter from "./components/SidebarFooter";

export default function AdminSidebar(props: AdminSidebarProps) {
  const c = useSidebarController(props);

  if (!c.mounted) {
    return <SidebarSkeleton />;
  }

  return (
    <>
      {/* Mobile overlay */}
      {c.isMobile && c.sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-20 lg:hidden"
          onClick={c.closeMobile}
        />
      )}

      <aside
        className={cn(
          "fixed lg:relative z-30 h-full bg-gray-900 shadow-lg transition-all duration-300 ease-in-out",
          c.isMobile
            ? c.sidebarOpen
              ? "translate-x-0 w-64"
              : "-translate-x-full w-64"
            : c.collapsed
            ? "w-20"
            : "w-64"
        )}
      >
        <div className="flex flex-col h-full">
          <SidebarHeader
            collapsed={c.collapsed}
            isMobile={c.isMobile}
            onToggle={c.toggleSidebar}
            onCloseMobile={c.closeMobile}
          />

          <SidebarUserInfo user={c.user} collapsed={c.collapsed} />

          <SidebarNav
            links={c.adminLinks}
            collapsed={c.collapsed}
            pathname={c.pathname}
            mounted={c.mounted}
            openDropdowns={c.openDropdowns}
            isActiveUrl={c.isActiveUrl}
            isDropdownActive={c.isDropdownActive}
            onToggleDropdown={c.toggleDropdown}
            onCloseMobile={c.closeMobile}
          />

          <SidebarFooter
            collapsed={c.collapsed}
            onLogout={c.logout}
          />
        </div>
      </aside>
    </>
  );
}
