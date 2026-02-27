// src/features/admin/admins/ui/components/UsersMobileList.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { MoreVertical, Eye, Edit, Trash2 } from "lucide-react";

import { MobilePagination } from "@/components/ui/Pagination";
import formatPhoneNumber from "@/utils/formatPhoneNumber";

import Avatar from "@/features/admin/admins/ui/components/Avatar";
import StatusBadge from "@/features/admin/admins/ui/components/StatusBadge";

import type { AdminUser, DeleteConfirmState, AdminModalState } from "@/features/admin/admins/model/types";

type Props = {
  rows: AdminUser[];

  page: number;
  totalPages: number;
  rowsPerPage: number;
  totalItems: number;
  startIndex: number;
  endIndex: number;

  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;

  setEdit: React.Dispatch<React.SetStateAction<AdminModalState>>;
  setDeleteConfirm: React.Dispatch<React.SetStateAction<DeleteConfirmState>>;
};

function MobileCard({
  row,
  setEdit,
  setDeleteConfirm,
}: {
  row: AdminUser;
  setEdit: React.Dispatch<React.SetStateAction<AdminModalState>>;
  setDeleteConfirm: React.Dispatch<React.SetStateAction<DeleteConfirmState>>;
}) {
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

        <div className="relative">
          <button
            onClick={() => setShowActions((s) => !s)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"
            type="button"
          >
            <MoreVertical size={18} />
          </button>

          {showActions && (
            <div className="absolute right-0 top-10 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-10 min-w-[140px]">
              <button
                onClick={() => {
                  window.open(`/admin/admins/${row.uid}`, "_blank");
                  setShowActions(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                type="button"
              >
                <Eye size={16} />
                Detaylar
              </button>

              <button
                onClick={() => {
                  setEdit({ open: true, mode: "edit", user: row });
                  setShowActions(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                type="button"
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
                type="button"
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
            {row.gender === "male" ? "Erkek" : row.gender === "female" ? "Kadın" : "-"}
          </div>
        </div>

        <div>
          <span className="text-gray-500">Rol</span>
          <div className="mt-1">
            <StatusBadge role={String(row.role)} />
          </div>
        </div>

        <div>
          <span className="text-gray-500">Telefon</span>
          <div className="font-medium text-gray-900">
            {row.gsmNumber ? formatPhoneNumber(row.gsmNumber) : "-"}
          </div>
        </div>

        <div>
          <span className="text-gray-500">Doğum Tarihi</span>
          <div className="font-medium text-gray-900">
            {row.birth ? `${row.birth.day}/${row.birth.month}/${row.birth.year}` : "-"}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UsersMobileList({
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
    <div className="lg:hidden">
      {rows.map((row) => (
        <MobileCard
          key={String(row.uid)}
          row={row}
          setEdit={setEdit}
          setDeleteConfirm={setDeleteConfirm}
        />
      ))}

      {rows.length > 0 && (
        <MobilePagination
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
