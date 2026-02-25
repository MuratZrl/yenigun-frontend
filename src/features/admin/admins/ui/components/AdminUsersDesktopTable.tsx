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

const HEADERS = ["Profil", "Ad Soyad", "Rol", "İletişim", "İşlemler"] as const;

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
    <div className="hidden lg:block bg-white rounded-md shadow-[0_2px_1px_-1px_rgba(0,0,0,0.2),0_1px_1px_0_rgba(0,0,0,0.14),0_1px_3px_0_rgba(0,0,0,0.12)] overflow-hidden">
      <div className="overflow-auto">
        <table className="w-full border-collapse">
          {/* MUI-style header: no bg, bold weight, rgba text */}
          <thead>
            <tr>
              {HEADERS.map((h, i) => (
                <th
                  key={h}
                  className={[
                    "py-3 text-left text-xs font-semibold tracking-wide text-black/60 border-b border-black/12 whitespace-nowrap",
                    i === 0 ? "pl-4 pr-2 w-16" : i === 1 ? "pl-2 pr-4" : "px-4",
                  ].join(" ")}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm text-black/60">Yükleniyor...</span>
                  </div>
                </td>
              </tr>
            )}

            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center">
                  <div className="flex flex-col items-center gap-2 text-black/38">
                    <Search size={32} strokeWidth={1.5} />
                    <span className="text-sm font-medium text-black/60">Kayıt bulunamadı</span>
                    <p className="text-xs text-black/38">Arama kriterlerinize uygun sonuç bulunamadı.</p>
                  </div>
                </td>
              </tr>
            )}

            {!loading &&
              rows.map((row) => (
                <tr
                  key={String(row.uid)}
                  className="border-b border-black/6 last:border-b-0 hover:bg-black/[0.04] transition-colors"
                >
                  {/* Profil */}
                  <td className="pl-4 pr-2 py-2 w-16">
                    {row.profilePicture ? (
                      <Image
                        width={72}
                        height={72}
                        className="w-10 h-10 shrink-0 rounded-full"
                        alt={`${row.name} ${row.surname}`}
                        src={row.profilePicture}
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      <Avatar name={row.name} className="w-10 h-10 text-sm" />
                    )}
                  </td>

                  {/* Ad Soyad */}
                  <td className="pl-2 pr-4 py-2">
                    <span className="text-[0.875rem] leading-6 text-black/87">{`${row.name} ${row.surname}`}</span>
                  </td>

                  {/* Rol */}
                  <td className="px-4 py-2">
                    <StatusBadge role={String(row.role)} />
                  </td>

                  {/* İletişim */}
                  <td className="px-4 py-2">
                    <div className="min-w-0">
                      <div className="text-[0.875rem] leading-6 text-black/87 truncate">
                        {row.gsmNumber ? formatPhoneNumber(row.gsmNumber) : "-"}
                      </div>
                      <div className="text-xs leading-5 text-black/60 truncate">{row.mail ?? "-"}</div>
                    </div>
                  </td>

                  {/* İşlemler */}
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-0.5">
                      <button
                        onClick={() => window.open(`/admin/admins/${row.uid}`, "_blank")}
                        className="p-1.5 text-black/54 hover:text-blue-600 hover:bg-blue-600/8 rounded-full transition-colors"
                        type="button"
                        title="Görüntüle"
                      >
                        <Eye size={18} strokeWidth={1.5} />
                      </button>

                      <button
                        onClick={() => setEdit({ open: true, user: row })}
                        className="p-1.5 text-black/54 hover:text-green-600 hover:bg-green-600/8 rounded-full transition-colors"
                        type="button"
                        title="Düzenle"
                      >
                        <Edit size={18} strokeWidth={1.5} />
                      </button>

                      <button
                        onClick={() => setDeleteConfirm({ open: true, uid: row.uid, user: row })}
                        className="p-1.5 text-black/54 hover:text-red-600 hover:bg-red-600/8 rounded-full transition-colors"
                        type="button"
                        title="Sil"
                      >
                        <Trash2 size={18} strokeWidth={1.5} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {totalItems > 0 && (
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
      )}
    </div>
  );
}
