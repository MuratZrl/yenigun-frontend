// src/features/admin/emlak-archived/ui/ArchivedPage.client.tsx

"use client";

import React from "react";
import { Poppins } from "next/font/google";

import AdminLayout from "@/components/layout/AdminLayout";
import { Pagination, MobilePagination } from "@/components/ui/Pagination";

import { useArchivedAdverts } from "../hooks/useArchivedAdverts";
import { useArchivedFilters } from "../hooks/useArchivedFilters";
import { useArchivedActions } from "../hooks/useArchivedActions";

import ArchivedHeader from "./ArchivedHeader.client";
import ArchivedFilterBar from "./ArchivedFilterBar.client";
import ArchivedWarningBanner from "./ArchivedWarningBanner";
import ArchivedEmptyState from "./ArchivedEmptyState";
import ArchivedAdCard from "./ArchivedAdCard";
import ArchivedModals from "./ArchivedModals";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function ArchivedPage() {
  /* ---- Hooks ---- */

  const adverts = useArchivedAdverts();

  const filters = useArchivedFilters({
    allAdverts: adverts.allAdverts,
    applyFilteredData: adverts.applyFilteredData,
  });

  const actions = useArchivedActions({
    updateAdvert: adverts.updateAdvert,
    removeAdvert: adverts.removeAdvert,
  });

  /* ---- Loading state ---- */

  if (!adverts.isAuthenticated || adverts.loading) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-custom-orange" />
      </div>
    );
  }

  /* ---- Render ---- */

  return (
    <AdminLayout>
      <div
        className="w-full min-h-screen bg-gray-50"
        style={poppins.style}
      >
        <ArchivedHeader totalCount={adverts.filteredAdverts.length} />

        <ArchivedFilterBar
          filters={filters.filters}
          onTitleChange={(v) => filters.updateFilter("title", v)}
          onUidChange={(v) => filters.updateFilter("uid", v)}
          onSearch={filters.applyFilters}
          onOpenFilter={filters.openFilter}
        />

        <ArchivedWarningBanner filteredAdverts={adverts.filteredAdverts} />

        <div className="p-6">
          {adverts.filteredAdverts.length === 0 ? (
            <ArchivedEmptyState onResetFilters={filters.resetFilters} />
          ) : (
            <>
              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {adverts.paginatedData.map((ad) => (
                  <ArchivedAdCard
                    key={ad.uid}
                    ad={ad}
                    onToggleActivity={actions.handleToggleActivity}
                    onDelete={actions.openDeleteConfirm}
                    onAdminNote={actions.openAdminNote}
                    onUserNotes={actions.openAdUserNotes}
                  />
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-8">
                {adverts.isMobile ? (
                  <MobilePagination
                    page={adverts.page}
                    totalPages={adverts.totalPages}
                    rowsPerPage={adverts.rowsPerPage}
                    totalItems={adverts.filteredAdverts.length}
                    startIndex={adverts.startIndex}
                    endIndex={adverts.endIndex}
                    onPageChange={adverts.handleChangePage}
                    onRowsPerPageChange={adverts.handleChangeRowsPerPage}
                  />
                ) : (
                  <Pagination
                    page={adverts.page}
                    totalPages={adverts.totalPages}
                    rowsPerPage={adverts.rowsPerPage}
                    totalItems={adverts.filteredAdverts.length}
                    startIndex={adverts.startIndex}
                    endIndex={adverts.endIndex}
                    onPageChange={adverts.handleChangePage}
                    onRowsPerPageChange={adverts.handleChangeRowsPerPage}
                  />
                )}
              </div>
            </>
          )}
        </div>

        <ArchivedModals
          adminNote={actions.adminNote}
          onCloseAdminNote={actions.closeAdminNote}
          deleteConfirm={actions.deleteConfirm}
          onCloseDeleteConfirm={actions.closeDeleteConfirm}
          onConfirmDelete={actions.handleDelete}
          adUserNotes={actions.adUserNotes}
          onCloseAdUserNotes={actions.closeAdUserNotes}
          isFilterOpen={filters.isFilterOpen}
          onCloseFilter={filters.closeFilter}
          filters={filters.filters}
          setFilters={filters.setFilters}
          onApplyFilters={filters.applyFilters}
          onResetFilters={filters.resetFilters}
        />
      </div>
    </AdminLayout>
  );
}