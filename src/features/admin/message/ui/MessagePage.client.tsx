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

import AdminLayout from "@/components/layout/AdminLayout";
import UserFilterModal from "@/components/modals/UserFilterModals";
import CreateGroupModal from "@/components/modals/CreateGruopModal";
import EditGroupModal from "@/components/modals/EditGroupModal";
import SendMessage from "@/components/modals/SendMessages";

import { useMessageController } from "../hooks/useMessageController";
import GroupCard from "./components/GroupCard";
import UserRow from "./components/UserRow";

const PoppinsFont = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export default function MessagePage() {
  const c = useMessageController();

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
          {/* Header */}
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
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 group font-semibold"
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

          {/* Group Cards */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <User className="text-blue-600" size={24} />
              <h2 className="text-xl font-semibold text-gray-800">
                Mesaj Grupları
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {c.groups.map((group, index) => (
                <GroupCard
                  key={index}
                  group={group}
                  onEdit={c.handleEditGroup}
                  onDelete={c.handleDeleteGroup}
                />
              ))}
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Table toolbar */}
            <div className="p-6 border-b border-gray-100">
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

              {/* Filter warning */}
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

              {/* Selected items bar */}
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

            {/* Table */}
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
                  {c.loading && (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                          <div className="text-gray-600">Yükleniyor...</div>
                        </div>
                      </td>
                    </tr>
                  )}
                  {!c.loading && c.paginatedUsers.length === 0 && (
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
                  {c.paginatedUsers.map((row: any) => (
                    <UserRow
                      key={row.uid}
                      row={row}
                      isChecked={c.checkedItems.some(
                        (item: any) => item.uid === row.uid,
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
            <div className="flex flex-col sm:flex-row items-center justify-between p-6 border-t border-gray-100 bg-white">
              <div className="flex items-center gap-4 mb-4 sm:mb-0">
                <span className="text-sm text-gray-700">Sayfa başına:</span>
                <select
                  value={c.rowsPerPage}
                  onChange={c.handleChangeRowsPerPage}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                </select>
              </div>

              <div className="text-sm text-gray-700 mb-4 sm:mb-0">
                <span className="font-medium">
                  {c.startIndex + 1}-
                  {Math.min(c.endIndex, c.listUsers.length)}
                </span>{" "}
                arası, toplam{" "}
                <span className="font-medium">{c.listUsers.length}</span> kayıt
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => c.handleChangePage(c.page - 1)}
                  disabled={c.page === 0}
                  className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  <ChevronLeft size={16} />
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
                        className={`w-10 h-10 rounded-lg border transition-all duration-200 font-medium ${
                          c.page === pageNumber
                            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white border-transparent shadow-lg"
                            : "border-gray-300 text-gray-700 hover:bg-gray-50"
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
                  className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Modals */}
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
        </div>
      </div>
    </AdminLayout>
  );
}