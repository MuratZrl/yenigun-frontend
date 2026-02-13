// src/features/admin/emlak-create/model/buildCreateAdvertPayload.ts
import type { FormData, StepState } from "@/types/property";

type BuildPayloadArgs = {
  firstStep: StepState;
  secondStep: StepState;
  thirdStep: StepState;
  featuresStep: StepState;
  fourthStep: FormData;
  content: string;
  marker: any[];
  isActiveAd: boolean;
};

function getSelected(step: StepState): any {
  return (step as any)?.selected ?? {};
}

/**
 * Build the request body for POST /admin/create-advert
 * Based on API documentation at API_DOCUMENTATION.md lines 895-959
 */
export function buildCreateAdvertPayload(args: BuildPayloadArgs) {
  const {
    firstStep,
    secondStep,
    thirdStep,
    featuresStep,
    fourthStep,
    content,
    marker,
    isActiveAd,
  } = args;

  const fs = getSelected(firstStep);
  const ss = getSelected(secondStep);
  const ts = getSelected(thirdStep);

  /* ── fee: plain number string with dots, NO currency symbol ── */
  const rawPrice = String((fourthStep as any).price?.value ?? "0");
  // rawPrice is already formatted like "9.999" or "3.200.000", just strip any currency symbols
  const fee = rawPrice.replace(/[^\d.]/g, "") || "0";

  /* ── categoryUid: use the deepest selected category's uid ── */
  const categoryUid =
    ts?.subcategoryData?.uid ??
    ss?.subcategoryData?.uid ??
    fs?.categoryData?.uid ??
    null;

  /* ── advisor: API requires { uid, peopleCanSeeProfile } ── */
  const advisorUid = Number((fourthStep as any).advisor) || 0;
  const advisor = advisorUid
    ? {
        uid: advisorUid,
        peopleCanSeeProfile:
          (fourthStep as any).advisor_profile?.value === "Evet",
      }
    : undefined;

  /* ── contract ── */
  const contractDateTimestamp = (fourthStep as any).contract_date
    ? new Date((fourthStep as any).contract_date).getTime()
    : Date.now();

  /* ── eids (top-level fields) ── */
  const eidsNo = (fourthStep as any).eids?.no || "";
  const eidsDate = (fourthStep as any).eids?.date
    ? new Date((fourthStep as any).eids.date).getTime()
    : null;

  /* ── featureValues: array format [{ featureId, value }] ── */
  const featureValues: Array<{ featureId: string; value: any }> = [];
  const selections = (featuresStep as any).selections;
  if (selections) {
    Object.values(selections).forEach((sel: any) => {
      if (sel?.featureId && sel.value !== undefined && sel.value !== null) {
        featureValues.push({
          featureId: sel.featureId,
          value: sel.value,
        });
      }
    });
  }

  /* ── mapCoordinates: API doc shows number (0), but let's send coords if available ── */
  const mapCoordinates = 0;

  /* ── details ── */
  const isKonutOrBina =
    fs?.value === "Konut" || fs?.value === "Bina";
  const isArsaOrArazi =
    fs?.value === "Arsa" || fs?.value === "Arazi";
  const isSatilik =
    ss?.value === "Satılık" || ss?.value === "Devren Satılık";

  const details: Record<string, any> = {
    roomCount: isKonutOrBina ? ((fourthStep as any).roomCount || "") : null,
    netArea: isKonutOrBina ? (Number((fourthStep as any).netArea) || null) : null,
    grossArea: isKonutOrBina ? (Number((fourthStep as any).grossArea) || null) : null,
    buildingAge: isKonutOrBina ? (Number((fourthStep as any).buildingAge) || 0) : null,
    elevator: (fourthStep as any).elevator?.value === "Evet",
    inSite: (fourthStep as any).inSite?.value === "Evet",
    whichSide: (fourthStep as any).whichSide?.value || "",
    acre: isArsaOrArazi ? `${(fourthStep as any).acre || 0} m²` : null,
    zoningStatus: isArsaOrArazi ? ((fourthStep as any).zoningStatus?.value || "") : "",
    floor: Number((fourthStep as any).floor) || null,
    totalFloor: Number((fourthStep as any).totalFloors) || null,
    balcony: (fourthStep as any).balcony?.value === "Evet",
    balconyCount: Number((fourthStep as any).balconyCount) || null,
    furniture: (fourthStep as any).isFurnished?.value === "Evet",
    heating: (fourthStep as any).heating?.value || "",
    deed: isSatilik ? ((fourthStep as any).deedStatus?.value || "") : "",
  };

  return {
    title: (fourthStep as any).title || "",
    steps: {
      first: fs?.value || "",
      second: ss?.value || "",
      third: ts?.value || "",
    },
    customer: Number((fourthStep as any).customer) || 0,
    contract: {
      no: (fourthStep as any).contract_no || "",
      date: contractDateTimestamp,
      time: (fourthStep as any).contract_time?.value || "",
    },
    ...(advisor ? { advisor } : {}),
    eidsNo,
    eidsDate,
    questions: {
      agendaEmlak: (fourthStep as any).agenda_emlak?.value === "Evet",
      homepageEmlak: (fourthStep as any).homepage_emlak?.value === "Evet",
      new_emlak: (fourthStep as any).new_emlak?.value === "Evet",
      chance_emlak: (fourthStep as any).chance_emlak?.value === "Evet",
      special_emlak: (fourthStep as any).special_emlak?.value === "Evet",
      onweb_emlak: (fourthStep as any).onweb_emlak?.value === "Evet",
    },
    thoughts: content || " ",
    whoseKey: (fourthStep as any).key?.value || "Yenigün Emlak",
    fee,
    address: {
      province: (fourthStep as any).province || "",
      district: (fourthStep as any).district || "",
      quarter: (fourthStep as any).quarter || "",
      full_address: (fourthStep as any).address || "",
      mapCoordinates,
      parcel: (fourthStep as any).parsel || "",
    },
    details,
    adminNote: (fourthStep as any).adminNote || "",
    active: isActiveAd,
    userNotes: [],
    categoryUid: categoryUid ? Number(categoryUid) : null,
    featureValues,
    isFeatures: featureValues.length > 0,
  };
}