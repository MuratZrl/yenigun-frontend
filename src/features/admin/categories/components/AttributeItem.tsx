// src/features/admin/categories/components/AttributeItem.tsx
"use client";

import { useState } from "react";
import { List, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import type { Attribute } from "../lib/types";
import { CategoryAPI } from "../lib/api";
import { getAttrTypeLabel, errMsg } from "../lib/helpers";

interface Props {
  attr: Attribute;
  categoryUid: number;
  onDeleted: () => void;
}

export default function AttributeItem({ attr, categoryUid, onDeleted }: Props) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (deleting) return;
    setDeleting(true);
    try {
      await CategoryAPI.removeAttribute(categoryUid, attr.id);
      toast.success(`"${attr.name}" özelliği silindi`);
      onDeleted();
    } catch (err: any) {
      toast.error(errMsg(err));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded flex items-center justify-center shadow-sm">
          <List size={16} className="text-white" />
        </div>
        <div>
          <span className="font-medium text-gray-900 text-sm">{attr.name}</span>
          <span className="ml-3 text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
            {getAttrTypeLabel(attr.type)}
          </span>
          {attr.required && (
            <span className="ml-1 text-xs font-medium text-red-500 bg-red-50 px-2 py-1 rounded-full">
              Zorunlu
            </span>
          )}
        </div>
      </div>
      <button
        onClick={handleDelete}
        disabled={deleting}
        className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg disabled:opacity-50"
        title="Özelliği sil"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}