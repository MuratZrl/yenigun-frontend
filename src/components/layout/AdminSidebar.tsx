// src/components/layout/AdminSidebar.tsx
"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useCookies } from "react-cookie";
import { Poppins } from "next/font/google";
import {
  Archive,
  BarChart3,
  BookA,
  Building,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  FileText,
  LogOut,
  Mail,
  Send,
  Shield,
  Users,
} from "lucide-react";

import api from "@/lib/api";

const poppins = Poppins({ subsets: ["latin"], weight: ["400"] });

type Id = string;

type AdminUser = {
  name: string;
  surname: string;
};

type SidebarSubLink = {
  key: string;
  name: string;
  url: string;
  icon: React.ReactNode;
};

type SidebarLink = {
  key: string;
  name: string;
  url: string;
  icon: React.ReactNode;
  blank?: boolean;
  dropdown?: SidebarSubLink[];
};

type AdminSidebarProps = {
  cookie?: string | null; // geriye dönük uyumluluk için
  isMobile: boolean;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
};

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export default function AdminSidebar({
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

  const adminLinks: SidebarLink[] = useMemo(
    () => [
      {
        key: "emlak",
        name: "Emlak Yönetimi",
        url: "/admin/emlak",
        icon: <ChevronRight size={20} />,
        dropdown: [
          {
            key: "emlak-all",
            name: "Tüm İlanlar",
            url: "/admin/emlak",
            icon: <Building size={18} />,
          },
          {
            key: "emlak-archived",
            name: "Arşivlenen İlanlar",
            url: "/admin/emlak/archived",
            icon: <Archive size={18} />,
          },
        ],
      },
      {
        key: "categories",
        name: "Kategori Yönetimi",
        url: "/admin/categories",
        icon: <BookA size={20} />,
      },
      {
        key: "users",
        name: "Müşteri Yönetimi",
        url: "/admin/customers",
        icon: <Users size={20} />,
      },
      {
        key: "admins",
        name: "Yetkili Yönetimi",
        url: "/admin/admin",
        icon: <Shield size={20} />,
      },
      {
        key: "message",
        name: "Mesaj Paneli",
        url: "/admin/message",
        icon: <Mail size={20} />,
      },
      {
        key: "contracts",
        name: "Sözleşmeler",
        url: "/admin/contracts",
        icon: <FileText size={20} />,
      },
      {
        key: "statistics",
        name: "İstatistikler",
        url: "/admin/statistics",
        icon: <BarChart3 size={20} />,
      },
      {
        key: "mail",
        name: "Mail Giriş",
        url: "https://mail.hostinger.com/",
        icon: <Send size={20} />,
        blank: true,
      },
    ],
    []
  );

  useEffect(() => {
    setMounted(true);

    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem("adminSidebarCollapsed");
      if (stored === "1") setCollapsed(true);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (typeof window === "undefined") return;
    window.localStorage.setItem("adminSidebarCollapsed", collapsed ? "1" : "0");
  }, [collapsed, mounted]);

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
          // token bozuksa sidebar user’ı boşalsın, kullanıcı da login’e düşsün
          if (!cancelled) setUser(null);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  const isActiveUrl = useCallback(
    (url: string) => {
      if (!mounted) return false;
      if (!url.startsWith("/")) return false;
      if (pathname === url) return true;
      // nested route’larda da aktif say (örn: /admin/categories/xyz)
      return pathname.startsWith(url + "/");
    },
    [pathname, mounted]
  );

  const isDropdownActive = useCallback(
    (link: SidebarLink) => {
      if (!mounted) return false;
      if (!link.dropdown?.length) return isActiveUrl(link.url);
      return link.dropdown.some((s) => pathname === s.url || pathname.startsWith(s.url + "/"));
    },
    [mounted, pathname, isActiveUrl]
  );

  // Aktif dropdown’ı otomatik açık tut
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
  }, [pathname, mounted, collapsed, adminLinks]);

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

  const UserAvatar = useMemo(() => {
    return function Avatar({
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
    };
  }, []);

  if (!mounted) {
    return (
      <aside className="fixed lg:relative z-30 h-full bg-gray-900 shadow-lg w-64">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <div className="h-8 w-32 bg-gray-700 rounded animate-pulse" />
          </div>
          <nav className="flex-1 overflow-y-auto">
            <ul className="space-y-1 p-2">
              {adminLinks.slice(0, 3).map((_, index) => (
                <li key={index}>
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

  return (
    <>
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-20 lg:hidden"
          onClick={closeMobile}
        />
      )}

      <aside
        className={cn(
          "fixed lg:relative z-30 h-full bg-gray-900 shadow-lg transition-all duration-300 ease-in-out",
          isMobile
            ? sidebarOpen
              ? "translate-x-0 w-64"
              : "-translate-x-full w-64"
            : collapsed
            ? "w-20"
            : "w-64"
        )}
      >
        <div className="flex flex-col h-full">
          <div
            className={cn(
              "flex items-center p-4 border-b border-gray-700",
              collapsed ? "justify-center" : "justify-between"
            )}
          >
            {!collapsed && (
              <Link href="/" className="flex items-center" onClick={closeMobile}>
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
                onClick={toggleSidebar}
                className="text-gray-400 hover:text-white focus:outline-none transition-colors p-1 rounded hover:bg-gray-800"
                aria-label={collapsed ? "Menüyü genişlet" : "Menüyü daralt"}
              >
                {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
              </button>
            )}
          </div>

          {user && (
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
          )}

          <nav className="flex-1 overflow-y-auto">
            <ul className="space-y-1 p-2">
              {adminLinks.map((item) => {
                const active = isDropdownActive(item);
                const open = !!openDropdowns[item.key];

                if (item.dropdown?.length) {
                  return (
                    <li key={item.key}>
                      <button
                        type="button"
                        onClick={() => toggleDropdown(item.key)}
                        className={cn(
                          "flex items-center justify-between w-full rounded-lg p-3 transition-colors",
                          active ? "bg-blue-800/50 text-blue-100" : "text-gray-300 hover:bg-gray-800"
                        )}
                        aria-expanded={open}
                        aria-controls={`sidebar-dd-${item.key}`}
                      >
                        <div className="flex items-center">
                          <span className={active ? "text-blue-400" : "text-gray-400"}>
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
                            {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </span>
                        )}
                      </button>

                      {!collapsed && open && (
                        <ul id={`sidebar-dd-${item.key}`} className="ml-8 mt-1 space-y-1">
                          {item.dropdown.map((sub) => {
                            const subActive = mounted && (pathname === sub.url || pathname.startsWith(sub.url + "/"));
                            return (
                              <li key={sub.key}>
                                <Link
                                  href={sub.url}
                                  onClick={closeMobile}
                                  className={cn(
                                    "flex items-center rounded-lg p-2 transition-colors",
                                    subActive ? "bg-blue-800/30 text-blue-400" : "text-gray-300 hover:bg-gray-800"
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

                const isExternal = item.blank || !item.url.startsWith("/");
                if (isExternal) {
                  return (
                    <li key={item.key}>
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
                  <li key={item.key}>
                    <Link
                      href={item.url}
                      onClick={closeMobile}
                      className={cn(
                        "flex items-center rounded-lg p-3 transition-colors",
                        isActiveUrl(item.url) ? "bg-blue-800/50 text-blue-100" : "text-gray-300 hover:bg-gray-800"
                      )}
                    >
                      <span className={isActiveUrl(item.url) ? "text-blue-400" : "text-gray-400"}>
                        {item.icon}
                      </span>
                      {!collapsed && (
                        <span className={cn("ml-3", poppins.className)}>{item.name}</span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="p-4 border-t border-gray-700">
            <button
              type="button"
              onClick={logout}
              className={cn(
                "flex items-center w-full rounded-lg p-3 text-red-400 hover:bg-red-900/30 transition-colors",
                collapsed ? "justify-center" : ""
              )}
            >
              <LogOut size={20} />
              {!collapsed && <span className="ml-3">Çıkış Yap</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
