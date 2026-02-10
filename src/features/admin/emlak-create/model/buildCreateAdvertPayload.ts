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

  const eidsDateTimestamp = (fourthStep as any).eids?.date
    ? new Date((fourthStep as any).eids.date).getTime()
    : null;

  const contractDateTimestamp = (fourthStep as any).contract_date
    ? new Date((fourthStep as any).contract_date).getTime()
    : Date.now();

  const formattedPrice = (fourthStep as any).price?.value
    ? `${(fourthStep as any).price.value} ${(fourthStep as any).price.type}`
    : "0 TL";

  const categoryId = (firstStep as any).selected?.categoryData?._id || "";

  const subcategoryId = (thirdStep as any).selected?.subcategoryData?._id
    ? (thirdStep as any).selected.subcategoryData._id
    : (secondStep as any).selected?.subcategoryData?._id || "";

  const formattedFeatures: Record<string, any> = {};
  const selections = (featuresStep as any).selections;

  if (selections) {
    Object.values(selections).forEach((sel: any) => {
      if (sel?.featureId && sel.value !== undefined && sel.value !== null) {
        formattedFeatures[sel.featureId] = sel.value;
      }
    });
  }

  return {
    steps: {
      first: (firstStep as any).selected?.value || "",
      second: (secondStep as any).selected?.value || "",
      third: (thirdStep as any).selected?.value || "",
    },
    title: (fourthStep as any).title || "",
    customer: Number((fourthStep as any).customer) || 0,
    contract: {
      no: (fourthStep as any).contract_no || "",
      date: contractDateTimestamp,
      time: (fourthStep as any).contract_time?.value || "",
    },
    advisor: {
      uid: Number((fourthStep as any).advisor) || 0,
      peopleCanSeeProfile: (fourthStep as any).advisor_profile?.value === "Evet",
    },
    eids: {
      no: (fourthStep as any).eids?.no || "",
      date: eidsDateTimestamp,
    },
    questions: {
      agendaEmlak: (fourthStep as any).agenda_emlak?.value === "Evet",
      homepageEmlak: (fourthStep as any).homepage_emlak?.value === "Evet",
      new_emlak: (fourthStep as any).new_emlak?.value === "Evet",
      chance_emlak: (fourthStep as any).chance_emlak?.value === "Evet",
      special_emlak: (fourthStep as any).special_emlak?.value === "Evet",
      onweb_emlak: (fourthStep as any).onweb_emlak?.value === "Evet",
    },
    thoughts: content || " ",
    adminNote: (fourthStep as any).adminNote || "",
    whoseKey: (fourthStep as any).key?.value || "Yenigün Emlak",
    fee: formattedPrice,
    address: {
      province: (fourthStep as any).province || "",
      district: (fourthStep as any).district || "",
      quarter: (fourthStep as any).quarter || "",
      full_address: (fourthStep as any).address || "",
      mapCoordinates:
        marker && marker[0]
          ? { lat: marker[0].lat, lng: marker[0].lng }
          : { lat: 0, lng: 0 },
      parcel: (fourthStep as any).parsel || "",
    },
    active: isActiveAd,
    details: {
      roomCount:
        (firstStep as any).selected.value === "Konut" ||
        (firstStep as any).selected.value === "Bina"
          ? (fourthStep as any).roomCount
          : null,
      netArea:
        (firstStep as any).selected.value === "Konut" ||
        (firstStep as any).selected.value === "Bina"
          ? Number((fourthStep as any).netArea)
          : null,
      grossArea:
        (firstStep as any).selected.value === "Konut" ||
        (firstStep as any).selected.value === "Bina"
          ? Number((fourthStep as any).grossArea)
          : null,
      buildingAge:
        (firstStep as any).selected.value === "Konut" ||
        (firstStep as any).selected.value === "Bina"
          ? Number((fourthStep as any).buildingAge)
          : null,
      elevator: (fourthStep as any).elevator?.value === "Evet",
      inSite: (fourthStep as any).inSite?.value === "Evet",
      whichSide: (fourthStep as any).whichSide?.value || "",
      acre:
        (firstStep as any).selected.value === "Arsa" ||
        (firstStep as any).selected.value === "Arazi"
          ? `${(fourthStep as any).acre} m²`
          : null,
      zoningStatus:
        (firstStep as any).selected.value === "Arsa" ||
        (firstStep as any).selected.value === "Arazi"
          ? (fourthStep as any).zoningStatus?.value || ""
          : "",
      floor: Number((fourthStep as any).floor) || null,
      totalFloor: Number((fourthStep as any).totalFloor) || null,
      balcony: (fourthStep as any).balcony?.value === "Evet",
      balconyCount: Number((fourthStep as any).balconyCount) || null,
      furniture: (fourthStep as any).isFurnished?.value === "Evet",
      heating: (fourthStep as any).heating?.value || "",
      deed:
        (secondStep as any).selected.value === "Satılık" ||
        (secondStep as any).selected.value === "Devren Satılık"
          ? (fourthStep as any).deedStatus?.value || ""
          : "",
    },
    category: categoryId,
    subcategory: subcategoryId,
    features: formattedFeatures,
  };
}
