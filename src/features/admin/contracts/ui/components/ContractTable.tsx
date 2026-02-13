// src/features/admin/contracts/ui/components/ContractTable.tsx
"use client";

import React from "react";

export function Table({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <table className={`w-full border-collapse ${className}`}>{children}</table>
  );
}

export function TableHead({ children }: { children: React.ReactNode }) {
  return <thead className="bg-gray-50 sticky top-0">{children}</thead>;
}

export function TableBody({ children }: { children: React.ReactNode }) {
  return <tbody>{children}</tbody>;
}

export function TableRow({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <tr className={`border-b border-gray-200 ${className}`}>{children}</tr>
  );
}

export function TableCell({
  children,
  className = "",
  colSpan,
}: {
  children: React.ReactNode;
  className?: string;
  colSpan?: number;
}) {
  return (
    <td
      className={`px-4 py-3 border-x border-gray-200 ${className}`}
      colSpan={colSpan}
    >
      {children}
    </td>
  );
}

export function TableHeaderCell({
  children,
  className = "",
  colSpan,
}: {
  children: React.ReactNode;
  className?: string;
  colSpan?: number;
}) {
  return (
    <th
      className={`px-4 py-3 font-semibold text-gray-700 text-left border-x border-gray-200 bg-gray-50 ${className}`}
      colSpan={colSpan}
    >
      {children}
    </th>
  );
}