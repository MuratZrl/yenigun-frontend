// src/app/components/layout/Navbar.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCookies } from "react-cookie";
import { Search, ChevronDown, LogOut, User } from "lucide-react";
import api from "@/lib/api";
import type { User as UserType } from "@/types/user";

const Navbar: React.FC = () => {
  const router = useRouter();

  const [cookies, , removeCookie] = useCookies(["token"]);
  const [user, setUser] = useState<UserType | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const [q, setQ] = useState("");
  const [openUserMenu, setOpenUserMenu] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const isLoggedIn = Boolean(cookies.token && user);

  useEffect(() => {
    let alive = true;

    const fetchMe = async () => {
      setLoadingUser(true);
      try {
        if (!cookies.token) {
          if (alive) setUser(null);
          return;
        }
        const res = await api.get("/user/auth");
        const u = res?.data?.data?.user ?? null;
        if (alive) setUser(u);
      } catch {
        removeCookie("token");
        if (alive) setUser(null);
      } finally {
        if (alive) setLoadingUser(false);
      }
    };

    fetchMe();
    return () => {
      alive = false;
    };
  }, [cookies.token, removeCookie]);

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

  const handleSubmitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = q.trim();
    if (!query) {
      router.push("/ilanlar");
      return;
    }
    router.push(`/ilanlar?q=${encodeURIComponent(query)}`);
  };

  const handleLogout = () => {
    removeCookie("token");
    setUser(null);
    setOpenUserMenu(false);
    router.push("/");
  };

  const userInitials = (() => {
    if (!user) return "";
    const a = (user.name || "").charAt(0);
    const b = (user.surname || "").charAt(0);
    return `${a}${b}`.toUpperCase();
  })();

  const navLinkClass =
    "hidden md:inline text-sm text-white/80 hover:text-white transition-colors";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#2f3b4a] text-white">
      <div className="mx-auto max-w-6xl px-4">
        <div className="h-14 flex items-center gap-3">
          {/* Sol: Logo */}
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

          {/* Orta: Search + Nav Links */}
          <div className="flex-1 flex items-center gap-4">
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

            <Link href="/ilanlar" className={navLinkClass}>
              İlanlar
            </Link>
            <Link href="/about" className={navLinkClass}>
              Hakkımızda
            </Link>
            <Link href="/contact" className={navLinkClass}>
              İletişim
            </Link>
          </div>

          {/* Sağ: Auth + Action */}
          <div className="shrink-0 flex items-center gap-3">
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
                      Hesabım
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
        </div>
      </div>
    </header>
  );
};

export default Navbar;