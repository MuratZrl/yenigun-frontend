"use client";
import React, { useState, useEffect } from "react";
import { Poppins } from "next/font/google";
import {
  Search,
  Filter,
  AlertTriangle,
  Edit,
  Trash2,
  MessageCircle,
  Phone,
  ChevronLeft,
  ChevronRight,
  X,
  Plus,
  User,
  Users,
  Send,
} from "lucide-react";
import UserFilterModal from "@/app/components/modals/UserFilterModals";
import CreateGroupModal from "@/app/components/modals/CreateGruopModal";
import EditGroupModal from "@/app/components/modals/EditGroupModal";
const PoppinsFont = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});
import SendMessage from "@/app/components/modals/SendMessages";
import { useCookies } from "react-cookie";
import AdminLayout from "@/app/components/layout/AdminLayout";
import formatPhoneNumber from "@/app/utils/formatPhoneNumber";
import { useRouter } from "next/navigation";
import { checkAuth } from "@/app/lib/auth";
import api from "@/app/lib/api";

const Table = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <table className={`w-full border-collapse ${className}`}>{children}</table>
);

const TableHead = ({ children }: { children: React.ReactNode }) => (
  <thead className="bg-gray-50">{children}</thead>
);

const TableBody = ({ children }: { children: React.ReactNode }) => (
  <tbody>{children}</tbody>
);

const TableRow = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => <tr className={`border-b border-gray-200 ${className}`}>{children}</tr>;

const TableCell = ({
  children,
  className = "",
  colSpan,
}: {
  children: React.ReactNode;
  className?: string;
  colSpan?: number;
}) => (
  <td className={`p-3 border-x border-gray-200 ${className}`} colSpan={colSpan}>
    {children}
  </td>
);

const TableHeaderCell = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <th
    className={`p-3 text-left font-semibold text-gray-700 border-x border-gray-200 bg-gray-100 ${className}`}
  >
    {children}
  </th>
);

const Row = ({
  row,
  checkedItems,
  setCheckedItems,
  sendMessage,
  setSendMessage,
}: any) => {
  const handleSendWhatsapp = (id: any) => {
    setSendMessage({ open: true, type: ["whatsapp"], users: [id] });
  };

  const handleSendSms = (id: any) => {
    setSendMessage({ open: true, type: ["sms"], users: [id] });
  };

  const handleChange = (event: any, row: any) => {
    if (event.target.checked) {
      setCheckedItems([...checkedItems, row]);
    } else {
      setCheckedItems(checkedItems.filter((item: any) => item.uid !== row.uid));
    }
  };

  return (
    <TableRow className="hover:bg-custom-orange-dark/10 duration-300">
      <TableCell>
        <input
          type="checkbox"
          checked={checkedItems.some((item: any) => item.uid === row.uid)}
          onChange={(e) => handleChange(e, row)}
          name={row.uid.toString()}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
        />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-3">
          {row.image ? (
            <img
              src={row.image}
              alt={`${row.name} ${row.surname}`}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
              {row.name[0]}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-gray-900 truncate">
              {`${row.name} ${row.surname}`}
            </div>
            <div className="text-xs text-gray-500 truncate mt-0.5">
              {row.mail.mail}
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell>{row.gender === "male" ? "Erkek" : "Kadın"}</TableCell>
      <TableCell>{row.status}</TableCell>
      <TableCell>
        {row.phones.map((phone: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <p className="text-sm">
              {formatPhoneNumber(phone.number || "Bulunamadı")}
            </p>
            {phone.isAbleToSendSMS ? (
              <span className="text-green-500 text-xs bg-green-50 px-1 rounded">
                SMS
              </span>
            ) : (
              <span className="text-red-500 text-xs bg-red-50 px-1 rounded">
                SMS
              </span>
            )}
          </div>
        ))}
      </TableCell>
      <TableCell>{row.fulladdress}</TableCell>
      <TableCell>
        <div className="flex gap-2">
          <button
            onClick={() => handleSendWhatsapp(row.id)}
            className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
            title="WhatsApp"
          >
            <MessageCircle size={18} />
          </button>
          <button
            onClick={() => handleSendSms(row.id)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="SMS"
          >
            <Phone size={18} />
          </button>
        </div>
      </TableCell>
    </TableRow>
  );
};

const Message = () => {
  const [cookies] = useCookies(["token"]);
  const router = useRouter();
  const [users, setUsers] = useState([]) as any;
  const [listUsers, setListUsers] = useState(users) as any[];
  const [checkedItems, setCheckedItems] = useState([]) as any;
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [groups, setGroups] = useState([
    {
      uid: 1,
      name: "Sakarya Grubu",
      users: [1, 2],
      description:
        "Sakarya ilindeki tüm yenigün emlak müşterileri (kiracılar, ev sahipleri ve özel müşteriler )",
    },
    {
      uid: 2,
      name: "Ankara Ev Sahipleri",
      users: [2],
      description:
        "Ankara ilindeki tüm yenigün emlak müşterileri (sadece ev sahipleri)",
    },
    {
      uid: 3,
      name: "Özel Müşteriler",
      users: [1, 2],
      description: "Yenigün emlak tüm özel müşterileri",
    },
  ]);

  useEffect(() => {
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
    if (!isAuthenticated) return;

    api
      .get("/admin/customers")
      .then((res) => {
        setUsers(res.data.data);
        setListUsers(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Kullanıcıları getirme hatası:", err);
        setLoading(false);
        if (err.response?.status === 401) {
          router.push("/login");
        }
      });
  }, [isAuthenticated, router]);

  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
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
  const [editModal, setEditModal] = useState({
    open: false,
    group: {},
  }) as any;
  const [sendMessage, setSendMessage] = useState({
    open: false,
    type: ["whatsapp", "sms"],
    users: [],
  });

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
    setListUsers(users);
  };

  const safeValue = (value: string | undefined | null) => value || "";

  const handleFilterUsers = () => {
    setOpenFilter(false);

    const filterFullname = users.filter((user: any) => {
      if (!filteredValues.fullname) return true;
      const nameFilter = user.name
        .toLowerCase()
        .includes(filteredValues.fullname.toLowerCase());
      const surnameFilter = user.surname
        .toLowerCase()
        .includes(filteredValues.fullname.toLowerCase());
      const fullname = `${user.name.toLowerCase()} ${user.surname.toLowerCase()}`;
      return (
        nameFilter ||
        surnameFilter ||
        fullname.includes(filteredValues.fullname.toLowerCase())
      );
    });
    const filterEmail = users.filter((user: any) => {
      if (!filteredValues.email) return true;
      return user.mail.mail.startsWith(filteredValues.email);
    });
    const filterPhone = users.filter((user: any) => {
      if (!filteredValues.phone) return true;
      const filterPhone = user.phones.map((phone: any) => phone.number);
      return filterPhone.includes(filteredValues.phone);
    });
    const filterGender = users.filter((user: any) => {
      if (!filteredValues.gender) return true;
      const filteredGender =
        filteredValues.gender === "Erkek" ? "male" : "female";
      return user.gender === filteredGender;
    });
    const filterStatus = users.filter((user: any) => {
      if (!filteredValues.status.selected) return true;
      return user.status.includes(filteredValues.status.selected);
    });

    const filterTurkishId = users.filter((user: any) => {
      if (!filteredValues.turkish_id) return true;
      return user.tcNumber.includes(filteredValues.turkish_id);
    });
    const filterMernisNo = users.filter((user: any) => {
      if (!filteredValues.mernis_no) return true;
      return user.mernisNo.includes(filteredValues.mernis_no);
    });
    const filterProvince = users.filter((user: any) => {
      if (!filteredValues.province) return true;
      return user.city.includes(filteredValues.province);
    });
    const filterDistrict = users.filter((user: any) => {
      if (!filteredValues.district) return true;
      return user.county.includes(filteredValues.district);
    });
    const filterQuarter = users.filter((user: any) => {
      if (!filteredValues.quarter) return true;
      return user.neighbourhood.includes(filteredValues.quarter);
    });
    const filterValues = [
      filterFullname,
      filterEmail,
      filterPhone,
      filterGender,
      filterStatus,
      filterTurkishId,
      filterMernisNo,
      filterProvince,
      filterDistrict,
      filterQuarter,
    ];
    const filteredUsers = filterValues.reduce((acc, val) =>
      acc.filter((user: any) => val.includes(user))
    );
    setListUsers(filteredUsers);
  };

  const handleEditGroup = (group: any) => () => {
    setEditModal({ open: true, group: group });
  };

  const handleDeleteGroup = (group: any) => {
    setGroups(groups.filter((g) => g.name !== group.name));
  };

  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedUsers = listUsers.slice(startIndex, endIndex);
  const totalPages = Math.ceil(listUsers.length / rowsPerPage);

  if (!isAuthenticated || loading) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div
        className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30"
        style={PoppinsFont.style}
      >
        <div className="p-6 max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Mesaj Paneli
                </h1>
                <p className="text-gray-600 mt-2">
                  Toplam {listUsers.length} kullanıcı ve {groups.length} grup
                  bulunuyor
                </p>
              </div>

              <button
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 group font-semibold"
                onClick={() => setOpen(true)}
              >
                <Plus
                  size={20}
                  className="group-hover:rotate-90 transition-transform duration-200"
                />
                Yeni Grup Oluştur
              </button>
            </div>
          </div>

          {/* Grup Kartları */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <User className="text-blue-600" size={24} />
              <h2 className="text-xl font-semibold text-gray-800">
                Mesaj Grupları
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groups.map((group, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:border-blue-200 p-6 group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {group.name}
                    </h3>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        onClick={handleEditGroup(group)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteGroup(group)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-2">
                    {group.users.length} kişi
                  </p>
                  <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                    {group.description}
                  </p>

                  <div className="flex gap-2">
                    <button className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 font-medium text-sm">
                      <MessageCircle size={16} />
                      WhatsApp
                    </button>
                    <button className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 font-medium text-sm">
                      <Send size={16} />
                      SMS
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Kullanıcılar Tablosu */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Users className="text-blue-600" size={24} />
                  <h2 className="text-xl font-semibold text-gray-800">
                    Kullanıcılar
                  </h2>
                </div>

                {/* Arama ve Filtreleme */}
                <div className="flex flex-col sm:flex-row gap-3 flex-1 max-w-2xl">
                  <div className="relative flex-1">
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <input
                      type="text"
                      placeholder="İsim, email veya telefon ile ara..."
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50"
                      value={safeValue(filteredValues.fullname)}
                      onChange={(e) =>
                        setFilteredValues({
                          ...filteredValues,
                          fullname: e.target.value,
                        })
                      }
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleFilterUsers()
                      }
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      className="bg-gray-800 text-white hover:bg-gray-900 duration-200 px-6 py-3 rounded-xl flex items-center gap-2 font-medium transition-all hover:shadow-lg"
                      onClick={handleFilterUsers}
                    >
                      <Filter size={18} />
                      Filtrele
                    </button>
                  </div>
                </div>
              </div>

              {/* Filtre Uyarısı */}
              {listUsers.length < users.length && (
                <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3">
                  <AlertTriangle
                    size={20}
                    className="text-amber-600 flex-shrink-0"
                  />
                  <div className="text-sm text-amber-800">
                    <span className="font-medium">Aktif filtreleme:</span>{" "}
                    {users.length - listUsers.length} kayıt filtrelendi.{" "}
                    <button
                      className="underline font-medium hover:text-amber-900 transition-colors"
                      onClick={handleCleanFilters}
                    >
                      Tümünü göster
                    </button>
                  </div>
                </div>
              )}

              {/* Seçilen Öğeler */}
              {checkedItems.length > 0 && (
                <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                        {checkedItems.length}
                      </div>
                      <div className="text-sm text-blue-800">
                        <span className="font-medium">
                          {checkedItems.length} kişi
                        </span>{" "}
                        seçildi
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="text-blue-700 hover:text-blue-900 text-sm font-medium transition-colors"
                        onClick={() => setCheckedItems([])}
                      >
                        Seçimi Temizle
                      </button>
                      <button
                        onClick={() => {
                          setSendMessage({
                            open: true,
                            type: ["whatsapp", "sms"],
                            users: checkedItems.map((item: any) => item.id),
                          });
                        }}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-xl transition-all duration-200 text-sm font-medium flex items-center gap-2"
                      >
                        <Send size={16} />
                        Seçilenlere Gönder
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Tablo */}
            <div className="overflow-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-75">
                  <tr>
                    {[
                      { label: "Seçim", width: "w-16" },
                      { label: "Kullanıcı", width: "w-64" },
                      { label: "Cinsiyet", width: "w-32" },
                      { label: "Durum", width: "w-40" },
                      { label: "İletişim", width: "w-48" },
                      { label: "Adres", width: "w-64" },
                      { label: "İşlemler", width: "w-32" },
                    ].map((header, index) => (
                      <th
                        key={index}
                        className={`px-4 py-4 font-semibold text-gray-700 text-left text-sm uppercase tracking-wider border-b border-gray-200 ${header.width}`}
                      >
                        {header.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading && (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                          <div className="text-gray-600">Yükleniyor...</div>
                        </div>
                      </td>
                    </tr>
                  )}
                  {!loading && paginatedUsers.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center">
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
                    <Row
                      key={row.uid}
                      row={row}
                      checkedItems={checkedItems}
                      setCheckedItems={setCheckedItems}
                      sendMessage={sendMessage}
                      setSendMessage={setSendMessage}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Sayfalama */}
            <div className="flex flex-col sm:flex-row items-center justify-between p-6 border-t border-gray-100 bg-white">
              <div className="flex items-center gap-4 mb-4 sm:mb-0">
                <span className="text-sm text-gray-700">Sayfa başına:</span>
                <select
                  value={rowsPerPage}
                  onChange={handleChangeRowsPerPage}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                </select>
              </div>

              <div className="text-sm text-gray-700 mb-4 sm:mb-0">
                <span className="font-medium">
                  {startIndex + 1}-{Math.min(endIndex, listUsers.length)}
                </span>{" "}
                arası, toplam{" "}
                <span className="font-medium">{listUsers.length}</span> kayıt
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleChangePage(page - 1)}
                  disabled={page === 0}
                  className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNumber =
                    page < 3
                      ? i
                      : page > totalPages - 3
                      ? totalPages - 5 + i
                      : page - 2 + i;
                  return (
                    <button
                      key={i}
                      onClick={() => handleChangePage(pageNumber)}
                      className={`w-10 h-10 rounded-lg border transition-all duration-200 font-medium ${
                        page === pageNumber
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white border-transparent shadow-lg"
                          : "border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {pageNumber + 1}
                    </button>
                  );
                })}

                <button
                  onClick={() => handleChangePage(page + 1)}
                  disabled={page >= totalPages - 1}
                  className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Modaller */}
          <UserFilterModal
            open={openFilter}
            setOpen={setOpenFilter}
            filteredValues={filteredValues}
            handleFilterUsers={handleFilterUsers}
            setFilteredValues={setFilteredValues}
            handleCleanFilters={handleCleanFilters}
          />
          <CreateGroupModal
            open={open}
            setOpen={setOpen}
            users={users}
            groups={groups}
            setGroups={setGroups}
          />
          <EditGroupModal
            open={editModal.open}
            setOpen={setEditModal}
            users={users}
            groups={groups}
            setGroups={setGroups}
            group={editModal.group}
          />
          <SendMessage
            open={sendMessage.open}
            setOpen={setSendMessage}
            type={sendMessage.type}
            users={sendMessage.users}
            allUsers={users}
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default Message;
