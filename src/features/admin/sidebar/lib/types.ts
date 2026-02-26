// src/features/admin/sidebar/lib/types.ts

import type React from "react";

export type SidebarSubLink = {
  key: string;
  name: string;
  url: string;
  icon: React.ReactNode;
};

export type SidebarLink = {
  key: string;
  name: string;
  url: string;
  icon: React.ReactNode;
  blank?: boolean;
  dropdown?: SidebarSubLink[];
};

export type AdminUser = {
  name: string;
  surname: string;
};

export type AdminSidebarProps = {
  cookie?: string | null;
  isMobile: boolean;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
};

/** Simple className joiner */
export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}
