// src/features/admin/advisor-detail/hooks/useAdvisorDetailController.ts
"use client";

import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import type { Advisor, Advert, AdvisorDetailProps } from "../lib/types";

export function useAdvisorDetailController(props: AdvisorDetailProps) {
  const router = useRouter();
  const { advisor, adverts, advertCount } = props;

  const activeAdverts = useMemo(
    () => adverts.filter((a) => a.active),
    [adverts],
  );

  const passiveAdverts = useMemo(
    () => adverts.filter((a) => !a.active),
    [adverts],
  );

  const goBack = useCallback(() => {
    router.push("/admin/admins");
  }, [router]);

  const handleAdvertClick = useCallback((advert: Advert) => {
    window.open(`/ilan/${advert.uid}`, "_blank");
  }, []);

  const handleEmail = useCallback(() => {
    window.open(`mailto:${advisor.mail}`, "_blank");
  }, [advisor.mail]);

  const handleCall = useCallback(() => {
    if (advisor.gsmNumber) {
      window.open(`tel:${advisor.gsmNumber}`, "_blank");
    }
  }, [advisor.gsmNumber]);

  return {
    advisor,
    adverts,
    advertCount,
    activeAdverts,
    passiveAdverts,
    goBack,
    handleAdvertClick,
    handleEmail,
    handleCall,
  };
}