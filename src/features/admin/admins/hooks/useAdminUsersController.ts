// src/features/admin/admins/hooks/useAdminUsersController.ts
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";

import type {
  AdminUser,
  CreateAdminUserPayload,
  DeleteConfirmState,
  EditUserModalState,
} from "../model/types";
import { filterUsers, paginate } from "../model/utils";

// Bunu senin adminUsersApi.ts dosyan sağlayacak.
// Beklenenler: listAdmins(), deleteAdmin(uid)
import { adminUsersApi } from "../api/adminUsersApi";

type Options = {
  initialRowsPerPage?: number;
  redirectOn401To?: string; // örn: "/admin/emlak" veya "/login"
  autoFetch?: boolean; // default true
};

const DEFAULT_NEW_USER: CreateAdminUserPayload = {
  name: "",
  surname: "",
  mail: "",
  gsmNumber: "",
  password: "",
  role: "",
  image: "",
  birthDate: "",
};

function getAxiosStatus(err: any): number | undefined {
  return err?.response?.status;
}
function getAxiosMessage(err: any): string | undefined {
  return err?.response?.data?.message;
}

export function useAdminUsersController(options: Options = {}) {
  const {
    initialRowsPerPage = 25,
    redirectOn401To = "/admin/emlak",
    autoFetch = true,
  } = options;

  const router = useRouter();
  const [cookies] = useCookies(["token"]);

  const [authChecked, setAuthChecked] = useState(false);
  const [loading, setLoading] = useState(true);

  const [isMobile, setIsMobile] = useState(false);

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [filterInput, setFilterInput] = useState(""); // inputta yazılan
  const [appliedFilter, setAppliedFilter] = useState(""); // gerçekten uygulanan

  const [page, setPage] = useState(0); // 0-based
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);

  const [openCreate, setOpenCreate] = useState(false);
  const [newUser, setNewUser] = useState<CreateAdminUserPayload>(
    DEFAULT_NEW_USER,
  );

  const [editUser, setEditUser] = useState<EditUserModalState>({
    open: false,
    user: null,
  });

  const [deleteConfirm, setDeleteConfirm] = useState<DeleteConfirmState>({
    open: false,
    uid: null,
    user: null,
  });

  const filteredUsers = useMemo(() => {
    return filterUsers(users, appliedFilter);
  }, [users, appliedFilter]);

  const pagination = useMemo(() => {
    return paginate(filteredUsers, page, rowsPerPage);
  }, [filteredUsers, page, rowsPerPage]);

  const paginatedUsers = pagination.slice;

  const handleChangePage = useCallback((newPage: number) => {
    setPage(Math.max(0, newPage || 0));
  }, []);

  const handleChangeRowsPerPage = useCallback(
    (value: number) => {
      const v = Math.max(1, Number(value) || 1);
      setRowsPerPage(v);
      setPage(0);
    },
    [],
  );

  const applyFilter = useCallback(() => {
    const q = String(filterInput ?? "").trim().toLowerCase();
    setAppliedFilter(q);
    setPage(0);
  }, [filterInput]);

  const clearFilter = useCallback(() => {
    setFilterInput("");
    setAppliedFilter("");
    setPage(0);
  }, []);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminUsersApi.listAdmins();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err: any) {
      const status = getAxiosStatus(err);
      if (status === 401) {
        toast.error("Oturum süresi doldu. Lütfen tekrar giriş yapın.");
        router.push(redirectOn401To);
        return;
      }
      toast.error(getAxiosMessage(err) || "Kullanıcılar alınamadı.");
    } finally {
      setLoading(false);
    }
  }, [router, redirectOn401To]);

  const openDeleteConfirm = useCallback((user: AdminUser) => {
    setDeleteConfirm({ open: true, uid: user.uid, user });
  }, []);

  const closeDeleteConfirm = useCallback(() => {
    setDeleteConfirm({ open: false, uid: null, user: null });
  }, []);

  const confirmDelete = useCallback(async () => {
    const uid = deleteConfirm.uid;
    if (!uid) {
      closeDeleteConfirm();
      return;
    }

    const optimisticPrev = users;
    const nextUsers = users.filter((u) => u.uid !== uid);
    setUsers(nextUsers);

    try {
      const res = await adminUsersApi.deleteAdmin(uid);
      toast.success(res?.message || "Yetkili silindi.");
      closeDeleteConfirm();
    } catch (err: any) {
      setUsers(optimisticPrev);

      const status = getAxiosStatus(err);
      if (status === 401) {
        toast.error("Oturum süresi doldu. Lütfen tekrar giriş yapın.");
        router.push(redirectOn401To);
        return;
      }

      toast.error(getAxiosMessage(err) || "Silme işlemi başarısız.");
      closeDeleteConfirm();
    }
  }, [deleteConfirm.uid, users, router, redirectOn401To, closeDeleteConfirm]);

  const openEditModal = useCallback((user: AdminUser) => {
    setEditUser({ open: true, user });
  }, []);

  const closeEditModal = useCallback(() => {
    setEditUser({ open: false, user: null });
  }, []);

  const resetCreateForm = useCallback(() => {
    setNewUser(DEFAULT_NEW_USER);
  }, []);

  const openCreateModal = useCallback(() => {
    setOpenCreate(true);
  }, []);

  const closeCreateModal = useCallback(() => {
    setOpenCreate(false);
  }, []);

  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth < 1024);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    setAuthChecked(true);
    if (!autoFetch) {
      setLoading(false);
      return;
    }
    fetchUsers();
    // cookies.token dependency’si burada pratikte “re-fetch” tetiklesin diye var.
    // api zaten token’ı kendi yönetiyorsa yine de zararı yok.
  }, [autoFetch, fetchUsers, cookies.token]);

  return {
    authChecked,
    loading,

    isMobile,

    users,
    setUsers,

    filterInput,
    setFilterInput,
    appliedFilter,
    applyFilter,
    clearFilter,

    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,

    totalPages: pagination.totalPages,
    totalItems: pagination.totalItems,
    startIndex: pagination.startIndex,
    endIndex: pagination.endIndex,
    filteredCount: filteredUsers.length,
    paginatedUsers,

    refetch: fetchUsers,

    openCreate,
    openCreateModal,
    closeCreateModal,
    newUser,
    setNewUser,
    resetCreateForm,

    editUser,
    openEditModal,
    closeEditModal,
    setEditUser,

    deleteConfirm,
    openDeleteConfirm,
    closeDeleteConfirm,
    confirmDelete,
    setDeleteConfirm,
  };
}
