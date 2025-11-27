"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { useCookies } from "react-cookie";
import { Poppins } from "next/font/google";
import { usePathname } from "next/navigation";
import {
  Building,
  Users,
  Shield,
  Mail,
  FileText,
  LogOut,
  ChevronLeft,
  ChevronRight,
  SquareStack,
  Archive,
  ChevronDown,
  ChevronUp,
  Send,
  BookA,
} from "lucide-react";
import api from "@/app/lib/api";

const poppins = Poppins({ subsets: ["latin"], weight: ["400"] });

const AdminSidebar = ({
  cookie,
  isMobile,
  sidebarOpen,
  setSidebarOpen,
}: any) => {
  const [user, setUser] = useState<any>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [openDropdowns, setOpenDropdowns] = useState<Record<number, boolean>>({
    1: true,
  });

  const [cookies, , removeCookie] = useCookies(["token"]);
  const pathname = usePathname();

  const adminLinks = [
    {
      name: "Pop-up Yönetimi",
      url: "/admin/popup",
      icon: <SquareStack size={20} />,
    },
    {
      name: "Emlak Yönetimi",
      url: "/admin/emlak",
      icon: <ChevronRight size={20} />,
      dropdown: [
        {
          name: "Tüm İlanlar",
          url: "/admin/emlak",
          icon: <Building size={18} />,
        },
        {
          name: "Arşivlenen İlanlar",
          url: "/admin/emlak/archived",
          icon: <Archive size={18} />,
        },
      ],
    },
    {
      name: "Kategori Yönetimi",
      url: "/admin/categories",
      icon: <BookA size={20} />,
    },
    {
      name: "Müşteri Yönetimi",
      url: "/admin/users",
      icon: <Users size={20} />,
    },
    {
      name: "Yetkili Yönetimi",
      url: "/admin/admin",
      icon: <Shield size={20} />,
    },
    {
      name: "Mesaj Paneli",
      url: "/admin/message",
      icon: <Mail size={20} />,
    },
    {
      name: "Sözleşmeler",
      url: "/admin/contracts",
      icon: <FileText size={20} />,
    },
    {
      name: "Mail Giriş",
      url: "https://mail.hostinger.com/",
      icon: <Send size={20} />,
      blank: true,
    },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (cookie) {
      api
        .get("/user/auth")
        .then((res) => {
          setUser(res.data.data.user);
        })
        .catch((err) => console.log(err));
    }
  }, [cookie]);

  const logout = () => {
    removeCookie("token");
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  const toggleSidebar = () => {
    if (!isMobile) {
      setCollapsed(!collapsed);
    }
  };

  const toggleDropdown = (index: number) => {
    if (collapsed) return;

    setOpenDropdowns((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const isLinkActive = (linkUrl: string, subUrl?: string) => {
    if (!mounted) return false;

    if (subUrl) {
      return pathname === subUrl;
    }

    if (linkUrl === pathname) return true;

    const link = adminLinks.find((item) => item.url === linkUrl);
    if (link?.dropdown) {
      return link.dropdown.some((item) => item.url === pathname);
    }

    return false;
  };

  const isDropdownActive = (linkUrl: string) => {
    if (!mounted) return false;

    const link = adminLinks.find((item) => item.url === linkUrl);
    if (link?.dropdown) {
      return link.dropdown.some((item) => item.url === pathname);
    }
    return pathname === linkUrl;
  };

  const UserAvatar = ({
    name,
    className = "",
  }: {
    name: string;
    className?: string;
  }) => {
    return (
      <div
        className={`flex items-center justify-center rounded-full bg-gray-700 text-white font-medium ${className}`}
      >
        {name?.[0]?.toUpperCase() || "U"}
      </div>
    );
  };

  if (!mounted) {
    return (
      <aside className="fixed lg:relative z-30 h-full bg-gray-900 shadow-lg w-64">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <div className="h-8 w-32 bg-gray-700 rounded animate-pulse"></div>
          </div>
          <nav className="flex-1 overflow-y-auto">
            <ul className="space-y-1 p-2">
              {adminLinks.slice(0, 3).map((_, index) => (
                <li key={index}>
                  <div className="flex items-center rounded-lg p-3 text-gray-300">
                    <div className="h-5 w-5 bg-gray-700 rounded animate-pulse"></div>
                    <div className="ml-3 h-4 w-24 bg-gray-700 rounded animate-pulse"></div>
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
          className="fixed inset-0 bg-black bg-opacity-70 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:relative z-30 h-full bg-gray-900 shadow-lg transition-all duration-300 ease-in-out
          ${
            isMobile
              ? sidebarOpen
                ? "translate-x-0 w-64"
                : "-translate-x-full w-64"
              : collapsed
              ? "w-20"
              : "w-64"
          }
        `}
      >
        <div className="flex flex-col h-full">
          <div
            className={`flex items-center ${
              collapsed ? "justify-center" : "justify-between"
            } p-4 border-b border-gray-700`}
          >
            {!collapsed && (
              <Link href="/" className="flex items-center">
                <img
                  src="/logo.png"
                  alt="logo"
                  className="h-8 filter brightness-0 invert"
                />
              </Link>
            )}

            {!isMobile && (
              <button
                onClick={toggleSidebar}
                className="text-gray-400 hover:text-white focus:outline-none transition-colors p-1 rounded hover:bg-gray-800"
              >
                {collapsed ? (
                  <ChevronRight size={20} />
                ) : (
                  <ChevronLeft size={20} />
                )}
              </button>
            )}
          </div>

          {user && (
            <div
              className={`flex items-center ${
                collapsed ? "justify-center" : "justify-start"
              } p-4 border-b border-gray-700 gap-3`}
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

          <nav className="flex-1 overflow-y-auto scrollbar-hide">
            <ul className="space-y-1 p-2">
              {adminLinks.map((item, index) => (
                <li key={index}>
                  {item.dropdown ? (
                    <>
                      <button
                        onClick={() => toggleDropdown(index)}
                        className={`flex items-center justify-between w-full rounded-lg p-3 transition-colors ${
                          isDropdownActive(item.url)
                            ? "bg-blue-800/50 text-blue-100"
                            : "text-gray-300 hover:bg-gray-800"
                        }`}
                      >
                        <div className="flex items-center">
                          <span
                            className={
                              isDropdownActive(item.url)
                                ? "text-blue-400"
                                : "text-gray-400"
                            }
                          >
                            {item.icon}
                          </span>
                          {!collapsed && (
                            <span className={`ml-3 ${poppins.className}`}>
                              {item.name}
                            </span>
                          )}
                        </div>
                        {!collapsed && item.dropdown && (
                          <span className="text-gray-400">
                            {openDropdowns[index] ? (
                              <ChevronUp size={16} />
                            ) : (
                              <ChevronDown size={16} />
                            )}
                          </span>
                        )}
                      </button>

                      {!collapsed && openDropdowns[index] && (
                        <ul className="ml-8 mt-1 space-y-1">
                          {item.dropdown.map((subItem, subIndex) => (
                            <li key={subIndex}>
                              <Link href={subItem.url}>
                                <div
                                  className={`flex items-center rounded-lg p-2 transition-colors ${
                                    isLinkActive(item.url, subItem.url)
                                      ? "bg-blue-800/30 text-blue-400"
                                      : "text-gray-300 hover:bg-gray-800"
                                  }`}
                                >
                                  <span className="text-gray-400">
                                    {subItem.icon}
                                  </span>
                                  <span
                                    className={`ml-3 text-sm ${poppins.className}`}
                                  >
                                    {subItem.name}
                                  </span>
                                </div>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.url}
                      target={item.blank ? "_blank" : "_self"}
                    >
                      <div
                        className={`flex items-center rounded-lg p-3 transition-colors ${
                          isLinkActive(item.url)
                            ? "bg-blue-800/50 text-blue-100"
                            : "text-gray-300 hover:bg-gray-800"
                        }`}
                      >
                        <span
                          className={
                            isLinkActive(item.url)
                              ? "text-blue-400"
                              : "text-gray-400"
                          }
                        >
                          {item.icon}
                        </span>
                        {!collapsed && (
                          <span className={`ml-3 ${poppins.className}`}>
                            {item.name}
                          </span>
                        )}
                      </div>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-4 border-t border-gray-700">
            <button
              onClick={logout}
              className={`flex items-center w-full rounded-lg p-3 text-red-400 hover:bg-red-900/30 transition-colors ${
                collapsed ? "justify-center" : ""
              }`}
            >
              <LogOut size={20} />
              {!collapsed && <span className="ml-3">Çıkış Yap</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
