// src/features/admin/users/ui/components/CustomersGrid.tsx
"use client";

import React, { useMemo } from "react";
import CustomerCard from "./CustomerCard";
import { normalizeCustomers } from "@/features/admin/users/model/utils";
import type { CustomerUser } from "@/features/admin/users/api/usersApi";
import type { NormalizedCustomerUser } from "@/features/admin/users/model/types";

type Props = {
  rows: CustomerUser[];
  expandedIds: Set<string>;
  onEdit: (uid: string | number) => void;
  onDelete: (uid: string | number, user: NormalizedCustomerUser) => void;
  onViewDetails: (uid: string | number) => void;
  onViewLists: (uid: string | number) => void;
  onToggleExpand: (uid: string | number) => void;
};

export default function CustomersGrid({
  rows,
  expandedIds,
  onEdit,
  onDelete,
  onViewDetails,
  onViewLists,
  onToggleExpand,
}: Props) {
  const normalizedRows = useMemo(() => normalizeCustomers(rows ?? []), [rows]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
      {normalizedRows.map((u) => (
        <CustomerCard
          key={String(u.uid)}
          user={u}
          onEdit={onEdit}
          onDelete={onDelete}
          onViewDetails={onViewDetails}
          onViewLists={onViewLists}
          onToggleExpand={onToggleExpand}
          isExpanded={expandedIds.has(String(u.uid))}
        />
      ))}
    </div>
  );
}
