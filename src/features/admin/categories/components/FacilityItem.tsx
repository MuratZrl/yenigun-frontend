// src/features/admin/categories/components/FacilityItem.tsx
"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Tag, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import type { Facility } from "../lib/types";
import { CategoryAPI } from "../lib/api";
import { errMsg } from "../lib/helpers";

interface Props {
  facility: Facility;
  categoryUid: number;
  onDeleted: () => void;
}

export default function FacilityItem({ facility, categoryUid, onDeleted }: Props) {
  const [deleting, setDeleting] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleDelete = async () => {
    if (deleting) return;
    setDeleting(true);
    try {
      await CategoryAPI.removeFacility(categoryUid, facility.title);
      toast.success(`"${facility.title}" silindi`);
      onDeleted();
    } catch (err: any) {
      toast.error(errMsg(err));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-500 rounded flex items-center justify-center shadow-sm">
            <Tag size={16} className="text-white" />
          </div>
          <div>
            <span className="font-medium text-gray-900 text-sm">
              {facility.title}
            </span>
            <span className="ml-3 text-xs text-gray-500">
              {facility.features.length} özellik
            </span>
          </div>
        </div>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg disabled:opacity-50"
          title="Tesis özelliğini sil"
        >
          <Trash2 size={14} />
        </button>
      </div>
      {expanded && facility.features.length > 0 && (
        <div className="px-3 pb-3">
          <div className="flex flex-wrap gap-1.5 ml-12">
            {facility.features.map((f) => (
              <span
                key={f}
                className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
              >
                {f}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}