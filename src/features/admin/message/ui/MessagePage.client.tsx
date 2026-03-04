// src/features/admin/message/ui/MessagePage.client.tsx
"use client";

import React from "react";
import { Poppins } from "next/font/google";
import {
  Search,
  Filter,
  AlertTriangle,
  Plus,
  User,
  Users,
  Send,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Layout
import AdminLayout from "@/components/layout/AdminLayout";

// Shared modals
import UserFilterModal from "@/components/modals/UserFilterModals";
import CreateGroupModal from "@/components/modals/CreateGroupModal";
import EditGroupModal from "@/components/modals/EditGroupModal";
import SendMessage from "@/features/admin/message/ui/components/SendMessageModal";
import AreYouSure from "@/components/ui/AreYouSure";

// Local components
import MessageGroupCard from "./components/MessageGroupCard";
import MessageUsersTable from "./components/MessageUsersTable";

// Hook
import { useMessageController } from "../hooks/useMessageController";

const PoppinsFont = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export default function MessagePage() {
  const c = useMessageController();

  /* ── Loading / Auth gate ── */
  if (!c.isAuthenticated || c.loading) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900" />
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

          {/* ── Page Header ── */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Mesaj Paneli
                </h1>
                <p className="text-gray-600 mt-2">
                  Toplam {c.listUsers.length} kullanıcı ve {c.groups.length} grup
                  bulunuyor
                </p>
              </div>

              <button
                className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2 group font-semibold"
                onClick={() => c.setCreateGroupOpen(true)}
              >
                <Plus
                  size={20}
                  className="group-hover:rotate-90 transition-transform duration-200"
                />
                Yeni Grup Oluştur
              </button>
            </div>
          </div>

          {/* ── Message Groups ── */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <User className="text-blue-600" size={24} />
              <h2 className="text-xl font-semibold text-gray-800">
                Mesaj Grupları
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {c.groups.map((group, index) => (
                <MessageGroupCard
                  key={index}
                  group={group}
                  onEdit={c.handleEditGroup}
                  onDelete={c.handleDeleteGroup}
                  onWhatsapp={c.handleWhatsappGroup}
                />
              ))}
            </div>
          </div>

          {/* ── Users Table Card ── */}
          <div className="bg-white rounded-md shadow-[0_2px_1px_-1px_rgba(0,0,0,0.2),0_1px_1px_0_rgba(0,0,0,0.14),0_1px_3px_0_rgba(0,0,0,0.12)] overflow-hidden">

            {/* Toolbar: title + search + filter */}
            <div className="p-5 border-b border-black/12">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Users className="text-blue-600" size={24} />
                  <h2 className="text-xl font-semibold text-gray-800">
                    Kullanıcılar
                  </h2>
                </div>

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
                      value={c.filteredValues.fullname || ""}
                      onChange={(e) =>
                        c.setFilteredValues({
                          ...c.filteredValues,
                          fullname: e.target.value,
                        })
                      }
                      onKeyPress={(e) =>
                        e.key === "Enter" && c.handleFilterUsers()
                      }
                    />
                  </div>
                  <button
                    className="bg-gray-800 text-white hover:bg-gray-900 duration-200 px-6 py-3 rounded-xl flex items-center gap-2 font-medium transition-all hover:shadow-lg"
                    onClick={c.handleFilterUsers}
                  >
                    <Filter size={18} />
                    Filtrele
                  </button>
                </div>
              </div>

              {/* Active filter warning */}
              {c.hasActiveFilter && (
                <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3">
                  <AlertTriangle
                    size={20}
                    className="text-amber-600 flex-shrink-0"
                  />
                  <div className="text-sm text-amber-800">
                    <span className="font-medium">Aktif filtreleme:</span>{" "}
                    {c.users.length - c.listUsers.length} kayıt filtrelendi.{" "}
                    <button
                      className="underline font-medium hover:text-amber-900 transition-colors"
                      onClick={c.handleCleanFilters}
                    >
                      Tümünü göster
                    </button>
                  </div>
                </div>
              )}

              {/* Bulk selection bar */}
              {c.checkedItems.length > 0 && (
                <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                        {c.checkedItems.length}
                      </div>
                      <div className="text-sm text-blue-800">
                        <span className="font-medium">
                          {c.checkedItems.length} kişi
                        </span>{" "}
                        seçildi
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="text-blue-700 hover:text-blue-900 text-sm font-medium transition-colors"
                        onClick={c.clearChecked}
                      >
                        Seçimi Temizle
                      </button>
                      <button
                        onClick={c.handleSendToChecked}
                        className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-4 py-2 rounded-xl transition-all duration-200 text-sm font-medium flex items-center gap-2 shadow-sm hover:shadow-md"
                      >
                        <Send size={16} />
                        Seçilenlere Gönder
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Table */}
            <div className="overflow-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    {[
                      { label: "Seçim", width: "w-14", pad: "px-4" },
                      { label: "Profil", width: "w-18", pad: "pl-4 pr-4" },
                      { label: "Ad Soyad", width: "", pad: "pl-2 pr-4" },
                      { label: "Cinsiyet", width: "", pad: "px-4" },
                      { label: "Durum", width: "", pad: "px-4" },
                      { label: "İletişim", width: "", pad: "px-4" },
                      { label: "Adres", width: "", pad: "px-4" },
                      { label: "İşlemler", width: "w-24", pad: "px-4" },
                    ].map((header, index) => (
                      <th
                        key={index}
                        className={`${header.pad} py-3 text-left text-xs font-semibold tracking-wide text-black/60 border-b border-black/12 whitespace-nowrap ${header.width}`}
                      >
                        {header.label}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {/* Loading state */}
                  {c.loading && (
                    <tr>
                      <td colSpan={8} className="px-4 py-12 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                          <span className="text-sm text-black/60">Yükleniyor...</span>
                        </div>
                      </td>
                    </tr>
                  )}

                  {/* Empty state */}
                  {!c.loading && c.paginatedUsers.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-4 py-12 text-center">
                        <div className="flex flex-col items-center gap-2 text-black/38">
                          <Search size={32} strokeWidth={1.5} />
                          <span className="text-sm font-medium text-black/60">Kayıt bulunamadı</span>
                          <p className="text-xs text-black/38">Arama kriterlerinize uygun sonuç bulunamadı.</p>
                        </div>
                      </td>
                    </tr>
                  )}

                  {/* User rows */}
                  {c.paginatedUsers.map((row) => (
                    <MessageUsersTable
                      key={row.uid}
                      row={row}
                      isChecked={c.checkedItems.some(
                        (item) => item.uid === row.uid,
                      )}
                      onCheck={c.handleCheckItem}
                      onWhatsapp={c.handleSendWhatsapp}
                      onSms={c.handleSendSms}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 border-t border-black/12">
              <div className="flex items-center gap-3 mb-3 sm:mb-0">
                <span className="text-[0.75rem] text-black/60">Sayfa başına:</span>
                <select
                  value={c.rowsPerPage}
                  onChange={c.handleChangeRowsPerPage}
                  className="border border-black/20 rounded px-2 py-1 text-[0.8125rem] text-black/87 focus:ring-1 focus:ring-blue-600 focus:border-blue-600 bg-white"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                </select>
              </div>

              <div className="text-[0.75rem] text-black/60 mb-3 sm:mb-0">
                {c.startIndex + 1}–{Math.min(c.endIndex, c.listUsers.length)} / {c.listUsers.length}
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => c.handleChangePage(c.page - 1)}
                  disabled={c.page === 0}
                  className="p-1.5 text-black/54 rounded-full disabled:opacity-38 disabled:cursor-not-allowed hover:bg-black/[0.04] transition-colors"
                >
                  <ChevronLeft size={18} />
                </button>

                {Array.from(
                  { length: Math.min(5, c.totalPages) },
                  (_, i) => {
                    const pageNumber =
                      c.page < 3
                        ? i
                        : c.page > c.totalPages - 3
                          ? c.totalPages - 5 + i
                          : c.page - 2 + i;
                    return (
                      <button
                        key={i}
                        onClick={() => c.handleChangePage(pageNumber)}
                        className={`w-8 h-8 rounded-full text-[0.8125rem] font-medium transition-colors ${
                          c.page === pageNumber
                            ? "bg-blue-600 text-white"
                            : "text-black/87 hover:bg-black/[0.04]"
                        }`}
                      >
                        {pageNumber + 1}
                      </button>
                    );
                  },
                )}

                <button
                  onClick={() => c.handleChangePage(c.page + 1)}
                  disabled={c.page >= c.totalPages - 1}
                  className="p-1.5 text-black/54 rounded-full disabled:opacity-38 disabled:cursor-not-allowed hover:bg-black/[0.04] transition-colors"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* ── Modals ── */}
          <UserFilterModal
            open={c.openFilter}
            setOpen={c.setOpenFilter}
            filteredValues={c.filteredValues}
            handleFilterUsers={c.handleFilterUsers}
            setFilteredValues={c.setFilteredValues}
            handleCleanFilters={c.handleCleanFilters}
          />
          <CreateGroupModal
            open={c.createGroupOpen}
            setOpen={c.setCreateGroupOpen}
            users={c.users}
            groups={c.groups}
            setGroups={c.setGroups}
          />
          <EditGroupModal
            open={c.editModal.open}
            setOpen={c.setEditModal}
            users={c.users}
            groups={c.groups}
            setGroups={c.setGroups}
            group={c.editModal.group}
          />
          <SendMessage
            open={c.sendMessage.open}
            setOpen={c.setSendMessage}
            type={c.sendMessage.type}
            users={c.sendMessage.users}
            allUsers={c.users}
          />
          <AreYouSure
            open={c.deleteConfirm.open}
            onClose={c.cancelDeleteGroup}
            onConfirm={c.confirmDeleteGroup}
            title="Grubu Sil"
            message={`"${c.deleteConfirm.group?.name ?? ""}" grubunu silmek istediğinize emin misiniz?`}
            confirmText="Evet, Sil"
            type="delete"
          />
        </div>
      </div>
    </AdminLayout>
  );
}
