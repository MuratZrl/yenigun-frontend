"use client";
import React, { useState, useEffect } from "react";
import { use } from "react";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import GoToTop from "@/app/components/GoToTop";
import JSONDATA from "../data.json";
import {
  Filter,
  Clock,
  Armchair,
  Layers,
  Square,
  RotateCcw,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  MapPin,
  DollarSign,
  Building,
  Navigation,
} from "lucide-react";
import api from "@/app/lib/api";
import { Advert, FilterState } from "@/app/types/advert";

const turkeyCities = JSONDATA.map((city: any) => {
  return {
    province: city.name,
    districts: city.towns.map((district: any) => {
      return {
        district: district.name,
        quarters: district.districts.reduce((acc: any, district: any) => {
          const quarterNames = district.quarters.map(
            (quarter: any) => quarter.name
          );
          return acc.concat(quarterNames);
        }, []),
      };
    }),
  };
});

const actionOptions = [
  { value: "Tümü", label: "Tümü" },
  { value: "Kiralık", label: "Kiralık" },
  { value: "Günlük Kiralık", label: "Günlük Kiralık" },
  { value: "Devren Kiralık", label: "Devren Kiralık" },
  { value: "Satılık", label: "Satılık" },
  { value: "Devren Satılık", label: "Devren Satılık" },
];

const typeOptions = [
  { value: "Hepsi", label: "Hepsi" },
  { value: "Arsa", label: "Arsa" },
  { value: "Daire", label: "Daire" },
  { value: "Residence", label: "Residence" },
  { value: "Müstakil Ev", label: "Müstakil Ev" },
  { value: "Villa", label: "Villa" },
  { value: "Çiftlik Evi", label: "Çiftlik Evi" },
  { value: "Köşk - Konak", label: "Köşk - Konak" },
  { value: "Yalı", label: "Yalı" },
  { value: "Yalı Dairesi", label: "Yalı Dairesi" },
  { value: "Yazlık", label: "Yazlık" },
  { value: "Prefabrik Ev", label: "Prefabrik Ev" },
  { value: "Kooparatif", label: "Kooparatif" },
];
export default function AdsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = use(searchParams);

  const [filters, setFilters] = useState<FilterState>({
    keyword: "",
    location: "Hepsi",
    district: "Hepsi",
    action: "Tümü",
    type: "Hepsi",
    minPrice: null,
    maxPrice: null,
  });

  const [data, setData] = useState<Advert[]>([]);
  const [adverts, setAdverts] = useState<Advert[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [modal, setModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = isMobile ? 10 : 15;

  useEffect(() => {
    const fetchAllAdverts = async () => {
      try {
        setLoading(true);
        let allAdverts: Advert[] = [];
        let currentPage = 1;
        let hasMorePages = true;
        const limit = 100;

        console.log("Tüm ilanlar çekiliyor...");

        while (hasMorePages) {
          try {
            const response = await api.get("/advert/adverts", {
              params: {
                page: currentPage,
                limit: limit,
              },
            });

            const fetchedAdverts: Advert[] = response.data.data || [];
            console.log(
              `Sayfa ${currentPage}'de ${fetchedAdverts.length} ilan bulundu`
            );

            if (fetchedAdverts.length > 0) {
              allAdverts = [...allAdverts, ...fetchedAdverts];

              const totalPages = response.data.totalPages;
              const currentPageFromApi = response.data.currentPage;

              console.log(
                `Total Pages: ${totalPages}, Current Page: ${currentPageFromApi}`
              );

              if (totalPages && currentPage >= totalPages) {
                console.log(`Toplam sayfa sayısına ulaşıldı: ${totalPages}`);
                hasMorePages = false;
              } else if (fetchedAdverts.length === 0) {
                console.log(
                  `Sayfa ${currentPage} boş, pagination durduruluyor`
                );
                hasMorePages = false;
              } else if (currentPage > 50) {
                console.warn(
                  "Maksimum sayfa limitine ulaşıldı, pagination durduruluyor"
                );
                hasMorePages = false;
              } else {
                currentPage++;
              }
            } else {
              console.log(`Sayfa ${currentPage} boş, pagination durduruluyor`);
              hasMorePages = false;
            }
          } catch (pageError) {
            console.error(`Sayfa ${currentPage} çekilirken hata:`, pageError);
            hasMorePages = false;
          }
        }

        console.log(`Toplam çekilen ilan sayısı: ${allAdverts.length}`);

        const activeAdverts = allAdverts
          .filter((ad: Advert) => ad.active === true)
          .sort((a: Advert, b: Advert) => {
            const aC = a.created?.createdTimestamp || 0;
            const bC = b.created?.createdTimestamp || 0;
            return bC - aC;
          });

        console.log(`Aktif ilan sayısı: ${activeAdverts.length}`);

        setAdverts(activeAdverts);
        setData(activeAdverts);
        setLoading(false);
      } catch (error) {
        console.error("İlanlar çekilirken hata oluştu:", error);
        setLoading(false);
      }
    };

    fetchAllAdverts();
  }, []);

  useEffect(() => {
    if (resolvedSearchParams && Object.keys(resolvedSearchParams).length > 0) {
      const newFilters: FilterState = {
        keyword:
          typeof resolvedSearchParams.q === "string"
            ? resolvedSearchParams.q
            : "",
        location:
          typeof resolvedSearchParams.location === "string"
            ? resolvedSearchParams.location
            : "Hepsi",
        district:
          typeof resolvedSearchParams.district === "string"
            ? resolvedSearchParams.district
            : "Hepsi",
        action: resolvedSearchParams.action
          ? resolvedSearchParams.action === "buy"
            ? "Satılık"
            : resolvedSearchParams.action === "rent"
            ? "Kiralık"
            : "Tümü"
          : "Tümü",
        type:
          typeof resolvedSearchParams.type === "string"
            ? resolvedSearchParams.type
            : "Hepsi",
        minPrice: resolvedSearchParams.minPrice
          ? Number(resolvedSearchParams.minPrice)
          : null,
        maxPrice: resolvedSearchParams.maxPrice
          ? Number(resolvedSearchParams.maxPrice)
          : null,
      };
      setFilters(newFilters);
      handleFilter(newFilters);
    }
  }, [resolvedSearchParams]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 800);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  function normalizeString(str: string): string {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  const parsePrice = (priceStr: string): number => {
    if (!priceStr) return 0;
    const cleanPrice = priceStr.replace(/[^\d,]/g, "").replace(",", ".");
    return parseFloat(cleanPrice) || 0;
  };

  const handleFilter = (autoFilters: FilterState | null = null) => {
    setModal(false);
    let filteredData = adverts.filter((ad: Advert) => ad.active === true);
    let filterValues = autoFilters || filters;

    console.log("Filtreleme başlıyor:", filterValues);
    console.log("Toplam ilan sayısı:", filteredData.length);

    if (filterValues.keyword && filterValues.keyword.trim() !== "") {
      const keyword = normalizeString(filterValues.keyword.trim());
      filteredData = filteredData.filter((ad: Advert) => {
        const title = normalizeString(ad.title || "");
        return title.includes(keyword);
      });
      console.log("Anahtar kelime filtresi sonrası:", filteredData.length);
    }

    if (filterValues.location && filterValues.location !== "Hepsi") {
      filteredData = filteredData.filter((ad: Advert) => {
        return ad.address?.province === filterValues.location;
      });
      console.log("Konum filtresi sonrası:", filteredData.length);
    }

    if (filterValues.district && filterValues.district !== "Hepsi") {
      filteredData = filteredData.filter((ad: Advert) => {
        return ad.address?.district === filterValues.district;
      });
      console.log("İlçe filtresi sonrası:", filteredData.length);
    }

    if (filterValues.action && filterValues.action !== "Tümü") {
      filteredData = filteredData.filter(
        (ad: Advert) => ad.steps?.second === filterValues.action
      );
      console.log("İşlem türü filtresi sonrası:", filteredData.length);
    }

    if (filterValues.type && filterValues.type !== "Hepsi") {
      filteredData = filteredData.filter(
        (ad: Advert) => ad.steps?.third === filterValues.type
      );
      console.log("Emlak tipi filtresi sonrası:", filteredData.length);
    }

    if (filterValues.minPrice !== null && filterValues.minPrice > 0) {
      filteredData = filteredData.filter((ad: Advert) => {
        if (!ad.fee) return false;
        const priceNumber = parsePrice(ad.fee);
        return priceNumber >= filterValues.minPrice!;
      });
      console.log("Min fiyat filtresi sonrası:", filteredData.length);
    }

    if (filterValues.maxPrice !== null && filterValues.maxPrice > 0) {
      filteredData = filteredData.filter((ad: Advert) => {
        if (!ad.fee) return false;
        const priceNumber = parsePrice(ad.fee);
        return priceNumber <= filterValues.maxPrice!;
      });
      console.log("Max fiyat filtresi sonrası:", filteredData.length);
    }

    console.log("Son filtreleme sonucu:", filteredData.length);

    setData(
      filteredData.sort((a: Advert, b: Advert) => {
        const aC = a.created?.createdTimestamp || 0;
        const bC = b.created?.createdTimestamp || 0;
        return bC - aC;
      })
    );
    setCurrentPage(1);
  };

  const hasValidImage = (ad: Advert): boolean => {
    if (!ad.photos || !Array.isArray(ad.photos)) return false;

    const validPhoto = ad.photos.find((photo: any) => {
      if (typeof photo === "string") {
        return (
          photo.trim() !== "" &&
          !photo.includes("default-image") &&
          !photo.includes("placeholder")
        );
      }
      return false;
    });

    return !!validPhoto;
  };

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = data.slice(startIndex, startIndex + itemsPerPage);

  const CustomPagination = () => {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
      const pages: number[] = [];
      const maxVisiblePages = isMobile ? 5 : 7;

      let startPage = Math.max(
        1,
        currentPage - Math.floor(maxVisiblePages / 2)
      );
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      return pages;
    };

    return (
      <div className="flex items-center justify-center gap-2 mt-8">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
          className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={16} />
        </button>

        {getPageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`flex items-center justify-center w-10 h-10 rounded-lg border transition-all ${
              currentPage === page
                ? "bg-blue-600 text-white border-blue-600 shadow-lg"
                : "border-gray-300 hover:bg-gray-50 text-gray-700 hover:shadow-md"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(totalPages, prev + 1))
          }
          disabled={currentPage === totalPages}
          className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    );
  };

  const logoUrl = "/logo.png";

  if (loading) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-gray-600"></div>
          <p className="text-gray-600 font-medium">Tüm ilanlar yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Navbar />

      <div className="pt-20 container mx-auto max-w-6xl px-4 py-8 -mt-8">
        {/* Search Card */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-100">
          <div className="flex flex-col lg:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="İl, ilçe, mahalle veya proje adı yazın..."
                value={filters.keyword}
                className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 text-sm shadow-sm transition-colors"
                onChange={(e) => {
                  setFilters({ ...filters, keyword: e.target.value });
                }}
                onKeyPress={(e) => {
                  if (e.key === "Enter") handleFilter();
                }}
              />
            </div>

            <div className="flex gap-2 w-full lg:w-auto">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 flex-1 lg:flex-none justify-center font-medium text-sm transition-colors shadow-sm hover:shadow-md"
                onClick={() => handleFilter()}
              >
                <Search size={16} />
                Ara
              </button>

              <button
                className="bg-white hover:bg-gray-50 border border-gray-200 px-3 py-2.5 flex items-center gap-2 rounded-lg flex-1 lg:flex-none justify-center font-medium text-sm transition-colors shadow-sm hover:shadow-md"
                onClick={() => setModal(true)}
              >
                <Filter size={16} />
                Filtre
              </button>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {filters.keyword ? `"${filters.keyword}"` : "Tüm İlanlar"}
              {filters.keyword && (
                <span className="text-sm text-gray-500 ml-2">
                  ({data.length} sonuç)
                </span>
              )}
            </h2>
            {!filters.keyword && (
              <p className="text-gray-600 mt-1">
                {data.length} aktif ilan bulundu
                {adverts.length > 0 && (
                  <span className="text-sm text-gray-500 ml-2">
                    (Toplam {adverts.length} ilan)
                  </span>
                )}
              </p>
            )}
          </div>

          {data.length < adverts.length && (
            <button
              className="text-blue-600 hover:text-blue-800 hover:underline transition-colors flex items-center gap-2 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg border border-blue-200"
              onClick={() => {
                setFilters({
                  keyword: "",
                  location: "Hepsi",
                  district: "Hepsi",
                  action: "Tümü",
                  type: "Hepsi",
                  minPrice: null,
                  maxPrice: null,
                });
                setData(
                  adverts.sort((a: Advert, b: Advert) => {
                    const aC = a.created?.createdTimestamp || 0;
                    const bC = b.created?.createdTimestamp || 0;
                    return bC - aC;
                  })
                );
                setModal(false);
              }}
            >
              <RotateCcw size={16} />
              Filtreleri Temizle
            </button>
          )}
        </div>

        {/* Ads Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {currentItems.length === 0 ? (
            <div className="col-span-3 py-16 text-center">
              <div className="max-w-md mx-auto">
                <Search size={64} className="mx-auto text-gray-300 mb-4" />
                <p className="text-xl font-semibold text-gray-900 mb-2">
                  Sonuç bulunamadı
                </p>
                <p className="text-gray-600 mb-4">
                  Filtrelerinizi değiştirerek tekrar deneyin
                </p>
                <button
                  onClick={() => setModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 mx-auto shadow-lg hover:shadow-xl transition-all"
                >
                  <Filter size={18} />
                  Filtreleri Değiştir
                </button>
              </div>
            </div>
          ) : (
            currentItems.map((ad: Advert, index: number) => (
              <Link
                href={`/ads/${ad.uid}`}
                key={ad.uid || index}
                className="flex relative flex-col bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group hover:-translate-y-1 border border-gray-200"
              >
                {ad.steps?.first && ad.steps?.second && (
                  <div className="absolute z-10 top-3 left-3 bg-gradient-to-r from-orange-500 to-red-500 text-white py-1 px-3 rounded-full text-xs font-semibold shadow-lg">
                    {ad.steps.second} / {ad.steps.first}
                  </div>
                )}

                {/* Image Section */}
                <div className="relative h-48 overflow-hidden">
                  {hasValidImage(ad) ? (
                    <img
                      src={ad.photos?.find(
                        (photo: any) => typeof photo === "string"
                      )}
                      alt={ad.title || "İlan görseli"}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src = logoUrl;
                        e.currentTarget.alt = "Logo";
                        e.currentTarget.className =
                          "w-full h-full object-contain p-4 bg-gray-100";
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 w-full h-full">
                      <img
                        src={logoUrl}
                        alt="Logo"
                        className="object-contain h-16 opacity-70"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://via.placeholder.com/150x150?text=Logo";
                        }}
                      />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                </div>

                {/* Content Section */}
                <div className="flex flex-col gap-3 p-5 flex-1">
                  <h3 className="font-bold text-gray-900 text-lg leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {ad.title || "Başlık Yok"}
                  </h3>

                  {(ad.address?.province ||
                    ad.address?.district ||
                    ad.address?.quarter) && (
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <MapPin size={14} className="text-blue-500" />
                      {[
                        ad.address?.province,
                        ad.address?.district,
                        ad.address?.quarter,
                      ]
                        .filter(Boolean)
                        .join(" / ")}
                    </p>
                  )}

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 my-1">
                    {ad.steps?.third && (
                      <div className="flex items-center gap-1 text-xs text-gray-600 bg-blue-50 px-2 py-1 rounded border border-blue-100">
                        <Building size={12} className="text-blue-500" />
                        <span className="font-medium">{ad.steps.third}</span>
                      </div>
                    )}

                    {ad.details?.roomCount && (
                      <div className="flex items-center gap-1 text-xs text-gray-600 bg-green-50 px-2 py-1 rounded border border-green-100">
                        <Armchair size={12} className="text-green-500" />
                        <span className="font-medium">
                          {ad.details.roomCount} Oda
                        </span>
                      </div>
                    )}

                    {ad.details?.floor && (
                      <div className="flex items-center gap-1 text-xs text-gray-600 bg-purple-50 px-2 py-1 rounded border border-purple-100">
                        <Layers size={12} className="text-purple-500" />
                        <span className="font-medium">
                          {ad.details.floor}. Kat
                        </span>
                      </div>
                    )}

                    {(ad.details?.netArea || ad.details?.acre) && (
                      <div className="flex items-center gap-1 text-xs text-gray-600 bg-orange-50 px-2 py-1 rounded border border-orange-100">
                        <Square size={12} className="text-orange-500" />
                        <span className="font-medium">
                          {ad.details.netArea
                            ? `${ad.details.netArea} m²`
                            : `${ad.details.acre} dönüm`}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Price and Date */}
                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
                    <div className="text-xl font-bold text-gray-900 flex items-center gap-1">
                      {ad.fee ? `${ad.fee}` : "Fiyat belirtilmemiş"}
                    </div>
                    {ad.created?.createdTimestamp && (
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock size={14} className="text-gray-400" />
                        <span className="font-medium whitespace-nowrap">
                          {new Date(
                            ad.created.createdTimestamp
                          ).toLocaleDateString("tr-TR", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Custom Pagination */}
        {totalPages > 1 && <CustomPagination />}
      </div>

      <Footer />
      <GoToTop />

      {/* Filter Modal */}
      {modal && (
        <div className="fixed inset-0 z-[9999] flex items-start justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl my-8 border border-gray-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-2xl">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <Filter size={24} />
                Detaylı Filtreleme
              </h2>
              <button
                onClick={() => setModal(false)}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleFilter();
              }}
              className="p-6 space-y-6 max-h-[70vh] overflow-y-auto"
            >
              {/* Location Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Navigation size={18} className="text-blue-500" />
                  Konum
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      İl
                    </label>
                    <select
                      value={filters.location}
                      onChange={(e) => {
                        setFilters({
                          ...filters,
                          location: e.target.value,
                          district: "Hepsi",
                        });
                      }}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    >
                      <option value="Hepsi">Tüm İller</option>
                      {turkeyCities.map((city: any) => (
                        <option key={city.province} value={city.province}>
                          {city.province}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      İlçe
                    </label>
                    <select
                      value={filters.district}
                      onChange={(e) => {
                        setFilters({
                          ...filters,
                          district: e.target.value,
                        });
                      }}
                      disabled={filters.location === "Hepsi"}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                    >
                      <option value="Hepsi">
                        {filters.location === "Hepsi"
                          ? "Önce il seçiniz"
                          : "Tüm İlçeler"}
                      </option>
                      {turkeyCities
                        .find((city: any) => city.province === filters.location)
                        ?.districts.map((district: any) => (
                          <option
                            key={district.district}
                            value={district.district}
                          >
                            {district.district}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Property Type Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Building size={18} className="text-green-500" />
                  Emlak Bilgileri
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tür (Satılık/Kiralık)
                    </label>
                    <select
                      value={filters.action}
                      onChange={(e) => {
                        setFilters({
                          ...filters,
                          action: e.target.value,
                        });
                      }}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    >
                      {actionOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Emlak Tipi
                    </label>
                    <select
                      value={filters.type}
                      onChange={(e) => {
                        setFilters({
                          ...filters,
                          type: e.target.value,
                        });
                      }}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    >
                      {typeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Price Range Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <DollarSign size={18} className="text-yellow-500" />
                  Fiyat Aralığı
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Min. Fiyat
                    </label>
                    <input
                      type="number"
                      placeholder="Min. Fiyat"
                      value={filters.minPrice || ""}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          minPrice: e.target.value
                            ? Number(e.target.value)
                            : null,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max. Fiyat
                    </label>
                    <input
                      type="number"
                      placeholder="Max. Fiyat"
                      value={filters.maxPrice || ""}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          maxPrice: e.target.value
                            ? Number(e.target.value)
                            : null,
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <Filter size={20} />
                  Filtrele ({data.length} ilan)
                </button>
                <button
                  type="button"
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 border border-gray-300"
                  onClick={() => {
                    setFilters({
                      keyword: "",
                      location: "Hepsi",
                      district: "Hepsi",
                      action: "Tümü",
                      type: "Hepsi",
                      minPrice: null,
                      maxPrice: null,
                    });
                    setData(
                      adverts.sort((a: Advert, b: Advert) => {
                        const aC = a.created?.createdTimestamp || 0;
                        const bC = b.created?.createdTimestamp || 0;
                        return bC - aC;
                      })
                    );
                    setModal(false);
                  }}
                >
                  <RotateCcw size={20} />
                  Temizle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
