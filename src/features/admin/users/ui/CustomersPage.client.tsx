// src/features/admin/users/ui/CustomersPage.client.tsx
"use client";

import React, { useMemo } from "react";
import { Poppins } from "next/font/google";

import AdminLayout from "@/components/layout/AdminLayout";
import AreYouSure from "@/components/AreYouSure";

import CreateUserModal from "@/components/modals/CreateUsersModal";
import UserFilterModal from "@/components/modals/UserFilterModals";
import EditUserModal from "@/components/modals/EditUserModal";
import ListUserModal from "@/components/modals/ListUserModals";

import { Pagination, MobilePagination } from "@/components/Pagination";

import { useUsersController } from "@/features/admin/users/hooks/useUsersController";
import { normalizeCustomers } from "@/features/admin/users/model/utils";
import type { NormalizedCustomerUser } from "@/features/admin/users/model/types";

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
  } = useUsersController();

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
        <div className="pt-5 pl-5 pr-5 mb-6 lg:mb-8">
          <CustomersHeader onOpenCreate={() => setOpenCreate(true)} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-white rounded-xl shadow-sm border p-4 lg:p-6">
            <CustomersSearchBar
              value={filteredValues.fullname || ""}
              onChange={(v) =>
                setFilteredValues((prev) => ({ ...prev, fullname: v }))
              }
              onSearch={() => handleFilterUsers()}
              onOpenFilter={() => setOpenFilter(true)}
            />

            <div className="border-t pt-4">
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
            </div>

            <CustomersActiveFilterBanner
              filteredOutCount={filteredOutCount}
              onClear={handleCleanFilters}
              noteSearchActive={noteSearch.active}
            />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          {!authChecked || loading ? (
            <CustomersStates kind={isMobile ? "mobileLoading" : "loading"} />
          ) : showEmpty ? (
            <CustomersStates kind="empty" onOpenCreate={() => setOpenCreate(true)} onClear={handleCleanFilters} />
          ) : (
            <>
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

        <CreateUserModal
          open={openCreate}
          setOpen={setOpenCreate}
          newUser={newUser}
          setNewUser={setNewUser}
          cookies={cookies}
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
            setOpen={setEditUser}
            user={editUser.user}
            cookies={cookies}
          />
        ) : null}

        <ListUserModal
          open={listOpen.open}
          setOpen={setListOpen}
          user={listOpen.user}
          cookies={cookies}
        />

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
