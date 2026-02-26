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
  return <thead>{children}</thead>;
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
    <tr className={`border-b border-black/6 last:border-b-0 ${className}`}>{children}</tr>
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
      className={`px-4 py-3 text-[0.875rem] leading-6 text-black/87 ${className}`}
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
      className={`px-4 py-3 text-left text-xs font-semibold tracking-wide text-black/60 border-b border-black/12 whitespace-nowrap ${className}`}
      colSpan={colSpan}
    >
      {children}
    </th>
  );
}
