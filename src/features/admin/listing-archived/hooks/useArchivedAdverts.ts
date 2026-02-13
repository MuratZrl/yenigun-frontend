// src/features/admin/emlak-archived/hooks/useArchivedAdverts.ts

"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { checkAuth } from "@/lib/auth";
import api from "@/lib/api";
import type { Advert } from "../types";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const PAGE_FETCH_LIMIT = 100;
const MAX_PAGES = 100;
const DEFAULT_ROWS_PER_PAGE = 25;

/* ------------------------------------------------------------------ */
/*  Sorting                                                            */
/* ------------------------------------------------------------------ */

function sortByNewest(a: Advert, b: Advert): number {
  return b.created.createdTimestamp - a.created.createdTimestamp;
}

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */

export function useArchivedAdverts() {
  const router = useRouter();

  /* ---- Auth ---- */
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /* ---- Data ---- */
  const [allAdverts, setAllAdverts] = useState<Advert[]>([]);
  const [filteredAdverts, setFilteredAdverts] = useState<Advert[]>([]);
  const [loading, setLoading] = useState(true);

  /* ---- Pagination ---- */
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ROWS_PER_PAGE);

  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const totalPages = Math.ceil(filteredAdverts.length / rowsPerPage);
  const paginatedData = filteredAdverts.slice(startIndex, endIndex);

  /* ---- Responsive ---- */
  const [isMobile, setIsMobile] = useState(false);

  /* ================================================================ */
  /*  Auth check                                                      */
  /* ================================================================ */

  useEffect(() => {
    let cancelled = false;

    const verify = async () => {
      const valid = await checkAuth();
      if (cancelled) return;
      if (!valid) {
        router.push("/login");
        return;
      }
      setIsAuthenticated(true);
    };

    verify();
    return () => { cancelled = true; };
  }, [router]);

  /* ================================================================ */
  /*  Fetch archived adverts                                          */
  /* ================================================================ */

  useEffect(() => {
    if (!isAuthenticated) return;
    let cancelled = false;

    const fetchAll = async () => {
      try {
        let collected: Advert[] = [];
        let currentPage = 1;
        let hasMore = true;

        while (hasMore) {
          try {
            const res = await api.get(
              `/admin/adverts?page=${currentPage}&limit=${PAGE_FETCH_LIMIT}`
            );

            const adverts: Advert[] = res.data.data || [];

            if (adverts.length > 0) {
              const archived = adverts.filter((ad) => !ad.active);
              collected = [...collected, ...archived];
            }

            const total = res.data.totalPages;
            if ((total && currentPage >= total) || adverts.length === 0) {
              hasMore = false;
            } else {
              currentPage++;
            }

            if (currentPage > MAX_PAGES) {
              console.warn("Max page limit reached, stopping pagination");
              hasMore = false;
            }
          } catch (err) {
            console.error(`Error fetching page ${currentPage}:`, err);
            hasMore = false;
          }
        }

        if (cancelled) return;

        const sorted = collected.sort(sortByNewest);
        setAllAdverts(sorted);
        setFilteredAdverts(sorted);
      } catch (err) {
        console.error("Error fetching archived adverts:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchAll();
    return () => { cancelled = true; };
  }, [isAuthenticated]);

  /* ================================================================ */
  /*  Screen size                                                     */
  /* ================================================================ */

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* ================================================================ */
  /*  Pagination handlers                                             */
  /* ================================================================ */

  const handleChangePage = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(parseInt(e.target.value, 10));
      setPage(0);
    },
    []
  );

  /* ================================================================ */
  /*  Data mutation (used by actions hook)                            */
  /* ================================================================ */

  /** Replace filtered list (called after filter apply / reset) */
  const applyFilteredData = useCallback((data: Advert[]) => {
    setFilteredAdverts(data.sort(sortByNewest));
    setPage(0);
  }, []);

  /** Update a single advert in both lists (e.g. activity toggle) */
  const updateAdvert = useCallback(
    (uid: string, updater: (ad: Advert) => Advert) => {
      setAllAdverts((prev) => prev.map((ad) => (ad.uid === uid ? updater(ad) : ad)).sort(sortByNewest));
      setFilteredAdverts((prev) => prev.map((ad) => (ad.uid === uid ? updater(ad) : ad)).sort(sortByNewest));
    },
    []
  );

  /** Remove an advert from both lists (e.g. delete) */
  const removeAdvert = useCallback((uid: string) => {
    setAllAdverts((prev) => prev.filter((ad) => ad.uid !== uid).sort(sortByNewest));
    setFilteredAdverts((prev) => prev.filter((ad) => ad.uid !== uid).sort(sortByNewest));
  }, []);

  /* ================================================================ */
  /*  Return                                                          */
  /* ================================================================ */

  return {
    // State
    isAuthenticated,
    loading,
    isMobile,

    // Data
    allAdverts,
    filteredAdverts,
    paginatedData,

    // Pagination
    page,
    rowsPerPage,
    startIndex,
    endIndex,
    totalPages,
    handleChangePage,
    handleChangeRowsPerPage,

    // Mutations (for other hooks / components)
    applyFilteredData,
    updateAdvert,
    removeAdvert,
  };
}