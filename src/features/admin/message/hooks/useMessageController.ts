// src/features/admin/message/hooks/useMessageController.ts
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useCookies } from "react-cookie";
import { checkAuth } from "@/lib/auth";
import api from "@/lib/api";

import type {
  MessageGroup,
  MessageUser,
  FilterValues,
  SendMessageState,
  EditModalState,
} from "../lib/types";
import { DEFAULT_FILTER_VALUES, DEFAULT_GROUPS } from "../lib/types";

export function useMessageController() {
  const [cookies] = useCookies(["token"]);
  const router = useRouter();

  /* ── Core state ── */
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [users, setUsers] = useState<MessageUser[]>([]);
  const [listUsers, setListUsers] = useState<MessageUser[]>([]);
  const [checkedItems, setCheckedItems] = useState<MessageUser[]>([]);
  const [groups, setGroups] = useState<MessageGroup[]>(DEFAULT_GROUPS);

  /* ── Pagination ── */
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  /* ── Modals ── */
  const [createGroupOpen, setCreateGroupOpen] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [filteredValues, setFilteredValues] = useState<FilterValues>(DEFAULT_FILTER_VALUES);
  const [editModal, setEditModal] = useState<EditModalState>({
    open: false,
    group: {},
  });
  const [sendMessage, setSendMessage] = useState<SendMessageState>({
    open: false,
    type: ["whatsapp", "sms"],
    users: [],
  });

  /* ── Auth ── */
  useEffect(() => {
    const verifyAuth = async () => {
      const authValid = await checkAuth();
      if (!authValid) {
        router.push("/login");
        return;
      }
      setIsAuthenticated(true);
    };
    verifyAuth();
  }, [router]);

  /* ── Load users ── */
  useEffect(() => {
    if (!isAuthenticated) return;
    api
      .get("/admin/customers")
      .then((res) => {
        setUsers(res.data.data);
        setListUsers(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Kullanıcıları getirme hatası:", err);
        setLoading(false);
        if (err.response?.status === 401) {
          router.push("/login");
        }
      });
  }, [isAuthenticated, router]);

  /* ── Pagination computed ── */
  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedUsers = useMemo(
    () => listUsers.slice(startIndex, endIndex),
    [listUsers, startIndex, endIndex],
  );
  const totalPages = Math.ceil(listUsers.length / rowsPerPage);

  const handleChangePage = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    },
    [],
  );

  /* ── Filter ── */
  const handleCleanFilters = useCallback(() => {
    setFilteredValues(DEFAULT_FILTER_VALUES);
    setListUsers(users);
  }, [users]);

  const handleFilterUsers = useCallback(() => {
    setOpenFilter(false);

    const filterFullname = users.filter((user: MessageUser) => {
      if (!filteredValues.fullname) return true;
      const lower = filteredValues.fullname.toLowerCase();
      const fullname = `${user.name.toLowerCase()} ${user.surname.toLowerCase()}`;
      return (
        user.name.toLowerCase().includes(lower) ||
        user.surname.toLowerCase().includes(lower) ||
        fullname.includes(lower)
      );
    });
    const filterEmail = users.filter((user: MessageUser) => {
      if (!filteredValues.email) return true;
      return user.mail.mail.startsWith(filteredValues.email);
    });
    const filterPhone = users.filter((user: MessageUser) => {
      if (!filteredValues.phone) return true;
      return user.phones.map((p) => p.number).includes(filteredValues.phone);
    });
    const filterGender = users.filter((user: MessageUser) => {
      if (!filteredValues.gender) return true;
      return user.gender === (filteredValues.gender === "Erkek" ? "male" : "female");
    });
    const filterStatus = users.filter((user: MessageUser) => {
      if (!filteredValues.status.selected) return true;
      return user.status.includes(filteredValues.status.selected);
    });
    const filterTurkishId = users.filter((user: MessageUser) => {
      if (!filteredValues.turkish_id) return true;
      return (user.tcNumber ?? "").includes(filteredValues.turkish_id);
    });
    const filterMernisNo = users.filter((user: MessageUser) => {
      if (!filteredValues.mernis_no) return true;
      return (user.mernisNo ?? "").includes(filteredValues.mernis_no);
    });
    const filterProvince = users.filter((user: MessageUser) => {
      if (!filteredValues.province) return true;
      return (user.city ?? "").includes(filteredValues.province);
    });
    const filterDistrict = users.filter((user: MessageUser) => {
      if (!filteredValues.district) return true;
      return (user.county ?? "").includes(filteredValues.district);
    });
    const filterQuarter = users.filter((user: MessageUser) => {
      if (!filteredValues.quarter) return true;
      return (user.neighbourhood ?? "").includes(filteredValues.quarter);
    });

    const allFilters = [
      filterFullname, filterEmail, filterPhone, filterGender,
      filterStatus, filterTurkishId, filterMernisNo,
      filterProvince, filterDistrict, filterQuarter,
    ];
    const filtered = allFilters.reduce((acc, val) =>
      acc.filter((user: MessageUser) => val.includes(user)),
    );
    setListUsers(filtered);
  }, [users, filteredValues]);

  const hasActiveFilter = listUsers.length < users.length;

  /* ── Row checkbox ── */
  const handleCheckItem = useCallback(
    (checked: boolean, row: MessageUser) => {
      if (checked) {
        setCheckedItems((prev) => [...prev, row]);
      } else {
        setCheckedItems((prev) => prev.filter((item) => item.uid !== row.uid));
      }
    },
    [],
  );

  const clearChecked = useCallback(() => setCheckedItems([]), []);

  /* ── Row actions ── */
  const handleSendWhatsapp = useCallback((id: string | number) => {
    setSendMessage({ open: true, type: ["whatsapp"], users: [id] });
  }, []);

  const handleSendSms = useCallback((id: string | number) => {
    setSendMessage({ open: true, type: ["sms"], users: [id] });
  }, []);

  const handleSendToChecked = useCallback(() => {
    setSendMessage({
      open: true,
      type: ["whatsapp", "sms"],
      users: checkedItems.map((item) => item.id ?? item.uid),
    });
  }, [checkedItems]);

  const handleWhatsappGroup = useCallback((group: MessageGroup) => {
    const groupUserIds = group.users ?? [];
    const phones: string[] = users
      .filter((u) => groupUserIds.includes(u.id ?? -1) || groupUserIds.includes(Number(u.uid)))
      .map((u) => u.phones?.[0]?.number?.replace(/\D/g, "") || "")
      .filter(Boolean);

    if (phones.length === 0) return;

    // Open wa.me for each user in the group
    for (const phone of phones) {
      window.open(`https://wa.me/90${phone}`, "_blank");
    }
  }, [users]);

  /* ── Group actions ── */
  const handleEditGroup = useCallback((group: MessageGroup) => {
    setEditModal({ open: true, group });
  }, []);

  /* ── Delete confirmation ── */
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; group: MessageGroup | null }>({
    open: false,
    group: null,
  });

  const handleDeleteGroup = useCallback((group: MessageGroup) => {
    setDeleteConfirm({ open: true, group });
  }, []);

  const confirmDeleteGroup = useCallback(() => {
    if (deleteConfirm.group) {
      setGroups((prev) => prev.filter((g) => g.name !== deleteConfirm.group!.name));
    }
    setDeleteConfirm({ open: false, group: null });
  }, [deleteConfirm.group]);

  const cancelDeleteGroup = useCallback(() => {
    setDeleteConfirm({ open: false, group: null });
  }, []);

  return {
    /* auth */
    loading,
    isAuthenticated,

    /* data */
    users,
    listUsers,
    checkedItems,
    groups,
    setGroups,

    /* pagination */
    page,
    rowsPerPage,
    startIndex,
    endIndex,
    paginatedUsers,
    totalPages,
    handleChangePage,
    handleChangeRowsPerPage,

    /* filter */
    openFilter,
    setOpenFilter,
    filteredValues,
    setFilteredValues,
    handleFilterUsers,
    handleCleanFilters,
    hasActiveFilter,

    /* checkbox */
    handleCheckItem,
    clearChecked,

    /* row actions */
    handleSendWhatsapp,
    handleSendSms,
    handleSendToChecked,

    /* group */
    createGroupOpen,
    setCreateGroupOpen,
    handleEditGroup,
    handleDeleteGroup,
    handleWhatsappGroup,
    deleteConfirm,
    confirmDeleteGroup,
    cancelDeleteGroup,

    /* modals */
    editModal,
    setEditModal,
    sendMessage,
    setSendMessage,
  };
}
