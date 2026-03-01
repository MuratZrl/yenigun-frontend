// src/features/admin/message/ui/components/MessageGroupCard.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Edit, Trash2, MessageCircle, Send, Users } from "lucide-react";
import type { MessageGroup } from "../../lib/types";

type Props = {
  group: MessageGroup;
  onEdit: (group: MessageGroup) => void;
  onDelete: (group: MessageGroup) => void;
  onWhatsapp: (group: MessageGroup) => void;
};

export default function MessageGroupCard({ group, onEdit, onDelete, onWhatsapp }: Props) {
  const router = useRouter();

  return (
    <div className="bg-white rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-200 overflow-hidden group flex flex-col h-full">
      {/* Header */}
      <div className="px-5 pt-5 pb-3 flex-1">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 shrink-0 rounded-full bg-blue-50 flex items-center justify-center">
              <Users size={18} className="text-blue-600" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-gray-900 truncate">
                {group.name}
              </h3>
              <span className="text-xs text-gray-500">{group.users.length} kişi</span>
            </div>
          </div>

          <div className="flex gap-0.5 shrink-0">
            <button
              onClick={() => onEdit(group)}
              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              title="Düzenle"
            >
              <Edit size={15} strokeWidth={1.5} />
            </button>
            <button
              onClick={() => onDelete(group)}
              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
              title="Sil"
            >
              <Trash2 size={15} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {group.description && (
          <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">
            {group.description}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 px-5 pb-4 pt-1">
        <button
          onClick={() => onWhatsapp(group)}
          className="flex-1 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white px-3 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors text-xs font-medium"
        >
          <MessageCircle size={14} />
          WhatsApp
        </button>
        <button
          onClick={() => router.push(`/admin/sms-panel?group=${group.uid}&users=${group.users.join(",")}`)}
          className="flex-1 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-3 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors text-xs font-medium"
        >
          <Send size={14} />
          SMS
        </button>
      </div>
    </div>
  );
}
