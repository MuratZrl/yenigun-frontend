// src/features/admin/admins/ui/components/Avatar.tsx
import React from "react";

export type AvatarProps = {
  name: string;
  className?: string;
  title?: string;
};

function getInitials(input: string) {
  const cleaned = (input || "").trim().replace(/\s+/g, " ");
  if (!cleaned) return "?";

  const parts = cleaned.split(" ").filter(Boolean);

  const first = parts[0]?.[0] ?? "?";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : "";

  const out = `${first}${last}`.toUpperCase();
  return out || "?";
}

export function Avatar({ name, className = "", title }: AvatarProps) {
  const initials = getInitials(name);

  return (
    <div
      title={title ?? name}
      aria-label={title ?? name}
      className={[
        "flex items-center justify-center rounded-full",
        "bg-blue-600",
        "text-white font-semibold select-none",
        className,
      ].join(" ")}
    >
      {initials}
    </div>
  );
}

export default Avatar;
