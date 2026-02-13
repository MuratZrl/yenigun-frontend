// src/features/admin/contracts/hooks/useContractsController.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import { checkAuth } from "@/lib/auth";

/* ── Types ── */

export type ContractRow = {
  tenant: string;
  email: string;
  address: string;
  landlord: string;
  status: string;
  phone: string;
  url: string;
  date: string;
  uid?: string | number;
};

export type NewContractState = {
  open: boolean;
  id: number;
};

/* ── Hook ── */

export function useContractsController() {
  const [cookies] = useCookies(["token"]);
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [contracts, setContracts] = useState<ContractRow[]>([]);
  const [listContracts, setListContracts] = useState<ContractRow[]>([]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [newContract, setNewContract] = useState<NewContractState>({
    open: false,
    id: 0,
  });

  const [showContractDropdown, setShowContractDropdown] = useState(false);

  /* ── Auth ── */
  useEffect(() => {
    const verifyAuth = async () => {
      const authValid = await checkAuth();
      if (!authValid) {
        router.push("/login");
        return;
      }
      setIsAuthenticated(true);
      setLoading(false);
    };
    verifyAuth();
  }, [router]);

  /* ── Load data ── */
  useEffect(() => {
    if (!isAuthenticated) return;

    // Fake data — gerçek uygulamada API'den çekilecek
    const tableFakeData: ContractRow[] = [
      {
        tenant: "Mehmet Demir",
        email: "mehmetdemir@yenigun.com",
        address: "Ankara, Turkey 06500",
        landlord: "Ahmet Yilmaz",
        status: "Aktif Sözleşme",
        phone: "5555555555",
        url: "https://www.atonet.org.tr/Uploads/Birimler/Internet/Duyurular/ATO%20DUYURULARI/2023-10-10-62%20No'lu/kira_sozlesmesi_ornegi.pdf",
        date: "01/01/2024",
      },
    ];
    setContracts(tableFakeData);
    setListContracts(tableFakeData);
  }, [isAuthenticated]);

  /* ── Pagination ── */
  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedContracts = listContracts.slice(startIndex, endIndex);
  const totalPages = Math.ceil(listContracts.length / rowsPerPage);

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

  /* ── Row actions ── */
  const handleDelete = useCallback((_uid: any) => {
    toast.error("Kullanıcı silme işlemi şu an için devre dışıdır.");
  }, []);

  const handleDownloadPDF = useCallback((url: string) => {
    window.open(url, "_blank");
  }, []);

  const handleReviewPDF = useCallback((_uid: any) => {
    toast.error("PDF incelemesi şu an için devre dışıdır.");
  }, []);

  /* ── Filter ── */
  const clearFilter = useCallback(() => {
    setListContracts(contracts);
  }, [contracts]);

  const hasActiveFilter = listContracts.length < contracts.length;

  /* ── Contract dropdown ── */
  const toggleDropdown = useCallback(() => {
    setShowContractDropdown((prev) => !prev);
  }, []);

  const openNewContract = useCallback((id: number) => {
    setNewContract({ open: true, id });
    setShowContractDropdown(false);
  }, []);

  return {
    /* auth */
    loading,
    isAuthenticated,
    cookies,

    /* data */
    contracts,
    listContracts,
    paginatedContracts,

    /* pagination */
    page,
    rowsPerPage,
    startIndex,
    endIndex,
    totalPages,
    handleChangePage,
    handleChangeRowsPerPage,

    /* row actions */
    handleDelete,
    handleDownloadPDF,
    handleReviewPDF,

    /* filter */
    clearFilter,
    hasActiveFilter,

    /* contract modal */
    newContract,
    setNewContract,
    showContractDropdown,
    toggleDropdown,
    openNewContract,
  };
}