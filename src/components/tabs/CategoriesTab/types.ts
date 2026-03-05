// src/components/tabs/CategoriesTab/types.ts
import type { SelectedItem, StepState } from "@/types/property";

export type Id = string;

/** Shape of a node coming from the API before mapping */
export interface RawCategoryNode {
  _id?: string;
  uid?: number;
  parentUid?: number | null;
  name?: string;
  attributes?: unknown[];
  facilities?: unknown[];
  children?: RawCategoryNode[];
}

/** Extended selected item with fields specific to category selection */
export interface CategorySelectedItem extends Omit<SelectedItem, "categoryData" | "subcategoryData"> {
  uid?: number;
  categoryData?: NestedSubCategory | null;
  subcategoryData?: NestedSubCategory | null;
}

export type CategoryAttribute = {
  id: string;
  type: string;
  options?: string[];
  required?: boolean;
  name: string;
  order?: number;
};

export type CategoryFacilityGroup = {
  title: string;
  features: string[];
};

export type NestedSubCategory = {
  _id: Id;
  uid: number;
  parentUid: number | null;
  name: string;
  attributes?: CategoryAttribute[];
  facilities?: CategoryFacilityGroup[];
  subcategories?: NestedSubCategory[];
};

export type UiCategory = NestedSubCategory & { value: string };

export interface CombinedCategoryTabProps {
  firstStep: StepState;
  setFirstStep: React.Dispatch<React.SetStateAction<StepState>>;
  secondStep: StepState;
  setSecondStep: React.Dispatch<React.SetStateAction<StepState>>;
  thirdStep: StepState;
  setThirdStep: React.Dispatch<React.SetStateAction<StepState>>;
  onNext?: () => void;
}
