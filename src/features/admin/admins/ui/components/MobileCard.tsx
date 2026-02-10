// src/features/admin/admins/ui/components/MobileCard.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { MoreVertical, Eye, Edit, Trash2 } from "lucide-react";

import Avatar from "./Avatar";
import StatusBadge from "./StatusBadge";

import type {
  AdminUser,
  DeleteConfirmState,
  EditUserModalState,
} from "../../model/types";

type Props = {
  row: AdminUser;
  setEdit: React.Dispatch<React.SetStateAction<EditUserModalState>>;
  setDeleteConfirm: React.Dispatch<React.SetStateAction<DeleteConfirmState>>;
};

export default function MobileCard({ row, setEdit, setDeleteConfirm }: Props) {
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
            <div className="text-sm text-gray-500">{row.mail || ""}</div>
          </div>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setShowActions((v) => !v)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"
          >
            <MoreVertical size={18} />
          </button>

          {showActions && (
            <div className="absolute right-0 top-10 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-10 min-w-[120px]">
              <button
                type="button"
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
                type="button"
                onClick={() => {
                  setEdit({ open: true, user: row });
                  setShowActions(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <Edit size={16} />
                Düzenle
              </button>

              <button
                type="button"
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
            {row.gender === "male" ? "Erkek" : row.gender === "female" ? "Kadın" : ""}
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
          <div className="font-medium text-gray-900">{row.gsmNumber || ""}</div>
        </div>

        <div>
          <span className="text-gray-500">Doğum Tarihi</span>
          <div className="font-medium text-gray-900">
            {row.birth ? `${row.birth.day}/${row.birth.month}/${row.birth.year}` : ""}
          </div>
        </div>
      </div>
    </div>
  );
}
