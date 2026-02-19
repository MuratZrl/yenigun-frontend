// src/features/home/highlights/ui/CategorySidebar.client.tsx
"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import api from "@/lib/api";

type Id = string;

type CategoryVm = {
  id: Id;
  name: string;
};

type Props = {
  selectedCategoryId?: string;
};

interface SearchResponse {
  pagination?: { totalItems?: number };
}

/** Fetch the total advert count for a given category name. */
async function fetchAdvertCount(categoryName: string): Promise<number> {
  try {
    const qs = new URLSearchParams({ category: categoryName }).toString();
    const res = await api.get<SearchResponse>(`/advert/search?${qs}`);
    const data: SearchResponse = res?.data ?? (res as any);
    return data?.pagination?.totalItems ?? 0;
  } catch {
    return 0;
  }
}

export default function CategorySidebar({ selectedCategoryId }: Props) {
  const router = useRouter();

  const [categories, setCategories] = useState<CategoryVm[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Map of category id → advert count (null = still loading)
  const [counts, setCounts] = useState<Map<string, number | null>>(new Map());
  const countsAbort = useRef<AbortController | null>(null);

  const selectedId = useMemo(
    () => (selectedCategoryId ? String(selectedCategoryId).trim() : ""),
    [selectedCategoryId]
  );

  // Fetch category tree
  useEffect(() => {
    const ctrl = new AbortController();

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await api.get("/categories/tree", { signal: ctrl.signal } as any);

        const root = res?.data ?? res;
        const tree: any[] =
          root?.data?.tree ??
          root?.tree ??
          root?.data ??
          (Array.isArray(root) ? root : []);

        let items: any[] = tree;
        if (
          items.length === 1 &&
          Array.isArray(items[0]?.children) &&
          items[0].children.length > 0
        ) {
          items = items[0].children;
        }

        const mapped: CategoryVm[] = items.map((c: any) => ({
          id: String(c.uid ?? c._id ?? c.name),
          name: c.name,
        }));

        setCategories(mapped);
      } catch (e: any) {
        if (e?.name === "CanceledError" || e?.code === "ERR_CANCELED") return;
        if (e?.message?.toLowerCase?.().includes("canceled")) return;

        setCategories([]);
        setError(e?.response?.data?.message || e?.message || "Kategoriler yüklenemedi.");
      } finally {
        setLoading(false);
      }
    })();

    return () => {
      ctrl.abort();
    };
  }, []);

  // Fetch advert counts per category once categories are loaded
  useEffect(() => {
    if (!categories.length) return;

    if (countsAbort.current) countsAbort.current.abort();
    const ctrl = new AbortController();
    countsAbort.current = ctrl;

    // Init all counts as null (loading)
    setCounts(new Map(categories.map((c) => [c.id, null])));

    const fetchAll = async () => {
      const results = await Promise.allSettled(
        categories.map(async (cat) => {
          const count = await fetchAdvertCount(cat.name);
          return { id: cat.id, count };
        })
      );

      if (ctrl.signal.aborted) return;

      const next = new Map<string, number | null>();
      for (const r of results) {
        if (r.status === "fulfilled") {
          next.set(r.value.id, r.value.count);
        }
      }
      setCounts(next);
    };

    fetchAll();

    return () => {
      ctrl.abort();
    };
  }, [categories]);

  const goCategory = useCallback(
    (id: Id, name: string) => {
      router.push(`/ilanlar?type=${encodeURIComponent(name)}`);
    },
    [router]
  );

  const goAll = useCallback(() => {
    router.push("/ilanlar");
  }, [router]);

  return (
    <aside className="w-full rounded-lg bg-white border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100">
        <span className="text-sm font-semibold text-gray-900">Kategoriler</span>
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
      {!loading && !error && categories.length === 0 && (
        <div className="px-4 py-6 text-xs text-gray-400 text-center">
          Kategori bulunamadı.
        </div>
      )}

      {/* Category list */}
      {!loading && !error && categories.length > 0 && (
        <div className="p-1.5">
          {/* All categories button */}
          <button
            type="button"
            onClick={goAll}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors duration-150 ${
              !selectedId
                ? "bg-indigo-50 text-indigo-700 font-semibold"
                : "text-gray-700 hover:bg-gray-50 font-medium"
            }`}
          >
            <span>Tüm Kategoriler</span>
          </button>

          {/* Category items */}
          {categories.map((c) => {
            const active = selectedId === c.id;
            const count = counts.get(c.id) ?? null;

            return (
              <button
                key={c.id}
                type="button"
                onClick={() => goCategory(c.id, c.name)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors duration-150 ${
                  active
                    ? "bg-indigo-50 text-indigo-700 font-semibold"
                    : "text-gray-700 hover:bg-gray-50 font-medium"
                }`}
              >
                <span className="truncate">{c.name}</span>
                {count === null ? (
                  <Loader2 size={10} className="shrink-0 animate-spin text-gray-300" />
                ) : (
                  <span className="shrink-0 text-xs text-gray-400">
                    {count.toLocaleString("tr-TR")}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </aside>
  );
}
