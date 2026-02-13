// src/features/admin/emlak-list/ui/AdvertListModals.tsx

"use client";

import React from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { useCookies } from "react-cookie";

import FilterAdminAds from "@/components/modals/FilterAdminAds";
import AdUserNotes from "@/components/modals/AddUserNotes";
import AreYouSure from "@/components/AreYouSure";

import type {
  FilterState,
  AdminNoteModal,
  DeleteConfirmModal,
  AdUserNotesModal,
} from "../types";

type Props = {
  // Admin note
  adminNote: AdminNoteModal;
  onCloseAdminNote: () => void;

  // Delete confirm
  deleteConfirm: DeleteConfirmModal;
  onCloseDeleteConfirm: () => void;
  onConfirmDelete: () => void;

  // User notes
  adUserNotes: AdUserNotesModal;
  onCloseAdUserNotes: () => void;

  // Filter modal
  isFilterOpen: boolean;
  onCloseFilter: () => void;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onApplyFilters: () => void;
  onResetFilters: () => void;
  onSearchResult?: (data: any) => void;
};

export default function AdvertListModals({
  adminNote,
  onCloseAdminNote,
  deleteConfirm,
  onCloseDeleteConfirm,
  onConfirmDelete,
  adUserNotes,
  onCloseAdUserNotes,
  isFilterOpen,
  onCloseFilter,
  filters,
  setFilters,
  onApplyFilters,
  onResetFilters,
  onSearchResult,
}: Props) {
  const [cookies] = useCookies(["token"]);

  return (
    <>
      {/* Admin note modal */}
      {adminNote.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Admin Notu</h3>
              <button
                onClick={onCloseAdminNote}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 mb-4 max-h-40 overflow-y-auto">
              <p className="text-gray-700 text-sm">
                {"adminNote" in adminNote.ad && adminNote.ad.adminNote
                  ? adminNote.ad.adminNote
                  : "Not bulunamadı"}
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                href={`/admin/emlak/${
                  "uid" in adminNote.ad ? adminNote.ad.uid : ""
                }`}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg text-center text-sm font-medium transition-colors"
              >
                Notu Düzenle
              </Link>
              <button
                onClick={onCloseAdminNote}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter modal */}
      <FilterAdminAds
        open={isFilterOpen}
        setOpen={onCloseFilter as any}
        setFilters={setFilters as any}
        filters={filters as any}
        handleFilter={() => {
          onApplyFilters();
          onCloseFilter();
        }}
        handleCleanFilters={onResetFilters}
        onSearchResult={onSearchResult}
      />

      {/* User notes modal */}
      <AdUserNotes
        data={adUserNotes}
        setOpen={onCloseAdUserNotes}
        cookies={cookies}
      />

      {/* Delete confirm */}
      <AreYouSure
        open={deleteConfirm.open}
        onClose={onCloseDeleteConfirm}
        onConfirm={onConfirmDelete}
        title={`${deleteConfirm.ad?.title || ""} ilanını silmek istiyor musunuz?`}
        message="Bu işlem geri alınamaz. İlana ait tüm veriler kalıcı olarak silinecektir."
        confirmText="Evet, Sil"
        cancelText="İptal"
        type="delete"
      />
    </>
  );
}