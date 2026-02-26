// src/features/admin/sidebar/ui/components/SidebarSkeleton.tsx
"use client";

import React from "react";

export default function SidebarSkeleton() {
  return (
    <aside className="fixed lg:relative z-30 h-full bg-gray-900 shadow-lg w-64">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="h-8 w-32 bg-gray-700 rounded animate-pulse" />
        </div>
        <nav className="flex-1 overflow-y-auto">
          <ul className="space-y-1 p-2">
            {[0, 1, 2].map((i) => (
              <li key={i}>
                <div className="flex items-center rounded-lg p-3 text-gray-300">
                  <div className="h-5 w-5 bg-gray-700 rounded animate-pulse" />
                  <div className="ml-3 h-4 w-24 bg-gray-700 rounded animate-pulse" />
                </div>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
