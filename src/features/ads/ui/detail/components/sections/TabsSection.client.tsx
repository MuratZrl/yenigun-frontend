// src/features/ads/ui/detail/components/sections/TabsSection.client.tsx
"use client";

import React, { useMemo, useState } from "react";
import type { AdvertData } from "@/types/advert";

import DetailsPanel from "./panels/DetailsPanel.client";
import LocationPanel from "./panels/LocationPanel.client";

type TabKey = "details" | "location";

type TabItem = {
  key: TabKey;
  label: string;
};

type Props = {
  data: AdvertData;
  className?: string;

  initialTab?: TabKey;

  detailsTitle?: string;
  locationTitle?: string;

  detailsEmptyText?: string;
};

function cls(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export default function TabsSection({
  data,
  className,

  initialTab = "details",
  detailsTitle = "İlan Detayları",
  locationTitle = "Konumu ve Sokak Görünümü",

  detailsEmptyText = "Detay bilgisi bulunamadı",
}: Props) {
  const [active, setActive] = useState<TabKey>(initialTab);

  const tabs = useMemo<TabItem[]>(
    () => [
      { key: "details", label: detailsTitle },
      { key: "location", label: locationTitle },
    ],
    [detailsTitle, locationTitle],
  );

  // Screenshot'a yakın tab stili
  const underline = "border-b-2 border-[#f2c200]";
  const activeTab = "bg-[#ffd200] text-black";
  const inactiveTab = "bg-white text-blue-700 hover:bg-gray-50";

  const commonTab =
    "h-10 px-6 inline-flex items-center justify-center text-[13px] font-semibold " +
    "border border-gray-300 border-b-0 rounded-t relative -mb-[2px]";

  return (
    <section className={cls("w-full", className)}>
      {/* DESKTOP */}
      <div className="hidden lg:block">
        <div className="flex items-end gap-2">
          {tabs.map((t) => {
            const isActive = active === t.key;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setActive(t.key)}
                className={cls(commonTab, isActive ? activeTab : inactiveTab)}
                aria-selected={isActive}
                aria-controls={`tab-panel-${t.key}`}
              >
                {t.label}
              </button>
            );
          })}

          <div className={cls("flex-1", underline)} />
        </div>

        <div className={cls("border border-gray-300 border-t-0", "bg-white")}>
          <div id={`tab-panel-${active}`} className="p-3">
            {active === "details" && (
              <DetailsPanel data={data} emptyText={detailsEmptyText} />
            )}
            {active === "location" && <LocationPanel data={data} />}
          </div>
        </div>
      </div>

      {/* MOBILE */}
      <div className="block lg:hidden bg-white border border-gray-200">
        <div className="flex">
          {tabs.map((t) => {
            const isActive = active === t.key;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setActive(t.key)}
                className={cls(
                  "flex-1 h-11 inline-flex items-center justify-center",
                  "text-[13px] font-semibold border-b border-gray-200",
                  isActive ? "bg-[#ffd200] text-black" : "bg-white text-blue-700",
                )}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        <div className="p-3">
          {active === "details" && (
            <DetailsPanel data={data} emptyText={detailsEmptyText} />
          )}
          {active === "location" && <LocationPanel data={data} />}
        </div>
      </div>
    </section>
  );
}
