// src/features/admin/sidebar/ui/components/SidebarNav.tsx
"use client";

import React from "react";

import type { SidebarLink } from "../../lib/types";
import SidebarNavItem from "./SidebarNavItem";
import SidebarDropdownItem from "./SidebarDropdownItem";

type Props = {
  links: SidebarLink[];
  collapsed: boolean;
  pathname: string;
  mounted: boolean;
  openDropdowns: Record<string, boolean>;
  isActiveUrl: (url: string) => boolean;
  isDropdownActive: (link: SidebarLink) => boolean;
  onToggleDropdown: (key: string) => void;
  onCloseMobile: () => void;
};

export default function SidebarNav({
  links,
  collapsed,
  pathname,
  mounted,
  openDropdowns,
  isActiveUrl,
  isDropdownActive,
  onToggleDropdown,
  onCloseMobile,
}: Props) {
  return (
    <nav className="flex-1 overflow-y-auto">
      <ul className="space-y-1 p-2">
        {links.map((item) => {
          const active = isDropdownActive(item);
          const open = !!openDropdowns[item.key];

          if (item.dropdown?.length) {
            return (
              <SidebarDropdownItem
                key={item.key}
                item={item}
                isActive={active}
                isOpen={open}
                collapsed={collapsed}
                pathname={pathname}
                mounted={mounted}
                onToggle={onToggleDropdown}
                onCloseMobile={onCloseMobile}
              />
            );
          }

          return (
            <SidebarNavItem
              key={item.key}
              item={item}
              isActive={isActiveUrl(item.url)}
              collapsed={collapsed}
              onCloseMobile={onCloseMobile}
            />
          );
        })}
      </ul>
    </nav>
  );
}
