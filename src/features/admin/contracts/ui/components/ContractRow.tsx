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
    <TableRow className="hover:bg-custom-orange-dark/10 duration-300">
      <TableCell>
        <div className="flex items-center gap-3">{row.landlord}</div>
      </TableCell>
      <TableCell>{row.email}</TableCell>
      <TableCell>{row.tenant}</TableCell>
      <TableCell>{row.status}</TableCell>
      <TableCell>{formatPhoneNumber(row.phone)}</TableCell>
      <TableCell>{row.address}</TableCell>
      <TableCell>
        <div className="flex gap-1">
          <button
            onClick={() => onDownload(row.url)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="PDF İndir"
          >
            <Download size={18} />
          </button>
          <button
            onClick={() => onReview(row.uid)}
            className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
            title="Önizleme"
          >
            <Eye size={18} />
          </button>
          <button
            onClick={() => onDelete(row.uid)}
            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Sil"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </TableCell>
    </TableRow>
  );
}