// src/features/admin/customer-detail/hooks/useCustomerDetailController.ts
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import type { Customer, Advert } from "../lib/types";

export function useCustomerDetailController() {
  const router = useRouter();
  const params = useParams();
  const uid = params.uid;

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [adverts, setAdverts] = useState<Advert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ── Fetch data ── */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="))
          ?.split("=")[1];

        if (!token) {
          router.push("/login");
          return;
        }

        const customerResponse = await api.get(`/admin/customers/${uid}`);
        if (customerResponse.data.status !== 200) {
          setError("Müşteri bulunamadı");
          return;
        }

        const advertsResponse = await api.get(
          `/admin/customers/${uid}/adverts?sortBy=created&sortOrder=desc`,
        );

        setCustomer(customerResponse.data.data);
        setAdverts(advertsResponse.data.data || []);
      } catch (err) {
        console.error("Error fetching customer data:", err);
        setError("Veri yüklenirken bir hata oluştu");
      } finally {
        setLoading(false);
      }
    };

    if (uid) fetchData();
  }, [uid, router]);

  /* ── Computed ── */
  const primaryPhone = customer?.phones?.[0]?.number || "Belirtilmemiş";
  const advertCount = adverts.length;
  const activeCount = useMemo(() => adverts.filter((a) => a.active).length, [adverts]);
  const passiveCount = useMemo(() => adverts.filter((a) => !a.active).length, [adverts]);

  /* ── Actions ── */
  const goBack = useCallback(() => {
    router.push("/admin/users");
  }, [router]);

  const handleAdvertClick = useCallback((advert: Advert) => {
    window.open(`/ilan/${advert.uid}`, "_blank");
  }, []);

  const handleEmail = useCallback(() => {
    if (customer?.mail.mail) {
      window.open(`mailto:${customer.mail.mail}`, "_blank");
    }
  }, [customer]);

  const handleCall = useCallback(() => {
    if (primaryPhone !== "Belirtilmemiş") {
      window.open(`tel:${primaryPhone}`, "_blank");
    }
  }, [primaryPhone]);

  return {
    loading,
    error,
    customer,
    adverts,
    primaryPhone,
    advertCount,
    activeCount,
    passiveCount,
    goBack,
    handleAdvertClick,
    handleEmail,
    handleCall,
  };
}