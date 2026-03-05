// src/features/home/highlights/ui/CategorySidebar.client.tsx
"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import api from "@/lib/api";

/* ── Types ── */

interface NavigateChild {
  uid: number;
  name: string;
  advertCount: number;
}

interface NavigateResponse {
  success: boolean;
  data: {
    path: { uid: number; name: string }[];
    children: NavigateChild[];
    totalAdverts: number;
  };
}

type Props = {
  selectedCategoryId?: string;
};

/* ── Component ── */

export default function CategorySidebar({ selectedCategoryId }: Props) {
  const router = useRouter();

  const [children, setChildren] = useState<NavigateChild[]>([]);
  const [totalAdverts, setTotalAdverts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const selectedId = useMemo(
    () => (selectedCategoryId ? String(selectedCategoryId).trim() : ""),
    [selectedCategoryId],
  );

  // Single fetch — categories + counts in one request
  useEffect(() => {
    const ctrl = new AbortController();

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await api.get<NavigateResponse>("/categories/navigate", {
          signal: ctrl.signal,
        });

        const data = res?.data?.data ?? res?.data;
        setChildren(Array.isArray(data?.children) ? data.children : []);
        setTotalAdverts(data?.totalAdverts ?? 0);
      } catch (e: unknown) {
        if (e instanceof Error && e.message?.toLowerCase().includes("canceled")) return;
        if ((e as { code?: string })?.code === "ERR_CANCELED") return;
        setChildren([]);
        setError("Kategoriler yüklenemedi.");
      } finally {
        setLoading(false);
      }
    })();

    return () => ctrl.abort();
  }, []);

  const goCategory = useCallback(
    (name: string) => {
      router.push(`/ilanlar?type=${encodeURIComponent(name)}`);
    },
    [router],
  );

  const goAll = useCallback(() => {
    router.push("/ilanlar");
  }, [router]);

  return (
    <aside className="w-full rounded-lg bg-white border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100">
        <button
          type="button"
          onClick={goAll}
          className="w-full flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:text-blue-900 hover:underline cursor-pointer"
        >
          <span>Tüm Kategoriler</span>
          <span className="text-xs text-gray-400 font-normal no-underline">
            ({totalAdverts.toLocaleString("tr-TR")})
          </span>
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center gap-2 px-4 py-8">
          <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
          <span className="text-xs text-gray-400">Yükleniyor...</span>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="px-4 py-4 text-xs text-red-500">{error}</div>
      )}

      {/* Empty */}
      {!loading && !error && children.length === 0 && (
        <div className="px-4 py-6 text-xs text-gray-400 text-center">
          Kategori bulunamadı.
        </div>
      )}

      {/* Category list */}
      {!loading && !error && children.length > 0 && (
        <div className="px-4 py-3 space-y-1">
          {children.map((c) => {
            const active = selectedId === String(c.uid);
            return (
              <button
                key={c.uid}
                type="button"
                onClick={() => goCategory(c.name)}
                className={`w-full flex items-center gap-1.5 pl-3 py-1 text-sm cursor-pointer transition-colors duration-150 group/cat ${
                  active
                    ? "text-blue-800 font-semibold"
                    : "text-blue-700 hover:text-blue-900 font-normal"
                }`}
              >
                <span className="truncate group-hover/cat:underline">{c.name}</span>
                <span className="shrink-0 text-xs text-gray-400">
                  ({c.advertCount.toLocaleString("tr-TR")})
                </span>
              </button>
            );
          })}
        </div>
      )}
    </aside>
  );
}
