// src/features/admin/message/ui/components/MessageUsersTable.tsx
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

export default function MessageUsersTable({
  row,
  isChecked,
  onCheck,
  onWhatsapp,
  onSms,
}: Props) {
  return (
    <tr className="border-b border-black/6 last:border-b-0 hover:bg-black/[0.04] transition-colors">
      <td className="px-4 py-2">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={(e) => onCheck(e.target.checked, row)}
          className="w-[18px] h-[18px] text-blue-600 border-black/30 rounded-sm focus:ring-blue-600 focus:ring-offset-0 cursor-pointer"
        />
      </td>
      {/* Profil */}
      <td className="pl-4 pr-4 py-2 w-18">
        {row.image ? (
          <img
            src={row.image}
            alt={`${row.name} ${row.surname}`}
            className="w-10 h-10 rounded-full object-cover shrink-0"
          />
        ) : (
          <div className="w-10 h-10 shrink-0 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
            {row.name[0]}
          </div>
        )}
      </td>

      {/* Ad Soyad */}
      <td className="pl-2 pr-4 py-2">
        <div className="text-[0.875rem] leading-6 text-black/87">
          {row.name} {row.surname}
        </div>
        <div className="text-xs leading-5 text-black/60 truncate">
          {row.mail.mail}
        </div>
      </td>
      <td className="px-4 py-2">
        <span className="text-[0.875rem] leading-6 text-black/87">
          {row.gender === "male" ? "Erkek" : "Kadın"}
        </span>
      </td>
      <td className="px-4 py-2">
        <span className="text-[0.875rem] leading-6 text-black/87">{row.status}</span>
      </td>
      <td className="px-4 py-2">
        {row.phones.map((phone: any, index: number) => (
          <div key={index} className="flex items-center gap-1.5">
            <span className="text-[0.875rem] leading-6 text-black/87">
              {formatPhoneNumber(phone.number || "Bulunamadı")}
            </span>
            {phone.isAbleToSendSMS ? (
              <span className="text-[0.625rem] font-medium text-green-700 bg-green-50 px-1.5 py-0.5 rounded">
                SMS
              </span>
            ) : (
              <span className="text-[0.625rem] font-medium text-red-700 bg-red-50 px-1.5 py-0.5 rounded">
                SMS
              </span>
            )}
          </div>
        ))}
      </td>
      <td className="px-4 py-2">
        <span className="text-[0.875rem] leading-6 text-black/87">{row.fulladdress}</span>
      </td>
      <td className="px-4 py-2">
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => onWhatsapp(row.id)}
            className="p-1.5 text-black/54 hover:text-green-600 hover:bg-green-600/8 rounded-full transition-colors"
            title="WhatsApp"
          >
            <MessageCircle size={18} strokeWidth={1.5} />
          </button>
          <button
            onClick={() => onSms(row.id)}
            className="p-1.5 text-black/54 hover:text-blue-600 hover:bg-blue-600/8 rounded-full transition-colors"
            title="SMS"
          >
            <Phone size={18} strokeWidth={1.5} />
          </button>
        </div>
      </td>
    </tr>
  );
}
