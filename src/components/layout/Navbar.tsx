// src/app/components/layout/Navbar.tsx
"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { Search, ChevronDown, LogOut, User, Menu, X } from "lucide-react";
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
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#2f3b4a] text-white">
        <div className="mx-auto max-w-6xl px-4">
          <div className="h-14 flex items-center gap-3">
            {/* Logo */}
            <Link href="/" className="shrink-0 flex items-center">
              <Image
                src="/logo.png"
                alt="Yenigün Emlak"
                width={140}
                height={32}
                priority
                className="h-8 w-auto"
              />
            </Link>

            {/* Desktop: Search + Nav Links */}
            <div className="hidden md:flex flex-1 items-center gap-4">
              <form onSubmit={handleSubmitSearch} className="w-full max-w-sm">
                <div className="relative">
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600">
                    <Search className="w-4 h-4" />
                  </span>
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Kelime, ilan no veya mağaza adı ile ara"
                    className="w-full h-9 rounded-sm bg-white text-black pl-3 pr-9 text-sm outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-400"
                  />
                </div>
              </form>

              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm transition-colors ${
                    isActive(link.href)
                      ? "text-white font-semibold"
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right side spacer on mobile */}
            <div className="flex-1 md:hidden" />

            {/* Auth (desktop) */}
            <div className="hidden md:flex shrink-0 items-center gap-3">
              {!loadingUser && !isLoggedIn && (
                <Link
                  href="/login"
                  className="text-sm text-white/90 hover:text-white"
                >
                  Giriş Yap
                </Link>
              )}

              {!loadingUser && isLoggedIn && user && (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setOpenUserMenu((v) => !v)}
                    className="h-9 flex items-center gap-2 px-2 rounded-sm hover:bg-white/10"
                  >
                    <span className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-xs font-semibold">
                      {userInitials || <User className="w-4 h-4" />}
                    </span>
                    <span className="hidden lg:inline text-sm">
                      {user.name} {user.surname}
                    </span>
                    <ChevronDown className="w-4 h-4 opacity-80" />
                  </button>

                  {openUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 rounded-sm bg-[#1f2933] border border-white/10 shadow-xl overflow-hidden">
                      <Link
                        href="/admin/emlak"
                        onClick={() => setOpenUserMenu(false)}
                        className="flex items-center gap-2 px-4 py-3 text-sm text-white hover:bg-white/10"
                      >
                        <User className="w-4 h-4" />
                        Yönetim Paneli
                      </Link>
                      <div className="border-t border-white/10" />
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-sm text-red-300 hover:bg-white/10 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Çıkış Yap
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile hamburger button */}
            <button
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="md:hidden shrink-0 w-9 h-9 flex items-center justify-center rounded-sm hover:bg-white/10 transition-colors"
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
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile menu panel */}
      <div
        className={`fixed top-14 right-0 z-40 h-[calc(100dvh-3.5rem)] w-72 bg-[#2f3b4a] shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile search */}
          <div className="p-4 border-b border-white/10">
            <form onSubmit={handleSubmitSearch}>
              <div className="relative">
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600">
                  <Search className="w-4 h-4" />
                </span>
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Ara..."
                  className="w-full h-10 rounded-sm bg-white text-black pl-3 pr-9 text-sm outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-400"
                />
              </div>
            </form>
          </div>

          {/* Mobile nav links */}
          <nav className="flex-1 overflow-y-auto py-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center px-4 py-3 text-sm transition-colors ${
                  isActive(link.href)
                    ? "text-white bg-white/10 font-semibold"
                    : "text-white/80 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile auth section */}
          <div className="border-t border-white/10 p-4">
            {!loadingUser && !isLoggedIn && (
              <Link
                href="/login"
                className="flex items-center justify-center gap-2 w-full h-10 rounded-sm bg-white/10 text-sm text-white hover:bg-white/20 transition-colors"
              >
                <User className="w-4 h-4" />
                Giriş Yap
              </Link>
            )}

            {!loadingUser && isLoggedIn && user && (
              <div className="space-y-2">
                <div className="flex items-center gap-3 px-1 py-2">
                  <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-semibold shrink-0">
                    {userInitials || <User className="w-4 h-4" />}
                  </span>
                  <span className="text-sm truncate">
                    {user.name} {user.surname}
                  </span>
                </div>
                <Link
                  href="/admin/emlak"
                  className="flex items-center gap-2 w-full px-3 py-2.5 rounded-sm text-sm text-white hover:bg-white/10 transition-colors"
                >
                  <User className="w-4 h-4" />
                  Yönetim Paneli
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-3 py-2.5 rounded-sm text-sm text-red-300 hover:bg-white/10 transition-colors"
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
