// src/features/admin/emlak-create/model/buildCreateAdvertPayload.ts
import type { FormData, StepState, SelectedItem, FeatureValue, PropertyDetails } from "@/types/property";

interface MarkerCoord {
  lat: number;
  lng: number;
}

type BuildPayloadArgs = {
  firstStep: StepState;
  secondStep: StepState;
  thirdStep: StepState;
  featuresStep: StepState;
  fourthStep: FormData;
  content: string;
  marker: MarkerCoord[];
  isActiveAd: boolean;
};

function getSelected(step: StepState): SelectedItem {
  return step?.selected ?? ({} as SelectedItem);
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
  const rawPrice = String(fourthStep.price?.value ?? "0");
  // rawPrice is already formatted like "9.999" or "3.200.000", just strip any currency symbols
  const fee = rawPrice.replace(/[^\d.]/g, "") || "0";

  /* ── categoryUid: use the deepest selected category's uid ── */
  const categoryUid =
    ts?.subcategoryData?.uid ??
    ss?.subcategoryData?.uid ??
    fs?.categoryData?.uid ??
    null;

  /* ── advisor: API requires { uid, peopleCanSeeProfile } ── */
  const advisorUid = Number(fourthStep.advisor) || 0;
  const advisor = advisorUid
    ? {
        uid: advisorUid,
        peopleCanSeeProfile:
          fourthStep.advisor_profile?.value === "Evet",
      }
    : undefined;

  /* ── contract ── */
  const contractDateTimestamp = fourthStep.contract_date
    ? new Date(fourthStep.contract_date).getTime()
    : Date.now();

  /* ── eids (top-level fields) ── */
  const eidsNo = fourthStep.eids?.no || "";
  const eidsDate = fourthStep.eids?.date
    ? new Date(fourthStep.eids.date).getTime()
    : null;

  /* ── featureValues: array format [{ featureId, value }] ── */
  const featureValues: Array<{ featureId: string; value: string | number | boolean | string[] }> = [];
  const selections = featuresStep?.selections as Record<string, FeatureValue> | undefined;
  if (selections) {
    Object.values(selections).forEach((sel) => {
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

  const details: PropertyDetails = {
    roomCount: isKonutOrBina ? (fourthStep.roomCount || "") : undefined,
    netArea: isKonutOrBina ? (Number(fourthStep.netArea) || undefined) : undefined,
    grossArea: isKonutOrBina ? (Number(fourthStep.grossArea) || undefined) : undefined,
    buildingAge: isKonutOrBina ? (Number(fourthStep.buildingAge) || 0) : undefined,
    elevator: fourthStep.elevator?.value === "Evet",
    inSite: fourthStep.inSite?.value === "Evet",
    whichSide: fourthStep.whichSide?.value || "",
    acre: isArsaOrArazi ? `${fourthStep.acre || 0} m²` : undefined,
    zoningStatus: isArsaOrArazi ? (fourthStep.zoningStatus?.value || "") : "",
    floor: Number(fourthStep.floor) || undefined,
    totalFloor: Number(fourthStep.totalFloor) || undefined,
    balcony: fourthStep.balcony?.value === "Evet",
    balconyCount: Number(fourthStep.balconyCount) || undefined,
    furniture: fourthStep.isFurnished?.value === "Evet",
    heating: fourthStep.heating?.value || "",
    deed: isSatilik ? (fourthStep.deedStatus?.value || "") : "",
    bathroomCount: fourthStep.bathroomCount || "",
    parking: fourthStep.parking || "",
  };

  return {
    title: fourthStep.title || "",
    steps: {
      first: fs?.value || "",
      second: ss?.value || "",
      third: ts?.value || "",
    },
    customer: Number(fourthStep.customer) || 0,
    contract: {
      no: fourthStep.contract_no || "",
      date: contractDateTimestamp,
      time: fourthStep.contract_time?.value || "",
    },
    ...(advisor ? { advisor } : {}),
    eidsNo,
    eidsDate,
    questions: {
      agendaEmlak: fourthStep.agenda_emlak?.value === "Evet",
      homepageEmlak: fourthStep.homepage_emlak?.value === "Evet",
      new_emlak: fourthStep.new_emlak?.value === "Evet",
      chance_emlak: fourthStep.chance_emlak?.value === "Evet",
      special_emlak: fourthStep.special_emlak?.value === "Evet",
      onweb_emlak: fourthStep.onweb_emlak?.value === "Evet",
    },
    thoughts: content || " ",
    whoseKey: fourthStep.key?.value || "Yenigün Emlak",
    fee,
    address: {
      province: fourthStep.province || "",
      district: fourthStep.district || "",
      quarter: fourthStep.quarter || "",
      full_address: fourthStep.address || "",
      mapCoordinates,
      parcel: fourthStep.parsel || "",
    },
    details,
    adminNote: fourthStep.adminNote || "",
    active: isActiveAd,
    userNotes: [] as string[],
    categoryUid: categoryUid ? Number(categoryUid) : null,
    featureValues,
    isFeatures: featureValues.length > 0,
  };
}
