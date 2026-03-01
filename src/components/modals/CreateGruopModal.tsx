import React, { useEffect, useState } from "react";
import { Poppins } from "next/font/google";
import {
  X,
  UserPlus,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const PoppinsFont = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

/* ── Styles ── */
const inputBase =
  "w-full h-[42px] text-sm text-black/87 bg-gray-50 border border-black/12 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-black/30";

const labelClass =
  "block text-xs font-medium text-black/50 uppercase tracking-wider mb-1.5";

/* ── Row component ── */
const Row = ({ row, formData, setFormData }: any) => {
  const isChecked = formData.users.some((item: any) => item.uid === row.uid);

  const handleChange = () => {
    if (isChecked) {
      setFormData({
        ...formData,
        users: formData.users.filter((item: any) => item.uid !== row.uid),
      });
    } else {
      setFormData({ ...formData, users: [...formData.users, row] });
    }
  };

  return (
    <tr
      className={`border-b border-black/6 transition-colors cursor-pointer ${
        isChecked ? "bg-emerald-50/60" : "hover:bg-black/[0.02]"
      }`}
      onClick={handleChange}
    >
      <td className="px-4 py-3">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleChange}
          onClick={(e) => e.stopPropagation()}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
        />
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2.5">
          {row.image ? (
            <img
              src={row.image}
              alt={`${row.name} ${row.surname}`}
              className="w-7 h-7 rounded-full object-cover"
            />
          ) : (
            <div className="w-7 h-7 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-[11px] font-semibold text-white">
              {row.name[0]}
            </div>
          )}
          <span className="text-sm text-black/87 font-medium">
            {row.name} {row.surname}
          </span>
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-black/60">{row.mail.mail}</td>
      <td className="px-4 py-3 text-sm text-black/60">
        {row.gender === "male" ? "Erkek" : "Kadın"}
      </td>
      <td className="px-4 py-3">
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            row.status === "active" || row.status === "Aktif"
              ? "bg-emerald-50 text-emerald-700"
              : "bg-gray-100 text-black/40"
          }`}
        >
          {row.status}
        </span>
      </td>
      <td className="px-4 py-3">
        {row.phones.map((phone: any, index: number) => (
          <div key={index} className="flex items-center gap-1.5">
            <span className="text-sm text-black/60">
              {phone.number
                ? phone.number.startsWith("0")
                  ? phone.number
                  : "0" + phone.number
                : "Bulunamadı"}
            </span>
            {phone.isAbleToSendSMS ? (
              <span className="text-[10px] font-medium text-emerald-600">SMS</span>
            ) : (
              <span className="text-[10px] font-medium text-red-400">SMS</span>
            )}
          </div>
        ))}
      </td>
      <td className="px-4 py-3 text-sm text-black/60">
        {row.city} / {row.county} / {row.neighbourhood}
      </td>
    </tr>
  );
};

/* ── Main component ── */
const CreateGroupModal = ({ open, setOpen, users, groups, setGroups }: any) => {
  const handleClose = () => {
    setOpen(false);
  };

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    users: [] as any[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGroups([
      ...groups,
      {
        uid: groups.length + 1,
        name: formData.name,
        description: formData.description,
        users: formData.users,
      },
    ]);
    setFormData({ name: "", description: "", users: [] });
    handleClose();
  };

  /* Pagination */
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (newPage: number) => setPage(newPage);

  const handleChangeRowsPerPage = (e: any) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  /* Search */
  const [filteredUsers, setFilteredUsers] = useState(users);

  useEffect(() => {
    setFilteredUsers(users);
  }, [users]);

  const handleSearch = (value: string) => {
    const q = value.toLowerCase();
    if (!q) {
      setFilteredUsers(users);
      return;
    }
    setFilteredUsers(
      users.filter(
        (user: any) =>
          user.name?.toLowerCase().includes(q) ||
          user.surname?.toLowerCase().includes(q) ||
          user.mail?.mail?.toLowerCase().includes(q) ||
          user.gender?.toLowerCase().includes(q) ||
          user.status?.toLowerCase().includes(q) ||
          user.city?.toLowerCase().includes(q) ||
          user.county?.toLowerCase().includes(q) ||
          user.neighbourhood?.toLowerCase().includes(q)
      )
    );
    setPage(0);
  };

  if (!open) return null;

  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={handleClose}
    >
      <div
        className="bg-white w-full max-w-[1100px] mx-4 max-h-[92vh] overflow-y-auto rounded-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]"
        style={PoppinsFont.style}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="relative px-6 pt-6 pb-5">
          <div className="absolute top-0 left-6 right-6 h-[3px] bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 rounded-full" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
                <UserPlus size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-black/87">
                  Yeni Grup Oluştur
                </h2>
                <p className="text-xs text-black/38 mt-0.5">
                  Grup bilgilerini doldurun ve üyeleri seçin
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="p-2 text-black/30 hover:text-black/60 hover:bg-black/[0.04] rounded-full transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* ── Form ── */}
        <form onSubmit={handleSubmit} className="px-6 pb-6">
          {/* ─ Section: Grup Bilgileri ─ */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-1">
              <div className="h-px flex-1 bg-black/6" />
              <span className="text-[10px] font-semibold text-black/30 uppercase tracking-widest">
                Grup Bilgileri
              </span>
              <div className="h-px flex-1 bg-black/6" />
            </div>

            <div>
              <label className={labelClass}>
                Grup Adı <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                autoComplete="off"
                required
                placeholder="örn: Sakarya Ev Sahipleri"
                className={`${inputBase} px-3 py-2.5`}
              />
            </div>

            <div>
              <label className={labelClass}>Grup Açıklaması</label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                autoComplete="off"
                required
                placeholder="Grup hakkında kısa bir açıklama yapınız."
                rows={3}
                className="w-full text-sm text-black/87 bg-gray-50 border border-black/12 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-black/30 px-3 py-2.5 resize-vertical"
              />
            </div>
          </div>

          {/* ─ Section: Kullanıcılar ─ */}
          <div className="space-y-4 mt-5">
            <div className="flex items-center gap-2 pb-1">
              <div className="h-px flex-1 bg-black/6" />
              <span className="text-[10px] font-semibold text-black/30 uppercase tracking-widest">
                Kullanıcılar
              </span>
              <div className="h-px flex-1 bg-black/6" />
            </div>

            {/* Search */}
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-black/25 pointer-events-none"
              />
              <input
                type="text"
                placeholder="İsim, email veya adres ile ara..."
                onChange={(e) => handleSearch(e.target.value)}
                className={`${inputBase} pl-9 pr-3`}
              />
            </div>

            {/* Selected count */}
            {formData.users.length > 0 && (
              <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg">
                <div className="w-6 h-6 bg-emerald-500 rounded-md flex items-center justify-center text-white text-xs font-semibold">
                  {formData.users.length}
                </div>
                <span className="text-xs text-emerald-700 font-medium">
                  kişi seçildi
                </span>
              </div>
            )}

            {/* Table */}
            <div className="overflow-auto max-h-[300px] border border-black/8 rounded-xl">
              <table className="w-full">
                <thead className="sticky top-0 bg-gray-50/95 backdrop-blur-sm">
                  <tr>
                    {[
                      "Seçim",
                      "Ad Soyad",
                      "Email",
                      "Cinsiyet",
                      "Durum",
                      "Telefon",
                      "Adres",
                    ].map((header) => (
                      <th
                        key={header}
                        className="px-4 py-2.5 text-left text-[10px] font-semibold text-black/40 uppercase tracking-wider border-b border-black/8"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.map((row: any) => (
                    <Row
                      key={row.uid}
                      row={row}
                      formData={formData}
                      setFormData={setFormData}
                    />
                  ))}
                  {paginatedUsers.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-4 py-8 text-center text-sm text-black/30"
                      >
                        Kullanıcı bulunamadı
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-[0.75rem] text-black/40">
                  Sayfa başına:
                </span>
                <select
                  value={rowsPerPage}
                  onChange={handleChangeRowsPerPage}
                  className="border border-black/12 rounded-lg px-2 py-1 text-xs text-black/60 bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                </select>
              </div>

              <span className="text-[0.75rem] text-black/40">
                {filteredUsers.length > 0
                  ? `${startIndex + 1}–${Math.min(
                      endIndex,
                      filteredUsers.length
                    )} / ${filteredUsers.length}`
                  : "0 kayıt"}
              </span>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleChangePage(page - 1)}
                  disabled={page === 0}
                  className="p-1.5 text-black/40 rounded-full disabled:opacity-30 disabled:cursor-not-allowed hover:bg-black/[0.04] transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => handleChangePage(page + 1)}
                  disabled={page >= totalPages - 1}
                  className="p-1.5 text-black/40 rounded-full disabled:opacity-30 disabled:cursor-not-allowed hover:bg-black/[0.04] transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* ── Actions ── */}
          <div className="flex gap-3 mt-6 pt-5 border-t border-black/6">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-black/50 border border-black/10 rounded-xl hover:bg-black/[0.03] hover:text-black/70 transition-all"
            >
              İptal
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl hover:from-emerald-600 hover:to-emerald-700 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-600/30 transition-all"
            >
              Grup Oluştur
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupModal;
