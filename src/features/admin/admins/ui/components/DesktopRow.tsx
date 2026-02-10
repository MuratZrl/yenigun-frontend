// src/features/admin/admin/ui/components/DesktopRow.tsx
"use client";

import React from "react";
import Image from "next/image";
import { Eye, Edit, Trash2 } from "lucide-react";

import Avatar from "./Avatar";
import StatusBadge from "./StatusBadge";

import type { AdminUser } from "@/features/admin/admins/model/types";
import formatPhoneNumber from "@/utils/formatPhoneNumber";

type Props = {
  row: AdminUser;
  setEdit: (val: { user: AdminUser; open: boolean }) => void;
  setDeleteConfirm: (val: { open: boolean; uid: AdminUser["uid"]; user: AdminUser }) => void;
};

export default function DesktopRow({ row, setEdit, setDeleteConfirm }: Props) {
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
          <StatusBadge role={row.role} />
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
            className="p-2.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 group relative"
          >
            <Eye size={18} />
          </button>

          <button
            onClick={() => setEdit({ user: row, open: true })}
            className="p-2.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all duration-200 group relative"
          >
            <Edit size={18} />
          </button>

          <button
            onClick={() => setDeleteConfirm({ open: true, uid: row.uid, user: row })}
            className="p-2.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group relative"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
}
