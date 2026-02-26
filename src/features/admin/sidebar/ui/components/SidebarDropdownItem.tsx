// src/features/admin/sidebar/ui/components/SidebarDropdownItem.tsx
"use client";

import React from "react";
import Link from "next/link";
import { Poppins } from "next/font/google";
import { ChevronDown, ChevronUp } from "lucide-react";

import { cn } from "../../lib/types";
import type { SidebarLink } from "../../lib/types";

const poppins = Poppins({ subsets: ["latin"], weight: ["400"] });

type Props = {
  item: SidebarLink;
  isActive: boolean;
  isOpen: boolean;
  collapsed: boolean;
  pathname: string;
  mounted: boolean;
  onToggle: (key: string) => void;
  onCloseMobile: () => void;
};

export default function SidebarDropdownItem({
  item,
  isActive,
  isOpen,
  collapsed,
  pathname,
  mounted,
  onToggle,
  onCloseMobile,
}: Props) {
  return (
    <li>
      <button
        type="button"
        onClick={() => onToggle(item.key)}
        className={cn(
          "flex items-center justify-between w-full rounded-lg p-3 transition-colors",
          isActive
            ? "bg-blue-800/50 text-blue-100"
            : "text-gray-300 hover:bg-gray-800"
        )}
        aria-expanded={isOpen}
        aria-controls={`sidebar-dd-${item.key}`}
      >
        <div className="flex items-center">
          <span className={isActive ? "text-blue-400" : "text-gray-400"}>
            {item.icon}
          </span>
          {!collapsed && (
            <span className={cn("ml-3", poppins.className)}>
              {item.name}
            </span>
          )}
        </div>

        {!collapsed && (
          <span className="text-gray-400">
            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </span>
        )}
      </button>

      {!collapsed && isOpen && item.dropdown && (
        <ul id={`sidebar-dd-${item.key}`} className="ml-8 mt-1 space-y-1">
          {item.dropdown.map((sub) => {
            const subActive =
              mounted &&
              (pathname === sub.url || pathname.startsWith(sub.url + "/"));
            return (
              <li key={sub.key}>
                <Link
                  href={sub.url}
                  onClick={onCloseMobile}
                  className={cn(
                    "flex items-center rounded-lg p-2 transition-colors",
                    subActive
                      ? "bg-blue-800/30 text-blue-400"
                      : "text-gray-300 hover:bg-gray-800"
                  )}
                >
                  <span className="text-gray-400">{sub.icon}</span>
                  <span className={cn("ml-3 text-sm", poppins.className)}>
                    {sub.name}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </li>
  );
}
