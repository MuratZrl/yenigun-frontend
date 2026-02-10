// src/features/admin/admins/ui/components/StatusBadge.tsx
import React from "react";

type Props = {
  role: string;
  className?: string;
};

function getRoleStyles(roleRaw: string) {
  const role = (roleRaw || "").toLowerCase().trim();

  switch (role) {
    case "admin":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "moderator":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "editor":
      return "bg-green-100 text-green-800 border-green-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

export default function StatusBadge({ role, className = "" }: Props) {
  const label = role?.trim() ? role : "unknown";

  return (
    <span
      className={[
        "px-3 py-1 rounded-full text-xs font-medium border inline-flex items-center",
        getRoleStyles(label),
        className,
      ].join(" ")}
      title={label}
    >
      {label}
    </span>
  );
}
