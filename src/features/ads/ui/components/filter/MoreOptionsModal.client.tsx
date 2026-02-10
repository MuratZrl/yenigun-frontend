"use client";

import React, { useEffect, useMemo, useState } from "react";
import type { FilterState } from "@/types/advert";

type TabKey = "price" | "date" | "media" | "map";

type Props = {
  open: boolean;
  initialFilters: FilterState;
  onClose: () => void;

  // "Ara" basılınca parent'a gönder
  onApply: (next: FilterState) => void;

  title?: string;
};

function cloneFilters<T>(obj: T): T {
  // Browser'da çoğu yerde var, yoksa JSON ile fallback.
  // FilterState çok karmaşık değilse bu yeterli.
  try {
    // @ts-ignore
    if (typeof structuredClone === "function") return structuredClone(obj);
  } catch {}
  return JSON.parse(JSON.stringify(obj));
}

function cls(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export default function MoreOptionsModal({
  open,
  initialFilters,
  onClose,
  onApply,
  title = "Tüm Seçenekler",
}: Props) {
  const tabs = useMemo(
    () =>
      [
        { key: "price" as const, label: "Fiyat" },
        { key: "date" as const, label: "İlan Tarihi" },
        { key: "media" as const, label: "Fotoğraf, Video" },
        { key: "map" as const, label: "Harita" },
      ] as const,
    [],
  );

  const [active, setActive] = useState<TabKey>("price");
  const [draft, setDraft] = useState<FilterState>(() => cloneFilters(initialFilters));

  // Modal açılınca draft'ı güncelle (Vazgeç mantığı için şart)
  useEffect(() => {
    if (!open) return;
    setDraft(cloneFilters(initialFilters));
    setActive("price");
  }, [open, initialFilters]);

  // ESC ile kapat, body scroll kapat
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  const currency: "TL" | "USD" | "EUR" | "GBP" =
    ((draft as any).priceCurrency ?? (draft as any).currency ?? "TL") as any;

  const setCurrency = (c: typeof currency) =>
    setDraft((p: any) => ({ ...p, priceCurrency: c, currency: c }));

  const setMin = (v: string) =>
    setDraft((p: any) => ({ ...p, minPrice: v.trim() ? Number(v) : null }));

  const setMax = (v: string) =>
    setDraft((p: any) => ({ ...p, maxPrice: v.trim() ? Number(v) : null }));

  const setPostedDays = (days: number | null) =>
    setDraft((p: any) => ({ ...p, postedWithinDays: days }));

  const setBool = (key: string, value: boolean) =>
    setDraft((p: any) => ({ ...p, [key]: value }));

  const onSearch = () => {
    onApply(draft);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[999]">
      {/* overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* window */}
      <div className="absolute left-1/2 top-1/2 w-[92vw] max-w-[980px] h-[72vh] -translate-x-1/2 -translate-y-1/2 bg-white border border-gray-300 shadow-xl">
        {/* header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <div className="text-[16px] font-semibold text-gray-900">{title}</div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-xl leading-none"
            aria-label="Kapat"
          >
            ×
          </button>
        </div>

        {/* body */}
        <div className="flex h-[calc(72vh-120px)]">
          {/* left nav */}
          <div className="w-[210px] border-r border-gray-200 p-4">
            <div className="space-y-2">
              {tabs.map((t) => {
                const selected = active === t.key;
                return (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => setActive(t.key)}
                    className={cls(
                      "relative w-full text-left text-[13px] px-3 py-2",
                      selected ? "bg-gray-100 font-semibold text-gray-900" : "text-blue-700 hover:underline",
                    )}
                  >
                    {selected && (
                      <span
                        className="absolute right-[-14px] top-1/2 -translate-y-1/2"
                        style={{
                          width: 0,
                          height: 0,
                          borderTop: "14px solid transparent",
                          borderBottom: "14px solid transparent",
                          borderLeft: "14px solid #f3f4f6", // gray-100
                        }}
                      />
                    )}
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* content */}
          <div className="flex-1 p-6">
            {active === "price" && (
              <div className="flex items-center gap-4">
                <div className="text-[14px] font-semibold text-gray-900 w-16">Fiyat</div>

                <input
                  type="number"
                  placeholder="Min"
                  value={(draft as any).minPrice ?? ""}
                  onChange={(e) => setMin(e.target.value)}
                  className="w-[110px] border border-gray-300 px-2 py-1 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-gray-500">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={(draft as any).maxPrice ?? ""}
                  onChange={(e) => setMax(e.target.value)}
                  className="w-[110px] border border-gray-300 px-2 py-1 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as any)}
                  className="w-[80px] border border-gray-300 px-2 py-1 text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="TL">TL</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
            )}

            {active === "date" && (
              <div className="space-y-2">
                {[
                  { label: "Son 24 saat", days: 1 },
                  { label: "Son 3 gün içinde", days: 3 },
                  { label: "Son 7 gün içinde", days: 7 },
                  { label: "Son 15 gün içinde", days: 15 },
                  { label: "Son 30 gün içinde", days: 30 },
                ].map((o) => {
                  const checked = Number((draft as any).postedWithinDays) === o.days;
                  return (
                    <label key={o.days} className="flex items-center gap-2 text-[13px] text-blue-700 cursor-pointer">
                      <input
                        type="radio"
                        name="postedWithinDays"
                        className="h-4 w-4 accent-blue-600"
                        checked={checked}
                        onChange={() => setPostedDays(o.days)}
                      />
                      <span className="hover:underline">{o.label}</span>
                    </label>
                  );
                })}
              </div>
            )}

            {active === "media" && (
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[13px] text-blue-700 cursor-pointer">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-blue-600"
                    checked={Boolean((draft as any).hasVideo)}
                    onChange={(e) => setBool("hasVideo", e.target.checked)}
                  />
                  <span className="hover:underline">Videolu ilanlar</span>
                </label>

                <label className="flex items-center gap-2 text-[13px] text-blue-700 cursor-pointer">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-blue-600"
                    checked={Boolean((draft as any).hasClip)}
                    onChange={(e) => setBool("hasClip", e.target.checked)}
                  />
                  <span className="hover:underline">Klipli ilanlar</span>
                </label>

                <label className="flex items-center gap-2 text-[13px] text-blue-700 cursor-pointer">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-blue-600"
                    checked={Boolean((draft as any).hasVirtualTour)}
                    onChange={(e) => setBool("hasVirtualTour", e.target.checked)}
                  />
                  <span className="hover:underline">Sanal Tur’a sahip ilanlar</span>
                </label>
              </div>
            )}

            {active === "map" && (
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[13px] text-blue-700 cursor-pointer">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-blue-600"
                    checked={Boolean((draft as any).hasMap)}
                    onChange={(e) => setBool("hasMap", e.target.checked)}
                  />
                  <span className="hover:underline">Haritalı ilanlar</span>
                </label>
              </div>
            )}
          </div>
        </div>

        {/* footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
          <div className="text-[12px] text-gray-500">
            * Seçtiğiniz kriterler <span className="text-orange-500 font-semibold">turuncu</span> renkte gösterilmiştir
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="text-blue-700 hover:underline text-[14px]"
            >
              Vazgeç
            </button>
            <button
              type="button"
              onClick={onSearch}
              className="px-5 py-2 bg-blue-700 text-white text-[14px] font-semibold border border-blue-800 hover:bg-blue-800"
              style={{ borderRadius: 2 }}
            >
              Ara
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
