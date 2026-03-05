// src/features/admin/users/ui/CustomersPage.client.tsx
"use client";

import React, { useMemo } from "react";
import { Poppins } from "next/font/google";

// Layout
import AdminLayout from "@/components/layout/AdminLayout";
import AreYouSure from "@/components/ui/AreYouSure";

// Shared modals
import CreateUserModal from "@/components/modals/CreateUsersModal";
import UserFilterModal from "@/components/modals/UserFilterModals";
import EditUserModal from "@/features/admin/users/ui/components/EditCustomerModal";
import ListUserModal from "@/components/modals/ListUserModals";

// Shared pagination
import { Pagination, MobilePagination } from "@/components/ui/Pagination";

// Hook, utils & types
import { useUsersController } from "@/features/admin/users/hooks/useUsersController";
import { normalizeCustomers } from "@/features/admin/users/model/utils";
import type { NormalizedCustomerUser } from "@/features/admin/users/model/types";

// Local components
import CustomersHeader from "@/features/admin/users/ui/components/CustomersHeader";
import CustomersSearchBar from "@/features/admin/users/ui/components/CustomersSearchBar";
import CustomersNoteSearchBar from "@/features/admin/users/ui/components/CustomersNoteSearchBar";
import CustomersActiveFilterBanner from "@/features/admin/users/ui/components/CustomersActiveFilterBanner";
import CustomersStates from "@/features/admin/users/ui/components/CustomersStates";
import CustomersGrid from "@/features/admin/users/ui/components/CustomersGrid";
import CustomersTable from "@/features/admin/users/ui/components/CustomersTable";

const PoppinsFont = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export default function CustomersPageClient() {
  const {
    cookies,
    authChecked,
    loading,

    isMobile,
    viewMode,

    expandedUsers,
    handleToggleExpand,

    allUsers,
    filteredUsers,
    paginatedUsers,

    pagination,
    totalPages,
    startIndex,
    endIndex,
    handlePageChange,
    handleRowsPerPageChange,

    noteSearch,
    setNoteSearch,
    searchByNote,
    clearNoteSearch,

    filteredValues,
    setFilteredValues,
    handleFilterUsers,
    handleCleanFilters,

    openCreate,
    setOpenCreate,
    openFilter,
    setOpenFilter,

    newUser,
    setNewUser,

    editUser,
    setEditUser,

    listOpen,
    setListOpen,

    deleteConfirm,
    setDeleteConfirm,
    handleDelete,
    handleConfirmDelete,

    handleEdit,
    handleViewDetails,
    handleViewLists,

    refetch,
  } = useUsersController();

  /* ── Derived state ── */
  const normalizedPaginated: NormalizedCustomerUser[] = useMemo(() => {
    return normalizeCustomers(paginatedUsers ?? []);
  }, [paginatedUsers]);

  const filteredOutCount = useMemo(() => {
    return Math.max(0, (allUsers?.length ?? 0) - (filteredUsers?.length ?? 0));
  }, [allUsers?.length, filteredUsers?.length]);

  const showEmpty = !loading && normalizedPaginated.length === 0;

  return (
    <AdminLayout>
      <div className="w-full min-h-screen bg-gray-50" style={PoppinsFont.style}>

        {/* ── Page Header ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 lg:pt-8">
          <CustomersHeader onOpenCreate={() => setOpenCreate(true)} />
        </div>

        {/* ── Search & Filters ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 lg:p-5">
            <CustomersSearchBar
              value={filteredValues.fullname || ""}
              onChange={(v) =>
                setFilteredValues((prev) => ({ ...prev, fullname: v }))
              }
              onSearch={() => handleFilterUsers()}
              onOpenFilter={() => setOpenFilter(true)}
            />

            <CustomersNoteSearchBar
              value={noteSearch.text}
              loading={noteSearch.loading}
              active={noteSearch.active}
              onChange={(v) =>
                setNoteSearch((prev) => ({ ...prev, text: v }))
              }
              onSearch={() => searchByNote(noteSearch.text)}
              onClear={clearNoteSearch}
            />

            <CustomersActiveFilterBanner
              filteredOutCount={filteredOutCount}
              onClear={handleCleanFilters}
              noteSearchActive={noteSearch.active}
            />
          </div>
        </div>

        {/* ── Content: Table / Grid + Pagination ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          {!authChecked || loading ? (
            <CustomersStates kind={isMobile ? "mobileLoading" : "loading"} />
          ) : showEmpty ? (
            <CustomersStates kind="empty" onOpenCreate={() => setOpenCreate(true)} onClear={handleCleanFilters} />
          ) : (
            <>
              {/* Data view */}
              {viewMode === "grid" ? (
                <CustomersGrid
                  rows={normalizedPaginated}
                  expandedIds={expandedUsers}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onViewDetails={handleViewDetails}
                  onViewLists={handleViewLists}
                  onToggleExpand={handleToggleExpand}
                />
              ) : (
                <CustomersTable
                  rows={normalizedPaginated}
                  expandedIds={expandedUsers}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onViewDetails={handleViewDetails}
                  onViewLists={handleViewLists}
                  onToggleExpand={handleToggleExpand}
                />
              )}

              {/* Pagination */}
              {pagination.total > 0 ? (
                isMobile ? (
                  <MobilePagination
                    page={pagination.page}
                    totalPages={totalPages}
                    rowsPerPage={pagination.rowsPerPage}
                    totalItems={pagination.total}
                    startIndex={startIndex}
                    endIndex={endIndex}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
                  />
                ) : (
                  <Pagination
                    page={pagination.page}
                    totalPages={totalPages}
                    rowsPerPage={pagination.rowsPerPage}
                    totalItems={pagination.total}
                    startIndex={startIndex}
                    endIndex={endIndex}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
                  />
                )
              ) : null}
            </>
          )}
        </div>

        {/* ── Modals ── */}
        <CreateUserModal
          open={openCreate}
          setOpen={setOpenCreate}
          onSuccess={refetch}
        />

        <UserFilterModal
          open={openFilter}
          setOpen={setOpenFilter}
          filteredValues={filteredValues}
          setFilteredValues={setFilteredValues}
          handleFilterUsers={handleFilterUsers}
          handleCleanFilters={handleCleanFilters}
        />

        {editUser.user ? (
          <EditUserModal
            open={editUser.open}
            setOpen={(state) => setEditUser({ open: state.open, user: state.user as typeof editUser.user })}
            user={editUser.user}
            cookies={cookies}
            onSuccess={refetch}
          />
        ) : null}

        <ListUserModal
          open={listOpen.open}
          setOpen={setListOpen}
          user={listOpen.user}
          cookies={cookies}
        />

        {/* ── Delete Confirmation ── */}
        <AreYouSure
          open={deleteConfirm.open}
          onClose={() => setDeleteConfirm({ open: false, uid: null, user: null })}
          onConfirm={handleConfirmDelete}
          title={`${deleteConfirm.user?.name ?? ""} ${deleteConfirm.user?.surname ?? ""} kullanıcısını silmek istiyor musunuz?`}
          message="Bu işlem geri alınamaz. Kullanıcıya ait tüm veriler kalıcı olarak silinecektir."
          confirmText="Evet, Sil"
          cancelText="İptal"
          type="delete"
        />
      </div>
    </AdminLayout>
  );
}
