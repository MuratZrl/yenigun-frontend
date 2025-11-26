"use client";
import React, { useState, useEffect } from "react";
import { Poppins } from "next/font/google";
const PoppinsFont = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});
import { useCookies } from "react-cookie";
import axios from "axios";
import AdminLayout from "@/app/components/layout/AdminLayout";
import { toast } from "react-toastify";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Notification {
  id?: string;
  title: string;
  message: string;
  backgroundImage?: string | File;
}

const NotificationManagement = () => {
  const [cookies] = useCookies(["token"]);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<Notification>({
    title: "",
    message: "",
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [hasActiveNotification, setHasActiveNotification] = useState(false);

  useEffect(() => {
    // Authentication kontrolü
    if (!cookies.token) {
      router.push("/login");
      return;
    }

    fetchActiveNotification();
  }, [cookies.token, router]);

  const fetchActiveNotification = async () => {
    try {
      const response = await axios.get(
        process.env.NEXT_PUBLIC_BACKEND_API + "/admin/active-notification",
        {
          headers: {
            Authorization: `Bearer ${cookies.token}`,
          },
        }
      );
      if (response.data.data) {
        setNotification(response.data.data);
        setHasActiveNotification(true);
        if (response.data.data.backgroundImage) {
          setPreviewImage(response.data.data.backgroundImage);
        }
      }
    } catch (error) {
      console.error("Error fetching active notification:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNotification((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNotification((prev) => ({
        ...prev,
        backgroundImage: file,
      }));

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target) {
          setPreviewImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("title", notification.title);
    formData.append("message", notification.message);
    if (notification.backgroundImage instanceof File) {
      formData.append("backgroundImage", notification.backgroundImage);
    }

    try {
      const endpoint = hasActiveNotification
        ? "/admin/update-notification-with-image"
        : "/admin/create-notification-with-image";

      await axios.post(
        process.env.NEXT_PUBLIC_BACKEND_API + endpoint,
        formData,
        {
          headers: {
            Authorization: `Bearer ${cookies.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(
        hasActiveNotification
          ? "Bildirim başarıyla güncellendi!"
          : "Bildirim başarıyla oluşturuldu!",
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );

      fetchActiveNotification();
    } catch (error) {
      toast.error("Bir hata oluştu. Lütfen tekrar deneyin.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      console.error("Error submitting notification:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!notification.id) return;

    if (!window.confirm("Bildirimi silmek istediğinize emin misiniz?")) return;

    setLoading(true);
    try {
      await axios.post(
        process.env.NEXT_PUBLIC_BACKEND_API + "/admin/delete-notification",
        { id: notification.id },
        {
          headers: {
            Authorization: `Bearer ${cookies.token}`,
          },
        }
      );

      toast.success("Bildirim başarıyla silindi!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      setNotification({ title: "", message: "" });
      setPreviewImage(null);
      setHasActiveNotification(false);
    } catch (error) {
      toast.error("Bir hata oluştu. Lütfen tekrar deneyin.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      console.error("Error deleting notification:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearForm = () => {
    setNotification({ title: "", message: "" });
    setPreviewImage(null);
  };

  // Eğer token yoksa veya yükleniyorsa loading göster
  if (!cookies.token || loading) {
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
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-700">
              {hasActiveNotification
                ? "Aktif Bildirimi Düzenle"
                : "Yeni Bildirim Oluştur"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {hasActiveNotification
                ? "Mevcut bildirimi güncelleyebilir veya silebilirsiniz."
                : "Yeni bir bildirim oluşturabilirsiniz."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Başlık
              </label>
              <input
                type="text"
                name="title"
                value={notification.title}
                onChange={handleInputChange}
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
                value={notification.message}
                onChange={handleInputChange}
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
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    id="backgroundImage"
                  />
                  <label
                    htmlFor="backgroundImage"
                    className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-200"
                  >
                    {previewImage ? "Resmi Değiştir" : "Resim Seç"}
                  </label>
                </div>
                {previewImage && (
                  <div className="relative w-20 h-20 rounded-md overflow-hidden border border-gray-200">
                    <Image
                      src={previewImage}
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

            <div className="flex justify-end space-x-4">
              {hasActiveNotification && (
                <>
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? "Siliniyor..." : "Sil"}
                  </button>
                  <button
                    type="button"
                    onClick={handleClearForm}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
                    disabled={loading}
                  >
                    Formu Temizle
                  </button>
                </>
              )}
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                disabled={loading}
              >
                {loading
                  ? hasActiveNotification
                    ? "Güncelleniyor..."
                    : "Oluşturuluyor..."
                  : hasActiveNotification
                  ? "Güncelle"
                  : "Oluştur"}
              </button>
            </div>
          </form>

          {hasActiveNotification && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Aktif Bildirim Önizleme
              </h2>
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <h3 className="text-lg font-medium text-gray-900">
                  {notification.title}
                </h3>
                <p className="mt-2 text-gray-600">{notification.message}</p>
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
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default NotificationManagement;
