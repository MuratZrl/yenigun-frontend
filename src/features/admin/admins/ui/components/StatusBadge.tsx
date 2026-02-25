// src/features/admin/admins/ui/components/StatusBadge.tsx
import React from "react";

type Props = {
  role: string;
  className?: string;
};

function getRoleStyles(roleRaw: string) {
  const role = (roleRaw || "").toLowerCase().trim();

  switch (role) {
    case "head_admin":
      return "bg-amber-100 text-amber-800 border-amber-200";
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

function getRoleLabel(roleRaw: string): string {
  const role = (roleRaw || "").toLowerCase().trim();

  switch (role) {
    case "head_admin":
      return "Baş Yetkili";
    case "admin":
      return "Yetkili";
    case "moderator":
      return "Moderatör";
    case "editor":
      return "Editör";
    default:
      return roleRaw || "Bilinmiyor";
  }
}

export default function StatusBadge({ role, className = "" }: Props) {
  const label = getRoleLabel(role);

  return (
    <span
      className={[
        "px-3 py-1 rounded-full text-xs font-medium border inline-flex items-center",
        getRoleStyles(role),
        className,
      ].join(" ")}
      title={label}
    >
      {label}
    </span>
  );
}
