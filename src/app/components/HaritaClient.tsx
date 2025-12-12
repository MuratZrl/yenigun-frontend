"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Filter,
  Search,
  MapPin,
  X,
  Home,
  Layers,
  ExternalLink,
} from "lucide-react";
import Navbar from "./Navbar";

const CDN_MARKER_ICON = "https://unpkg.com/leaflet@1.9.4/dist/images/";

interface Advert {
  uid: number;
  title: string;
  fee: string;
  address: {
    full_address: string;
    province: string;
    district: string;
    quarter: string;
    mapCoordinates?: {
      lat: number;
      lng: number;
    };
  };
  thoughts?: string;
  details: any;
  photos: string[];
  created?: {
    createdTimestamp: number;
  };
  advisor?: {
    name: string;
    surname: string;
    gsmNumber?: string;
    mail?: string;
  };
  isNew?: boolean;
  steps?: {
    first: string;
    second: string;
    third: string;
  };
}

const SAKARYA_CENTER: [number, number] = [40.7569, 30.3783];
const DEFAULT_ZOOM = 11;

export default function HaritaClient() {
  const router = useRouter();
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const leafletRef = useRef<any>(null);

  const [adverts, setAdverts] = useState<Advert[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAdvert, setSelectedAdvert] = useState<Advert | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    category: [] as string[],
    district: [] as string[],
  });
  const [showFilters, setShowFilters] = useState(false);
  const [showAdvertDetails, setShowAdvertDetails] = useState(false);
  const [mapInitialized, setMapInitialized] = useState(false);

  useEffect(() => {
    const savedAdverts = localStorage.getItem("haritaAdverts");
    if (savedAdverts) {
      try {
        const parsedAdverts = JSON.parse(savedAdverts);
        console.log(
          "📍 LocalStorage'dan yüklenen ilanlar:",
          parsedAdverts.length
        );
        setAdverts(parsedAdverts);
      } catch (error) {
        console.error("LocalStorage veri parse hatası:", error);
      }
    } else {
      console.warn("⚠️ LocalStorage'da 'haritaAdverts' verisi bulunamadı!");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!containerRef.current || mapRef.current || loading) return;

    const initMap = async () => {
      const L = await import("leaflet");
      leafletRef.current = L;

      // Marker icon fix
      // @ts-ignore
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: `${CDN_MARKER_ICON}marker-icon-2x.png`,
        iconUrl: `${CDN_MARKER_ICON}marker-icon.png`,
        shadowUrl: `${CDN_MARKER_ICON}marker-shadow.png`,
      });

      mapRef.current = L.map(containerRef.current!, {
        center: SAKARYA_CENTER,
        zoom: DEFAULT_ZOOM,
        zoomControl: true,
        scrollWheelZoom: true,
        dragging: true,
        doubleClickZoom: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(mapRef.current);

      console.log("🗺️ Harita başarıyla başlatıldı");
      setMapInitialized(true);
    };

    initMap();

    return () => {
      if (mapRef.current) {
        console.log("🗺️ Harita temizleniyor...");
        mapRef.current.remove();
        mapRef.current = null;
        setMapInitialized(false);
      }
    };
  }, [loading]);

  useEffect(() => {
    if (!mapRef.current || !mapInitialized || loading || adverts.length === 0) {
      console.log("⏳ Marker ekleme için bekleniyor:", {
        mapRef: !!mapRef.current,
        mapInitialized,
        loading,
        advertsLength: adverts.length,
      });
      return;
    }

    console.log("📍 Marker'lar ekleniyor...", adverts.length);

    markersRef.current.forEach((marker) => {
      mapRef.current?.removeLayer(marker);
    });
    markersRef.current = [];

    const filteredAdverts = adverts.filter((advert) => {
      if (
        !searchQuery &&
        filters.category.length === 0 &&
        filters.district.length === 0
      ) {
        return true;
      }

      const matchesSearch =
        !searchQuery ||
        advert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        advert.address.full_address
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        advert.address.district
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      const matchesCategory =
        filters.category.length === 0 ||
        (advert.steps?.first && filters.category.includes(advert.steps.first));

      const matchesDistrict =
        filters.district.length === 0 ||
        filters.district.includes(advert.address.district);

      return matchesSearch && matchesCategory && matchesDistrict;
    });

    console.log("✅ Gösterilecek ilan sayısı:", filteredAdverts.length);

    filteredAdverts.forEach((advert) => {
      const lat =
        advert.address?.mapCoordinates?.lat ||
        SAKARYA_CENTER[0] + (Math.random() - 0.5) * 0.1;
      const lng =
        advert.address?.mapCoordinates?.lng ||
        SAKARYA_CENTER[1] + (Math.random() - 0.5) * 0.1;

      console.log(`📍 İlan ${advert.uid}:`, { lat, lng });

      const getMarkerColor = (category?: string) => {
        if (!category) return "#8b5cf6";
        switch (category.toLowerCase()) {
          case "arsa":
            return "#22c55e";
          case "konut":
            return "#3b82f6";
          case "işyeri":
            return "#f59e0b";
          case "villa":
            return "#ef4444";
          case "tarla":
            return "#10b981";
          case "apartman":
            return "#8b5cf6";
          case "daire":
            return "#06b6d4";
          default:
            return "#8b5cf6";
        }
      };
      const customIcon = leafletRef.current.divIcon({
        html: `
          <div class="custom-marker" style="background-color: ${getMarkerColor(
            advert.steps?.first
          )}; border: 2px solid white; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); width: 40px; height: 40px; position: relative; box-shadow: 0 2px 5px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; cursor: pointer;">
            <div style="transform: rotate(45deg); color: white; font-size: 12px; font-weight: bold; text-align: center;">
              ${advert.fee.replace(" TL", "").substring(0, 3)}K
            </div>
          </div>
        `,
        className: "custom-div-icon",
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40],
      });

      const marker = leafletRef.current.marker([lat, lng], {
        icon: customIcon,
        title: advert.title,
      });

      const popupContent = `
        <div style="padding: 12px; min-width: 250px;">
          <div style="margin-bottom: 8px;">
            <h3 style="font-size: 14px; font-weight: bold; margin-bottom: 4px; line-height: 1.2;">${
              advert.title
            }</h3>
            <span style="font-size: 16px; font-weight: bold; color: #16a34a;">${
              advert.fee
            }</span>
          </div>
          <div style="font-size: 12px; color: #666;">
            <p><strong>Konum:</strong> ${advert.address.district}, ${
        advert.address.quarter
      }</p>
            <p><strong>Kategori:</strong> ${
              advert.steps?.first || "Belirtilmemiş"
            }</p>
            <a href="/ilan/${
              advert.uid
            }" target="_blank" style="display: inline-block; margin-top: 8px; color: #3b82f6; text-decoration: none; font-weight: 500;">İlanı Gör →</a>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on("click", () => {
        setSelectedAdvert(advert);
        setShowAdvertDetails(true);
      });

      marker.addTo(mapRef.current!);
      markersRef.current.push(marker);
    });

    if (filteredAdverts.length > 0) {
      const bounds = leafletRef.current.latLngBounds(
        filteredAdverts
          .filter(
            (advert) =>
              advert.address?.mapCoordinates?.lat &&
              advert.address?.mapCoordinates?.lng
          )
          .map((advert) => [
            advert.address.mapCoordinates!.lat,
            advert.address.mapCoordinates!.lng,
          ])
      );

      if (bounds.isValid()) {
        mapRef.current?.fitBounds(bounds, { padding: [50, 50] });
      } else {
        mapRef.current?.setView(SAKARYA_CENTER, DEFAULT_ZOOM);
      }
    } else {
      mapRef.current?.setView(SAKARYA_CENTER, DEFAULT_ZOOM);
    }
  }, [adverts, mapInitialized, searchQuery, filters, loading]);

  const categories = Array.from(
    new Set(adverts.map((advert) => advert.steps?.first).filter(Boolean))
  ) as string[];

  const districts = Array.from(
    new Set(adverts.map((advert) => advert.address.district).filter(Boolean))
  ) as string[];

  const filteredCount = adverts.filter((advert) => {
    if (
      !searchQuery &&
      filters.category.length === 0 &&
      filters.district.length === 0
    ) {
      return true;
    }
    const matchesSearch =
      !searchQuery ||
      advert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      advert.address.full_address
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      advert.address.district.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      filters.category.length === 0 ||
      (advert.steps?.first && filters.category.includes(advert.steps.first));
    const matchesDistrict =
      filters.district.length === 0 ||
      filters.district.includes(advert.address.district);
    return matchesSearch && matchesCategory && matchesDistrict;
  }).length;

  const handleCategoryToggle = (category: string) => {
    setFilters((prev) => ({
      ...prev,
      category: prev.category.includes(category)
        ? prev.category.filter((c) => c !== category)
        : [...prev.category, category],
    }));
  };

  const handleDistrictToggle = (district: string) => {
    setFilters((prev) => ({
      ...prev,
      district: prev.district.includes(district)
        ? prev.district.filter((d) => d !== district)
        : [...prev.district, district],
    }));
  };

  const resetFilters = () => {
    setFilters({
      category: [],
      district: [],
    });
    setSearchQuery("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">İlanlar yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (adverts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-4">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-yellow-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Haritada Gösterilecek İlan Yok
            </h2>
            <p className="text-gray-600 mb-6">
              Arama sayfasından "Haritada Göster" butonuna tıklayarak ilanları
              haritada görüntüleyebilirsiniz.
            </p>
            <button
              onClick={() => router.push("/")}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
            >
              <Home size={20} />
              Ana Sayfaya Dön
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {showFilters && (
            <div className="lg:w-1/4">
              <div className="bg-white rounded-xl shadow-sm border p-4 sticky top-24">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-lg">Filtreler</h2>
                  <button
                    onClick={resetFilters}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Temizle
                  </button>
                </div>

                {categories.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <Layers size={16} />
                      Kategoriler
                    </h3>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <label
                          key={category}
                          className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                        >
                          <input
                            type="checkbox"
                            checked={filters.category.includes(category)}
                            onChange={() => handleCategoryToggle(category)}
                            className="rounded text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-gray-700">{category}</span>
                          <span className="ml-auto text-sm text-gray-500">
                            {
                              adverts.filter((a) => a.steps?.first === category)
                                .length
                            }
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {districts.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <MapPin size={16} />
                      İlçeler
                    </h3>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {districts.map((district) => (
                        <label
                          key={district}
                          className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                        >
                          <input
                            type="checkbox"
                            checked={filters.district.includes(district)}
                            onChange={() => handleDistrictToggle(district)}
                            className="rounded text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-gray-700">{district}</span>
                          <span className="ml-auto text-sm text-gray-500">
                            {
                              adverts.filter(
                                (a) => a.address.district === district
                              ).length
                            }
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-6 border-t">
                  <h3 className="font-semibold text-gray-700 mb-3">
                    İstatistikler
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="text-xs text-blue-700">Toplam</div>
                      <div className="font-bold">{adverts.length}</div>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="text-xs text-green-700">Gösterilen</div>
                      <div className="font-bold">{filteredCount}</div>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <div className="text-xs text-purple-700">Kategori</div>
                      <div className="font-bold">{categories.length}</div>
                    </div>
                    <div className="bg-orange-50 p-3 rounded-lg">
                      <div className="text-xs text-orange-700">İlçe</div>
                      <div className="font-bold">{districts.length}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className={`${showFilters ? "lg:w-3/4" : "w-full"}`}>
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <div
                ref={containerRef}
                className="w-full h-[600px] leaflet-container"
                style={{ width: "100%", height: "600px", zIndex: 1 }}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
