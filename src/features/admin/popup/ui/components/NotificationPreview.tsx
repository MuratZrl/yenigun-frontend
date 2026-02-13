// src/features/admin/popup/ui/components/NotificationPreview.tsx
"use client";

import React from "react";
import Image from "next/image";

type Props = {
  title: string;
  message: string;
  previewImage: string | null;
};

export default function NotificationPreview({
  title,
  message,
  previewImage,
}: Props) {
  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Aktif Bildirim Önizleme
      </h2>
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <p className="mt-2 text-gray-600">{message}</p>
        {previewImage && (
          <div className="mt-4 relative w-full h-48 rounded-md overflow-hidden">
            <Image
              src={previewImage}
              alt="Notification background"
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
        )}
      </div>
    </div>
  );
}