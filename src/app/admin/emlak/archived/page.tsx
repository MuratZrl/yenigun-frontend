"use client";
import React, { useState, useEffect } from "react";
import { Poppins } from "next/font/google";
import Link from "next/link";
import { useCookies } from "react-cookie";
import FilterAdminAds from "@/app/components/modals/FilterAdminAds";
import { toast } from "react-toastify";
import AdUserNotes from "@/app/components/modals/AddUserNotes";
import AdminLayout from "@/app/components/layout/AdminLayout";
import AreYouSure from "@/app/components/AreYouSure";
import {
  Eye,
  EyeOff,
  X,
  Filter,
  Search,
  Plus,
  Edit,
  Trash2,
  User,
  Phone,
  Mail,
  Link as LinkIcon,
  MapPin,
  FileText,
} from "lucide-react";
import { Pagination, MobilePagination } from "@/app/components/Pagination";
import { useRouter } from "next/navigation";
import { checkAuth } from "@/app/lib/auth";
import api from "@/app/lib/api";
import axios from "axios";

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
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [adminNote, setAdminNote] = React.useState({
    isOpen: false,
    ad: {} as Advert | {},
  });
  const [adUserNotes, setAdUserNotes] = React.useState({
    isOpen: false,
    ad: {} as Advert | {},
  });
  const [deleteConfirm, setDeleteConfirm] = React.useState({
    open: false,
    ad: null as Advert | null,
  });

  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(25);
  const [isMobile, setIsMobile] = useState(false);

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
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

    const fetchArchivedAdverts = async () => {
      try {
        let allArchivedAdverts: Advert[] = [];
        let currentPage = 1;
        let hasMorePages = true;
        const limit = 100;

        while (hasMorePages) {
          try {
            const response = await axios.get(
              `https://api.yenigunemlak.com/admin/adverts?page=${currentPage}&limit=${limit}`,
              {
                headers: {
                  Authorization: `Bearer ${cookies.token}`,
                },
              }
            );

            console.log("API Response:", response.data);
            const adverts = response.data.data || [];

            if (adverts.length > 0) {
              const archivedAds = adverts.filter((ad: Advert) => !ad.active);
              allArchivedAdverts = [...allArchivedAdverts, ...archivedAds];
              console.log("arc", archivedAds);
            }

            const totalPages = response.data.totalPages;

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

        const sortedArchivedAds = allArchivedAdverts.sort(
          (a: Advert, b: Advert) => {
            const aC = a.created.createdTimestamp;
            const bC = b.created.createdTimestamp;
            return bC - aC;
          }
        );

        setData(sortedArchivedAds);
        setDefaultData(sortedArchivedAds);
        console.log(
          `Total archived adverts fetched: ${allArchivedAdverts.length}`
        );
        setLoading(false);
      } catch (error) {
        console.error("Error fetching archived adverts:", error);
        setLoading(false);
      }
    };

    fetchArchivedAdverts();
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
        const updatedData = data.map((ad: Advert) => {
          if (ad.uid === uid) {
            return {
              ...ad,
              active: !ad.active,
            };
          }
          return ad;
        });
        setData(
          updatedData.sort((a: Advert, b: Advert) => {
            const aC = a.created.createdTimestamp;
            const bC = b.created.createdTimestamp;
            return bC - aC;
          })
        );
        setDefaultData(updatedData);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const [filters, setFilters] = useState({
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

  function normalizeString(str: string) {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  const [openFilter, setOpenFilter] = useState(false);

  const handleFilter = () => {
    let filteredData = defaultData;

    filteredData = defaultData.filter((ad: Advert) => {
      if (filters.uid && ad.uid.toString() !== filters.uid) {
        return false;
      }
      if (filters.title) {
        const title = normalizeString(ad.title);
        const keyword = normalizeString(filters.title);
        if (!title.includes(keyword)) {
          return false;
        }
      }
      if (
        filters.province &&
        !ad.address.province
          .toLowerCase()
          .includes(filters.province.toLowerCase())
      ) {
        return false;
      }
      if (
        filters.district &&
        !ad.address.district
          .toLowerCase()
          .includes(filters.district.toLowerCase())
      ) {
        return false;
      }
      if (
        filters.quarter &&
        !ad.address.quarter
          .toLowerCase()
          .includes(filters.quarter.toLowerCase())
      ) {
        return false;
      }
      if (
        filters.type &&
        filters.type !== "hepsi" &&
        ad.steps.second !== filters.type
      ) {
        return false;
      }
      if (
        filters.otherType &&
        !ad.steps.first.toLowerCase().includes(filters.otherType.toLowerCase())
      ) {
        return false;
      }
      if (filters.minFee && ad.fee < Number(filters.minFee)) {
        return false;
      }
      if (filters.maxFee && ad.fee > Number(filters.maxFee)) {
        return false;
      }
      if (filters.advisor) {
        const fullName = ad.advisor.name + " " + ad.advisor.surname;
        if (!fullName.toLowerCase().includes(filters.advisor.toLowerCase())) {
          return false;
        }
      }
      if (filters.customer) {
        const fullName = ad.customer.name + " " + ad.customer.surname;
        if (!fullName.toLowerCase().includes(filters.customer.toLowerCase())) {
          return false;
        }
      }
      return true;
    });

    setData(
      filteredData.sort((a: Advert, b: Advert) => {
        const aC = a.created.createdTimestamp;
        const bC = b.created.createdTimestamp;
        return bC - aC;
      })
    );
    setPage(0);
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
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-custom-orange"></div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="w-full min-h-screen bg-gray-50" style={PoppinsFont.style}>
        {/* Header Section */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                  Arşivlenen İlanlar
                </h1>
                <p className="text-gray-600 mt-1">
                  Toplam {data.length} arşivlenmiş ilan
                </p>
              </div>

              <Link
                href="/admin/emlak/add"
                className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
              >
                <Plus size={16} />
                Yeni İlan Ekle
              </Link>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
          <div className="bg-white rounded-xl shadow-sm border p-4 lg:p-6">
            <div className="flex flex-col sm:flex-row gap-3 w-full items-stretch">
              {/* Arama Input */}
              <div className="relative flex-1">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="İlan başlığı ile arayın..."
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-orange focus:border-transparent text-sm sm:text-base"
                  onChange={(e) => {
                    setFilters({ ...filters, title: e.target.value });
                  }}
                  onKeyPress={(e) => e.key === "Enter" && handleFilter()}
                />
              </div>

              <div className="relative w-full sm:w-32">
                <input
                  type="number"
                  placeholder="ID ara..."
                  className="w-full px-3 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-orange focus:border-transparent text-sm sm:text-base"
                  onChange={(e) => {
                    setFilters({ ...filters, uid: e.target.value });
                  }}
                  onKeyPress={(e) => e.key === "Enter" && handleFilter()}
                />
              </div>

              <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
                <button
                  className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white px-4 py-2.5 sm:py-3 rounded-lg font-medium transition-colors duration-200 flex-1 sm:flex-none text-sm sm:text-base min-w-[80px]"
                  onClick={handleFilter}
                >
                  <Search size={18} />
                  <span>Ara</span>
                </button>

                <button
                  className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 sm:py-3 rounded-lg font-medium transition-colors duration-200 flex-1 sm:flex-none text-sm sm:text-base min-w-[100px]"
                  onClick={() => setOpenFilter(true)}
                >
                  <Filter size={18} />
                  <span>Filtrele</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Warning Banner */}
        {data.filter((ad: Advert) => ad.active).length !== 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-semibold text-yellow-800 text-sm sm:text-base">
                  Arşivde olmayan ilanlar da bulunuyor
                </h3>
                <p className="text-yellow-700 text-xs sm:text-sm mt-1">
                  Sadece arşivlenmiş ilanları görmek için sayfayı yenileyin.
                </p>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-lg transition-colors duration-200 text-sm whitespace-nowrap"
              >
                Sayfayı Yenile
              </button>
            </div>
          </div>
        )}

        <div className="p-6">
          {data.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Filter size={48} className="mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                İlan bulunamadı
              </h3>
              <p className="text-gray-600 mb-4">
                Filtre kriterlerinize uygun arşivlenmiş ilan bulunamadı.
              </p>
              <button
                onClick={() => {
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
                  setData(defaultData);
                  setPage(0);
                }}
                className="inline-flex items-center gap-2 bg-custom-orange hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Filtreleri Temizle
              </button>
            </div>
          ) : (
            <>
              {/* Ads Grid - 3 columns */}
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
                          } else if (
                            typeof addressObj.full_address === "object"
                          ) {
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
                        const quarter = addressObj.quarter || "";

                        if (province || district || quarter) {
                          return `${province}${
                            province && district ? ", " : ""
                          }${district}${
                            quarter && (province || district) ? ", " : ""
                          }${quarter}`;
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
                        const quarter = addressObj.quarter || "";

                        return `${province}${
                          province && district ? " / " : ""
                        }${district}${
                          quarter && (province || district) ? " / " : ""
                        }${quarter}`;
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
                          title={ad.active ? "Arşivle" : "Arşivden Çıkar"}
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

                        {/* Location */}
                        <div className="flex items-center gap-1 text-gray-600 text-sm mb-3">
                          <MapPin size={14} className="text-custom-orange" />
                          <span className="line-clamp-1">
                            {renderLocationSafely()}
                          </span>
                        </div>

                        {/* Address */}
                        <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                          {renderAddressSafely()}
                        </p>

                        {/* Customer Info */}
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

                          {/* Advisor Info */}
                          <div className="flex items-center gap-2 text-gray-600">
                            <User size={14} className="text-custom-orange" />
                            <span
                              className={ad.advisor.name ? "" : "text-red-500"}
                            >
                              {ad.advisor.name
                                ? `${ad.advisor.name} ${ad.advisor.surname}`
                                : "Danışman Yok"}
                            </span>
                          </div>
                        </div>

                        {/* Admin Note */}
                        {ad.adminNote && (
                          <button
                            onClick={() =>
                              setAdminNote({ isOpen: true, ad: ad })
                            }
                            className="w-full text-left text-blue-600 hover:text-blue-700 text-sm mb-3 flex items-center gap-1 transition-colors"
                          >
                            <FileText size={14} />
                            <span>Admin Notunu Gör</span>
                          </button>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <Link
                            href={`/admin/emlak/uid=${ad.uid}`}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg flex items-center justify-center gap-1 transition-colors text-sm font-medium"
                          >
                            <Edit size={14} />
                            Düzenle
                          </Link>
                          <button
                            onClick={() =>
                              setDeleteConfirm({ open: true, ad: ad })
                            }
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-lg flex items-center justify-center gap-1 transition-colors text-sm font-medium"
                          >
                            <Trash2 size={14} />
                            Sil
                          </button>
                        </div>

                        {/* User Notes Button */}
                        <button
                          onClick={() =>
                            setAdUserNotes({ isOpen: true, ad: ad })
                          }
                          className="w-full mt-2 bg-gray-600 hover:bg-gray-700 text-white py-2 px-3 rounded-lg flex items-center justify-center gap-1 transition-colors text-sm font-medium"
                        >
                          <User size={14} />
                          Kullanıcı Notları
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

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
            </>
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
                  href={`/admin/emlak/edit?uid=${
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

        {/* Other Modals */}
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
                const aC = a.created.createdTimestamp;
                const bC = b.created.createdTimestamp;
                return bC - aC;
              })
            );
            setPage(0);
          }}
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
