// src/app/search/SearchClient.tsx
"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search as SearchIcon, Filter, MapPin } from "lucide-react";

type Initial = {
  type: string;
  propertyType: string;
  city: string;
  district: string;
  neighborhood: string;
  minPrice: string;
  maxPrice: string;
  currency: string;
  rooms: string; // "1+1,2+1"
  showMore: boolean;
};

const BG =
  "url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=2000&q=80')";

const ROOM_OPTIONS = ["1+0", "1+1", "2+1", "3+1", "4+1", "5+1", "Stüdyo"] as const;

export default function SearchClient({ initial }: { initial: Initial }) {
  const router = useRouter();

  const [activeType, setActiveType] = useState(initial.type || "satilik");
  const [showMoreOptions, setShowMoreOptions] = useState(Boolean(initial.showMore));

  const [propertyType, setPropertyType] = useState(initial.propertyType);
  const [city, setCity] = useState(initial.city);
  const [district, setDistrict] = useState(initial.district);
  const [neighborhood, setNeighborhood] = useState(initial.neighborhood);

  const [minPrice, setMinPrice] = useState(initial.minPrice);
  const [maxPrice, setMaxPrice] = useState(initial.maxPrice);
  const [currency, setCurrency] = useState(initial.currency || "tl");

  const initialRooms = useMemo(() => {
    const raw = (initial.rooms || "").trim();
    if (!raw) return new Set<string>();
    return new Set(raw.split(",").map((x) => x.trim()).filter(Boolean));
  }, [initial.rooms]);

  const [rooms, setRooms] = useState<Set<string>>(initialRooms);

  const buildQuery = () => {
    const params = new URLSearchParams();

    params.set("type", activeType);

    if (propertyType) params.set("propertyType", propertyType);
    if (city) params.set("city", city);
    if (district) params.set("district", district);
    if (neighborhood) params.set("neighborhood", neighborhood);

    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (currency) params.set("currency", currency);

    if (rooms.size > 0) params.set("rooms", Array.from(rooms).join(","));
    if (showMoreOptions) params.set("more", "1");

    return params;
  };

  const handleToggleRoom = (r: string) => {
    setRooms((prev) => {
      const next = new Set(prev);
      if (next.has(r)) next.delete(r);
      else next.add(r);
      return next;
    });
  };

  const handleSearch = () => {
    const qs = buildQuery().toString();
    router.push(qs ? `/ads?${qs}` : "/ads");
  };

  const handleMapSearch = () => {
    const qs = buildQuery().toString();
    router.push(qs ? `/Harita?${qs}` : "/Harita");
  };

  const popularTags = [
    "İstanbul Daire",
    "Ankara Satılık",
    "İzmir Villa",
    "Bursa Müstakil",
    "Deniz Manzaralı",
    "Merkezi Konut",
  ];

  return (
    <div
      className="relative w-full min-h-[400px] mb-8 rounded-xl overflow-hidden"
      style={{
        backgroundImage: BG,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />

      <div className="relative z-10 w-full pt-16">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Hayalindeki Evi Bul</h1>
          <p className="text-gray-200 text-lg">
            İlanlar arasından size en uygun konutu keşfedin
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-2xl p-6">
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 border-b pb-4">
              {[
                { k: "satilik", t: "Satılık" },
                { k: "kiralik", t: "Kiralık" },
                { k: "gunluk", t: "Günlük Kiralık" },
                { k: "projeler", t: "Projeler" },
              ].map((x) => (
                <button
                  key={x.k}
                  type="button"
                  className={`px-5 py-2 rounded-lg font-medium transition-all ${
                    activeType === x.k
                      ? "bg-orange-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => setActiveType(x.k)}
                >
                  {x.t}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Konut Tipi
                </label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm"
                >
                  <option value="">Tümü</option>
                  <option value="apartment">Daire</option>
                  <option value="villa">Villa</option>
                  <option value="house">Müstakil Ev</option>
                  <option value="land">Arsa</option>
                  <option value="residence">Rezidans</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">İl</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm"
                >
                  <option value="">Tüm İller</option>
                  <option value="istanbul">İstanbul</option>
                  <option value="ankara">Ankara</option>
                  <option value="izmir">İzmir</option>
                  <option value="bursa">Bursa</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">İlçe</label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm"
                >
                  <option value="">Tüm İlçeler</option>
                  <option value="kadikoy">Kadıköy</option>
                  <option value="besiktas">Beşiktaş</option>
                  <option value="sisli">Şişli</option>
                  <option value="uskudar">Üsküdar</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mahalle</label>
                <select
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm"
                >
                  <option value="">Tüm Mahalleler</option>
                  <option value="moda">Moda</option>
                  <option value="feneryolu">Feneryolu</option>
                  <option value="goztepe">Göztepe</option>
                  <option value="caddebostan">Caddebostan</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fiyat</label>
                <div className="flex gap-2">
                  <input
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="Min"
                    inputMode="numeric"
                    className="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm"
                  />
                  <input
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="Max"
                    inputMode="numeric"
                    className="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm"
                  />
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-24 px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm"
                  >
                    <option value="tl">TL</option>
                    <option value="usd">USD</option>
                    <option value="eur">EUR</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Oda Sayısı</label>
                <div className="flex flex-wrap gap-1">
                  {ROOM_OPTIONS.map((room) => {
                    const selected = rooms.has(room);
                    return (
                      <button
                        key={room}
                        type="button"
                        onClick={() => handleToggleRoom(room)}
                        aria-pressed={selected}
                        className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                          selected
                            ? "bg-orange-500 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {room}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="md:col-span-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleSearch}
                  className="flex-1 px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
                >
                  <SearchIcon size={18} />
                  Ara
                </button>

                <button
                  type="button"
                  onClick={handleMapSearch}
                  className="flex-1 px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                >
                  <MapPin size={18} />
                  Haritada Ara
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t">
            <button
              type="button"
              onClick={() => setShowMoreOptions((v) => !v)}
              className="text-orange-500 hover:text-orange-700 font-medium flex items-center gap-2 text-sm"
            >
              <Filter size={14} />
              Daha fazla seçenek {showMoreOptions ? "gizle" : "göster"}
              <svg
                className={`w-3 h-3 transform transition-transform ${
                  showMoreOptions ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showMoreOptions && (
              <div className="mt-3 p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Bina Yaşı</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                      <option value="">Tümü</option>
                      <option value="0-5">0-5 Yıl</option>
                      <option value="5-10">5-10 Yıl</option>
                      <option value="10+">10+ Yıl</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Kat Sayısı</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                      <option value="">Tümü</option>
                      <option value="1">1</option>
                      <option value="2-4">2-4</option>
                      <option value="5+">5+</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Isınma Tipi</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                      <option value="">Tümü</option>
                      <option value="dogalgaz">Doğalgaz</option>
                      <option value="kombi">Kombi</option>
                      <option value="merkezi">Merkezi</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Banyo Sayısı</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                      <option value="">Tümü</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3+">3+</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6">
          <p className="text-white text-sm mb-2">Popüler Aramalar:</p>
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => router.push(`/ads?q=${encodeURIComponent(tag)}`)}
                className="px-3 py-1.5 bg-white/10 text-white text-sm rounded-full hover:bg-white/20 transition-colors backdrop-blur-sm"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
