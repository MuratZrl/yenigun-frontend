// src/features/admin/sidebar/hooks/useSidebarController.ts
"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useCookies } from "react-cookie";

import api from "@/lib/api";
import { adminLinks } from "../data/links";
import type { AdminSidebarProps, AdminUser, SidebarLink } from "../lib/types";

export function useSidebarController({
  cookie,
  isMobile,
  sidebarOpen,
  setSidebarOpen,
}: AdminSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [cookies, , removeCookie] = useCookies(["token"]);
  const token = (cookie ?? cookies?.token ?? "") as string;

  const [user, setUser] = useState<AdminUser | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({
    emlak: true,
  });

  // ── Mount + restore collapsed state ──
  useEffect(() => {
    setMounted(true);

    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem("adminSidebarCollapsed");
      if (stored === "1") setCollapsed(true);
    }
  }, []);

  // ── Persist collapsed state ──
  useEffect(() => {
    if (!mounted) return;
    if (typeof window === "undefined") return;
    window.localStorage.setItem("adminSidebarCollapsed", collapsed ? "1" : "0");
  }, [collapsed, mounted]);

  // ── Fetch user ──
  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }

    let cancelled = false;

    api
      .get("/user/auth")
      .then((res) => {
        const u = res?.data?.data?.user;
        if (!cancelled) setUser(u ? { name: u.name, surname: u.surname } : null);
      })
      .catch((err) => {
        const status = err?.response?.status;
        if (status === 401) {
          if (!cancelled) setUser(null);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  // ── Active URL detection ──
  const isActiveUrl = useCallback(
    (url: string) => {
      if (!mounted) return false;
      if (!url.startsWith("/")) return false;
      if (pathname === url) return true;
      return pathname.startsWith(url + "/");
    },
    [pathname, mounted]
  );

  const isDropdownActive = useCallback(
    (link: SidebarLink) => {
      if (!mounted) return false;
      if (!link.dropdown?.length) return isActiveUrl(link.url);
      return link.dropdown.some(
        (s) => pathname === s.url || pathname.startsWith(s.url + "/")
      );
    },
    [mounted, pathname, isActiveUrl]
  );

  // ── Auto-open active dropdown ──
  useEffect(() => {
    if (!mounted) return;
    if (collapsed) return;

    const next: Record<string, boolean> = { ...openDropdowns };
    for (const l of adminLinks) {
      if (l.dropdown?.length) {
        if (isDropdownActive(l)) next[l.key] = true;
      }
    }
    setOpenDropdowns(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, mounted, collapsed]);

  // ── Actions ──
  const logout = useCallback(() => {
    removeCookie("token", { path: "/" });
    setUser(null);

    if (isMobile) setSidebarOpen(false);

    router.replace("/");
    router.refresh();
  }, [removeCookie, router, isMobile, setSidebarOpen]);

  const toggleSidebar = useCallback(() => {
    if (isMobile) return;
    setCollapsed((p) => !p);
  }, [isMobile]);

  const toggleDropdown = useCallback(
    (key: string) => {
      if (collapsed) return;
      setOpenDropdowns((prev) => ({ ...prev, [key]: !prev[key] }));
    },
    [collapsed]
  );

  const closeMobile = useCallback(() => {
    if (isMobile) setSidebarOpen(false);
  }, [isMobile, setSidebarOpen]);

  return {
    // state
    user,
    collapsed,
    mounted,
    openDropdowns,
    pathname,
    isMobile,
    sidebarOpen,

    // computed
    adminLinks,
    isActiveUrl,
    isDropdownActive,

    // actions
    logout,
    toggleSidebar,
    toggleDropdown,
    closeMobile,
  };
}
