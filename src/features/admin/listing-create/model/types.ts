// src/features/admin/listing-create/model/types.ts

import type React from "react";
import type { FormData, ImageItem, StepState, TurkeyCity } from "@/types/property";
import type Customer from "@/types/customers";
import type { Advisor } from "@/types/advert";

export type FormDataValue = FormData[keyof FormData];

export type MapMarker = { lat: number; lng: number; time?: Date };

export type FeatureValue = string | number | boolean | string[];

/** Category tree node used by helpers (flat or nested API shapes) */
export type CategoryTreeNode = {
  uid?: string;
  _id?: string;
  id?: string;
  name?: string;
  title?: string;
  parentUid?: string;
  parentId?: string;
  children?: CategoryTreeNode[];
  subcategories?: CategoryTreeNode[];
  subCategories?: CategoryTreeNode[];
  attributes?: CategoryAttribute[];
  facilities?: CategoryFacility[];
  features?: { _id: string; name: string; type?: string; options?: string[]; order?: number }[];
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
};

export type CategoryAttribute = {
  id?: string;
  _id?: string;
  name?: string;
  type?: string;
  options?: string[];
  order?: number;
};

export type CategoryFacility = {
  title?: string;
  features?: string[];
};

/** Built dynamic feature descriptor */
export type DynamicFeature = {
  _id: string;
  name: string;
  type: string;
  options: string[];
  required: boolean;
  order?: number;
};

export interface IlanDetaylariTabProps {
  /* basic info */
  fourthStep: FormData;
  updateFourthStep: (field: keyof FormData, value: FormDataValue) => void;
  updateNestedFourthStep: (parent: keyof FormData, child: string, value: string) => void;
  content: string;
  setContent: (c: string) => void;
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPriceValueChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPriceTypeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onAdminNoteChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  currencyOptions: string[];

  /* features */
  firstStep: StepState;
  secondStep: StepState;
  thirdStep: StepState;
  featuresStep: StepState;
  setFeaturesStep: React.Dispatch<React.SetStateAction<StepState>>;
  onElevatorToggle: (v: string) => void;
  onInSiteToggle: (v: string) => void;
  onBalconyToggle: (v: string) => void;
  onIsFurnishedToggle: (v: string) => void;
  onHeatingChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onDeedStatusChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onWhichSideChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onZoningStatusChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  heatingOptions: string[];
  deedStatusOptions: string[];
  directionOptions: string[];
  zoningStatusOptions: string[];

  /* location */
  marker: MapMarker[];
  setMarker: (m: MapMarker[]) => void;
  turkeyCities: TurkeyCity[];

  /* media */
  images: ImageItem[];
  setImages: (imgs: ImageItem[]) => void;
  videoFile: File | null;
  setVideoFile: (f: File | null) => void;
  reOrderImages: boolean;
  setReOrderImages: (v: boolean) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onVideoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (id: string) => void;

  /* other info */
  customers: Customer[];
  advisors: Advisor[];
  isActiveAd: boolean;
  setIsActiveAd: (v: boolean) => void;
  contractTimes: string[];
  yesNoOptions: string[];
  keyOptions: string[];

  /* submit */
  onSubmit: (e?: React.SyntheticEvent) => void;
  isSubmitting: boolean;
}
