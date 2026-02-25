// src/features/admin/admins/ui/AdminUsersPage.client.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Poppins } from "next/font/google";
import { useCookies } from "react-cookie";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

// Layout
import AdminLayout from "@/components/layout/AdminLayout";
import AreYouSure from "@/components/AreYouSure";

// Shared modals
import AdminModal from "@/components/modals/AdminModal";

// API
import api from "@/lib/api";

// Local components
import AdminUsersHeader from "@/features/admin/admins/ui/components/AdminUsersHeader";
import AdminUsersFiltersBar from "@/features/admin/admins/ui/components/AdminUsersFiltersBar";
import AdminUsersDesktopTable from "@/features/admin/admins/ui/components/AdminUsersDesktopTable";
import AdminUsersMobileList from "@/features/admin/admins/ui/components/AdminUsersMobileList";
import {
  AdminUsersActiveFilterBanner,
  AdminUsersMobileLoadingCard,
  AdminUsersMobileEmptyCard,
} from "@/features/admin/admins/ui/components/AdminUsersStates";

// Types
import type {
  AdminUser,
  AdminUserRole,
  AdminModalState,
  DeleteConfirmState,
} from "@/features/admin/admins/model/types";

const PoppinsFont = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

/* ── Helpers ── */
function normalizeUser(u: Record<string, unknown>): AdminUser {
  const birth = u?.birth as Record<string, unknown> | undefined;
  return {
    uid: typeof u?.uid === "string" ? Number(u.uid) : Number(u?.uid ?? 0),
    name: String(u?.name ?? ""),
    surname: String(u?.surname ?? ""),
    mail: u?.mail ? String(u.mail) : undefined,
    gsmNumber: u?.gsmNumber ? String(u.gsmNumber) : undefined,
    role: (u?.role ? String(u.role) : "admin") as AdminUserRole,
    gender: u?.gender ? String(u.gender) : undefined,
    profilePicture: (u?.profilePicture as string | null) ?? null,
    birth: birth
      ? {
          day: Number(birth.day ?? 0),
          month: Number(birth.month ?? 0),
          year: Number(birth.year ?? 0),
        }
      : undefined,
    createdAt: u?.createdAt ? String(u.createdAt) : undefined,
  };
}

export default function AdminUsersPageClient() {
  const router = useRouter();
  const [cookies] = useCookies(["token"]);

  /* ── State ── */
  const [authChecked] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [listUsers, setListUsers] = useState<AdminUser[]>([]);
  const [filteredValues, setFilteredValues] = useState("");

  const [adminModal, setAdminModal] = useState<AdminModalState>({
    open: false,
    mode: "create",
    user: null,
  });

  const [deleteConfirm, setDeleteConfirm] = useState<DeleteConfirmState>({
    open: false,
    uid: null,
    user: null,
  });

  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(25);

  /* ── Effects ── */
  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth < 1024);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    let alive = true;

    api
      .get("/user/auth")
      .then(() => api.get("/admin/users"))
      .then((res) => {
        if (!alive) return;

        const raw = (res.data?.data ?? res.data) as Record<string, unknown>[];
        const normalized = Array.isArray(raw) ? raw.map(normalizeUser) : [];
        setUsers(normalized);
        setListUsers(normalized);
      })
      .catch((err) => {
        if (!alive) return;

        const status = err?.response?.status;
        if (status === 401 || status === 403) {
          router.replace("/login");
          return;
        }

        console.error("Error fetching users:", err);
        toast.error("Yetkililer yüklenemedi.");
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [router]);

  /* ── Derived state ── */
  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

  const totalPages = useMemo(() => {
    const count = listUsers.length;
    return count === 0 ? 0 : Math.ceil(count / rowsPerPage);
  }, [listUsers.length, rowsPerPage]);

  const paginatedUsers = useMemo(() => {
    return listUsers.slice(startIndex, endIndex);
  }, [listUsers, startIndex, endIndex]);

  const filteredOutCount = useMemo(() => {
    return Math.max(0, users.length - listUsers.length);
  }, [users.length, listUsers.length]);

  const showClear = listUsers.length < users.length;

  /* ── Handlers ── */
  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCleanFilters = () => {
    setFilteredValues("");
    setListUsers(users);
    setPage(0);
  };

  const handleFilterUsers = () => {
    const q = filteredValues.trim().toLowerCase();
    if (!q) {
      setListUsers(users);
      setPage(0);
      return;
    }

    const filtered = users.filter((u) => {
      const name = (u.name ?? "").toLowerCase();
      const surname = (u.surname ?? "").toLowerCase();
      const mail = (u.mail ?? "").toLowerCase();
      const gsm = (u.gsmNumber ?? "").toLowerCase();
      return (
        name.includes(q) ||
        surname.includes(q) ||
        mail.includes(q) ||
        gsm.includes(q)
      );
    });

    setListUsers(filtered);
    setPage(0);
  };

  const handleConfirmDelete = () => {
    const uid = deleteConfirm.uid;
    if (!uid) return;

    api
      .post("/admin/delete-admin", { uid })
      .then((res) => {
        toast.success(res.data?.message ?? "Silindi");
        const newUsers = users.filter((u) => u.uid !== uid);
        setUsers(newUsers);

        const newList = listUsers.filter((u) => u.uid !== uid);
        setListUsers(newList);

        setDeleteConfirm({ open: false, uid: null, user: null });

        if (page > 0 && startIndex >= newList.length) {
          setPage((p) => Math.max(0, p - 1));
        }
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message ?? "Silme işlemi başarısız.");
        setDeleteConfirm({ open: false, uid: null, user: null });
      });
  };

  /* ── Loading / Auth gate ── */
  if (!authChecked || loading) {
    return (
      <AdminLayout>
        <div className={`${PoppinsFont.className} p-6`}>
          {isMobile ? (
            <AdminUsersMobileLoadingCard />
          ) : (
            <div className="flex justify-center items-center h-64">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <div className="text-lg text-gray-600">Yükleniyor...</div>
              </div>
            </div>
          )}
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div
        className="w-full min-h-screen bg-linear-to-br from-gray-50 to-blue-50/30"
        style={PoppinsFont.style}
      >
        <div className="p-4 lg:p-6 max-w-7xl mx-auto">

          {/* ── Page Header ── */}
          <AdminUsersHeader totalCount={listUsers.length} onOpenCreate={() => setAdminModal({ open: true, mode: "create", user: null })} />

          {/* ── Search & Filters ── */}
          <AdminUsersFiltersBar
            value={filteredValues}
            onChange={(v) => setFilteredValues(v)}
            onFilter={handleFilterUsers}
            onClear={handleCleanFilters}
            showClear={showClear}
          />

          {/* Active filter warning */}
          <AdminUsersActiveFilterBanner filteredOutCount={filteredOutCount} onClear={handleCleanFilters} />

          {/* ── Content: Desktop Table / Mobile List ── */}
          {!isMobile ? (
            <AdminUsersDesktopTable
              loading={loading}
              rows={paginatedUsers}
              page={page}
              totalPages={totalPages}
              rowsPerPage={rowsPerPage}
              totalItems={listUsers.length}
              startIndex={startIndex}
              endIndex={Math.min(endIndex, listUsers.length)}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              setEdit={setAdminModal}
              setDeleteConfirm={setDeleteConfirm}
            />
          ) : (
            <>
              {paginatedUsers.length === 0 ? (
                <AdminUsersMobileEmptyCard />
              ) : (
                <AdminUsersMobileList
                  rows={paginatedUsers}
                  page={page}
                  totalPages={totalPages}
                  rowsPerPage={rowsPerPage}
                  totalItems={listUsers.length}
                  startIndex={startIndex}
                  endIndex={Math.min(endIndex, listUsers.length)}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  setEdit={setAdminModal}
                  setDeleteConfirm={setDeleteConfirm}
                />
              )}
            </>
          )}
        </div>

        {/* ── Modal ── */}
        <AdminModal
          open={adminModal.open}
          mode={adminModal.mode}
          user={adminModal.user}
          onClose={() => setAdminModal({ open: false, mode: "create", user: null })}
        />

        {/* ── Delete Confirmation ── */}
        <AreYouSure
          open={deleteConfirm.open}
          onClose={() => setDeleteConfirm({ open: false, uid: null, user: null })}
          onConfirm={handleConfirmDelete}
          title={`${deleteConfirm.user?.name ?? ""} ${deleteConfirm.user?.surname ?? ""} yetkilisini silmek istiyor musunuz?`}
          message="Bu işlem geri alınamaz. Yetkiliye ait tüm veriler kalıcı olarak silinecektir."
          confirmText="Evet, Sil"
          cancelText="İptal"
          type="delete"
        />
      </div>
    </AdminLayout>
  );
}
