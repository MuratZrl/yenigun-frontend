// src/features/home/comments/ui/StarsRow.client.tsx
"use client";

import React from "react";
import { Star } from "lucide-react";

type Props = {
  count: number;
};

export default function StarsRow({ count }: Props) {
  const safe = Math.max(0, Math.min(5, Number(count) || 0));

  return (
    <div className="flex gap-0.5 mb-3">
      {Array.from({ length: safe }).map((_, i) => (
        <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
      ))}
    </div>
  );
}
