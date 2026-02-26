// src/features/admin/sidebar/ui/components/SidebarFooter.tsx
"use client";

import React from "react";
import { LogOut } from "lucide-react";

import { cn } from "../../lib/types";

type Props = {
  collapsed: boolean;
  onLogout: () => void;
};

export default function SidebarFooter({ collapsed, onLogout }: Props) {
  return (
    <div className="p-4 border-t border-gray-700">
      <button
        type="button"
        onClick={onLogout}
        className={cn(
          "flex items-center w-full rounded-lg p-3 text-red-400 hover:bg-red-900/30 transition-colors",
          collapsed ? "justify-center" : ""
        )}
      >
        <LogOut size={20} />
        {!collapsed && <span className="ml-3">Çıkış Yap</span>}
      </button>
    </div>
  );
}
