// src/features/admin/popup/ui/PopupPage.client.tsx
"use client";

import React from "react";
import { Poppins } from "next/font/google";
import Image from "next/image";
import AdminLayout from "@/components/layout/AdminLayout";

import { usePopupController } from "../hooks/usePopupController";
import NotificationPreview from "./components/NotificationPreview";

const PoppinsFont = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export default function PopupPage() {
  const c = usePopupController();

  if (!c.hasToken || c.loading) {
    return (
      <AdminLayout>
        <div className={`${PoppinsFont.className} p-6`}>
          <div className="flex justify-center items-center h-64">
            <div className="text-lg">Yükleniyor...</div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className={`${PoppinsFont.className} p-6`}>
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Bildirim Yönetimi
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Section header */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-700">
              {c.hasActiveNotification
                ? "Aktif Bildirimi Düzenle"
                : "Yeni Bildirim Oluştur"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {c.hasActiveNotification
                ? "Mevcut bildirimi güncelleyebilir veya silebilirsiniz."
                : "Yeni bir bildirim oluşturabilirsiniz."}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={c.handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Başlık
              </label>
              <input
                type="text"
                name="title"
                value={c.notification.title}
                onChange={c.handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Bildirim başlığı girin"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mesaj
              </label>
              <textarea
                name="message"
                value={c.notification.message}
                onChange={c.handleInputChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Bildirim mesajını girin"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Arkaplan Resmi
              </label>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={c.handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    id="backgroundImage"
                  />
                  <label
                    htmlFor="backgroundImage"
                    className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-200"
                  >
                    {c.previewImage ? "Resmi Değiştir" : "Resim Seç"}
                  </label>
                </div>
                {c.previewImage && (
                  <div className="relative w-20 h-20 rounded-md overflow-hidden border border-gray-200">
                    <Image
                      src={c.previewImage}
                      alt="Preview"
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                )}
              </div>
              <p className="mt-1 text-sm text-gray-500">
                PNG, JPG, JPEG formatında resim yükleyebilirsiniz.
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex justify-end space-x-4">
              {c.hasActiveNotification && (
                <>
                  <button
                    type="button"
                    onClick={c.handleDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                    disabled={c.loading}
                  >
                    {c.loading ? "Siliniyor..." : "Sil"}
                  </button>
                  <button
                    type="button"
                    onClick={c.handleClearForm}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
                    disabled={c.loading}
                  >
                    Formu Temizle
                  </button>
                </>
              )}
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                disabled={c.loading}
              >
                {c.loading
                  ? c.hasActiveNotification
                    ? "Güncelleniyor..."
                    : "Oluşturuluyor..."
                  : c.hasActiveNotification
                    ? "Güncelle"
                    : "Oluştur"}
              </button>
            </div>
          </form>

          {/* Active notification preview */}
          {c.hasActiveNotification && (
            <NotificationPreview
              title={c.notification.title}
              message={c.notification.message}
              previewImage={c.previewImage}
            />
          )}
        </div>
      </div>
    </AdminLayout>
  );
}