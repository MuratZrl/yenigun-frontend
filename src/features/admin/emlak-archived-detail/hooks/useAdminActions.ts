// src/features/admin/emlak-archived-detail/hooks/useAdminActions.ts

"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export function useAdminActions(uid: number | string) {
  const router = useRouter();
  const [isReactivating, setIsReactivating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleReactivate = useCallback(async () => {
    if (!confirm("Bu ilanı tekrar aktif etmek istediğinizden emin misiniz?")) return;

    setIsReactivating(true);
    try {
      await api.patch(`/advert/adverts/${uid}`, { active: true });
      alert("İlan başarıyla aktif edildi!");
      router.push("/admin/ads");
    } catch (error) {
      console.error("İlan aktifleştirme hatası:", error);
      alert("İlan aktifleştirilirken bir hata oluştu!");
    } finally {
      setIsReactivating(false);
    }
  }, [uid, router]);

  const handleDelete = useCallback(async () => {
    if (!confirm("Bu ilanı tamamen silmek istediğinizden emin misiniz? Bu işlem geri alınamaz!")) return;

    setIsDeleting(true);
    try {
      await api.delete(`/advert/adverts/${uid}`);
      alert("İlan başarıyla silindi!");
      router.push("/admin/archived");
    } catch (error) {
      console.error("İlan silme hatası:", error);
      alert("İlan silinirken bir hata oluştu!");
    } finally {
      setIsDeleting(false);
    }
  }, [uid, router]);

  const handleShare = useCallback(async () => {
    const shareData = {
      title: document.title,
      text: "Bu ilana bir göz atın: " + window.location.href,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Paylaşım hatası:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Kopyalama hatası:", err);
      }
    }
  }, []);

  return {
    isReactivating,
    isDeleting,
    copied,
    handleReactivate,
    handleDelete,
    handleShare,
    router,
  };
}