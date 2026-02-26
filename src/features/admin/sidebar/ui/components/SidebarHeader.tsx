// src/features/admin/sidebar/ui/components/SidebarHeader.tsx
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, ChevronLeft } from "lucide-react";

import { cn } from "../../lib/types";

type Props = {
  collapsed: boolean;
  isMobile: boolean;
  onToggle: () => void;
  onCloseMobile: () => void;
};

export default function SidebarHeader({
  collapsed,
  isMobile,
  onToggle,
  onCloseMobile,
}: Props) {
  return (
    <div
      className={cn(
        "flex items-center p-4 border-b border-gray-700",
        collapsed ? "justify-center" : "justify-between"
      )}
    >
      {!collapsed && (
        <Link href="/" className="flex items-center" onClick={onCloseMobile}>
          <Image
            src="/logo.png"
            alt="logo"
            width={120}
            height={32}
            className="h-8 w-auto filter brightness-0 invert"
            priority
          />
        </Link>
      )}

      {!isMobile && (
        <button
          type="button"
          onClick={onToggle}
          className="text-gray-400 hover:text-white focus:outline-none transition-colors p-1 rounded hover:bg-gray-800"
          aria-label={collapsed ? "Menüyü genişlet" : "Menüyü daralt"}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      )}
    </div>
  );
}
