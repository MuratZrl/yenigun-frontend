// src/features/admin/sms-panel/hooks/useSmsController.ts
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";

import api from "@/lib/api";
import type {
  SmsTab,
  SmsStats,
  SmsHistoryItem,
  SmsComposeState,
  RecipientType,
  CustomerCategory,
} from "../lib/types";
import { mockStats, mockHistory, mockRecipientCounts, mockRecipients, districtsByCity } from "../lib/mockData";

export function useSmsController() {
  const router = useRouter();
  const [cookies] = useCookies(["token"]);
  const token = cookies.token;

  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Tab state
  const [activeTab, setActiveTab] = useState<SmsTab>("compose");

  // Stats
  const [stats, setStats] = useState<SmsStats>(mockStats);

  // History
  const [history, setHistory] = useState<SmsHistoryItem[]>(mockHistory);
  const [historyPage, setHistoryPage] = useState(0);
  const [historyRowsPerPage, setHistoryRowsPerPage] = useState(10);

  // Compose form
  const [compose, setCompose] = useState<SmsComposeState>({
    recipientType: "all",
    selectedCities: [],
    selectedDistricts: [],
    selectedCategory: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [excludedRecipientIds, setExcludedRecipientIds] = useState<Set<string>>(new Set());

  // Auth check
  useEffect(() => {
    if (!token) {
      setLoading(false);
      setIsAuthenticated(false);
      return;
    }

    let cancelled = false;

    api
      .get("/user/auth")
      .then(() => {
        if (!cancelled) {
          setIsAuthenticated(true);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          if (err?.response?.status === 401) {
            router.push("/admin/emlak");
          }
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [token, router]);

  // Compose handlers
  const setRecipientType = useCallback((type: RecipientType) => {
    setCompose((prev) => ({
      ...prev,
      recipientType: type,
      selectedCities: [],
      selectedDistricts: [],
      selectedCategory: "",
    }));
    setExcludedRecipientIds(new Set());
  }, []);

  const excludeRecipient = useCallback((id: string) => {
    setExcludedRecipientIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  const toggleCity = useCallback((city: string) => {
    setCompose((prev) => {
      const exists = prev.selectedCities.includes(city);
      const newCities = exists
        ? prev.selectedCities.filter((c) => c !== city)
        : [...prev.selectedCities, city];

      // Remove districts that no longer belong to any selected city
      const validDistricts = newCities.flatMap((c) => districtsByCity[c] ?? []);
      const newDistricts = prev.selectedDistricts.filter((d) =>
        validDistricts.includes(d)
      );

      return {
        ...prev,
        selectedCities: newCities,
        selectedDistricts: newDistricts,
      };
    });
  }, []);

  const toggleDistrict = useCallback((district: string) => {
    setCompose((prev) => {
      const exists = prev.selectedDistricts.includes(district);
      return {
        ...prev,
        selectedDistricts: exists
          ? prev.selectedDistricts.filter((d) => d !== district)
          : [...prev.selectedDistricts, district],
      };
    });
  }, []);

  const setCategory = useCallback((category: CustomerCategory | "") => {
    setCompose((prev) => ({
      ...prev,
      selectedCategory: category,
    }));
  }, []);

  const setMessage = useCallback((message: string) => {
    setCompose((prev) => ({ ...prev, message }));
  }, []);

  // Character & segment count
  const charCount = compose.message.length;
  const smsSegments = Math.max(1, Math.ceil(charCount / 160));

  // Estimated recipient count (derived from actual mockRecipients, minus excluded)
  const estimatedRecipientCount = useMemo(() => {
    const notExcluded = (r: (typeof mockRecipients)[0]) => !excludedRecipientIds.has(r.id);

    switch (compose.recipientType) {
      case "all":
        return mockRecipients.filter(notExcluded).length;
      case "city": {
        if (compose.selectedDistricts.length > 0) {
          return mockRecipients.filter(
            (r) => r.district && compose.selectedDistricts.includes(r.district) && notExcluded(r)
          ).length;
        }
        if (compose.selectedCities.length > 0) {
          return mockRecipients.filter(
            (r) => r.city && compose.selectedCities.includes(r.city) && notExcluded(r)
          ).length;
        }
        return 0;
      }
      case "category":
        return compose.selectedCategory
          ? mockRecipients.filter((r) => r.category === compose.selectedCategory && notExcluded(r)).length
          : 0;
      case "specific":
        return 0;
      default:
        return 0;
    }
  }, [compose.recipientType, compose.selectedCities, compose.selectedDistricts, compose.selectedCategory, excludedRecipientIds]);

  // Recipient summary text
  const recipientSummary = useMemo(() => {
    switch (compose.recipientType) {
      case "all":
        return "Tüm kayıtlı kullanıcılar";
      case "city": {
        const parts: string[] = [];
        if (compose.selectedCities.length > 0) {
          parts.push(compose.selectedCities.join(", "));
        }
        if (compose.selectedDistricts.length > 0) {
          parts.push(compose.selectedDistricts.join(", "));
        }
        return parts.length > 0 ? parts.join(" — ") : "Henüz il/ilçe seçilmedi";
      }
      case "category":
        return compose.selectedCategory || "Henüz kategori seçilmedi";
      case "specific":
        return "Kullanıcı araması yapın";
      default:
        return "";
    }
  }, [compose.recipientType, compose.selectedCities, compose.selectedDistricts, compose.selectedCategory]);

  // Send handler (mock)
  const handleSend = useCallback(async () => {
    if (!compose.message.trim()) {
      toast.error("Lütfen bir mesaj yazın.");
      return;
    }

    if (compose.recipientType === "city" && compose.selectedCities.length === 0) {
      toast.error("Lütfen en az bir il seçin.");
      return;
    }

    if (compose.recipientType === "category" && !compose.selectedCategory) {
      toast.error("Lütfen bir kategori seçin.");
      return;
    }

    setSending(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Add to history (mock)
    const newItem: SmsHistoryItem = {
      id: String(Date.now()),
      recipientName:
        compose.recipientType === "all"
          ? "Tüm Kullanıcılar"
          : compose.recipientType === "city"
          ? compose.selectedCities.join(", ")
          : compose.recipientType === "category"
          ? compose.selectedCategory
          : "Seçili Alıcılar",
      recipientPhone: `${estimatedRecipientCount} kişi`,
      message: compose.message,
      status: "sent",
      sentAt: new Date().toISOString(),
    };

    setHistory((prev) => [newItem, ...prev]);
    setStats((prev) => ({
      ...prev,
      totalSent: prev.totalSent + estimatedRecipientCount,
      successCount: prev.successCount + estimatedRecipientCount,
      remainingQuota: Math.max(0, prev.remainingQuota - estimatedRecipientCount),
    }));

    setCompose((prev) => ({ ...prev, message: "" }));
    setSending(false);
    toast.success(`SMS ${estimatedRecipientCount} kişiye başarıyla gönderildi!`);
  }, [compose, estimatedRecipientCount]);

  // Reset form
  const handleReset = useCallback(() => {
    setCompose({
      recipientType: "all",
      selectedCities: [],
      selectedDistricts: [],
      selectedCategory: "",
      message: "",
    });
    setExcludedRecipientIds(new Set());
  }, []);

  // History pagination
  const paginatedHistory = useMemo(() => {
    const start = historyPage * historyRowsPerPage;
    return history.slice(start, start + historyRowsPerPage);
  }, [history, historyPage, historyRowsPerPage]);

  const totalHistoryPages = Math.ceil(history.length / historyRowsPerPage);

  return {
    loading,
    isAuthenticated,
    activeTab,
    setActiveTab,
    stats,
    history,
    paginatedHistory,
    historyPage,
    setHistoryPage,
    historyRowsPerPage,
    setHistoryRowsPerPage,
    totalHistoryPages,
    compose,
    setRecipientType,
    toggleCity,
    toggleDistrict,
    setCategory,
    setMessage,
    charCount,
    smsSegments,
    estimatedRecipientCount,
    recipientSummary,
    sending,
    handleSend,
    handleReset,
    recipients: mockRecipients,
    excludedRecipientIds,
    excludeRecipient,
  };
}
