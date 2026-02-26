// src/features/admin/sidebar/ui/components/SidebarUserInfo.tsx
"use client";

import React from "react";

import { cn } from "../../lib/types";
import type { AdminUser } from "../../lib/types";

type Props = {
  user: AdminUser | null;
  collapsed: boolean;
};

function UserAvatar({
  name,
  className = "",
}: {
  name: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-gray-700 text-white font-medium",
        className
      )}
      aria-label="Kullanıcı"
    >
      {name?.[0]?.toUpperCase() || "U"}
    </div>
  );
}

export default function SidebarUserInfo({ user, collapsed }: Props) {
  if (!user) return null;

  return (
    <div
      className={cn(
        "flex items-center p-4 border-b border-gray-700 gap-3",
        collapsed ? "justify-center" : "justify-start"
      )}
    >
      <UserAvatar name={user.name} className="w-10 h-10 text-lg" />
      {!collapsed && (
        <div>
          <h2 className="font-medium text-white">
            {user.name} {user.surname}
          </h2>
          <p className="text-xs text-gray-400">Admin</p>
        </div>
      )}
    </div>
  );
}
