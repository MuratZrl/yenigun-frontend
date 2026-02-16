// src/features/home/highlights/ui/CategorySidebar.client.tsx
"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

type Id = string;

type CategoryVm = {
  id: Id;
  name: string;
  count: number;
};

type Props = {
  selectedCategoryId?: string;
};

function slugifyTR(input: string) {
  return input
    .toLowerCase()
    .replace(/ç/g, "c")
    .replace(/ğ/g, "g")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ş/g, "s")
    .replace(/ü/g, "u")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export default function CategorySidebar({ selectedCategoryId }: Props) {
  const router = useRouter();

  const [categories, setCategories] = useState<CategoryVm[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const selectedId = useMemo(
    () => (selectedCategoryId ? String(selectedCategoryId).trim() : ""),
    [selectedCategoryId]
  );

  useEffect(() => {
    const ctrl = new AbortController();

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await api.get("/categories/tree", { signal: ctrl.signal } as any);

        // Axios wraps in .data, API wraps in {success, data: {tree: [...]}}
        const root = res?.data ?? res;
        const tree: any[] =
          root?.data?.tree ??
          root?.tree ??
          root?.data ??
          (Array.isArray(root) ? root : []);

        // tree is [ {uid:1, name:"Emlak", children:[...]} ]
        // If single root node, drill into its children (Konut, İş Yeri, Arsa, etc.)
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
          count: Array.isArray(c.children) ? c.children.length : 0,
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

  const goCategory = useCallback(
    (id: Id, name: string) => {
      router.push(`/ilanlar?type=${encodeURIComponent(name)}`);
    },
    [router]
  );

  const goAll = useCallback(() => {
    router.push("/ilanlar");
  }, [router]);

  const itemClass = useCallback(
    (active: boolean) =>
      cx(
        "block w-full text-left",
        "text-[13px] leading-6",
        "text-blue-700 hover:underline",
        active && "font-semibold"
      ),
    []
  );

  return (
    <aside className="w-full bg-white border border-gray-300 rounded-2xl overflow-hidden">
      <div className="px-3 py-2 border-b border-gray-200">
        <div className="text-[13px] font-semibold text-gray-900">Emlak</div>
      </div>

      {loading && (
        <div className="px-3 py-2 text-[12px] text-gray-500">Yükleniyor...</div>
      )}

      {!loading && error && (
        <div className="px-3 py-2 text-[12px] text-red-600">{error}</div>
      )}

      {!loading && !error && categories.length === 0 && (
        <div className="px-3 py-2 text-[12px] text-gray-500">Kategori bulunamadı.</div>
      )}

      {!loading && !error && categories.length > 0 && (
        <div className="px-3 py-2">
          <button type="button" onClick={goAll} className={itemClass(!selectedId)}>
            Tüm Kategoriler
          </button>

          {categories.map((c) => {
            const active = selectedId === c.id;

            return (
              <button
                key={c.id}
                type="button"
                onClick={() => goCategory(c.id, c.name)}
                className={itemClass(active)}
              >
                {c.name}{" "}
                <span className="text-gray-400 text-[11px]">({c.count})</span>
              </button>
            );
          })}
        </div>
      )}
    </aside>
  );
}