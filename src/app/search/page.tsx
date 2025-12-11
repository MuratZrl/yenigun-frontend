"use client";
import { Search as SearchIcon, Filter, MapPin } from "lucide-react";
import { useState } from "react";

const SearchComponent = () => {
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [activeType, setActiveType] = useState("satilik");

  return (
    <div
      className="relative w-full min-h-[400px] mb-8 rounded-xl overflow-hidden"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Koyu overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50"></div>

      {/* İçerik */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        {/* Başlık */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Hayalindeki Evi Bul
          </h1>
          <p className="text-gray-200 text-lg">
            1.234.567 ilan arasından size en uygun konutu keşfedin
          </p>
        </div>

        {/* Ana Arama Kartı */}
        <div className="bg-white rounded-xl shadow-2xl p-6">
          {/* Konut Tipi Seçenekleri */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 border-b pb-4">
              <button
                className={`px-5 py-2 rounded-lg font-medium transition-all ${
                  activeType === "satilik"
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setActiveType("satilik")}
              >
                Satılık
              </button>
              <button
                className={`px-5 py-2 rounded-lg font-medium transition-all ${
                  activeType === "kiralik"
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setActiveType("kiralik")}
              >
                Kiralık
              </button>
              <button
                className={`px-5 py-2 rounded-lg font-medium transition-all ${
                  activeType === "gunluk"
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setActiveType("gunluk")}
              >
                Günlük Kiralık
              </button>
              <button
                className={`px-5 py-2 rounded-lg font-medium transition-all ${
                  activeType === "projeler"
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setActiveType("projeler")}
              >
                Projeler
              </button>
            </div>
          </div>

          {/* Ana Arama Grid'i */}
          <div className="space-y-4">
            {/* Üst Satır */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Konut Tipi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Konut Tipi
                </label>
                <select className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm">
                  <option value="">Tümü</option>
                  <option value="apartment">Daire</option>
                  <option value="villa">Villa</option>
                  <option value="house">Müstakil Ev</option>
                  <option value="land">Arsa</option>
                  <option value="residence">Rezidans</option>
                </select>
              </div>

              {/* İl */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  İl
                </label>
                <select className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm">
                  <option value="">Tüm İller</option>
                  <option value="istanbul">İstanbul</option>
                  <option value="ankara">Ankara</option>
                  <option value="izmir">İzmir</option>
                  <option value="bursa">Bursa</option>
                </select>
              </div>

              {/* İlçe */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  İlçe
                </label>
                <select className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm">
                  <option value="">Tüm İlçeler</option>
                  <option value="kadikoy">Kadıköy</option>
                  <option value="besiktas">Beşiktaş</option>
                  <option value="sisli">Şişli</option>
                  <option value="uskudar">Üsküdar</option>
                </select>
              </div>

              {/* Mahalle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mahalle
                </label>
                <select className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm">
                  <option value="">Tüm Mahalleler</option>
                  <option value="moda">Moda</option>
                  <option value="feneryolu">Feneryolu</option>
                  <option value="goztepe">Göztepe</option>
                  <option value="caddebostan">Caddebostan</option>
                </select>
              </div>
            </div>

            {/* Alt Satır */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {/* Fiyat */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fiyat
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Min"
                    className="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Max"
                    className="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm"
                  />
                  <select className="w-24 px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm">
                    <option value="tl">TL</option>
                    <option value="usd">USD</option>
                    <option value="eur">EUR</option>
                  </select>
                </div>
              </div>

              {/* Oda Sayısı */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Oda Sayısı
                </label>
                <div className="flex flex-wrap gap-1">
                  {["1+0", "1+1", "2+1", "3+1", "4+1", "5+1", "Stüdyo"].map(
                    (room) => (
                      <button
                        key={room}
                        className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                      >
                        {room}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Arama Butonları */}
              <div className="md:col-span-2 flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <button className="w-full px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center justify-center gap-2">
                    <SearchIcon size={18} />
                    Ara
                  </button>
                </div>
                <div className="flex-1">
                  <button className="w-full px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-2">
                    <MapPin size={18} />
                    Haritada Ara
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Daha Fazla Seçenek */}
          <div className="mt-4 pt-4 border-t">
            <button
              onClick={() => setShowMoreOptions(!showMoreOptions)}
              className="text-orange-500 hover:text-orange-700 font-medium flex items-center gap-2 text-sm"
            >
              <Filter size={14} />
              Daha fazla seçenek göster
              <svg
                className={`w-3 h-3 transform transition-transform ${
                  showMoreOptions ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {showMoreOptions && (
              <div className="mt-3 p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Bina Yaşı
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                      <option value="">Tümü</option>
                      <option value="0-5">0-5 Yıl</option>
                      <option value="5-10">5-10 Yıl</option>
                      <option value="10+">10+ Yıl</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Kat Sayısı
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                      <option value="">Tümü</option>
                      <option value="1">1</option>
                      <option value="2-4">2-4</option>
                      <option value="5+">5+</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Isınma Tipi
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                      <option value="">Tümü</option>
                      <option value="dogalgaz">Doğalgaz</option>
                      <option value="kombi">Kombi</option>
                      <option value="merkezi">Merkezi</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Banyo Sayısı
                    </label>
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

        {/* Popüler Arama Önerileri */}
        <div className="mt-6">
          <p className="text-white text-sm mb-2">Popüler Aramalar:</p>
          <div className="flex flex-wrap gap-2">
            {[
              "İstanbul Daire",
              "Ankara Satılık",
              "İzmir Villa",
              "Bursa Müstakil",
              "Deniz Manzaralı",
              "Merkezi Konut",
            ].map((tag) => (
              <button
                key={tag}
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
};

export default SearchComponent;
