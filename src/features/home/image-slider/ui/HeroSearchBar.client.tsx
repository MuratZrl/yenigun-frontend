// src/features/home/image-slider/ui/HeroSearchBar.client.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, MapPin, ChevronDown, Home, Briefcase, LandPlot, Building2, ChevronRight } from "lucide-react";

const categories = [
  { key: "konut", label: "Konut", icon: Home },
  { key: "isyeri", label: "İş Yeri", icon: Briefcase },
  { key: "arsa", label: "Arsa", icon: LandPlot },
  { key: "bina", label: "Bina", icon: Building2 },
] as const;

const cities = [
  { value: "", label: "İl Seçin" },
  { value: "istanbul", label: "İstanbul" },
  { value: "ankara", label: "Ankara" },
  { value: "izmir", label: "İzmir" },
  { value: "sakarya", label: "Sakarya" },
  { value: "bursa", label: "Bursa" },
];

const districts = [
  { value: "", label: "İlçe Seçin" },
  { value: "kadikoy", label: "Kadıköy" },
  { value: "besiktas", label: "Beşiktaş" },
  { value: "sisli", label: "Şişli" },
  { value: "uskudar", label: "Üsküdar" },
];

const roomOptions = ["1+0", "1+1", "2+1", "3+1", "4+1", "5+1"] as const;

const popularCities = [
  { value: "Sakarya", label: "Sakarya" },
  { value: "İstanbul", label: "İstanbul" },
  { value: "Ankara", label: "Ankara" },
  { value: "İzmir", label: "İzmir" },
  { value: "Bursa", label: "Bursa" },
];

export default function HeroSearchBar() {
  const router = useRouter();

  const [activeCategory, setActiveCategory] = useState("konut");
  const [listingType, setListingType] = useState("");
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [rooms, setRooms] = useState("");

  const buildParams = () => {
    const params = new URLSearchParams();
    params.set("category", activeCategory);
    if (listingType) params.set("type", listingType);
    if (query.trim()) params.set("q", query.trim());
    if (city) params.set("location", city);
    if (district) params.set("district", district);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (rooms) params.set("rooms", rooms);
    return params.toString();
  };

  const handleSearch = () => {
    const qs = buildParams();
    router.push(qs ? `/ilanlar?${qs}` : "/ilanlar");
  };

  const handleMapSearch = () => {
    const selectedCity = city || "sakarya";
    router.push(`/haritada-emlak-arama/${activeCategory}/${selectedCity}`);
  };

  const selectCls =
    "w-full appearance-none bg-white border border-[hsl(219,25%,85%)] rounded-[var(--radius)] px-4 py-2.5 pr-9 text-sm text-[hsl(240,100%,20%)] focus:ring-2 focus:ring-[#035DBA]/25 focus:border-[#035DBA] outline-none transition-all cursor-pointer";

  const inputCls =
    "flex-1 min-w-0 bg-white border border-[hsl(219,25%,85%)] rounded-[var(--radius)] px-3 py-2.5 text-sm text-[hsl(240,100%,20%)] placeholder:text-gray-400 focus:ring-2 focus:ring-[#035DBA]/25 focus:border-[#035DBA] outline-none transition-all";

  return (
    <div className="w-full max-w-5xl mx-auto px-4 space-y-4">
      <div className="bg-white/95 backdrop-blur-lg rounded-[var(--radius)] shadow-2xl shadow-black/15 overflow-hidden border border-white/20">
        {/* Category Tabs */}
        <div className="flex">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.key;
            const Icon = cat.icon;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => { setActiveCategory(cat.key); if (cat.key !== "konut") setRooms(""); }}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-semibold transition-all duration-200 relative border-b-2 ${
                  isActive
                    ? "text-[#035DBA] bg-[#E9EEF7]/50 border-[#035DBA]"
                    : "text-gray-500 hover:text-[#03409F] hover:bg-gray-50/50 border-transparent"
                }`}
              >
                <Icon size={16} className={isActive ? "text-[#035DBA]" : "text-gray-400"} />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Filters */}
        <div className="p-4 space-y-3">
          {/* Search box with listing type select */}
          <div className="flex items-stretch gap-0 bg-[#E9EEF7]/40 border border-[hsl(219,25%,85%)] rounded-[var(--radius)] overflow-hidden focus-within:ring-2 focus-within:ring-[#035DBA]/25 focus-within:border-[#035DBA] focus-within:bg-white transition-all">
            <div className="relative flex-shrink-0 border-r border-[hsl(219,25%,85%)]">
              <select
                value={listingType}
                onChange={(e) => setListingType(e.target.value)}
                className="h-full appearance-none bg-white/80 px-4 pr-8 py-3 text-sm font-semibold text-[hsl(240,100%,20%)] outline-none cursor-pointer"
              >
                <option value="">Tümü</option>
                <option value="satilik">Satılık</option>
                <option value="kiralik">Kiralık</option>
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Adres, mahalle, ilan no veya anahtar kelime ile ara..."
                className="w-full h-full bg-transparent pl-10 pr-4 py-3 text-sm text-[hsl(240,100%,20%)] placeholder:text-gray-400 outline-none"
              />
            </div>
          </div>

          {/* Filter row */}
          <div className={`grid grid-cols-1 sm:grid-cols-2 ${activeCategory === "konut" ? "lg:grid-cols-4" : "lg:grid-cols-3"} gap-2.5`}>
            <div className="relative">
              <select value={city} onChange={(e) => { setCity(e.target.value); setDistrict(""); }} className={selectCls}>
                {cities.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            <div className="relative">
              <select value={district} onChange={(e) => setDistrict(e.target.value)} className={selectCls}>
                {districts.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            <div className="flex gap-1.5">
              <input value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="Min ₺" inputMode="numeric" className={inputCls} />
              <input value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="Max ₺" inputMode="numeric" className={inputCls} />
            </div>

            {activeCategory === "konut" && (
              <div className="relative">
                <select value={rooms} onChange={(e) => setRooms(e.target.value)} className={selectCls}>
                  <option value="">Oda Sayısı</option>
                  {roomOptions.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSearch}
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#035DBA] hover:bg-[#03409F] text-white text-sm font-bold rounded-[var(--radius)] shadow-lg shadow-[#035DBA]/20 transition-all duration-200"
            >
              <Search size={16} />
              İlan Ara
            </button>
            <button
              type="button"
              onClick={handleMapSearch}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[hsl(240,100%,20%)] hover:bg-[hsl(240,100%,16%)] text-white text-sm font-semibold rounded-[var(--radius)] transition-all duration-200"
            >
              <MapPin size={16} />
              Haritada Ara
            </button>
          </div>
        </div>
      </div>

      {/* Popüler Şehirler */}
      <div className="flex items-center justify-center gap-3 flex-wrap">
        <span className="text-white/70 text-xs font-medium tracking-wide uppercase">
          Popüler Şehirler:
        </span>
        {popularCities.map((c) => (
          <Link
            key={c.value}
            href={`/ilanlar?location=${encodeURIComponent(c.value)}`}
            className="px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-white text-xs font-medium hover:bg-white/25 transition-all duration-200"
          >
            {c.label}
          </Link>
        ))}
        <Link
          href="/ilanlar"
          className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-white/80 text-xs font-medium hover:bg-white/20 hover:text-white transition-all duration-200"
        >
          Tüm Şehirler
          <ChevronRight size={12} />
        </Link>
      </div>
    </div>
  );
}
