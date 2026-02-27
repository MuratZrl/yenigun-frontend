// src/app/components/layout/Navbar.tsx
"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { Search, ChevronDown, LogOut, User, Menu, X, LayoutDashboard } from "lucide-react";
import api from "@/lib/api";
import { getClientToken, removeClientToken, removeClientUser } from "@/lib/auth";
import type { User as UserType } from "@/types/user";

const NAV_LINKS = [
  { href: "/ilanlar", label: "İlanlar" },
  { href: "/about", label: "Hakkımızda" },
  { href: "/contact", label: "İletişim" },
] as const;

const Navbar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<UserType | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const [q, setQ] = useState("");
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const isLoggedIn = Boolean(user);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    let alive = true;

    const fetchMe = async () => {
      setLoadingUser(true);
      try {
        const token = getClientToken();
        if (!token) {
          if (alive) setUser(null);
          return;
        }
        const res = await api.get("/user/auth");
        const u = res?.data?.data?.user ?? null;
        if (alive) setUser(u);
      } catch {
        removeClientToken();
        removeClientUser();
        if (alive) setUser(null);
      } finally {
        if (alive) setLoadingUser(false);
      }
    };

    fetchMe();
    return () => {
      alive = false;
    };
  }, [pathname]);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(e.target as Node)) {
        setOpenUserMenu(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // Scroll shadow
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSubmitSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const query = q.trim();
      if (!query) {
        router.push("/ilanlar");
      } else {
        router.push(`/ilanlar?q=${encodeURIComponent(query)}`);
      }
      setMobileMenuOpen(false);
    },
    [q, router]
  );

  const handleLogout = () => {
    removeClientToken();
    removeClientUser();
    setUser(null);
    setOpenUserMenu(false);
    setMobileMenuOpen(false);
    router.push("/");
  };

  const userInitials = (() => {
    if (!user) return "";
    const a = (user.name || "").charAt(0);
    const b = (user.surname || "").charAt(0);
    return `${a}${b}`.toUpperCase();
  })();

  const isActive = (href: string) => pathname === href;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 transition-shadow duration-300 ${
          ""
        }`}
      >
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex items-center gap-5 h-16">
            {/* Logo */}
            <Link href="/" className="shrink-0 flex items-center">
              <Image
                src="/logo.png"
                alt="Yenigün Emlak"
                width={140}
                height={32}
                priority
                className="h-7 w-auto"
              />
            </Link>

            {/* Desktop: Search + Nav Links */}
            <div className="hidden md:flex flex-1 items-center gap-1">
              <form onSubmit={handleSubmitSearch} className="w-full max-w-xs mr-4">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Search className="w-4 h-4" />
                  </span>
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="İlan ara..."
                    className="w-full h-9 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 pl-9 pr-3 text-sm outline-none transition-all duration-200 focus:bg-white focus:border-[#035DBA] focus:ring-2 focus:ring-[#035DBA]/20 placeholder:text-gray-400"
                  />
                </div>
              </form>

              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
                    isActive(link.href)
                      ? "bg-[#E9EEF7] text-[#000066]"
                      : "text-gray-600 hover:text-[#000066] hover:bg-gray-50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right side spacer on mobile */}
            <div className="flex-1 md:hidden" />

            {/* Auth (desktop) */}
            <div className="hidden md:flex shrink-0 items-center gap-2">
              {!loadingUser && !isLoggedIn && (
                <Link
                  href="/login"
                  className="text-sm font-semibold px-4 py-2 rounded-lg bg-[#035DBA] text-white hover:bg-[#000066] transition-colors duration-150"
                >
                  Giriş Yap
                </Link>
              )}

              {!loadingUser && isLoggedIn && user && (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setOpenUserMenu((v) => !v)}
                    className="h-9 flex items-center gap-2 px-2 rounded-lg hover:bg-gray-50 transition-colors duration-150"
                  >
                    <span className="w-8 h-8 rounded-full bg-gradient-to-br from-[#000066] to-[#035DBA] text-white flex items-center justify-center text-xs font-bold">
                      {userInitials || <User className="w-4 h-4" />}
                    </span>
                    <span className="hidden lg:inline text-sm font-medium text-gray-700">
                      {user.name} {user.surname}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                        openUserMenu ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <div
                    className={`absolute right-0 mt-2 w-52 rounded-xl bg-white shadow-lg border border-gray-200 overflow-hidden transition-all duration-200 origin-top-right ${
                      openUserMenu
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-95 pointer-events-none"
                    }`}
                  >
                    <Link
                      href="/admin/emlak"
                      onClick={() => setOpenUserMenu(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-[#E9EEF7] hover:text-[#000066] transition-colors duration-150"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Yönetim Paneli
                    </Link>
                    <div className="border-t border-gray-100" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors duration-150"
                    >
                      <LogOut className="w-4 h-4" />
                      Çıkış Yap
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile hamburger button */}
            <button
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="md:hidden shrink-0 w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors duration-150 text-gray-600"
              aria-label={mobileMenuOpen ? "Menüyü kapat" : "Menüyü aç"}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile menu panel */}
      <div
        className={`fixed right-0 top-16 z-40 w-72 h-[calc(100dvh-4rem)] bg-white border-l border-gray-200 shadow-xl transform transition-transform duration-300 ease-in-out md:hidden ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile search */}
          <div className="p-4">
            <form onSubmit={handleSubmitSearch}>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Search className="w-4 h-4" />
                </span>
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="İlan ara..."
                  className="w-full h-10 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 pl-9 pr-3 text-sm outline-none transition-all duration-200 focus:bg-white focus:border-[#035DBA] focus:ring-2 focus:ring-[#035DBA]/20 placeholder:text-gray-400"
                />
              </div>
            </form>
          </div>

          {/* Mobile nav links */}
          <nav className="flex-1 overflow-y-auto px-3 space-y-0.5">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-colors duration-150 ${
                  isActive(link.href)
                    ? "bg-[#E9EEF7] text-[#000066]"
                    : "text-gray-700 hover:text-[#000066] hover:bg-gray-50"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile auth section */}
          <div className="p-4 border-t border-gray-100">
            {!loadingUser && !isLoggedIn && (
              <Link
                href="/login"
                className="flex items-center justify-center gap-2 w-full h-10 rounded-lg bg-[#035DBA] text-white text-sm font-semibold hover:bg-[#000066] transition-colors duration-150"
              >
                <User className="w-4 h-4" />
                Giriş Yap
              </Link>
            )}

            {!loadingUser && isLoggedIn && user && (
              <div className="space-y-1">
                <div className="flex items-center gap-3 px-3 py-3 rounded-lg bg-[#E9EEF7]/50">
                  <span className="w-9 h-9 rounded-full bg-gradient-to-br from-[#000066] to-[#035DBA] text-white flex items-center justify-center text-xs font-bold shrink-0">
                    {userInitials || <User className="w-4 h-4" />}
                  </span>
                  <span className="text-sm font-medium text-gray-900 truncate">
                    {user.name} {user.surname}
                  </span>
                </div>
                <Link
                  href="/admin/emlak"
                  className="flex items-center gap-3 w-full px-3 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-[#E9EEF7] hover:text-[#000066] transition-colors duration-150"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Yönetim Paneli
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-3 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors duration-150"
                >
                  <LogOut className="w-4 h-4" />
                  Çıkış Yap
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
