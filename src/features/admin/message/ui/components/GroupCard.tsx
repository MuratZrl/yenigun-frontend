// src/features/admin/message/ui/components/GroupCard.tsx
"use client";

import React from "react";
import { Edit, Trash2, MessageCircle, Send } from "lucide-react";
import type { MessageGroup } from "../../lib/types";

type Props = {
  group: MessageGroup;
  onEdit: (group: MessageGroup) => void;
  onDelete: (group: MessageGroup) => void;
};

export default function GroupCard({ group, onEdit, onDelete }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:border-blue-200 p-6 group">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
          {group.name}
        </h3>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => onEdit(group)}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => onDelete(group)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-2">{group.users.length} kişi</p>
      <p className="text-sm text-gray-700 mb-4 line-clamp-2">
        {group.description}
      </p>

      <div className="flex gap-2">
        <button className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 font-medium text-sm">
          <MessageCircle size={16} />
          WhatsApp
        </button>
        <button className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 font-medium text-sm">
          <Send size={16} />
          SMS
        </button>
      </div>
    </div>
  );
}