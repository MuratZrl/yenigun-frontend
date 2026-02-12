// src/features/admin/emlak-list/ui/AdvertListPage.client.tsx

"use client";

import React from "react";
import { Poppins } from "next/font/google";

import AdminLayout from "@/components/layout/AdminLayout";
import { Pagination, MobilePagination } from "@/components/Pagination";

import { useAdvertList } from "../hooks/useAdvertList";
import { useAdvertFilters } from "../hooks/useAdvertFilters";
import { useAdvertActions } from "../hooks/useAdvertActions";

import AdvertListHeader from "./AdvertListHeader";
import AdvertListFilterBar from "./AdvertListFilterBar";
import AdvertListEmptyState from "./AdvertListEmptyState";
import AdvertListAdCard from "./AdvertListAdCard";
import AdvertListModals from "./AdvertListModals";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function AdvertListPage() {
  /* ---- Hooks ---- */

  const adverts = useAdvertList();

  const filters = useAdvertFilters({
    allAdverts: adverts.allAdverts,
    applyFilteredData: adverts.applyFilteredData,
    setLoading: adverts.setLoading,
  });

  const actions = useAdvertActions({
    updateAdvert: adverts.updateAdvert,
    removeAdvert: adverts.removeAdvert,
  });

  /* ---- Loading state ---- */

  if (!adverts.isAuthenticated || adverts.loading) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-custom-orange" />
          <p className="text-gray-600 text-sm">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  /* ---- Render ---- */

  return (
    <AdminLayout>
      <div className="w-full min-h-screen bg-gray-50" style={poppins.style}>
        <AdvertListHeader totalCount={adverts.filteredAdverts.length} />

        <AdvertListFilterBar
          filters={filters.filters}
          loading={adverts.loading}
          onTitleChange={(v) => filters.updateFilter("title", v)}
          onUidChange={(v) => filters.updateFilter("uid", v)}
          onSearch={filters.handleSearch}
          onOpenFilter={filters.openFilter}
        />

        <div className="p-6">
          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adverts.paginatedData.map((ad) => (
              <AdvertListAdCard
                key={ad.uid}
                ad={ad}
                onToggleActivity={actions.handleToggleActivity}
                onDelete={actions.openDeleteConfirm}
                onAdminNote={actions.openAdminNote}
                onUserNotes={actions.openAdUserNotes}
              />
            ))}
          </div>

          {/* Empty state */}
          {adverts.paginatedData.length === 0 && <AdvertListEmptyState />}

          {/* Pagination */}
          {adverts.filteredAdverts.length > 0 && (
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
          )}
        </div>

        <AdvertListModals
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
          onSearchResult={filters.handleSearchResult}
        />
      </div>
    </AdminLayout>
  );
}