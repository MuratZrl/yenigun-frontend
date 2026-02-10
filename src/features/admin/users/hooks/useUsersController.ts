// src/features/admin/users/hooks/useUsersController.ts
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";

import { usersApi } from "@/features/admin/users/api/usersApi";
import type { CustomerUser } from "@/features/admin/users/model/types";

type FilteredValues = {
  fullname: string;
  email: string;
  phone: string;
  gender: string;
  status: {
    selected: string;
    options: string[];
  };
  turkish_id: string;
  mernis_no: string;
  province: string;
  district: string;
  quarter: string;
};

type NoteSearchState = {
  text: string;
  active: boolean;
  loading: boolean;
};

type PaginationState = {
  page: number; // 0-based (UI)
  rowsPerPage: number;
  total: number;
  apiPage: number; // legacy (kullanmasan da kalsın)
  apiLimit: number; // legacy
};

type DeleteConfirmState = {
  open: boolean;
  uid: string | number | null;
  user: CustomerUser | null;
};

type EditUserModalState = {
  open: boolean;
  user: CustomerUser | null;
};

type ListUserModalState = {
  open: boolean;
  user: CustomerUser | null;
};

function getMail(u: any): string {
  if (!u) return "";
  if (typeof u.mail === "string") return u.mail;
  return String(u.mail?.mail ?? "");
}

function getFullName(u: any): string {
  const name = String(u?.name ?? "");
  const surname = String(u?.surname ?? "");
  return `${name} ${surname}`.trim();
}

function normalizeGender(val: string): string {
  const v = (val ?? "").trim().toLowerCase();
  const map: Record<string, string> = {
    erkek: "male",
    kadın: "female",
    male: "male",
    female: "female",
  };
  return map[v] ?? v;
}

function safeStr(x: any): string {
  return String(x ?? "");
}

function includesInsensitive(hay: string, needle: string) {
  return hay.toLowerCase().includes(needle.toLowerCase());
}

export function useUsersController() {
  const router = useRouter();
  const [cookies] = useCookies(["token"]);

  const [authChecked, setAuthChecked] = useState(false);
  const [loading, setLoading] = useState(true);

  const [isMobile, setIsMobile] = useState(false);

  const [expandedUsers, setExpandedUsers] = useState<Set<string>>(new Set());

  const [allUsers, setAllUsers] = useState<CustomerUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<CustomerUser[]>([]);
  const [paginatedUsers, setPaginatedUsers] = useState<CustomerUser[]>([]);

  const [pagination, setPagination] = useState<PaginationState>({
    page: 0,
    rowsPerPage: 25,
    total: 0,
    apiPage: 1,
    apiLimit: 25,
  });

  const [noteSearch, setNoteSearch] = useState<NoteSearchState>({
    text: "",
    active: false,
    loading: false,
  });

  const [openCreate, setOpenCreate] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);

  const [deleteConfirm, setDeleteConfirm] = useState<DeleteConfirmState>({
    open: false,
    uid: null,
    user: null,
  });

  const [editUser, setEditUser] = useState<EditUserModalState>({
    open: false,
    user: null,
  });

  const [listOpen, setListOpen] = useState<ListUserModalState>({
    open: false,
    user: null,
  });

  const [newUser, setNewUser] = useState<any>({
    image: "",
    name: "",
    lastname: "",
    gender: {
      selected: "Erkek",
      options: ["Erkek", "Kadın"],
    },
    status: {
      selected: "",
      options: ["Mülk Sahibi", "Satınalan", "Kiralayan", "Özel Müşteri"],
    },
    phones: [
      {
        phone: "",
        isSmS: true,
      },
    ],
    turkish_id: "",
    mernis_no: "",
    province: "Sakarya",
    district: "Serdivan",
    quarter: "Kazımpaşa Mh.",
    address: "",
    comment: "",
    owner_url: "",
    email: "",
    note: "",
    isSmS: true,
  });

  const [filteredValues, setFilteredValues] = useState<FilteredValues>({
    fullname: "",
    email: "",
    phone: "",
    gender: "",
    status: {
      selected: "",
      options: ["Mülk Sahibi", "Satınalan", "Kiralayan", "Özel Müşteri"],
    },
    turkish_id: "",
    mernis_no: "",
    province: "",
    district: "",
    quarter: "",
  });

  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth < 1024);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const fetchAllCustomers = useCallback(async () => {
    try {
      setLoading(true);

      const all = await usersApi.listAllCustomers({
        limit: 100,
        sortBy: "created",
        sortOrder: "desc",
        maxPages: 200,
      });

      setAllUsers(all);
      setFilteredUsers(all);
      setPagination((prev) => ({ ...prev, total: all.length, page: 0 }));
    } catch (error: any) {
      console.error("Müşteri getirme hatası:", error);
      if (error?.response?.status === 401) router.push("/login");
      toast.error("Müşteriler yüklenirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    setAuthChecked(true);
    fetchAllCustomers();
  }, [cookies.token, fetchAllCustomers]);

  useEffect(() => {
    const start = pagination.page * pagination.rowsPerPage;
    const end = start + pagination.rowsPerPage;
    setPaginatedUsers(filteredUsers.slice(start, end));
  }, [filteredUsers, pagination.page, pagination.rowsPerPage]);

  const startIndex = useMemo(
    () => pagination.page * pagination.rowsPerPage,
    [pagination.page, pagination.rowsPerPage],
  );

  const endIndex = useMemo(() => {
    return Math.min(
      startIndex + pagination.rowsPerPage,
      pagination.total,
    );
  }, [startIndex, pagination.rowsPerPage, pagination.total]);

  const totalPages = useMemo(() => {
    if (pagination.total === 0) return 0;
    return Math.ceil(pagination.total / pagination.rowsPerPage);
  }, [pagination.total, pagination.rowsPerPage]);

  const viewMode = useMemo(() => (isMobile ? "grid" : "table"), [isMobile]);

  const handleToggleExpand = useCallback((userId: string | number) => {
    const key = String(userId);
    setExpandedUsers((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const handleEdit = useCallback(
    (uid: string | number) => {
      const user = allUsers.find((u: any) => String(u.uid) === String(uid));
      if (user) setEditUser({ open: true, user });
    },
    [allUsers],
  );

  const handleViewDetails = useCallback((uid: string | number) => {
    window.open(`/admin/users/${uid}/`);
  }, []);

  const handleViewLists = useCallback(
    (uid: string | number) => {
      const user = allUsers.find((u: any) => String(u.uid) === String(uid));
      if (user) setListOpen({ open: true, user });
    },
    [allUsers],
  );

  const handleDelete = useCallback((uid: string | number, user: CustomerUser) => {
    setDeleteConfirm({ open: true, uid, user });
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  }, []);

  const handleRowsPerPageChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const newRowsPerPage = parseInt(event.target.value, 10);
      setPagination((prev) => ({
        ...prev,
        rowsPerPage: newRowsPerPage,
        page: 0,
      }));
    },
    [],
  );

  const clearNoteSearch = useCallback(() => {
    setNoteSearch({ text: "", active: false, loading: false });
    setFilteredUsers(allUsers);
    setPagination((prev) => ({
      ...prev,
      page: 0,
      total: allUsers.length,
    }));
  }, [allUsers]);

  const searchByNote = useCallback(
    async (searchText: string) => {
      const q = (searchText ?? "").trim();
      if (!q) {
        clearNoteSearch();
        return;
      }

      try {
        setNoteSearch({ text: q, active: true, loading: true });
        setLoading(true);

        const { rows } = await usersApi.searchCustomersByNote({
          note: q,
          page: 1,
          limit: 100,
        });

        setFilteredUsers(rows);
        setPagination((prev) => ({
          ...prev,
          page: 0,
          total: rows.length,
        }));

        toast.success(`${rows.length} müşteri bulundu`);
      } catch (error: any) {
        console.error("Not arama hatası:", error);
        toast.error(
          error?.response?.data?.message ||
            "Not araması sırasında bir hata oluştu",
        );
      } finally {
        setNoteSearch((prev) => ({ ...prev, loading: false }));
        setLoading(false);
      }
    },
    [clearNoteSearch],
  );

  const handleCleanFilters = useCallback(() => {
    setFilteredValues({
      fullname: "",
      email: "",
      phone: "",
      gender: "",
      status: {
        selected: "",
        options: ["Mülk Sahibi", "Satınalan", "Kiralayan", "Özel Müşteri"],
      },
      turkish_id: "",
      mernis_no: "",
      province: "",
      district: "",
      quarter: "",
    });

    if (noteSearch.active) {
      clearNoteSearch();
    } else {
      setFilteredUsers(allUsers);
      setPagination((prev) => ({
        ...prev,
        page: 0,
        total: allUsers.length,
      }));
    }
  }, [allUsers, clearNoteSearch, noteSearch.active]);

  const handleFilterUsers = useCallback(
    (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      setOpenFilter(false);

      if (noteSearch.active) clearNoteSearch();

      const hasActiveFilters =
        filteredValues.fullname ||
        filteredValues.email ||
        filteredValues.phone ||
        filteredValues.gender ||
        filteredValues.status.selected ||
        filteredValues.turkish_id ||
        filteredValues.mernis_no ||
        filteredValues.province ||
        filteredValues.district ||
        filteredValues.quarter;

      if (!hasActiveFilters) {
        setFilteredUsers(allUsers);
        setPagination((prev) => ({ ...prev, page: 0, total: allUsers.length }));
        return;
      }

      const filtered = allUsers.filter((u: any) => {
        const fullName = getFullName(u);
        const email = getMail(u);
        const phones = Array.isArray(u.phones) ? u.phones : [];

        if (filteredValues.fullname) {
          if (!includesInsensitive(fullName, filteredValues.fullname)) return false;
        }

        if (filteredValues.email) {
          if (!includesInsensitive(email, filteredValues.email)) return false;
        }

        if (filteredValues.phone) {
          const q = filteredValues.phone.trim();
          const hasPhone = phones.some((p: any) => {
            const num = safeStr(p?.number);
            return num.includes(q);
          });
          if (!hasPhone) return false;
        }

        if (filteredValues.gender) {
          const ug = normalizeGender(safeStr(u?.gender));
          const fg = normalizeGender(filteredValues.gender);
          if (ug !== fg) return false;
        }

        if (filteredValues.status.selected) {
          const us = safeStr(u?.status);
          if (us !== filteredValues.status.selected) return false;
        }

        if (filteredValues.turkish_id) {
          const tc = safeStr(u?.tcNumber);
          if (!tc.includes(filteredValues.turkish_id)) return false;
        }

        if (filteredValues.mernis_no) {
          const mn = safeStr(u?.mernisNo);
          if (!mn.includes(filteredValues.mernis_no)) return false;
        }

        if (filteredValues.province) {
          const city = safeStr(u?.city);
          if (!includesInsensitive(city, filteredValues.province)) return false;
        }

        if (filteredValues.district) {
          const county = safeStr(u?.county);
          if (!includesInsensitive(county, filteredValues.district)) return false;
        }

        if (filteredValues.quarter) {
          const neigh = safeStr(u?.neighbourhood);
          if (!includesInsensitive(neigh, filteredValues.quarter)) return false;
        }

        return true;
      });

      setFilteredUsers(filtered);
      setPagination((prev) => ({
        ...prev,
        page: 0,
        total: filtered.length,
      }));
    },
    [allUsers, clearNoteSearch, filteredValues, noteSearch.active],
  );

  const handleConfirmDelete = useCallback(async () => {
    const uid = deleteConfirm.uid;
    if (uid === null || uid === undefined) return;

    try {
      const res = await usersApi.deleteCustomer({ uid });
      toast.success(res.message);

      const nextAll = allUsers.filter((u: any) => String(u.uid) !== String(uid));
      const nextFiltered = filteredUsers.filter((u: any) => String(u.uid) !== String(uid));

      setAllUsers(nextAll);
      setFilteredUsers(nextFiltered);
      setPagination((prev) => ({
        ...prev,
        total: nextFiltered.length,
        page: Math.max(0, Math.min(prev.page, Math.ceil(nextFiltered.length / prev.rowsPerPage) - 1)),
      }));

      setDeleteConfirm({ open: false, uid: null, user: null });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Silme işlemi başarısız");
      setDeleteConfirm({ open: false, uid: null, user: null });
    }
  }, [allUsers, deleteConfirm.uid, filteredUsers]);

  return {
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

    refetch: fetchAllCustomers,
  };
}
