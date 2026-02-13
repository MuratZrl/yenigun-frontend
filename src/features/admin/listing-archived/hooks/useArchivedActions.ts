// src/features/admin/emlak-archived/hooks/useArchivedActions.ts

"use client";

import { useState, useCallback } from "react";
import { toast } from "react-toastify";
import api from "@/lib/api";
import type { Advert, AdminNoteModal, DeleteConfirmModal, AdUserNotesModal } from "../types";

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */

type Deps = {
  updateAdvert: (uid: string, updater: (ad: Advert) => Advert) => void;
  removeAdvert: (uid: string) => void;
};

export function useArchivedActions({ updateAdvert, removeAdvert }: Deps) {
  /* ---- Modal states ---- */

  const [adminNote, setAdminNote] = useState<AdminNoteModal>({
    isOpen: false,
    ad: {},
  });

  const [deleteConfirm, setDeleteConfirm] = useState<DeleteConfirmModal>({
    open: false,
    ad: null,
  });

  const [adUserNotes, setAdUserNotes] = useState<AdUserNotesModal>({
    isOpen: false,
    ad: {},
  });

  /* ================================================================ */
  /*  Admin note modal                                                */
  /* ================================================================ */

  const openAdminNote = useCallback((ad: Advert) => {
    setAdminNote({ isOpen: true, ad });
  }, []);

  const closeAdminNote = useCallback(() => {
    setAdminNote({ isOpen: false, ad: {} });
  }, []);

  /* ================================================================ */
  /*  Delete confirm modal                                            */
  /* ================================================================ */

  const openDeleteConfirm = useCallback((ad: Advert) => {
    setDeleteConfirm({ open: true, ad });
  }, []);

  const closeDeleteConfirm = useCallback(() => {
    setDeleteConfirm({ open: false, ad: null });
  }, []);

  const handleDelete = useCallback(async () => {
    const ad = deleteConfirm.ad;
    if (!ad) return;

    try {
      await api.post("/admin/delete-advert", { uid: ad.uid });
      toast.success("İlan başarıyla silindi.");
      removeAdvert(ad.uid);
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("İlan silinirken bir hata oluştu.");
    } finally {
      closeDeleteConfirm();
    }
  }, [deleteConfirm.ad, removeAdvert, closeDeleteConfirm]);

  /* ================================================================ */
  /*  Toggle activity                                                 */
  /* ================================================================ */

  const handleToggleActivity = useCallback(
    async (uid: string) => {
      try {
        await api.post("/admin/change-advert-activity", { uid });
        toast.success("İlan başarıyla güncellendi.");
        updateAdvert(uid, (ad) => ({ ...ad, active: !ad.active }));
      } catch (err) {
        console.error("Activity toggle failed:", err);
        toast.error("İlan güncellenirken bir hata oluştu.");
      }
    },
    [updateAdvert]
  );

  /* ================================================================ */
  /*  User notes modal                                                */
  /* ================================================================ */

  const openAdUserNotes = useCallback((ad: Advert) => {
    setAdUserNotes({ isOpen: true, ad });
  }, []);

  const closeAdUserNotes = useCallback(() => {
    setAdUserNotes({ isOpen: false, ad: {} });
  }, []);

  /* ================================================================ */
  /*  Return                                                          */
  /* ================================================================ */

  return {
    // Admin note
    adminNote,
    openAdminNote,
    closeAdminNote,

    // Delete
    deleteConfirm,
    openDeleteConfirm,
    closeDeleteConfirm,
    handleDelete,

    // Activity
    handleToggleActivity,

    // User notes
    adUserNotes,
    openAdUserNotes,
    closeAdUserNotes,
  };
}