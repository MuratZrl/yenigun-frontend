// src/features/ads/ui/components/CustomPagination.client.tsx
"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  totalPages: number;
  currentPage: number;
  onChange: (page: number) => void;

  /** Opsiyonel: üstte “Toplam X sayfa içerisinde...” yazısı */
  showSummary?: boolean;

  /** Opsiyonel: sayfa başı sonuç seçimi (20/50) */
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];

  className?: string;

  /** Görseldeki gibi 1..10 göster, sonra hızlı atlama 20/30/40/50 */
  firstBlockCount?: number;
  quickJumpPages?: number[];
};

type Item =
  | { type: "page"; value: number }
  | { type: "ellipsis"; key: string };

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function buildItems({
  totalPages,
  currentPage,
  firstBlockCount,
  quickJumpPages,
}: {
  totalPages: number;
  currentPage: number;
  firstBlockCount: number;
  quickJumpPages: number[];
}): Item[] {
  const items: Item[] = [];
  const addPage = (p: number) => {
    if (p < 1 || p > totalPages) return;
    if (items.some((x) => x.type === "page" && x.value === p)) return;
    items.push({ type: "page", value: p });
  };

  const baseEnd = Math.min(firstBlockCount, totalPages);
  for (let p = 1; p <= baseEnd; p++) addPage(p);

  if (totalPages <= baseEnd) return items;

  // current 10’dan büyükse, araya bir “pencere” koy
  if (currentPage > baseEnd + 1) {
    items.push({ type: "ellipsis", key: "e1" });

    const start = clamp(currentPage - 2, baseEnd + 1, totalPages);
    const end = clamp(currentPage + 2, baseEnd + 1, totalPages);

    for (let p = start; p <= end; p++) addPage(p);
  }

  // Hızlı atlamalar (20/30/40/50)
  const jumps = quickJumpPages
    .filter((p) => p > baseEnd && p <= totalPages)
    .sort((a, b) => a - b);

  if (jumps.length > 0) {
    // Eğer son eklenen page ile ilk jump arasında boşluk varsa ellipsis
    const lastPage = [...items].reverse().find((x) => x.type === "page") as { type: "page"; value: number } | undefined;
    if (lastPage && jumps[0] > lastPage.value + 1) {
      items.push({ type: "ellipsis", key: "e2" });
    }
    jumps.forEach(addPage);
  }

  // En son sayfayı da koy
  if (!items.some((x) => x.type === "page" && x.value === totalPages)) {
    const lastPage = [...items].reverse().find((x) => x.type === "page") as { type: "page"; value: number } | undefined;
    if (lastPage && totalPages > lastPage.value + 1) {
      items.push({ type: "ellipsis", key: "e3" });
    }
    addPage(totalPages);
  }

  return items;
}

export default function CustomPagination({
  totalPages,
  currentPage,
  onChange,

  showSummary = false,

  pageSize,
  onPageSizeChange,
  pageSizeOptions = [20, 50],

  className = "",

  firstBlockCount = 10,
  quickJumpPages = [20, 30, 40, 50],
}: Props) {
  if (!totalPages || totalPages <= 1) return null;

  const safeCurrent = clamp(currentPage || 1, 1, totalPages);

  const items = buildItems({
    totalPages,
    currentPage: safeCurrent,
    firstBlockCount,
    quickJumpPages,
  });

  return (
    <div className={["w-full", className].join(" ")}>
      {showSummary ? (
        <div className="text-center text-[13px] text-gray-700">
          Toplam <span className="font-medium">{totalPages.toLocaleString("tr-TR")}</span> sayfa içerisinde{" "}
          <span className="font-medium">{safeCurrent.toLocaleString("tr-TR")}</span>. sayfayı görmektesiniz.
        </div>
      ) : null}

      <div className="mt-3 flex items-center justify-center gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => onChange(clamp(safeCurrent - 1, 1, totalPages))}
          disabled={safeCurrent === 1}
          className={[
            "inline-flex items-center justify-center h-9 px-3 rounded-sm border text-[13px]",
            safeCurrent === 1
              ? "border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50"
              : "border-gray-300 text-gray-700 hover:bg-gray-50",
          ].join(" ")}
        >
          <ChevronLeft size={16} />
          <span className="hidden sm:inline ml-1">Önceki</span>
        </button>

        {items.map((it) => {
          if (it.type === "ellipsis") {
            return (
              <span key={it.key} className="h-9 px-2 inline-flex items-center text-gray-500 select-none">
                …
              </span>
            );
          }

          const active = it.value === safeCurrent;

          return (
            <button
              key={it.value}
              type="button"
              onClick={() => onChange(it.value)}
              className={[
                "inline-flex items-center justify-center h-9 min-w-[36px] px-2 rounded-sm border text-[13px]",
                active
                  ? "bg-gray-600 text-white border-gray-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50",
              ].join(" ")}
            >
              {it.value}
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => onChange(clamp(safeCurrent + 1, 1, totalPages))}
          disabled={safeCurrent === totalPages}
          className={[
            "inline-flex items-center justify-center h-9 px-3 rounded-sm border text-[13px]",
            safeCurrent === totalPages
              ? "border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50"
              : "border-gray-300 text-gray-700 hover:bg-gray-50",
          ].join(" ")}
        >
          <span className="hidden sm:inline mr-1">Sonraki</span>
          <ChevronRight size={16} />
        </button>
      </div>

      {typeof pageSize === "number" && typeof onPageSizeChange === "function" ? (
        <div className="mt-4 flex items-center justify-center gap-2 text-[13px] text-gray-700">
          <span>Her sayfada</span>

          {pageSizeOptions.map((opt) => {
            const active = opt === pageSize;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => onPageSizeChange(opt)}
                className={[
                  "min-w-[52px] px-3 py-2 border rounded-sm",
                  active
                    ? "bg-gray-600 text-white border-gray-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50",
                ].join(" ")}
              >
                {opt}
              </button>
            );
          })}

          <span>sonuç göster</span>
        </div>
      ) : null}
    </div>
  );
}
