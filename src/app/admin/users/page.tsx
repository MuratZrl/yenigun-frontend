"use client";

import React, { useState, useEffect } from "react";
import CreateUserModal from "@/app/components/modals/CreateUsersModal";
import { Poppins } from "next/font/google";
import { 
  Filter,
  Search, 
  List,
  Info,
  Edit,
  Trash2,
  ChevronDown,
  ChevronUp,
  Phone,
  IdCard,
  User,
  MapPin,
  Mail,
  Plus,
  AlertTriangle,
  StickyNote,
} from "lucide-react";
import UserFilterModal from "@/app/components/modals/UserFilterModals";
const PoppinsFont = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});
import EditUserModal from "@/app/components/modals/EditUserModal";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import Image from "next/image";
import ListUserModal from "@/app/components/modals/ListUserModals";
import AdminLayout from "@/app/components/layout/AdminLayout";
import AreYouSure from "@/app/components/AreYouSure";
import formatPhoneNumber from "@/app/utils/formatPhoneNumber";
import { useRouter } from "next/navigation";
import { Pagination, MobilePagination } from "@/app/components/Pagination";
import api from "@/app/lib/api";

const UserTableRow = ({
  user,
  onEdit,
  onDelete,
  onViewDetails,
  onViewLists,
}: any) => {
  if (!user) {
    return null;
  }
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <tr className="border-b border-gray-100 hover:bg-blue-50/30 transition-all duration-200 group">
        <td className="p-4 pl-6">
          <div className="flex items-center gap-4">
            {user.profilePicture ? (
              <Image
                width={44}
                height={44}
                className="w-11 h-11 object-cover rounded-xl shrink-0 shadow-sm"
                alt={`${user.name} ${user.surname}`}
                src={user.profilePicture}
              />
            ) : (
              <div className="w-11 h-11 bg-linear-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-semibold text-lg shrink-0 shadow-sm">
                {user.name[0]}
              </div>
            )}
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 truncate text-sm">
                {user.name} {user.surname}
              </p>
              <p className="text-gray-500 text-xs truncate mt-0.5">
                {user.mail.mail}
              </p>
            </div>
          </div>
        </td>

        <td className="p-4">
          <div className="flex flex-col gap-1.5">
            {user.phones.map((phone: any, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <Phone size={12} className="text-gray-400 shrink-0" />
                  <span className="text-gray-700 text-sm font-medium truncate">
                    {phone.number ? formatPhoneNumber(phone.number) : "Yok"}
                  </span>
                </div>
                {phone.isAbleToSendSMS ? (
                  <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-medium">
                    SMS
                  </span>
                ) : (
                  <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full font-medium">
                    SMS
                  </span>
                )}
              </div>
            ))}
          </div>
        </td>

        <td className="p-4">
          <div className="flex flex-col gap-1.5">
            <span
              className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                user.gender === "male"
                  ? "bg-blue-100 text-blue-700 border border-blue-200"
                  : "bg-pink-100 text-pink-700 border border-pink-200"
              }`}
            >
              {user.gender === "male" ? "Erkek" : "Kadın"}
            </span>
            <span
              className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                user.status === "Mülk Sahibi"
                  ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                  : user.status === "Satınalan"
                  ? "bg-blue-100 text-blue-700 border border-blue-200"
                  : user.status === "Kiralayan"
                  ? "bg-amber-100 text-amber-700 border border-amber-200"
                  : "bg-purple-100 text-purple-700 border border-purple-200"
              }`}
            >
              {user.status}
            </span>
          </div>
        </td>

        <td className="p-4">
          <div className="max-w-[200px]">
            <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
              {user.fulladdress}
            </p>
          </div>
        </td>

        <td className="p-4">
          <div className="flex items-center gap-1 transition-opacity duration-200">
            <button
              onClick={() => onViewDetails(user.uid)}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 shadow-sm"
              title="Detaylar"
            >
              <Info size={16} />
            </button>
            {user.status === "Mülk Sahibi" && (
              <button
                onClick={() => onViewLists(user.uid)}
                className="p-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all duration-200 shadow-sm"
                title="Listeler"
              >
                <List size={16} />
              </button>
            )}
            <button
              onClick={() => onEdit(user.uid)}
              className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all duration-200 shadow-sm"
              title="Düzenle"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={() => onDelete(user.uid, user)}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 shadow-sm"
              title="Sil"
            >
              <Trash2 size={16} />
            </button>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all duration-200 shadow-sm"
              title={isExpanded ? "Detayları Gizle" : "Detayları Göster"}
            >
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
        </td>
      </tr>

      {isExpanded && (
        <tr className="bg-linear-to-r from-blue-50/50 to-purple-50/50">
          <td colSpan={5} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                    Kimlik Bilgileri
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <IdCard size={14} className="text-gray-400" />
                      <span className="text-gray-600">TC:</span>
                      <span className="font-medium text-gray-900">
                        {user.tcNumber || "-"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <User size={14} className="text-gray-400" />
                      <span className="text-gray-600">Mernis:</span>
                      <span className="font-medium text-gray-900">
                        {user.mernisNo || "-"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                    Konum Bilgisi
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin size={14} className="text-gray-400" />
                      <span className="text-gray-600">Ülke:</span>
                      <span className="font-medium text-gray-900">
                        {user.country || "-"}
                      </span>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin size={14} className="text-gray-400 mt-0.5" />
                      <div>
                        <span className="text-gray-600">Adres:</span>
                        <p className="font-medium text-gray-900">
                          {user.city} / {user.county} / {user.neighbourhood}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                    İletişim
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail size={14} className="text-gray-400" />
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium text-gray-900 truncate">
                        {user.mail.mail}
                      </span>
                    </div>
                    {user.phones.map((phone: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-sm"
                      >
                        <Phone size={14} className="text-gray-400" />
                        <span className="text-gray-600">Tel {index + 1}:</span>
                        <span className="font-medium text-gray-900">
                          {phone.number
                            ? formatPhoneNumber(phone.number)
                            : "Yok"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                    Notlar
                  </label>
                  <div className="bg-white rounded-lg border border-gray-200 p-3">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {user.ideasAboutCustomer || "Not bulunmuyor"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

const UserCard = ({
  user,
  onEdit,
  onDelete,
  onViewDetails,
  onViewLists,
  onToggleExpand,
  isExpanded,
}: any) => {
  if (!user) {
    return null;
  }
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {user.profilePicture ? (
              <Image
                width={48}
                height={48}
                className="w-12 h-12 object-cover rounded-full shrink-0"
                alt={`${user.name} ${user.surname}`}
                src={user.profilePicture}
              />
            ) : (
              <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg shrink-0">
                {user.name[0]}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-gray-900 truncate">
                {user.name} {user.surname}
              </h3>
              <p className="text-sm text-gray-500 truncate">{user.mail.mail}</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onToggleExpand(user.uid)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
        </div>
      </div>
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                user.gender === "male"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-pink-100 text-pink-800"
              }`}
            >
              {user.gender === "male" ? "Erkek" : "Kadın"}
            </span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                user.status === "Mülk Sahibi"
                  ? "bg-green-100 text-green-800"
                  : user.status === "Satınalan"
                  ? "bg-blue-100 text-blue-800"
                  : user.status === "Kiralayan"
                  ? "bg-orange-100 text-orange-800"
                  : "bg-purple-100 text-purple-800"
              }`}
            >
              {user.status}
            </span>
          </div>
        </div>
        <div className="space-y-2">
          {user.phones.map((phone: any, index: number) => (
            <div
              key={index}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-center gap-2 text-gray-600">
                <Phone size={14} />
                <span>{formatPhoneNumber(phone.number || "Yok")}</span>
              </div>
              {phone.isAbleToSendSMS ? (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  SMS Aktif
                </span>
              ) : (
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                  SMS Pasif
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-start gap-2 text-sm text-gray-600">
          <MapPin size={14} className="mt-0.5 shrink-0" />
          <span className="line-clamp-2">{user.fulladdress}</span>
        </div>
      </div>

      <div className="p-4 border-t border-gray-100 bg-gray-50">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <button
              onClick={() => onViewDetails(user.uid)}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-white rounded-lg transition-colors"
              title="Detaylar"
            >
              <Info size={16} />
            </button>
            {user.status === "Mülk Sahibi" && (
              <button
                onClick={() => onViewLists(user.uid)}
                className="p-2 text-gray-600 hover:text-green-600 hover:bg-white rounded-lg transition-colors"
                title="Listeler"
              >
                <List size={16} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(user.uid)}
              className="p-2 text-gray-600 hover:text-green-600 hover:bg-white rounded-lg transition-colors"
              title="Düzenle"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={() => onDelete(user.uid, user)}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-white rounded-lg transition-colors"
              title="Sil"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <h4 className="font-semibold text-gray-900 mb-3 text-sm">
            Detaylı Bilgiler
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <IdCard size={14} className="text-gray-400" />
                <span className="text-gray-600">TC Kimlik:</span>
                <span className="font-medium">{user.tcNumber || "-"}</span>
              </div>
              <div className="flex items-center gap-2">
                <User size={14} className="text-gray-400" />
                <span className="text-gray-600">Mernis No:</span>
                <span className="font-medium">{user.mernisNo || "-"}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-gray-400" />
                <span className="text-gray-600">Ülke:</span>
                <span className="font-medium">{user.country || "-"}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <MapPin size={14} className="text-gray-400 mt-0.5" />
                <div>
                  <span className="text-gray-600">Adres:</span>
                  <p className="font-medium">
                    {user.city} / {user.county} / {user.neighbourhood}
                  </p>
                </div>
              </div>
              {user.ideasAboutCustomer && (
                <div className="flex items-start gap-2">
                  <span className="text-gray-600">Yorum:</span>
                  <p className="font-medium text-sm">
                    {user.ideasAboutCustomer}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Users = () => {
  const [cookies] = useCookies(["token"]);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [noteSearchLoading, setNoteSearchLoading] = useState(false);
  const [expandedUsers, setExpandedUsers] = useState<Set<string>>(new Set());
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [paginatedUsers, setPaginatedUsers] = useState<any[]>([]);
  const [pagination, setPagination] = useState({
    page: 0,
    rowsPerPage: 25,
    total: 0,
    apiPage: 1,
    apiLimit: 25,
  });

  const [noteSearch, setNoteSearch] = useState({
    text: "",
    active: false,
    loading: false,
  });

  const [newUser, setNewUser] = useState({
    image: "",
    name: "",
    lastname: "",
    gender: {
      selected: "Erkek",
      options: ["Erkek", "Kadın"],
    },
    status: {
      selected: "",
      options: ["Mülk Sahibi", "Satınalan", "Kiralayan", "Özel Müşteri"],
    },
    phones: [
      {
        phone: "",
        isSmS: true,
      },
    ],
    turkish_id: "",
    mernis_no: "",
    province: "Sakarya",
    district: "Serdivan",
    quarter: "Kazımpaşa Mh.",
    address: "",
    comment: "",
    owner_url: "",
    email: "",
    note: "",
    isSmS: true,
  }) as any;

  const [open, setOpen] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);

  const [filteredValues, setFilteredValues] = useState({
    fullname: "",
    email: "",
    phone: "",
    gender: "",
    status: {
      selected: "",
      options: ["Mülk Sahibi", "Satınalan", "Kiralayan", "Özel Müşteri"],
    },
    turkish_id: "",
    mernis_no: "",
    province: "",
    district: "",
    quarter: "",
  }) as any;

  const [deleteConfirm, setDeleteConfirm] = useState({
    open: false,
    uid: null,
    user: null,
  }) as any;

  useEffect(() => {
    const checkAuth = () => {
      const token = cookies.token;
      if (!token) {
        router.push("/login");
        return false;
      }
      setAuthChecked(true);
      return true;
    };

    checkAuth();
  }, [cookies.token, router]);

  const fetchAllCustomers = async () => {
    try {
      if (!cookies.token) {
        router.push("/login");
        return;
      }

      setLoading(true);

      let allData: any[] = [];
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        const response = await api.get(
          `/admin/customers?page=${page}&limit=100&sortBy=created&sortOrder=desc`
        );

        if (response.data.success && response.data.data.length > 0) {
          allData = [...allData, ...response.data.data];
          page++;

          if (response.data.data.length < 100) {
            hasMore = false;
          }
        } else {
          hasMore = false;
        }
      }

      console.log("Toplam veri çekildi:", allData.length);
      setAllUsers(allData);
      setFilteredUsers(allData);

      setPagination((prev) => ({
        ...prev,
        total: allData.length,
      }));
    } catch (error: any) {
      console.error("Müşteri getirme hatası:", error);
      if (error.response?.status === 401) {
        router.push("/login");
      }
      toast.error("Müşteriler yüklenirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authChecked && cookies.token) {
      fetchAllCustomers();
    }
  }, [authChecked, cookies.token]);

  useEffect(() => {
    const startIndex = pagination.page * pagination.rowsPerPage;
    const endIndex = startIndex + pagination.rowsPerPage;
    const currentPageData = filteredUsers.slice(startIndex, endIndex);
    setPaginatedUsers(currentPageData);
  }, [filteredUsers, pagination.page, pagination.rowsPerPage]);

  const handleToggleExpand = (userId: string) => {
    setExpandedUsers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  const handleEdit = (uid: string) => {
    const user = allUsers.find((u: any) => u.uid === uid);
    if (user) {
      setEditUser({ open: true, user });
    }
  };

  const handleViewDetails = (uid: string) => {
    window.open(`/admin/users/${uid}/`);
  };

  const handleViewLists = (uid: string) => {
    const user = allUsers.find((u: any) => u.uid === uid);
    if (user) {
      setListOpen({ open: true, user });
    }
  };

  const handleDelete = (uid: string, user: any) => {
    setDeleteConfirm({ open: true, uid, user });
  };

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newRowsPerPage = parseInt(event.target.value);
    setPagination((prev) => ({
      ...prev,
      rowsPerPage: newRowsPerPage,
      page: 0,
    }));
  };

  const searchByNote = async (searchText: string) => {
    if (!searchText.trim()) {
      setNoteSearch({ text: "", active: false, loading: false });
      setFilteredUsers(allUsers);
      setPagination((prev) => ({
        ...prev,
        page: 0,
        total: allUsers.length,
      }));
      return;
    }

    try {
      setNoteSearch({ text: searchText, active: true, loading: true });
      setLoading(true);

      const response = await api.get(
        `/admin/customers/note-search?note=${encodeURIComponent(
          searchText
        )}&page=1&limit=100`
      );

      if (response.data.success) {
        const searchResults = response.data.data || [];
        setFilteredUsers(searchResults);
        setPagination((prev) => ({
          ...prev,
          page: 0,
          total: searchResults.length,
        }));
        toast.success(`${searchResults.length} müşteri bulundu`);
      } else {
        toast.error("Not araması sırasında bir hata oluştu");
      }
    } catch (error: any) {
      console.error("Not arama hatası:", error);
      toast.error(
        error.response?.data?.message || "Not araması sırasında bir hata oluştu"
      );
    } finally {
      setNoteSearch((prev) => ({ ...prev, loading: false }));
      setLoading(false);
    }
  };

  const clearNoteSearch = () => {
    setNoteSearch({ text: "", active: false, loading: false });
    setFilteredUsers(allUsers);
    setPagination((prev) => ({
      ...prev,
      page: 0,
      total: allUsers.length,
    }));
  };

  const handleCleanFilters = () => {
    setFilteredValues({
      fullname: "",
      email: "",
      phone: "",
      gender: "",
      status: {
        selected: "",
        options: ["Mülk Sahibi", "Satınalan", "Kiralayan", "Özel Müşteri"],
      },
      turkish_id: "",
      mernis_no: "",
      province: "",
      district: "",
      quarter: "",
    });
    if (noteSearch.active) {
      clearNoteSearch();
    } else {
      setFilteredUsers(allUsers);
    }
  };

  const handleConfirmDelete = () => {
    const { uid } = deleteConfirm;
    api
      .post("/admin/delete-customer", {
        uid,
      })
      .then((res) => {
        toast.success(res.data.message);
        fetchAllCustomers();
        setDeleteConfirm({ open: false, uid: null, user: null });
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "Silme işlemi başarısız");
        setDeleteConfirm({ open: false, uid: null, user: null });
      });
  };

  const handleFilterUsers = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    setOpenFilter(false);

    if (noteSearch.active) {
      clearNoteSearch();
    }

    const hasActiveFilters =
      filteredValues.fullname ||
      filteredValues.email ||
      filteredValues.phone ||
      filteredValues.gender ||
      filteredValues.status.selected ||
      filteredValues.turkish_id ||
      filteredValues.mernis_no ||
      filteredValues.province ||
      filteredValues.district ||
      filteredValues.quarter;

    if (!hasActiveFilters) {
      setFilteredUsers(allUsers);
      setPagination((prev) => ({ ...prev, page: 0 }));
      return;
    }

    const filteredData = allUsers.filter((user: any) => {
      if (filteredValues.fullname) {
        const fullName = `${user.name || ""} ${
          user.surname || ""
        }`.toLowerCase();
        if (!fullName.includes(filteredValues.fullname.toLowerCase()))
          return false;
      }

      if (filteredValues.email) {
        const userEmail = user.mail?.mail || "";
        if (
          !userEmail.toLowerCase().includes(filteredValues.email.toLowerCase())
        )
          return false;
      }

      if (filteredValues.phone) {
        const hasPhone = user.phones?.some((phone: any) => {
          const phoneNumber = phone.number || "";
          return phoneNumber.includes(filteredValues.phone);
        });
        if (!hasPhone) return false;
      }

      if (filteredValues.gender) {
        const userGender = user.gender || "";
        const genderMap: Record<string, string> = {
          erkek: "male",
          kadın: "female",
          male: "male",
          female: "female",
        };

        const normalizedFilterGender =
          genderMap[filteredValues.gender.toLowerCase()];
        if (userGender !== normalizedFilterGender) return false;
      }

      if (filteredValues.status.selected) {
        const userStatus = user.status || "";
        if (userStatus !== filteredValues.status.selected) return false;
      }

      if (filteredValues.turkish_id) {
        const userTc = user.tcNumber || "";
        if (!userTc.includes(filteredValues.turkish_id)) return false;
      }

      if (filteredValues.mernis_no) {
        const userMernis = user.mernisNo || "";
        if (!userMernis.includes(filteredValues.mernis_no)) return false;
      }

      if (filteredValues.province) {
        const userCity = user.city || "";
        if (
          !userCity
            .toLowerCase()
            .includes(filteredValues.province.toLowerCase())
        )
          return false;
      }

      if (filteredValues.district) {
        const userCounty = user.county || "";
        if (
          !userCounty
            .toLowerCase()
            .includes(filteredValues.district.toLowerCase())
        )
          return false;
      }

      if (filteredValues.quarter) {
        const userNeighbourhood = user.neighbourhood || "";
        if (
          !userNeighbourhood
            .toLowerCase()
            .includes(filteredValues.quarter.toLowerCase())
        )
          return false;
      }

      return true;
    });

    console.log("Filtrelenen veri sayısı:", filteredData.length);
    console.log("Aktif filtreler:", {
      status: filteredValues.status.selected,
      gender: filteredValues.gender,
      email: filteredValues.email,
      phone: filteredValues.phone,
    });

    setFilteredUsers(filteredData);
    setPagination((prev) => ({
      ...prev,
      page: 0,
      total: filteredData.length,
    }));
  };

  const [editUser, setEditUser] = useState({
    user: {},
    open: false,
  } as any);

  const [listOpen, setListOpen] = useState({
    open: false,
    uid: "",
  } as any);

  const startIndex = pagination.page * pagination.rowsPerPage;
  const endIndex = Math.min(
    startIndex + pagination.rowsPerPage,
    pagination.total
  );
  const totalPages = Math.ceil(pagination.total / pagination.rowsPerPage);
  const viewMode = isMobile ? "grid" : "table";

  if (!authChecked) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="w-full min-h-screen bg-gray-50" style={PoppinsFont.style}>
        <div className="pt-5 pl-5 pr-5 mb-6 lg:mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold bg-linear-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Müşteri Yönetimi
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Müşterileri yönetin, filtreleyin ve notlarında arama yapın
              </p>
            </div>

            <button
              className="bg-linear-to-r from-blue-600 to-purple-600 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 group font-semibold text-sm lg:text-base w-full lg:w-auto justify-center"
              onClick={() => setOpen(true)}
            >
              <Plus
                size={18}
                className="group-hover:rotate-90 transition-transform duration-200"
              />
              Yeni Müşteri Ekle
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-white rounded-xl shadow-sm border p-4 lg:p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-4">
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <div className="relative flex-1">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="İsim, soyisim veya email ile ara..."
                    className="w-full pl-10 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                    value={filteredValues.fullname || ""}
                    onChange={(e) =>
                      setFilteredValues({
                        ...filteredValues,
                        fullname: e.target.value,
                      })
                    }
                    onKeyPress={(e) => e.key === "Enter" && handleFilterUsers()}
                  />
                </div>

                <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
                  <button
                    onClick={handleFilterUsers}
                    className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white px-4 py-2.5 sm:py-3 rounded-lg font-medium transition-colors duration-200 flex-1 sm:flex-none text-sm sm:text-base"
                  >
                    <Search size={18} className="sm:size-4" />
                    <span>Ara</span>
                  </button>

                  <button
                    onClick={() => setOpenFilter(true)}
                    className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-900 text-white px-4 py-2.5 sm:py-3 rounded-lg font-medium transition-colors duration-200 flex-1 sm:flex-none text-sm sm:text-base"
                  >
                    <Filter size={16} className="sm:size-4" />
                    <span>Filtrele</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <StickyNote
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Müşteri notlarında ara..."
                    className="w-full pl-10 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                    value={noteSearch.text}
                    onChange={(e) =>
                      setNoteSearch((prev) => ({
                        ...prev,
                        text: e.target.value,
                      }))
                    }
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        searchByNote(noteSearch.text);
                      }
                    }}
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => searchByNote(noteSearch.text)}
                    disabled={noteSearch.loading}
                    className="flex items-center justify-center gap-2 bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 py-2.5 sm:py-3 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex-1 sm:flex-none text-sm sm:text-base"
                  >
                    {noteSearch.loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Aranıyor...</span>
                      </>
                    ) : (
                      <>
                        <StickyNote size={16} className="sm:size-4" />
                        <span>Notlarda Ara</span>
                      </>
                    )}
                  </button>

                  {noteSearch.active && (
                    <button
                      onClick={clearNoteSearch}
                      className="flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2.5 sm:py-3 rounded-lg font-medium transition-colors duration-200 flex-1 sm:flex-none text-sm sm:text-base"
                    >
                      <span>Not Aramayı Temizle</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
            {filteredUsers.length < allUsers.length && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
                <AlertTriangle
                  size={18}
                  className="text-yellow-600 mt-0.5 shrink-0"
                />
                <div className="flex-1">
                  <p className="text-yellow-800 text-sm">
                    <strong>Aktif filtreleme</strong> uygulanıyor.{" "}
                    <button
                      onClick={handleCleanFilters}
                      className="underline hover:text-yellow-900 font-medium"
                    >
                      Filtreleri temizlemek için tıklayın
                    </button>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
                  {paginatedUsers.map((user: any) => (
                    <UserCard
                      key={user.uid}
                      user={user}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onViewDetails={handleViewDetails}
                      onViewLists={handleViewLists}
                      onToggleExpand={handleToggleExpand}
                      isExpanded={expandedUsers.has(user.uid)}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-linear-to-r from-gray-50 to-blue-50/30 border-b border-gray-200">
                        <tr>
                          <th className="p-4 pl-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Kullanıcı Bilgisi
                          </th>
                          <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            İletişim
                          </th>
                          <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Durum
                          </th>
                          <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Adres
                          </th>
                          <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-48">
                            İşlemler
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {paginatedUsers.map((user: any) => (
                          <UserTableRow
                            key={user.uid}
                            user={user}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onViewDetails={handleViewDetails}
                            onViewLists={handleViewLists}
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {paginatedUsers.length === 0 && !loading && (
                <div className="text-center py-12">
                  <div className="bg-white rounded-2xl shadow-sm border p-8 max-w-md mx-auto">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <User className="text-gray-400" size={24} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Kullanıcı bulunamadı
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {filteredUsers.length === 0
                        ? "Henüz hiç kullanıcı bulunmuyor."
                        : "Filtre kriterlerinize uygun kullanıcı bulunamadı."}
                    </p>
                    {filteredUsers.length === 0 ? (
                      <button
                        onClick={() => setOpen(true)}
                        className="text-custom-orange hover:text-orange-600 font-medium text-sm"
                      >
                        İlk kullanıcıyı ekle
                      </button>
                    ) : (
                      <button
                        onClick={handleCleanFilters}
                        className="text-custom-orange hover:text-orange-600 font-medium text-sm"
                      >
                        Filtreleri temizle
                      </button>
                    )}
                  </div>
                </div>
              )}

              {pagination.total > 0 && (
                <>
                  {isMobile ? (
                    <MobilePagination
                      page={pagination.page}
                      totalPages={totalPages}
                      rowsPerPage={pagination.rowsPerPage}
                      totalItems={pagination.total}
                      startIndex={startIndex}
                      endIndex={endIndex}
                      onPageChange={handlePageChange}
                      onRowsPerPageChange={handleRowsPerPageChange}
                    />
                  ) : (
                    <Pagination
                      page={pagination.page}
                      totalPages={totalPages}
                      rowsPerPage={pagination.rowsPerPage}
                      totalItems={pagination.total}
                      startIndex={startIndex}
                      endIndex={endIndex}
                      onPageChange={handlePageChange}
                      onRowsPerPageChange={handleRowsPerPageChange}
                    />
                  )}
                </>
              )}
            </>
          )}
        </div>

        <CreateUserModal
          open={open}
          setOpen={setOpen}
          newUser={newUser}
          setNewUser={setNewUser}
          cookies={cookies}
        />
        <UserFilterModal
          open={openFilter}
          setOpen={setOpenFilter}
          filteredValues={filteredValues}
          handleFilterUsers={handleFilterUsers}
          setFilteredValues={setFilteredValues}
          handleCleanFilters={handleCleanFilters}
        />

        {editUser.user && (
          <EditUserModal
            open={editUser.open}
            setOpen={setEditUser}
            user={editUser.user}
            cookies={cookies}
          />
        )}

        <ListUserModal
          open={listOpen.open}
          setOpen={setListOpen}
          user={listOpen.user}
          cookies={cookies}
        />

        <AreYouSure
          open={deleteConfirm.open}
          onClose={() =>
            setDeleteConfirm({ open: false, uid: null, user: null })
          }
          onConfirm={handleConfirmDelete}
          title={`${deleteConfirm.user?.name} ${deleteConfirm.user?.surname} kullanıcısını silmek istiyor musunuz?`}
          message="Bu işlem geri alınamaz. Kullanıcıya ait tüm veriler kalıcı olarak silinecektir."
          confirmText="Evet, Sil"
          cancelText="İptal"
          type="delete"
        />
      </div>
    </AdminLayout>
  );
};

export default Users;
