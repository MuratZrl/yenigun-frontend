// src/features/admin/popup/hooks/usePopupController.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import api from "@/lib/api";
import type { Notification } from "../lib/types";

const TOAST_CONFIG = {
  position: "top-right" as const,
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

export function usePopupController() {
  const [cookies] = useCookies(["token"]);
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<Notification>({
    title: "",
    message: "",
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [hasActiveNotification, setHasActiveNotification] = useState(false);

  /* ── Fetch active notification ── */
  const fetchActiveNotification = useCallback(async () => {
    try {
      const response = await api.get("/admin/active-notification");
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
  }, []);

  /* ── Auth + initial load ── */
  useEffect(() => {
    if (!cookies.token) {
      router.push("/login");
      return;
    }
    fetchActiveNotification();
  }, [cookies.token, router, fetchActiveNotification]);

  /* ── Input handlers ── */
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setNotification((prev) => ({ ...prev, [name]: value }));
    },
    [],
  );

  const handleImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        setNotification((prev) => ({ ...prev, backgroundImage: file }));

        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target) {
            setPreviewImage(event.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      }
    },
    [],
  );

  /* ── Submit (create / update) ── */
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
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

        await api.post(endpoint, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        toast.success(
          hasActiveNotification
            ? "Bildirim başarıyla güncellendi!"
            : "Bildirim başarıyla oluşturuldu!",
          TOAST_CONFIG,
        );

        fetchActiveNotification();
      } catch (error) {
        toast.error("Bir hata oluştu. Lütfen tekrar deneyin.", TOAST_CONFIG);
        console.error("Error submitting notification:", error);
      } finally {
        setLoading(false);
      }
    },
    [notification, hasActiveNotification, fetchActiveNotification],
  );

  /* ── Delete ── */
  const handleDelete = useCallback(async () => {
    if (!notification.id) return;
    if (!window.confirm("Bildirimi silmek istediğinize emin misiniz?")) return;

    setLoading(true);
    try {
      await api.post("/admin/delete-notification", { id: notification.id });
      toast.success("Bildirim başarıyla silindi!", TOAST_CONFIG);

      setNotification({ title: "", message: "" });
      setPreviewImage(null);
      setHasActiveNotification(false);
    } catch (error) {
      toast.error("Bir hata oluştu. Lütfen tekrar deneyin.", TOAST_CONFIG);
      console.error("Error deleting notification:", error);
    } finally {
      setLoading(false);
    }
  }, [notification.id]);

  /* ── Clear form ── */
  const handleClearForm = useCallback(() => {
    setNotification({ title: "", message: "" });
    setPreviewImage(null);
  }, []);

  return {
    loading,
    hasToken: !!cookies.token,
    notification,
    previewImage,
    hasActiveNotification,
    handleInputChange,
    handleImageChange,
    handleSubmit,
    handleDelete,
    handleClearForm,
  };
}