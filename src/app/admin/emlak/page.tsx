"use client";

import React, { useState, useEffect } from "react";
import { Poppins } from "next/font/google";
import Link from "next/link";
import axios from "axios";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import {
  Filter,
  Eye,
  EyeOff,
  X,
  Plus,
  Search,
  Edit,
  Trash2,
  User,
  Users,
  Phone,
  Mail,
  Link as LinkIcon,
  MapPin,
  FileText,
} from "lucide-react";
import FilterAdminAds from "@/app/components/modals/FilterAdminAds";
import AdUserNotes from "@/app/components/modals/AddUserNotes";
import AdminLayout from "@/app/components/layout/AdminLayout";
import AreYouSure from "@/app/components/AreYouSure";
import { Pagination, MobilePagination } from "@/app/components/Pagination";
import { checkAuth, getClientToken } from "@/app/lib/auth";
import api from "@/app/lib/api";

const PoppinsFont = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

interface Advert {
  uid: string;
  title: string;
  active: boolean;
  fee: number;
  photos: string[];
  address: {
    province: string;
    district: string;
    quarter: string;
    full_address: string;
  };
  steps: {
    first: string;
    second: string;
  };
  customer: {
    name: string;
    surname: string;
    phones: Array<{ number: string }>;
  };
  advisor: {
    name: string;
    surname: string;
  };
  adminNote?: string;
  created: {
    createdTimestamp: number;
  };
}

const Emlak = () => {
  const [cookies] = useCookies(["token"]);
  const router = useRouter();

  const [data, setData] = useState<Advert[]>([]);
  const [defaultData, setDefaultData] = useState<Advert[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(25);
  const [isMobile, setIsMobile] = useState(false);

  const [adminNote, setAdminNote] = useState({
    isOpen: false,
    ad: {} as Advert | {},
  });

  const [adUserNotes, setAdUserNotes] = useState({
    isOpen: false,
    ad: {} as Advert | {},
  });

  const [deleteConfirm, setDeleteConfirm] = useState({
    open: false,
    ad: null as Advert | null,
  });

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchResult = (resultData: any) => {
    console.log("Search Result:", resultData);

    if (resultData && Array.isArray(resultData)) {
      const sortedData = resultData
        .filter((ad: Advert) => ad.active !== false)
        .sort((a: Advert, b: Advert) => {
          const aC = a.created?.createdTimestamp || 0;
          const bC = b.created?.createdTimestamp || 0;
          return bC - aC;
        });

      setData(sortedData);
    } else if (resultData?.data && Array.isArray(resultData.data)) {
      const sortedData = resultData.data
        .filter((ad: Advert) => ad.active !== false)
        .sort((a: Advert, b: Advert) => {
          const aC = a.created?.createdTimestamp || 0;
          const bC = b.created?.createdTimestamp || 0;
          return bC - aC;
        });

      setData(sortedData);
    } else {
      console.warn("Unexpected result format:", resultData);
      toast.error("Sonuçlar beklenen formatta değil");
    }

    setPage(0);
  };

  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const totalPages = Math.ceil(data.length / rowsPerPage);
  const paginatedData = data.slice(startIndex, endIndex);

  React.useEffect(() => {
    const verifyAuth = async () => {
      const authValid = await checkAuth();

      if (!authValid) {
        router.push("/login");
        return;
      }
      setIsAuthenticated(true);
    };

    verifyAuth();
  }, [router]);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  React.useEffect(() => {
    if (!isAuthenticated) return;

    const fetchAllAdverts = async () => {
      try {
        setLoading(true);
        let allAdverts: Advert[] = [];
        let currentPage = 1;
        let hasMorePages = true;
        const limit = 100;

        while (hasMorePages) {
          try {
            const response = await api.get(
              `/admin/adverts?sortBy=created&page=${currentPage}&limit=${limit}`
            );

            console.log("API Response:", response.data);
            const adverts = response.data.data || [];

            if (adverts.length > 0) {
              allAdverts = [...allAdverts, ...adverts];
            }

            const totalPages = response.data.totalPages;
            const currentPageFromApi = response.data.currentPage;

            if (totalPages && currentPage >= totalPages) {
              hasMorePages = false;
            } else if (adverts.length === 0) {
              hasMorePages = false;
            } else {
              currentPage++;
            }

            if (currentPage > 100) {
              console.warn("Maximum page limit reached, stopping pagination");
              hasMorePages = false;
            }
          } catch (pageError) {
            console.error(`Error fetching page ${currentPage}:`, pageError);
            hasMorePages = false;
          }
        }

        const sortedAdverts = allAdverts
          .filter((ad: Advert) => ad.active !== false)
          .sort((a: Advert, b: Advert) => {
            const aC = a.created.createdTimestamp;
            const bC = b.created.createdTimestamp;
            return bC - aC;
          });

        setData(sortedAdverts);
        setDefaultData(sortedAdverts);
        console.log(`Total adverts fetched: ${allAdverts.length}`);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching adverts:", error);
        setLoading(false);
        toast.error("İlanlar yüklenirken bir hata oluştu");
      }
    };

    fetchAllAdverts();
  }, [isAuthenticated, cookies.token]);
  const handleDelete = (uid: string) => {
    api
      .post("/admin/delete-advert", {
        uid: uid,
      })
      .then((response) => {
        toast.success("İlan başarıyla silindi.");
        setData(
          data
            .filter((ad: Advert) => ad.uid !== uid)
            .sort((a: Advert, b: Advert) => {
              const aC = a.created.createdTimestamp;
              const bC = b.created.createdTimestamp;
              return bC - aC;
            })
        );
        setDeleteConfirm({ open: false, ad: null });
      })
      .catch((error) => {
        console.log(error);
        setDeleteConfirm({ open: false, ad: null });
      });
  };

  const handleConfirmDelete = () => {
    if (deleteConfirm.ad) {
      handleDelete(deleteConfirm.ad.uid);
    }
  };

  const handleChangeActivity = (uid: string) => {
    api
      .post("/admin/change-advert-activity", {
        uid: uid,
      })
      .then((response) => {
        toast.success("İlan başarıyla güncellendi.");
        const lastV = data.map((ad: Advert) => {
          if (ad.uid === uid) {
            return {
              ...ad,
              active: !ad.active,
            };
          }
          return ad;
        });
        setData(
          lastV.sort((a: Advert, b: Advert) => {
            const aC = a.created.createdTimestamp;
            const bC = b.created.createdTimestamp;
            return bC - aC;
          })
        );
        setDefaultData(lastV);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const [filters, setFilters] = useState({
    title: "",
    uid: "",
    province: "",
    district: "",
    quarter: "",
    type: "",
    otherType: "",
    minFee: "",
    maxFee: "",
    advisor: "",
    customer: "",
  });

  const clearFilters = () => {
    setFilters({
      title: "",
      uid: "",
      province: "",
      district: "",
      quarter: "",
      type: "",
      otherType: "",
      minFee: "",
      maxFee: "",
      advisor: "",
      customer: "",
    });
    handleFilter();
  };

  const [openFilter, setOpenFilter] = useState(false);

  const handleFilter = async () => {
    try {
      setLoading(true);

      const params: any = {
        page: 1,
        limit: 100,
      };

      if (filters.title) {
        params.search = filters.title.trim();
      }

      if (filters.uid) {
        params.uid = filters.uid.trim();
      }

      if (filters.province) {
        params.province = filters.province;
        if (filters.district) {
          params.district = filters.district;
        }
        if (filters.quarter) {
          params.quarter = filters.quarter;
        }
      }

      if (filters.type) {
        params.type = filters.type;
      }
      if (filters.otherType) {
        params.otherType = filters.otherType;
      }

      if (filters.minFee) {
        params.minFee = Number(filters.minFee);
      }
      if (filters.maxFee) {
        params.maxFee = Number(filters.maxFee);
      }

      if (filters.advisor) {
        params.advisor = filters.advisor;
      }
      if (filters.customer) {
        params.customer = filters.customer;
      }

      console.log("🔍 API'ye gönderilen parametreler:", params);

      const hasAnyFilter = Object.keys(params).length > 2;

      let response;
      if (hasAnyFilter) {
        response = await api.get("/admin/adverts/search", { params });
      } else {
        response = await api.get("/admin/adverts", {
          params: { page: 1, limit: 100, active: true },
        });
      }

      console.log("📥 API Yanıtı:", response.data);

      let searchResults = [];

      if (Array.isArray(response.data)) {
        searchResults = response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        searchResults = response.data.data;
      } else if (response.data?.items && Array.isArray(response.data.items)) {
        searchResults = response.data.items;
      } else if (
        response.data?.adverts &&
        Array.isArray(response.data.adverts)
      ) {
        searchResults = response.data.adverts;
      }

      const filteredAndSorted = searchResults
        .filter((ad: Advert) => ad.active !== false)
        .sort((a: Advert, b: Advert) => {
          const aC = a.created?.createdTimestamp || 0;
          const bC = b.created?.createdTimestamp || 0;
          return bC - aC;
        });

      setData(filteredAndSorted);

      const resultCount = filteredAndSorted.length;
      if (resultCount > 0) {
        toast.success(`${resultCount} ilan bulundu.`);
      } else {
        toast.info("Aramanıza uygun ilan bulunamadı.");
      }

      setPage(0);
    } catch (error: any) {
      console.error("Filtreleme hatası:", error);

      if (error.response) {
        toast.error(
          `API hatası: ${error.response.status} - ${
            error.response.data?.message || "Bilinmeyen hata"
          }`
        );
      } else if (error.request) {
        toast.error(
          "Sunucuya ulaşılamıyor. İnternet bağlantınızı kontrol edin."
        );
      } else {
        toast.error("Filtreleme sırasında bir hata oluştu");
      }

      setData(
        defaultData.sort((a: Advert, b: Advert) => {
          const aC = a.created?.createdTimestamp || 0;
          const bC = b.created?.createdTimestamp || 0;
          return bC - aC;
        })
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSingleAdFetch = async () => {
    if (!filters.uid) return;

    try {
      setLoading(true);
      const response = await api.get(`/advert/adverts/${filters.uid}`);

      if (response.data.success && response.data.data) {
        const singleAd = response.data.data;
        setData([singleAd]);
        setPage(0);
        toast.success("İlan bulundu!");
      } else {
        toast.error("İlan bulunamadı");
        setData([]);
      }
    } catch (error) {
      console.error("Tek ilan getirme hatası:", error);
      toast.error("İlan yüklenirken hata oluştu");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const hasValidPhotos = (ad: Advert) => {
    return (
      ad?.photos &&
      Array.isArray(ad.photos) &&
      ad.photos.some(
        (photo: any) => typeof photo === "string" && photo.trim() !== ""
      )
    );
  };

  const getFirstValidPhoto = (ad: Advert) => {
    if (!ad?.photos || !Array.isArray(ad.photos)) return null;

    const validPhoto = ad.photos.find(
      (photo: any) => typeof photo === "string" && photo.trim() !== ""
    );

    return validPhoto || null;
  };

  if (!isAuthenticated || loading) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-custom-orange"></div>
          <p className="text-gray-600 text-sm">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="w-full min-h-screen bg-gray-50" style={PoppinsFont.style}>
        {/* Header */}
        <div className="bg-white border-b">
          <div className="px-6 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  İlan Yönetimi
                </h1>
                <p className="text-gray-600 mt-1">Toplam {data.length} ilan</p>
              </div>
              <Link
                href="/admin/emlak/add"
                className="bg-[#FF6B35] hover:bg-[#E55A2B] text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors font-medium shadow-md hover:shadow-lg"
              >
                <Plus size={20} />
                Yeni İlan Ekle
              </Link>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-6 py-4 bg-white border-b">
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <div className="flex flex-1 gap-3 w-full">
              <div className="relative flex-1">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="İlan başlığı ara..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:border-custom-orange focus:ring-1 focus:ring-custom-orange outline-none"
                  value={filters.title || ""}
                  onChange={(e) =>
                    setFilters({ ...filters, title: e.target.value })
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleFilter();
                    }
                  }}
                />
              </div>
              <input
                type="number"
                placeholder="ID ara..."
                className="w-32 px-3 py-2.5 border border-gray-300 rounded-lg focus:border-custom-orange focus:ring-1 focus:ring-custom-orange outline-none"
                value={filters.uid || ""}
                onChange={(e) =>
                  setFilters({ ...filters, uid: e.target.value })
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleFilter();
                  }
                }}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleFilter}
                disabled={loading}
                className="bg-gray-800 hover:bg-gray-900 disabled:bg-gray-600 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 transition-colors font-medium disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                    Aranıyor...
                  </>
                ) : (
                  <>
                    <Search size={16} />
                    Ara
                  </>
                )}
              </button>
              <button
                onClick={() => setOpenFilter(true)}
                className="border border-gray-300 hover:border-custom-orange text-gray-700 hover:text-custom-orange px-4 py-2.5 rounded-lg flex items-center gap-2 transition-colors font-medium"
              >
                <Filter size={16} />
                Gelişmiş
              </button>
            </div>
          </div>
        </div>

        {/* Ads Grid - 3 columns */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedData.map((ad: Advert, index: number) => {
              const renderAddressSafely = () => {
                try {
                  if (!ad.address) {
                    return "Adres bilgisi yok";
                  }

                  if (typeof ad.address === "string") {
                    return ad.address;
                  }

                  if (typeof ad.address === "object") {
                    const addressObj = ad.address as any;

                    if (addressObj.full_address) {
                      if (typeof addressObj.full_address === "string") {
                        return addressObj.full_address;
                      } else if (typeof addressObj.full_address === "object") {
                        const nestedFullAddress = (
                          addressObj.full_address as any
                        ).full_address;
                        if (
                          nestedFullAddress &&
                          typeof nestedFullAddress === "string"
                        ) {
                          return nestedFullAddress;
                        }
                      }
                    }

                    const province = addressObj.province || "";
                    const district = addressObj.district || "";

                    if (province || district) {
                      return `${province}${
                        province && district ? ", " : ""
                      }${district}`;
                    }

                    return "Adres bilgisi yok";
                  }

                  return "Geçersiz adres formatı";
                } catch (error) {
                  console.error(
                    `❌ Error rendering address for ad ${ad.uid}:`,
                    error
                  );
                  return "Adres render hatası";
                }
              };

              const renderLocationSafely = () => {
                try {
                  if (!ad.address) {
                    return "Konum bilgisi yok";
                  }

                  if (typeof ad.address === "string") {
                    return ad.address;
                  }

                  if (typeof ad.address === "object") {
                    const addressObj = ad.address as any;
                    const province = addressObj.province || "";
                    const district = addressObj.district || "";

                    return `${province}${
                      province && district ? ", " : ""
                    }${district}`;
                  }

                  return "Geçersiz konum formatı";
                } catch (error) {
                  console.error(
                    `❌ Error rendering location for ad ${ad.uid}:`,
                    error
                  );
                  return "Konum render hatası";
                }
              };

              return (
                <div
                  key={index}
                  className="bg-white rounded-xl border border-gray-200 hover:border-custom-orange transition-colors overflow-hidden group"
                >
                  {/* Image Section */}
                  <div className="relative h-48 bg-gray-100 overflow-hidden">
                    {hasValidPhotos(ad) ? (
                      <img
                        src={getFirstValidPhoto(ad) || ""}
                        alt={ad.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.src = "/logo.png";
                          e.currentTarget.className =
                            "w-full h-full object-contain p-8 bg-gray-100";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <img
                          src="/logo.png"
                          alt="Logo"
                          className="h-16 object-contain opacity-50"
                        />
                      </div>
                    )}

                    {/* Status Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1">
                      <span className="bg-black/80 text-white text-xs font-medium px-2 py-1 rounded">
                        {ad.steps.second}/{ad.steps.first}
                      </span>
                    </div>

                    {/* Price */}
                    <div className="absolute top-3 right-3">
                      <span className="bg-custom-orange text-white text-sm font-bold px-3 py-1 rounded-lg">
                        {ad.fee}
                      </span>
                    </div>

                    {/* Active Toggle */}
                    <button
                      onClick={() => handleChangeActivity(ad.uid)}
                      className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg p-1.5 hover:scale-110 transition-transform"
                    >
                      {!ad.active ? (
                        <EyeOff size={16} className="text-red-500" />
                      ) : (
                        <Eye size={16} className="text-green-500" />
                      )}
                    </button>
                  </div>

                  {/* Content Section */}
                  <div className="p-4">
                    {/* Title */}
                    <Link href={`/ads/${ad.uid}`} className="block mb-2">
                      <h3 className="font-semibold text-gray-900 line-clamp-2 hover:text-custom-orange transition-colors">
                        {ad.title}
                      </h3>
                    </Link>

                    <div className="flex items-center gap-1 text-gray-600 text-sm mb-3">
                      <MapPin size={14} className="text-custom-orange" />
                      <span className="line-clamp-1">
                        {renderLocationSafely()}
                      </span>
                    </div>

                    <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                      {renderAddressSafely()}
                    </p>

                    <div className="space-y-2 mb-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <User size={14} className="text-custom-orange" />
                        <span>
                          {ad.customer.name} {ad.customer.surname}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone size={14} className="text-custom-orange" />
                        <div className="flex gap-1 flex-wrap">
                          {ad.customer?.phones
                            ?.slice(0, 2)
                            .map((phone: any, idx: number) => (
                              <span
                                key={idx}
                                className="bg-gray-100 rounded px-1.5 py-0.5 text-xs"
                              >
                                {phone.number.startsWith("0")
                                  ? phone.number
                                  : "0" + phone.number}
                              </span>
                            ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-gray-600">
                        <Users size={14} className="text-custom-orange" />
                        <span className={ad.advisor.name ? "" : "text-red-500"}>
                          {ad.advisor.name || "Danışman Yok"}{" "}
                          {ad.advisor.surname}
                        </span>
                      </div>
                    </div>

                    {ad.adminNote && (
                      <button
                        onClick={() => setAdminNote({ isOpen: true, ad: ad })}
                        className="w-full text-left text-blue-600 hover:text-blue-700 text-sm mb-3 flex items-center gap-1 transition-colors"
                      >
                        <FileText size={14} />
                        <span>Admin Notunu Gör</span>
                      </button>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/emlak/${ad.uid}`}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg flex items-center justify-center gap-1 transition-colors text-sm font-medium"
                      >
                        <Edit size={14} />
                        Düzenle
                      </Link>
                      <button
                        onClick={() => setDeleteConfirm({ open: true, ad: ad })}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-lg flex items-center justify-center gap-1 transition-colors text-sm font-medium"
                      >
                        <Trash2 size={14} />
                        Sil
                      </button>
                    </div>

                    {/* User Notes Button */}
                    <button
                      onClick={() => setAdUserNotes({ isOpen: true, ad: ad })}
                      className="w-full mt-2 bg-gray-600 hover:bg-gray-700 text-white py-2 px-3 rounded-lg flex items-center justify-center gap-1 transition-colors text-sm font-medium"
                    >
                      <Users size={14} />
                      Kullanıcı Notları
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {paginatedData.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <FileText size={48} className="mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                İlan bulunamadı
              </h3>
              <p className="text-gray-600 mb-4">
                Filtrelerinizi değiştirmeyi deneyin veya yeni ilan ekleyin.
              </p>
              <Link
                href="/admin/emlak/add"
                className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
              >
                <Plus size={16} />
                Yeni İlan Ekle
              </Link>
            </div>
          )}

          {/* Pagination */}
          {data.length > 0 && (
            <div className="mt-8">
              {isMobile ? (
                <MobilePagination
                  page={page}
                  totalPages={totalPages}
                  rowsPerPage={rowsPerPage}
                  totalItems={data.length}
                  startIndex={startIndex}
                  endIndex={endIndex}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              ) : (
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  rowsPerPage={rowsPerPage}
                  totalItems={data.length}
                  startIndex={startIndex}
                  endIndex={endIndex}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              )}
            </div>
          )}
        </div>

        {/* Admin Note Modal */}
        {adminNote.isOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Admin Notu</h3>
                <button
                  onClick={() => setAdminNote({ isOpen: false, ad: {} })}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 mb-4 max-h-40 overflow-y-auto">
                <p className="text-gray-700 text-sm">
                  {("adminNote" in adminNote.ad && adminNote.ad.adminNote) ||
                    "Not bulunamadı"}
                </p>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/admin/emlak/${
                    "uid" in adminNote.ad ? adminNote.ad.uid : ""
                  }`}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg text-center text-sm font-medium transition-colors"
                >
                  Notu Düzenle
                </Link>
                <button
                  onClick={() => setAdminNote({ isOpen: false, ad: {} })}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors"
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        )}

        <FilterAdminAds
          open={openFilter}
          setOpen={setOpenFilter}
          setFilters={setFilters}
          filters={filters}
          handleFilter={handleFilter}
          handleCleanFilters={() => {
            setFilters({
              uid: "",
              title: "",
              province: "",
              district: "",
              quarter: "",
              type: "",
              otherType: "",
              minFee: "",
              maxFee: "",
              advisor: "",
              customer: "",
            });

            setData(
              defaultData.sort((a: Advert, b: Advert) => {
                const aC = a.created?.createdTimestamp || 0;
                const bC = b.created?.createdTimestamp || 0;
                return bC - aC;
              })
            );
            setPage(0);
          }}
          onSearchResult={handleSearchResult}
        />
        <AdUserNotes
          data={adUserNotes}
          setOpen={setAdUserNotes}
          cookies={cookies}
        />
        <AreYouSure
          open={deleteConfirm.open}
          onClose={() => setDeleteConfirm({ open: false, ad: null })}
          onConfirm={handleConfirmDelete}
          title={`${deleteConfirm.ad?.title} ilanını silmek istiyor musunuz?`}
          message="Bu işlem geri alınamaz. İlana ait tüm veriler kalıcı olarak silinecektir."
          confirmText="Evet, Sil"
          cancelText="İptal"
          type="delete"
        />
      </div>
    </AdminLayout>
  );
};

export default Emlak;
