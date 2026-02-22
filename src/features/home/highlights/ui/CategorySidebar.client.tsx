// src/features/home/highlights/ui/CategorySidebar.client.tsx
"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { AxiosError } from "axios";
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

interface RawTreeNode {
  uid?: number;
  _id?: string;
  name?: string;
  children?: RawTreeNode[];
}

interface TreeApiRoot {
  data?: { tree?: RawTreeNode[] } | RawTreeNode[];
  tree?: RawTreeNode[];
}

/** Fetch the total advert count for a given category name. */
async function fetchAdvertCount(categoryName: string): Promise<number> {
  try {
    const qs = new URLSearchParams({ category: categoryName }).toString();
    const res = await api.get<SearchResponse>(`/advert/search?${qs}`);
    const data: SearchResponse = res?.data ?? (res as unknown as SearchResponse);
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

  const totalCount = useMemo(() => {
    let sum = 0;
    for (const v of counts.values()) {
      if (v !== null) sum += v;
    }
    return sum;
  }, [counts]);

  // Fetch category tree
  useEffect(() => {
    const ctrl = new AbortController();

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await api.get("/categories/tree", { signal: ctrl.signal });

        const root: TreeApiRoot = res?.data ?? res;
        const rootData = root?.data;
        const tree: RawTreeNode[] =
          (!Array.isArray(rootData) ? rootData?.tree : undefined) ??
          root?.tree ??
          (Array.isArray(rootData) ? rootData : undefined) ??
          (Array.isArray(root) ? (root as RawTreeNode[]) : []);

        let items: RawTreeNode[] = tree;
        if (
          items.length === 1 &&
          Array.isArray(items[0]?.children) &&
          items[0].children.length > 0
        ) {
          items = items[0].children;
        }

        const mapped: CategoryVm[] = items.map((c) => ({
          id: String(c.uid ?? c._id ?? c.name),
          name: c.name ?? "",
        }));

        setCategories(mapped);
      } catch (e: unknown) {
        if (e instanceof AxiosError) {
          if (e.name === "CanceledError" || e.code === "ERR_CANCELED") return;
          if (e.message?.toLowerCase().includes("canceled")) return;

          setCategories([]);
          const msg =
            (e.response?.data as Record<string, unknown> | undefined)?.message;
          setError(typeof msg === "string" ? msg : e.message || "Kategoriler yüklenemedi.");
        } else if (e instanceof Error) {
          if (e.message?.toLowerCase().includes("canceled")) return;

          setCategories([]);
          setError(e.message || "Kategoriler yüklenemedi.");
        } else {
          setCategories([]);
          setError("Kategoriler yüklenemedi.");
        }
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
        <button
          type="button"
          onClick={goAll}
          className="w-full flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:text-blue-900 hover:underline cursor-pointer"
        >
          <span>Tüm Kategoriler</span>
          <span className="text-xs text-gray-400 font-normal no-underline">
            ({totalCount.toLocaleString("tr-TR")})
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
      {!loading && !error && categories.length === 0 && (
        <div className="px-4 py-6 text-xs text-gray-400 text-center">
          Kategori bulunamadı.
        </div>
      )}

      {/* Category list */}
      {!loading && !error && categories.length > 0 && (
        <div className="px-4 py-3 space-y-1">
          {categories.map((c) => {
            const active = selectedId === c.id;
            const count = counts.get(c.id) ?? null;

            return (
              <button
                key={c.id}
                type="button"
                onClick={() => goCategory(c.id, c.name)}
                className={`w-full flex items-center gap-1.5 pl-3 py-1 text-sm cursor-pointer transition-colors duration-150 group/cat ${
                  active
                    ? "text-blue-800 font-semibold"
                    : "text-blue-700 hover:text-blue-900 font-normal"
                }`}
              >
                <span className="truncate group-hover/cat:underline">{c.name}</span>
                {count === null ? (
                  <Loader2 size={10} className="shrink-0 animate-spin text-gray-300" />
                ) : (
                  <span className="shrink-0 text-xs text-gray-400">
                    ({count.toLocaleString("tr-TR")})
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
