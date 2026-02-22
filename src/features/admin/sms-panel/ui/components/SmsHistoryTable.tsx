// src/features/admin/sms-panel/ui/components/SmsHistoryTable.tsx
"use client";

import React from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import type { SmsHistoryItem } from "../../lib/types";

type Props = {
  items: SmsHistoryItem[];
  page: number;
  totalPages: number;
  rowsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
};

function StatusBadge({ status }: { status: SmsHistoryItem["status"] }) {
  const map = {
    sent: { label: "Gönderildi", cls: "bg-green-50 text-green-700 border-green-200" },
    failed: { label: "Başarısız", cls: "bg-red-50 text-red-700 border-red-200" },
    pending: { label: "Beklemede", cls: "bg-amber-50 text-amber-700 border-amber-200" },
  };
  const s = map[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${s.cls}`}>
      {s.label}
    </span>
  );
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function SmsHistoryTable(props: Props) {
  const startIndex = props.page * props.rowsPerPage;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Table */}
      <div className="overflow-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {["Alıcı", "Telefon", "Mesaj", "Durum", "Tarih"].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {props.items.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-3 text-gray-400">
                    <Search size={40} className="text-gray-300" />
                    <div className="text-sm font-medium">Henüz mesaj gönderilmemiş</div>
                  </div>
                </td>
              </tr>
            )}
            {props.items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-3.5 text-sm font-medium text-gray-900 whitespace-nowrap">
                  {item.recipientName}
                </td>
                <td className="px-4 py-3.5 text-sm text-gray-500 whitespace-nowrap">
                  {item.recipientPhone}
                </td>
                <td className="px-4 py-3.5 text-sm text-gray-500 max-w-xs truncate">
                  {item.message}
                </td>
                <td className="px-4 py-3.5">
                  <StatusBadge status={item.status} />
                </td>
                <td className="px-4 py-3.5 text-sm text-gray-400 whitespace-nowrap">
                  {formatDate(item.sentAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 mb-3 sm:mb-0">
          <span className="text-xs text-gray-500">Sayfa başına:</span>
          <select
            value={props.rowsPerPage}
            onChange={(e) => props.onRowsPerPageChange(Number(e.target.value))}
            className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs bg-white focus:ring-2 focus:ring-blue-500"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
          </select>
        </div>

        <div className="text-xs text-gray-500 mb-3 sm:mb-0">
          <span className="font-medium">{startIndex + 1}-{Math.min(startIndex + props.rowsPerPage, props.totalItems)}</span>
          {" "}arası, toplam <span className="font-medium">{props.totalItems}</span> kayıt
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => props.onPageChange(props.page - 1)}
            disabled={props.page === 0}
            className="p-1.5 border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft size={14} />
          </button>
          <span className="px-3 py-1.5 text-xs font-medium text-gray-600">
            {props.page + 1} / {props.totalPages || 1}
          </span>
          <button
            onClick={() => props.onPageChange(props.page + 1)}
            disabled={props.page >= props.totalPages - 1}
            className="p-1.5 border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
