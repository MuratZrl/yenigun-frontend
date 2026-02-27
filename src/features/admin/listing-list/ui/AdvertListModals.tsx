// src/features/admin/emlak-list/ui/AdvertListModals.tsx

"use client";

import React from "react";
import Link from "next/link";
import { X, FileText, Pencil } from "lucide-react";
import { useCookies } from "react-cookie";

import FilterAdminAds from "@/components/modals/FilterAdminAds";
import AdUserNotes from "@/components/modals/AddUserNotes";
import AreYouSure from "@/components/ui/AreYouSure";

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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#000066] to-[#035DBA] px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <FileText size={18} className="text-white" />
                </div>
                <h3 className="text-base font-semibold text-white">Admin Notu</h3>
              </div>
              <button
                onClick={onCloseAdminNote}
                className="text-white/70 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="bg-[#E9EEF7]/50 border border-[#035DBA]/10 rounded-xl p-4 mb-5 max-h-40 overflow-y-auto">
                <p className="text-gray-700 text-sm leading-relaxed">
                  {"adminNote" in adminNote.ad && adminNote.ad.adminNote
                    ? adminNote.ad.adminNote
                    : "Not bulunamadı"}
                </p>
              </div>
              <div className="flex gap-3">
                <Link
                  href={`/admin/emlak/${
                    "uid" in adminNote.ad ? adminNote.ad.uid : ""
                  }`}
                  className="flex-1 bg-[#035DBA] hover:bg-[#000066] text-white py-2.5 px-3 rounded-xl text-center text-sm font-medium transition-colors flex items-center justify-center gap-1.5"
                >
                  <Pencil size={14} />
                  Notu Düzenle
                </Link>
                <button
                  onClick={onCloseAdminNote}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 px-3 rounded-xl text-sm font-medium transition-colors"
                >
                  Kapat
                </button>
              </div>
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