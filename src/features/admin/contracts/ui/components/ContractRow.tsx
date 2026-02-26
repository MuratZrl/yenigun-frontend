// src/features/admin/contracts/ui/components/ContractRow.tsx
"use client";

import React from "react";
import { Eye, Trash2, Download } from "lucide-react";
import formatPhoneNumber from "@/utils/formatPhoneNumber";
import { TableRow, TableCell } from "./ContractTable";
import type { ContractRow as ContractRowType } from "../../hooks/useContractsController";

type Props = {
  row: ContractRowType;
  onDelete: (uid: any) => void;
  onDownload: (url: string) => void;
  onReview: (uid: any) => void;
};

export default function ContractRow({
  row,
  onDelete,
  onDownload,
  onReview,
}: Props) {
  return (
    <TableRow className="hover:bg-black/[0.04] transition-colors">
      <TableCell>
        <span className="font-medium">{row.landlord}</span>
      </TableCell>
      <TableCell>
        <span className="text-black/60">{row.email}</span>
      </TableCell>
      <TableCell>{row.tenant}</TableCell>
      <TableCell>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
          {row.status}
        </span>
      </TableCell>
      <TableCell>{formatPhoneNumber(row.phone)}</TableCell>
      <TableCell>
        <span className="text-black/60 text-xs">{row.address}</span>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => onDownload(row.url)}
            className="p-1.5 text-black/54 hover:text-blue-600 hover:bg-blue-600/8 rounded-full transition-colors"
            title="PDF İndir"
          >
            <Download size={18} strokeWidth={1.5} />
          </button>
          <button
            onClick={() => onReview(row.uid)}
            className="p-1.5 text-black/54 hover:text-green-600 hover:bg-green-600/8 rounded-full transition-colors"
            title="Önizleme"
          >
            <Eye size={18} strokeWidth={1.5} />
          </button>
          <button
            onClick={() => onDelete(row.uid)}
            className="p-1.5 text-black/54 hover:text-red-600 hover:bg-red-600/8 rounded-full transition-colors"
            title="Sil"
          >
            <Trash2 size={18} strokeWidth={1.5} />
          </button>
        </div>
      </TableCell>
    </TableRow>
  );
}
