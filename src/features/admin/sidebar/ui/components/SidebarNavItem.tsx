// src/features/admin/sidebar/ui/components/SidebarNavItem.tsx
"use client";

import React from "react";
import Link from "next/link";
import { Poppins } from "next/font/google";

import { cn } from "../../lib/types";
import type { SidebarLink } from "../../lib/types";

const poppins = Poppins({ subsets: ["latin"], weight: ["400"] });

type Props = {
  item: SidebarLink;
  isActive: boolean;
  collapsed: boolean;
  onCloseMobile: () => void;
};

export default function SidebarNavItem({
  item,
  isActive,
  collapsed,
  onCloseMobile,
}: Props) {
  const isExternal = item.blank || !item.url.startsWith("/");

  if (isExternal) {
    return (
      <li>
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "flex items-center rounded-lg p-3 transition-colors",
            "text-gray-300 hover:bg-gray-800"
          )}
        >
          <span className="text-gray-400">{item.icon}</span>
          {!collapsed && (
            <span className={cn("ml-3", poppins.className)}>{item.name}</span>
          )}
        </a>
      </li>
    );
  }

  return (
    <li>
      <Link
        href={item.url}
        onClick={onCloseMobile}
        className={cn(
          "flex items-center rounded-lg p-3 transition-colors",
          isActive
            ? "bg-blue-800/50 text-blue-100"
            : "text-gray-300 hover:bg-gray-800"
        )}
      >
        <span className={isActive ? "text-blue-400" : "text-gray-400"}>
          {item.icon}
        </span>
        {!collapsed && (
          <span className={cn("ml-3", poppins.className)}>{item.name}</span>
        )}
      </Link>
    </li>
  );
}
