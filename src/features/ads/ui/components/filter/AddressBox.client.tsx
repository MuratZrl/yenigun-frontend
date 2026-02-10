// src/features/ads/ui/components/filter/AddressBox.client.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { FilterState } from "@/types/advert";

export interface CityData {
  province: string;
  districts: Array<{
    district: string;
    quarters: string[];
  }>;
}

type Props = {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;

  /**
   * Eğer data zaten parent'ta varsa direkt buraya ver.
   * Yoksa component endpoint'ten fetch etmeyi dener.
   */
  citiesData?: CityData[];

  /**
   * Backend endpoint. Vermezsen varsayılanı dener.
   * Varsayılan: `${NEXT_PUBLIC_BACKEND_API}/locations/cities`
   */
  endpoint?: string;

  className?: string;
};

function safeStr(v: any) {
  return typeof v === "string" ? v : "";
}

export default function AddressBox({
  filters,
  setFilters,
  citiesData,
  endpoint,
  className,
}: Props) {
  const [data, setData] = useState<CityData[]>(citiesData ?? []);
  const [loading, setLoading] = useState<boolean>(!citiesData);
  const [error, setError] = useState<string | null>(null);

  const selectedProvince = safeStr((filters as any).location || "Hepsi");
  const selectedDistrict = safeStr((filters as any).district || "Hepsi");
  const selectedQuarter = safeStr((filters as any).quarter || "Hepsi");

  useEffect(() => {
    if (citiesData && citiesData.length > 0) {
      setData(citiesData);
      setLoading(false);
      setError(null);
    }
  }, [citiesData]);

  useEffect(() => {
    if (citiesData && citiesData.length > 0) return;

    const base = process.env.NEXT_PUBLIC_BACKEND_API;
    const url = endpoint || (base ? `${base}/locations/cities` : null);

    if (!url) {
      setLoading(false);
      setError("Konum verisi için endpoint yok (NEXT_PUBLIC_BACKEND_API veya endpoint prop).");
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error(`Konum endpoint hata: ${res.status}`);
        const json = await res.json();

        // Backend ya direkt dizi döndürür, ya {data: [...]} döndürür diye toleranslı al.
        const list: CityData[] = Array.isArray(json) ? json : Array.isArray(json?.data) ? json.data : [];
        if (!Array.isArray(list)) throw new Error("Konum verisi formatı geçersiz.");

        if (!cancelled) setData(list);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Konum verisi alınamadı.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [endpoint, citiesData]);

  const provinceObj = useMemo(() => {
    if (!selectedProvince || selectedProvince === "Hepsi") return null;
    return data.find((c) => c.province === selectedProvince) ?? null;
  }, [data, selectedProvince]);

  const districtObj = useMemo(() => {
    if (!provinceObj) return null;
    if (!selectedDistrict || selectedDistrict === "Hepsi") return null;
    return provinceObj.districts.find((d) => d.district === selectedDistrict) ?? null;
  }, [provinceObj, selectedDistrict]);

  const districts = provinceObj?.districts ?? [];
  const quarters = districtObj?.quarters ?? [];

  const resetAll = () => {
    setFilters((prev) => ({
      ...prev,
      location: "Hepsi",
      district: "Hepsi",
      quarter: "Hepsi",
    } as any));
  };

  const onProvinceChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      location: value,
      district: "Hepsi",
      quarter: "Hepsi",
    } as any));
  };

  const onDistrictChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      district: value,
      quarter: "Hepsi",
    } as any));
  };

  const onQuarterChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      quarter: value,
    } as any));
  };

  return (
    <div className={className}>
      <div className="border border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 bg-white">
          <div className="text-[13px] font-semibold text-gray-900">Adres</div>
          <button
            type="button"
            onClick={resetAll}
            className="text-[13px] font-medium text-blue-700 hover:underline"
          >
            Türkiye
          </button>
        </div>

        <div className="p-3 space-y-2">
          <div className="relative">
            <select
              value={selectedProvince || "Hepsi"}
              onChange={(e) => onProvinceChange(e.target.value)}
              className="w-full appearance-none bg-white border border-gray-300 rounded-sm px-3 py-2 pr-9 text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              <option value="Hepsi">İl</option>
              {data.map((c) => (
                <option key={c.province} value={c.province}>
                  {c.province}
                </option>
              ))}
            </select>
            <ChevronDown size={18} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={selectedDistrict || "Hepsi"}
              onChange={(e) => onDistrictChange(e.target.value)}
              className="w-full appearance-none bg-white border border-gray-300 rounded-sm px-3 py-2 pr-9 text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
              disabled={loading || !provinceObj}
            >
              <option value="Hepsi">İlçe</option>
              {districts.map((d) => (
                <option key={d.district} value={d.district}>
                  {d.district}
                </option>
              ))}
            </select>
            <ChevronDown size={18} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={selectedQuarter || "Hepsi"}
              onChange={(e) => onQuarterChange(e.target.value)}
              className="w-full appearance-none bg-white border border-gray-300 rounded-sm px-3 py-2 pr-9 text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
              disabled={loading || !districtObj}
            >
              <option value="Hepsi">Semt / Mahalle</option>
              {quarters.map((q) => (
                <option key={q} value={q}>
                  {q}
                </option>
              ))}
            </select>
            <ChevronDown size={18} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>

          {error && (
            <div className="text-[12px] text-red-600 pt-1">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
