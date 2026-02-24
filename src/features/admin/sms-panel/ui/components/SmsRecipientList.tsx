// src/features/admin/sms-panel/ui/components/SmsRecipientList.tsx
"use client";

import React, { useMemo, useState } from "react";
import { Phone, Search, ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import type { SmsRecipient, RecipientType, CustomerCategory } from "../../lib/types";

type Props = {
  recipients: SmsRecipient[];
  recipientType: RecipientType;
  selectedCities: string[];
  selectedDistricts: string[];
  selectedCategory: CustomerCategory | "";
  excludedRecipientIds: Set<string>;
  onExcludeRecipient: (id: string) => void;
};

const PAGE_SIZE = 10;

export default function SmsRecipientList({
  recipients,
  recipientType,
  selectedCities,
  selectedDistricts,
  selectedCategory,
  excludedRecipientIds,
  onExcludeRecipient,
}: Props) {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(true);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    let list = recipients.filter((r) => !excludedRecipientIds.has(r.id));

    switch (recipientType) {
      case "all":
        break;
      case "city":
        if (selectedDistricts.length > 0) {
          list = list.filter((r) => r.district && selectedDistricts.includes(r.district));
        } else if (selectedCities.length > 0) {
          list = list.filter((r) => r.city && selectedCities.includes(r.city));
        } else {
          list = [];
        }
        break;
      case "category":
        list = selectedCategory
          ? list.filter((r) => r.category === selectedCategory)
          : [];
        break;
      case "specific":
        list = [];
        break;
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.phone.includes(q)
      );
    }

    return list;
  }, [recipients, recipientType, selectedCities, selectedDistricts, selectedCategory, search, excludedRecipientIds]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  // Reset visible count when filters change
  useMemo(() => {
    setVisibleCount(PAGE_SIZE);
  }, [recipientType, selectedCities, selectedDistricts, selectedCategory]);

  if (recipientType === "specific") return null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Phone size={14} className="text-gray-500" />
          <span className="text-sm font-semibold text-gray-700">Alıcı Numaraları</span>
          <span className="text-[11px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full font-medium">
            {filtered.length}
          </span>
        </div>
        {expanded ? (
          <ChevronUp size={16} className="text-gray-400" />
        ) : (
          <ChevronDown size={16} className="text-gray-400" />
        )}
      </button>

      {expanded && (
        <div className="border-t border-gray-100">
          {/* Search */}
          <div className="px-4 py-2.5 border-b border-gray-100">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setVisibleCount(PAGE_SIZE);
                }}
                placeholder="İsim veya numara ara..."
                className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-lg bg-gray-50/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* List */}
          <div className="max-h-[320px] overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="px-4 py-6 text-center">
                <Phone size={20} className="text-gray-300 mx-auto mb-2" />
                <p className="text-xs text-gray-400">
                  {recipientType === "all"
                    ? "Alıcı bulunamadı"
                    : "Lütfen önce alıcı seçimi yapın"}
                </p>
              </div>
            ) : (
              <>
                {visible.map((r) => (
                  <div
                    key={r.id}
                    className="px-4 py-2 flex items-center gap-2 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-b-0 group"
                  >
                    <button
                      type="button"
                      onClick={() => onExcludeRecipient(r.id)}
                      className="flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                      title="Alıcıyı çıkar"
                    >
                      <Trash2 size={13} />
                    </button>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-gray-800 truncate">{r.name}</p>
                      <p className="text-[11px] text-gray-400">{r.phone}</p>
                    </div>
                    {r.city && (
                      <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full flex-shrink-0">
                        {r.district ?? r.city}
                      </span>
                    )}
                  </div>
                ))}

                {hasMore && (
                  <button
                    type="button"
                    onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
                    className="w-full px-4 py-2.5 text-xs font-medium text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    Daha fazla göster ({filtered.length - visibleCount} kişi kaldı)
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
