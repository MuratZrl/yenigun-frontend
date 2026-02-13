// src/features/admin/message/ui/components/UserRow.tsx
"use client";

import React from "react";
import { MessageCircle, Phone } from "lucide-react";
import formatPhoneNumber from "@/utils/formatPhoneNumber";

type Props = {
  row: any;
  isChecked: boolean;
  onCheck: (checked: boolean, row: any) => void;
  onWhatsapp: (id: any) => void;
  onSms: (id: any) => void;
};

export default function UserRow({
  row,
  isChecked,
  onCheck,
  onWhatsapp,
  onSms,
}: Props) {
  return (
    <tr className="hover:bg-custom-orange-dark/10 duration-300 border-b border-gray-100">
      <td className="px-4 py-3">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={(e) => onCheck(e.target.checked, row)}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
        />
      </td>
      <td className="px-4 py-3">
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
              {row.name} {row.surname}
            </div>
            <div className="text-xs text-gray-500 truncate mt-0.5">
              {row.mail.mail}
            </div>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">{row.gender === "male" ? "Erkek" : "Kadın"}</td>
      <td className="px-4 py-3">{row.status}</td>
      <td className="px-4 py-3">
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
      </td>
      <td className="px-4 py-3">{row.fulladdress}</td>
      <td className="px-4 py-3">
        <div className="flex gap-2">
          <button
            onClick={() => onWhatsapp(row.id)}
            className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
            title="WhatsApp"
          >
            <MessageCircle size={18} />
          </button>
          <button
            onClick={() => onSms(row.id)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="SMS"
          >
            <Phone size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
}