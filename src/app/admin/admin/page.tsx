"use client";
import { useState, useEffect } from "react";
import { Poppins } from "next/font/google";
import {
  Search,
  AlertTriangle,
  Edit,
  Trash2,
  Eye,
  Plus,
  Filter,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
} from "lucide-react";
const PoppinsFont = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});
import { useCookies } from "react-cookie";
import axios from "axios";
import { toast } from "react-toastify";
import Image from "next/image";
import CreateAdmin from "@/app/components/modals/CreateAdminModal";
import EditAdminModal from "@/app/components/modals/EditAdminModal";
import AdminLayout from "@/app/components/layout/AdminLayout";
import AreYouSure from "@/app/components/AreYouSure";
import formatPhoneNumber from "@/app/utils/formatPhoneNumber";
import { useRouter } from "next/navigation";
import { Pagination, MobilePagination } from "@/app/components/Pagination";
import api from "@/app/lib/api";

const Avatar = ({
  name,
  className = "",
}: {
  name: string;
  className?: string;
}) => {
  return (
    <div
      className={`flex items-center justify-center rounded-full bg-linear-to-r from-blue-500 to-purple-600 text-white font-semibold ${className}`}
    >
      {name[0]?.toUpperCase()}
    </div>
  );
};

const StatusBadge = ({ role }: { role: string }) => {
  const getRoleStyles = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "moderator":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "editor":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium border ${getRoleStyles(
        role,
      )}`}
    >
      {role}
    </span>
  );
};

const MobileCard = ({ row, setEdit, setDeleteConfirm }: any) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {row.profilePicture ? (
            <div className="relative">
              <Image
                width={44}
                height={44}
                className="w-11 h-11 object-cover rounded-xl border-2 border-white shadow-sm"
                alt={`${row.name} ${row.surname}`}
                src={row.profilePicture}
              />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
          ) : (
            <Avatar name={row.name} className="w-11 h-11 text-sm" />
          )}
          <div>
            <div className="font-semibold text-gray-900">{`${row.name} ${row.surname}`}</div>
            <div className="text-sm text-gray-500">{row.mail}</div>
          </div>
        </div>

        {/* Mobile Actions Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"
          >
            <MoreVertical size={18} />
          </button>

          {showActions && (
            <div className="absolute right-0 top-10 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-10 min-w-[120px]">
              <button
                onClick={() => {
                  window.open(`/admin/details/${row.uid}`, "_blank");
                  setShowActions(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <Eye size={16} />
                Detaylar
              </button>
              <button
                onClick={() => {
                  setEdit({ user: row, open: true });
                  setShowActions(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <Edit size={16} />
                Düzenle
              </button>
              <button
                onClick={() => {
                  setDeleteConfirm({ open: true, uid: row.uid, user: row });
                  setShowActions(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <Trash2 size={16} />
                Sil
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <span className="text-gray-500">Cinsiyet</span>
          <div className="font-medium text-gray-900">
            {row.gender === "male" ? "Erkek" : "Kadın"}
          </div>
        </div>
        <div>
          <span className="text-gray-500">Rol</span>
          <div className="mt-1">
            <StatusBadge role={row.role} />
          </div>
        </div>
        <div>
          <span className="text-gray-500">Telefon</span>
          <div className="font-medium text-gray-900">
            {formatPhoneNumber(row.gsmNumber)}
          </div>
        </div>
        <div>
          <span className="text-gray-500">Doğum Tarihi</span>
          <div className="font-medium text-gray-900">
            {row.birth.day}/{row.birth.month}/{row.birth.year}
          </div>
        </div>
      </div>
    </div>
  );
};

const DesktopRow = ({ row, setEdit, setDeleteConfirm }: any) => {
  return (
    <tr className="hover:bg-linear-to-r hover:from-gray-50 hover:to-blue-50/30 duration-300 border-b border-gray-100 group">
      <td className="px-4 lg:px-6 py-4">
        <div className="flex items-center gap-3">
          {row.profilePicture ? (
            <div className="relative">
              <Image
                width={44}
                height={44}
                className="w-11 h-11 object-cover rounded-xl border-2 border-white shadow-sm"
                alt={`${row.name} ${row.surname}`}
                src={row.profilePicture}
              />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
          ) : (
            <Avatar name={row.name} className="w-11 h-11 text-sm" />
          )}
          <div>
            <div className="font-semibold text-gray-900">{`${row.name} ${row.surname}`}</div>
            <div className="text-sm text-gray-500">{row.mail}</div>
          </div>
        </div>
      </td>
      <td className="px-4 lg:px-6 py-4">
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">Cinsiyet</span>
          <span className="font-medium text-gray-900">
            {row.gender === "male" ? "Erkek" : "Kadın"}
          </span>
        </div>
      </td>
      <td className="px-4 lg:px-6 py-4">
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">Rol</span>
          <StatusBadge role={row.role} />
        </div>
      </td>
      <td className="px-4 lg:px-6 py-4">
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">Telefon</span>
          <span className="font-medium text-gray-900">
            {formatPhoneNumber(row.gsmNumber)}
          </span>
        </div>
      </td>
      <td className="px-4 lg:px-6 py-4">
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">Doğum Tarihi</span>
          <span className="font-medium text-gray-900">
            {row.birth.day}/{row.birth.month}/{row.birth.year}
          </span>
        </div>
      </td>
      <td className="px-4 lg:px-6 py-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.open(`/admin/details/${row.uid}`, "_blank")}
            className="p-2.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 group relative"
          >
            <Eye size={18} />
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
              Detaylar
            </div>
          </button>
          <button
            onClick={() => setEdit({ user: row, open: true })}
            className="p-2.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all duration-200 group relative"
          >
            <Edit size={18} />
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
              Düzenle
            </div>
          </button>
          <button
            onClick={() =>
              setDeleteConfirm({ open: true, uid: row.uid, user: row })
            }
            className="p-2.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group relative"
          >
            <Trash2 size={18} />
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
              Sil
            </div>
          </button>
        </div>
      </td>
    </tr>
  );
};

const Admin = () => {
  const [cookies] = useCookies(["token"]);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [users, setUsers] = useState([]) as any;
  const [listUsers, setListUsers] = useState(users) as any[];
  const [newUser, setNewUser] = useState({
    name: "",
    surname: "",
    mail: "",
    gsmNumber: "",
    password: "",
    role: "",
    image: "",
    birthDate: "",
  }) as any;

  const [open, setOpen] = useState(false);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(25);

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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

  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const totalPages = Math.ceil(listUsers.length / rowsPerPage);
  const paginatedUsers = listUsers.slice(startIndex, endIndex);

  const [filteredValues, setFilteredValues] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState({
    open: false,
    uid: null,
    user: null,
  }) as any;

  const handleCleanFilters = () => {
    setFilteredValues("");
    setListUsers(users);
  };

  const handleConfirmDelete = () => {
    const { uid } = deleteConfirm;
    const newUsers = users.filter((user: any) => user.uid !== uid);

    api
      .post("/admin/delete-admin", { uid })
      .then((res) => {
        toast.success(res.data.message);
        setUsers(newUsers);
        setListUsers(newUsers);
        setDeleteConfirm({ open: false, uid: null, user: null });
      })
      .catch((err) => {
        toast.error(err.response.data.message);
        setDeleteConfirm({ open: false, uid: null, user: null });
      });
  };

  useEffect(() => {
    setAuthChecked(true);

    api
      .get("/admin/users")
      .then((res) => {
        setUsers(res.data.data);
        setListUsers(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.error("Error fetching users:", err);
      });
  }, [cookies.token, router]);
  const handleFilterUsers = () => {
    const filteredUsers = users.filter((user: any) => {
      return (
        user.name.toLowerCase().includes(filteredValues) ||
        user.surname.toLowerCase().includes(filteredValues) ||
        user.mail.toLowerCase().includes(filteredValues) ||
        user.gsmNumber.toLowerCase().includes(filteredValues)
      );
    });
    setListUsers(filteredUsers);
  };

  const [editUser, setEditUser] = useState({
    user: {},
    open: false,
  } as any);

  if (!authChecked || loading) {
    return (
      <AdminLayout>
        <div className={`${PoppinsFont.className} p-6`}>
          <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <div className="text-lg text-gray-600">Yükleniyor...</div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div
        className="w-full min-h-screen bg-linear-to-br from-gray-50 to-blue-50/30"
        style={PoppinsFont.style}
      >
        <div className="p-4 lg:p-6 max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-6 lg:mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold bg-linear-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Yetkili Yönetimi
                </h1>
                <p className="text-gray-600 mt-2 text-sm lg:text-base">
                  Toplam {listUsers.length} yetkili bulunuyor
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
                Yeni Yetkili Ekle
              </button>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 lg:p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full">
                <div className="relative flex-1">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="İsim, email veya telefon ile ara..."
                    className="w-full pl-10 pr-4 py-2 lg:py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 text-sm lg:text-base"
                    value={filteredValues}
                    onChange={(e) =>
                      setFilteredValues(e.target.value.toLowerCase())
                    }
                    onKeyPress={(e) => e.key === "Enter" && handleFilterUsers()}
                  />
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    className="bg-gray-800 text-white hover:bg-gray-900 duration-200 px-4 lg:px-6 py-2 lg:py-3 rounded-xl flex items-center gap-2 font-medium transition-all hover:shadow-lg text-sm lg:text-base flex-1 sm:flex-none justify-center"
                    onClick={handleFilterUsers}
                  >
                    <Filter size={16} />
                    Filtrele
                  </button>

                  {listUsers.length < users.length && (
                    <button
                      className="border border-gray-300 text-gray-700 hover:bg-gray-50 duration-200 px-4 py-2 lg:py-3 rounded-xl flex items-center gap-2 font-medium transition-all text-sm lg:text-base flex-1 sm:flex-none justify-center"
                      onClick={handleCleanFilters}
                    >
                      Temizle
                    </button>
                  )}
                </div>
              </div>
            </div>

            {listUsers.length < users.length && (
              <div className="mt-4 p-3 lg:p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-center gap-3">
                <AlertTriangle size={18} className="text-yellow-600 shrink-0" />
                <div className="text-xs lg:text-sm text-yellow-800">
                  <span className="font-medium">Aktif filtreleme:</span>{" "}
                  {users.length - listUsers.length} kayıt filtrelendi.{" "}
                  <button
                    className="underline font-medium hover:text-yellow-900 transition-colors"
                    onClick={handleCleanFilters}
                  >
                    Tümünü göster
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Desktop Table (lg ve üzeri ekranlar) */}
          <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-auto">
              <table className="w-full">
                <thead className="bg-linear-to-r from-gray-50 to-gray-75">
                  <tr>
                    {[
                      "Kullanıcı",
                      "Cinsiyet",
                      "Rol",
                      "İletişim",
                      "Doğum Tarihi",
                      "İşlemler",
                    ].map((header, index) => (
                      <th
                        key={index}
                        className="px-6 py-4 font-semibold text-gray-700 text-left text-sm uppercase tracking-wider border-b border-gray-200"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading && (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                          <div className="text-gray-600">Yükleniyor...</div>
                        </div>
                      </td>
                    </tr>
                  )}
                  {!loading && paginatedUsers.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center gap-3 text-gray-500">
                          <Search size={48} className="text-gray-300" />
                          <div className="text-lg font-medium">
                            Kayıt bulunamadı
                          </div>
                          <p className="text-gray-400">
                            Arama kriterlerinize uygun sonuç bulunamadı.
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                  {paginatedUsers.map((row: any) => (
                    <DesktopRow
                      key={row.uid}
                      row={row}
                      setEdit={setEditUser}
                      setDeleteConfirm={setDeleteConfirm}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Desktop Pagination */}
            <Pagination
              page={page}
              totalPages={totalPages}
              rowsPerPage={rowsPerPage}
              totalItems={listUsers.length}
              startIndex={startIndex}
              endIndex={endIndex}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </div>

          {/* Mobile Cards (lg altı ekranlar) */}
          <div className="lg:hidden">
            {loading && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <div className="text-gray-600">Yükleniyor...</div>
                </div>
              </div>
            )}

            {!loading && paginatedUsers.length === 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
                <div className="flex flex-col items-center gap-3 text-gray-500">
                  <Search size={48} className="text-gray-300" />
                  <div className="text-lg font-medium">Kayıt bulunamadı</div>
                  <p className="text-gray-400 text-sm">
                    Arama kriterlerinize uygun sonuç bulunamadı.
                  </p>
                </div>
              </div>
            )}

            {paginatedUsers.map((row: any) => (
              <MobileCard
                key={row.uid}
                row={row}
                setEdit={setEditUser}
                setDeleteConfirm={setDeleteConfirm}
              />
            ))}

            {/* Mobile Pagination */}
            {paginatedUsers.length > 0 && (
              <MobilePagination
                page={page}
                totalPages={totalPages}
                rowsPerPage={rowsPerPage}
                totalItems={listUsers.length}
                startIndex={startIndex}
                endIndex={endIndex}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            )}
          </div>
        </div>

        {/* Modals */}
        <CreateAdmin
          open={open}
          setOpen={setOpen}
          newUser={newUser}
          setNewUser={setNewUser}
          cookies={cookies}
        />

        <EditAdminModal
          open={editUser.open}
          setOpen={setEditUser}
          user={editUser.user}
          cookies={cookies}
        />

        <AreYouSure
          open={deleteConfirm.open}
          onClose={() =>
            setDeleteConfirm({ open: false, uid: null, user: null })
          }
          onConfirm={handleConfirmDelete}
          title={`${deleteConfirm.user?.name} ${deleteConfirm.user?.surname} yetkilisini silmek istiyor musunuz?`}
          message="Bu işlem geri alınamaz. Yetkiliye ait tüm veriler kalıcı olarak silinecektir."
          confirmText="Evet, Sil"
          cancelText="İptal"
          type="delete"
        />
      </div>
    </AdminLayout>
  );
};

export default Admin;
