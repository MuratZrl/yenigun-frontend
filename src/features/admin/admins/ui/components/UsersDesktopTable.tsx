// src/features/admin/admins/ui/components/UsersDesktopTable.tsx
"use client";

import React from "react";
import Image from "next/image";
import { Eye, Edit, Trash2, Search } from "lucide-react";

import { Pagination } from "@/components/Pagination";
import formatPhoneNumber from "@/utils/formatPhoneNumber";

import Avatar from "@/features/admin/admins/ui/components/Avatar";
import StatusBadge from "@/features/admin/admins/ui/components/StatusBadge";

import type { AdminUser, DeleteConfirmState, EditUserModalState } from "@/features/admin/admins/model/types";

type Props = {
  loading: boolean;
  rows: AdminUser[];

  page: number;
  totalPages: number;
  rowsPerPage: number;
  totalItems: number;
  startIndex: number;
  endIndex: number;

  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;

  setEdit: React.Dispatch<React.SetStateAction<EditUserModalState>>;
  setDeleteConfirm: React.Dispatch<React.SetStateAction<DeleteConfirmState>>;
};

export default function UsersDesktopTable({
  loading,
  rows,
  page,
  totalPages,
  rowsPerPage,
  totalItems,
  startIndex,
  endIndex,
  onPageChange,
  onRowsPerPageChange,
  setEdit,
  setDeleteConfirm,
}: Props) {
  return (
    <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-auto">
        <table className="w-full">
          <thead className="bg-linear-to-r from-gray-50 to-gray-75">
            <tr>
              {["Kullanıcı", "Cinsiyet", "Rol", "İletişim", "Doğum Tarihi", "İşlemler"].map((h) => (
                <th
                  key={h}
                  className="px-6 py-4 font-semibold text-gray-700 text-left text-sm uppercase tracking-wider border-b border-gray-200"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {loading && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <div className="text-gray-600">Yükleniyor...</div>
                  </div>
                </td>
              </tr>
            )}

            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-3 text-gray-500">
                    <Search size={48} className="text-gray-300" />
                    <div className="text-lg font-medium">Kayıt bulunamadı</div>
                    <p className="text-gray-400">Arama kriterlerinize uygun sonuç bulunamadı.</p>
                  </div>
                </td>
              </tr>
            )}

            {!loading &&
              rows.map((row) => (
                <tr
                  key={String(row.uid)}
                  className="hover:bg-linear-to-r hover:from-gray-50 hover:to-blue-50/30 duration-300 border-b border-gray-100 group"
                >
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
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                        </div>
                      ) : (
                        <Avatar name={row.name} className="w-11 h-11 text-sm" />
                      )}
                      <div>
                        <div className="font-semibold text-gray-900">{`${row.name} ${row.surname}`}</div>
                        <div className="text-sm text-gray-500">{row.mail ?? "-"}</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 lg:px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">Cinsiyet</span>
                      <span className="font-medium text-gray-900">
                        {row.gender === "male" ? "Erkek" : row.gender === "female" ? "Kadın" : "-"}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 lg:px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">Rol</span>
                      <StatusBadge role={String(row.role)} />
                    </div>
                  </td>

                  <td className="px-4 lg:px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">Telefon</span>
                      <span className="font-medium text-gray-900">
                        {row.gsmNumber ? formatPhoneNumber(row.gsmNumber) : "-"}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 lg:px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">Doğum Tarihi</span>
                      <span className="font-medium text-gray-900">
                        {row.birth ? `${row.birth.day}/${row.birth.month}/${row.birth.year}` : "-"}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 lg:px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => window.open(`/admin/details/${row.uid}`, "_blank")}
                        className="p-2.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
                        type="button"
                      >
                        <Eye size={18} />
                      </button>

                      <button
                        onClick={() => setEdit({ open: true, user: row })}
                        className="p-2.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all duration-200"
                        type="button"
                      >
                        <Edit size={18} />
                      </button>

                      <button
                        onClick={() => setDeleteConfirm({ open: true, uid: row.uid, user: row })}
                        className="p-2.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                        type="button"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        rowsPerPage={rowsPerPage}
        totalItems={totalItems}
        startIndex={startIndex}
        endIndex={endIndex}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
      />
    </div>
  );
}
