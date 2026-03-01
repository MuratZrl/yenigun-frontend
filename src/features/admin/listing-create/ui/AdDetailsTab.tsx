// src/features/admin/listing-create/ui/AdDetailsTab.tsx
"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";

import type { StepState } from "@/types/property";
import type {
  IlanDetaylariTabProps,
  FeatureValue,
  DynamicFeature,
  CategoryTreeNode,
} from "../model/types";
import { buildFeaturesFromChain, isHardcodedField } from "../model/utils";

import AdDetailSection from "./components/AdDetailSection";
import AddressSection from "./components/AddressSection";
import PhotoSection from "./components/PhotoSection";
import VideoSection from "./components/VideoSection";
import CustomerContractSection from "./components/CustomerContractSection";
import SubmitButton from "./components/SubmitButton";
import ImageReorderModal from "./components/ImageReorderModal";

/* ================================================================== */
/*  Main Component                                                    */
/* ================================================================== */

export default function IlanDetaylariTab(props: IlanDetaylariTabProps) {
  const {
    fourthStep, updateFourthStep, updateNestedFourthStep,
    content, setContent,
    onTitleChange, onPriceValueChange, onPriceTypeChange, onAdminNoteChange,
    currencyOptions,
    firstStep, secondStep, thirdStep,
    featuresStep, setFeaturesStep,
    onElevatorToggle, onInSiteToggle, onBalconyToggle, onIsFurnishedToggle,
    onHeatingChange, onDeedStatusChange, onWhichSideChange, onZoningStatusChange,
    heatingOptions, deedStatusOptions, directionOptions, zoningStatusOptions,
    marker, setMarker, turkeyCities,
    images, setImages, videoFile, setVideoFile, reOrderImages, setReOrderImages,
    onImageChange, onVideoChange, onRemoveImage,
    customers, advisors,
    contractTimes, yesNoOptions,
    onSubmit, isSubmitting,
  } = props;

  /* ── Hidden fields (user can dismiss irrelevant rows) ── */
  const [hiddenFields, setHiddenFields] = useState<Set<string>>(new Set());

  const hideField = useCallback((fieldKey: string) => {
    setHiddenFields(prev => { const next = new Set(prev); next.add(fieldKey); return next; });
  }, []);

  const restoreAllFields = useCallback(() => {
    setHiddenFields(new Set());
  }, []);

  /* ── Dynamic features from category tree ── */
  type FVAction =
    | { type: "merge"; payload: Record<string, FeatureValue> }
    | { type: "set"; key: string; value: FeatureValue };
  const fvReducer = useCallback(
    (state: Record<string, FeatureValue>, action: FVAction): Record<string, FeatureValue> => {
      switch (action.type) {
        case "merge": {
          const next = { ...state, ...action.payload };
          return Object.keys(action.payload).length ? next : state;
        }
        case "set":
          return { ...state, [action.key]: action.value };
        default:
          return state;
      }
    },
    [],
  );
  const [featureValues, dispatchFV] = React.useReducer(fvReducer, {} as Record<string, FeatureValue>);

  const getSelected = (step: StepState) => step?.selected;

  const categoryData = useMemo(() => {
    const first = getSelected(firstStep)?.categoryData;
    const second = getSelected(secondStep)?.subcategoryData;
    const third = getSelected(thirdStep)?.subcategoryData;
    return third || second || first || null;
  }, [firstStep, secondStep, thirdStep]);

  const allFeatures = useMemo((): DynamicFeature[] => {
    if (!categoryData) return [];
    const chain: CategoryTreeNode[] = [];
    const first = getSelected(firstStep)?.categoryData as CategoryTreeNode | null | undefined;
    const second = getSelected(secondStep)?.subcategoryData as CategoryTreeNode | null | undefined;
    const third = getSelected(thirdStep)?.subcategoryData as CategoryTreeNode | null | undefined;
    if (first) chain.push(first);
    if (second) chain.push(second);
    if (third) chain.push(third);
    if (!chain.length) return [];
    return buildFeaturesFromChain(chain).filter((f) => !isHardcodedField(f.name));
  }, [categoryData, firstStep, secondStep, thirdStep]);

  useEffect(() => {
    if (!allFeatures.length) return;
    const additions: Record<string, FeatureValue> = {};
    for (const f of allFeatures) {
      if (!f._id || f._id in featureValues) continue;
      const t = f.type;
      additions[f._id] = t === "boolean" ? false : t === "number" ? 0 : t === "multi_select" ? [] : "";
    }
    if (Object.keys(additions).length) dispatchFV({ type: "merge", payload: additions });
  }, [allFeatures, featureValues]);

  const handleFeatureChange = useCallback((id: string, value: FeatureValue, type?: string) => {
    dispatchFV({ type: "set", key: id, value });
    setFeaturesStep((p) => ({ ...p, selections: { ...(p?.selections as Record<string, unknown> ?? {}), [id]: { featureId: id, value, featureType: type || "text" } } }));
  }, [setFeaturesStep]);

  /* ── Location: district boundary ── */
  const [boundaryCoords, setBoundaryCoords] = useState<{ lat: number; lng: number }[]>([]);

  useEffect(() => {
    if (!fourthStep.province || !fourthStep.district || !fourthStep.quarter) return;
    (async () => {
      try {
        const full = `${fourthStep.quarter}, ${fourthStep.district}, ${fourthStep.province}, Türkiye`;
        const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(full)}&key=AIzaSyDL9J82iDhcUWdQiuIvBYa0t5asrtz3Swk`);
        const data = await res.json();
        if (data.results?.length) {
          const loc = data.results[0].geometry.location;
          setMarker([{ lat: loc.lat, lng: loc.lng, time: new Date() }]);
        }
      } catch {}
    })();
  }, [fourthStep.province, fourthStep.district, fourthStep.quarter, setMarker]);

  /* ── Render ── */
  return (
    <div className="space-y-0">
      <AdDetailSection
        fourthStep={fourthStep}
        updateFourthStep={updateFourthStep}
        content={content}
        setContent={setContent}
        onTitleChange={onTitleChange}
        onPriceValueChange={onPriceValueChange}
        onPriceTypeChange={onPriceTypeChange}
        onAdminNoteChange={onAdminNoteChange}
        currencyOptions={currencyOptions}
        onElevatorToggle={onElevatorToggle}
        onInSiteToggle={onInSiteToggle}
        onBalconyToggle={onBalconyToggle}
        onIsFurnishedToggle={onIsFurnishedToggle}
        onHeatingChange={onHeatingChange}
        onDeedStatusChange={onDeedStatusChange}
        onWhichSideChange={onWhichSideChange}
        onZoningStatusChange={onZoningStatusChange}
        heatingOptions={heatingOptions}
        deedStatusOptions={deedStatusOptions}
        directionOptions={directionOptions}
        zoningStatusOptions={zoningStatusOptions}
        allFeatures={allFeatures}
        featureValues={featureValues}
        handleFeatureChange={handleFeatureChange}
        hiddenFields={hiddenFields}
        hideField={hideField}
        restoreAllFields={restoreAllFields}
      />

      <AddressSection
        fourthStep={fourthStep}
        updateFourthStep={updateFourthStep}
        turkeyCities={turkeyCities}
        marker={marker}
        setMarker={setMarker}
        boundaryCoords={boundaryCoords}
      />

      <PhotoSection
        images={images}
        onImageChange={onImageChange}
        onRemoveImage={onRemoveImage}
        onOpenReorder={() => setReOrderImages(true)}
      />

      <VideoSection
        videoFile={videoFile}
        setVideoFile={setVideoFile}
        onVideoChange={onVideoChange}
      />

      <CustomerContractSection
        fourthStep={fourthStep}
        updateFourthStep={updateFourthStep}
        updateNestedFourthStep={updateNestedFourthStep}
        customers={customers}
        advisors={advisors}
        contractTimes={contractTimes}
        yesNoOptions={yesNoOptions}
      />

      <SubmitButton onSubmit={onSubmit} isSubmitting={isSubmitting} />

      {reOrderImages && (
        <ImageReorderModal
          images={images}
          setImages={setImages}
          onClose={() => setReOrderImages(false)}
          onRemoveImage={onRemoveImage}
        />
      )}
    </div>
  );
}
