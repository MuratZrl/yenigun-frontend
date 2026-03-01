// src/features/admin/listing-edit/ui/EditAdDetailsTab.tsx
"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { MediaItem } from "@/types/property";
import { isLocal, isRemote } from "@/types/property";
import type { FeatureValues } from "@/types/category";

import type { EditAdDetailsTabProps, CategoryTreeNode } from "../model/types";
import {
  collectChainToNode, buildFeaturesFromChain, isHardcodedField,
  findNodeInTree, findNodeByName,
} from "../model/utils";

import EditAdDetailSection from "./components/EditAdDetailSection";
import EditAddressSection from "./components/EditAddressSection";
import EditPhotoSection from "./components/EditPhotoSection";
import EditVideoSection from "./components/EditVideoSection";
import EditCustomerContractSection from "./components/EditCustomerContractSection";
import EditSubmitButton from "./components/EditSubmitButton";
import EditImageReorderModal from "./components/EditImageReorderModal";

/* ================================================================== */
/*  Hook: media preview URLs (creates/revokes object URLs)            */
/* ================================================================== */

function mediaPreviewReducer(
  _prev: Map<string, string>,
  next: Map<string, string>,
) {
  return next;
}

function useMediaPreviewMap(mediaItems: MediaItem[]): Map<string, string> {
  const cacheRef = useRef<Map<string, string>>(new Map());
  const [map, dispatch] = React.useReducer(mediaPreviewReducer, new Map<string, string>());

  const mediaIdsKey = mediaItems.map(m => m.id).join(",");

  useEffect(() => {
    const cache = cacheRef.current;
    const next = new Map<string, string>();
    for (const item of mediaItems) {
      if (isRemote(item)) { next.set(item.id, item.url); continue; }
      if (isLocal(item)) {
        const existing = cache.get(item.id);
        if (existing) { next.set(item.id, existing); continue; }
        const url = URL.createObjectURL(item.file);
        cache.set(item.id, url);
        next.set(item.id, url);
      }
    }
    dispatch(next);

    // Revoke URLs for removed items
    const aliveIds = new Set(mediaItems.filter(isLocal).map(x => x.id));
    for (const [id, url] of cache.entries()) {
      if (!aliveIds.has(id)) { URL.revokeObjectURL(url); cache.delete(id); }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mediaIdsKey]);

  // Cleanup all on unmount
  useEffect(() => {
    const cache = cacheRef.current;
    return () => { for (const url of cache.values()) URL.revokeObjectURL(url); cache.clear(); };
  }, []);

  return map;
}

/* ================================================================== */
/*  Main Component                                                    */
/* ================================================================== */

export default function EditAdDetailsTab(props: EditAdDetailsTabProps) {
  const {
    fourthStep, updateFourthStep, updateNestedFourthStep,
    content, setContent,
    onTitleChange, onPriceValueChange, onPriceTypeChange, onAdminNoteChange,
    currencyOptions,
    onElevatorToggle, onInSiteToggle, onBalconyToggle, onIsFurnishedToggle,
    onHeatingChange, onDeedStatusChange, onWhichSideChange, onZoningStatusChange,
    heatingOptions, deedStatusOptions, directionOptions, zoningStatusOptions,
    featureValues, setFeatureValues, featuresStep, setFeaturesStep,
    categories, categoryId, subcategoryId,
    stepFirst, stepSecond, stepThird,
    marker, setMarker, turkeyCities,
    mediaItems, setMediaItems, onPickImages, onRemoveMedia,
    videoFile, setVideoFile, onPickVideo, existingVideoUrl,
    customers, advisors,
    contractTimes, yesNoOptions,
    onSubmit, isSubmitting,
  } = props;

  /* ── Hidden fields ── */
  const [hiddenFields, setHiddenFields] = useState<Set<string>>(new Set());
  const hideField = useCallback((fieldKey: string) => {
    setHiddenFields(prev => { const next = new Set(prev); next.add(fieldKey); return next; });
  }, []);
  const restoreAllFields = useCallback(() => setHiddenFields(new Set()), []);

  /* ── Dynamic features from category tree ── */
  const allFeatures = useMemo(() => {
    if (!categories?.length) return [];

    // Try ID-based lookup first (works when categories tab was used)
    const targetId = subcategoryId || categoryId;
    const nodes = categories as unknown as CategoryTreeNode[];
    if (targetId) {
      const chain = collectChainToNode(nodes, targetId);
      if (chain?.length) return buildFeaturesFromChain(chain).filter((f) => !isHardcodedField(f.name));
      const node = findNodeInTree(nodes, targetId);
      if (node) return buildFeaturesFromChain([node]).filter((f) => !isHardcodedField(f.name));
    }

    // Fallback: find nodes by step names (edit mode — advert has steps.first/second/third)
    const stepNames = [stepFirst, stepSecond, stepThird].filter(Boolean) as string[];
    if (!stepNames.length) return [];

    const chain: CategoryTreeNode[] = [];
    for (const name of stepNames) {
      const node = findNodeByName(nodes, name);
      if (node) chain.push(node);
    }
    if (!chain.length) return [];
    return buildFeaturesFromChain(chain).filter((f) => !isHardcodedField(f.name));
  }, [categories, categoryId, subcategoryId, stepFirst, stepSecond, stepThird]);

  console.log("EDIT allFeatures:", {
    stepFirst,
    stepSecond,
    stepThird,
    categoryId,
    subcategoryId,
    categoriesLength: categories?.length,
    featuresCount: allFeatures.length,
    featureNames: allFeatures.map((f) => f.name),
  });

  console.log("EDIT DEBUG:", {
    stepFirst,
    stepSecond,
    stepThird,
    categoryId,
    subcategoryId,
    categoriesLength: categories?.length,
    featuresCount: allFeatures.length,
    featureNames: allFeatures.map((f) => f.name),
  });

  useEffect(() => {
    if (!allFeatures.length) return;
    setFeatureValues((prev) => {
      const next: FeatureValues = { ...(prev ?? {}) };
      let changed = false;
      for (const f of allFeatures) {
        if (!f._id || Object.prototype.hasOwnProperty.call(next, f._id)) continue;
        const t = f.type;
        next[f._id] = t === "boolean" ? false : t === "number" ? 0 : t === "multi_select" ? [] : "";
        changed = true;
      }
      return changed ? next : prev;
    });
  }, [allFeatures, setFeatureValues]);

  const handleFeatureChange = useCallback((id: string, value: string | number | boolean | string[], type?: string) => {
    setFeatureValues(p => ({ ...p, [id]: value }));
    setFeaturesStep((p) => ({ ...p, selections: { ...(p?.selections ?? {}), [id]: { featureId: id, value, featureType: type || "text" } } }));
  }, [setFeatureValues, setFeaturesStep]);

  /* ── Location geocode ── */
  const [boundaryCoords, setBoundaryCoords] = useState<{lat:number;lng:number}[]>([]);

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

  /* ── Media preview cache ── */
  const previewSrc = useMediaPreviewMap(mediaItems);

  /* ── Video preview ── */
  const videoObjectUrlRef = useRef<string | null>(null);
  const [localVideoPreview, dispatchVideoPreview] = React.useReducer(
    (_prev: string | null, next: string | null) => next,
    null,
  );

  useEffect(() => {
    if (!videoFile) {
      if (videoObjectUrlRef.current) { URL.revokeObjectURL(videoObjectUrlRef.current); videoObjectUrlRef.current = null; }
      dispatchVideoPreview(null);
      return;
    }
    if (videoObjectUrlRef.current) URL.revokeObjectURL(videoObjectUrlRef.current);
    const url = URL.createObjectURL(videoFile);
    videoObjectUrlRef.current = url;
    dispatchVideoPreview(url);
    return () => { if (videoObjectUrlRef.current) { URL.revokeObjectURL(videoObjectUrlRef.current); videoObjectUrlRef.current = null; } };
  }, [videoFile]);

  const effectiveVideoSrc = localVideoPreview || existingVideoUrl || null;

  /* ── Sort modal ── */
  const [openSortModal, setOpenSortModal] = useState(false);

  const handleRemoveClick = (item: MediaItem) => {
    if (item.kind === "remote") {
      const ok = confirm("Bu fotoğraf yayındaki ilandan silinecek. Devam edilsin mi?");
      if (!ok) return;
    }
    onRemoveMedia(item.id);
  };

  /* ── Render ── */
  return (
    <div className="space-y-0">
      <EditAdDetailSection
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

      <EditAddressSection
        fourthStep={fourthStep}
        updateFourthStep={updateFourthStep}
        turkeyCities={turkeyCities}
        marker={marker}
        setMarker={setMarker}
        boundaryCoords={boundaryCoords}
      />

      <EditPhotoSection
        mediaItems={mediaItems}
        previewSrc={previewSrc}
        onPickImages={onPickImages}
        onRemoveClick={handleRemoveClick}
        onOpenSortModal={() => setOpenSortModal(true)}
      />

      <EditVideoSection
        videoFile={videoFile}
        setVideoFile={setVideoFile}
        onPickVideo={onPickVideo}
        effectiveVideoSrc={effectiveVideoSrc}
      />

      <EditCustomerContractSection
        fourthStep={fourthStep}
        updateFourthStep={updateFourthStep}
        updateNestedFourthStep={updateNestedFourthStep}
        customers={customers}
        advisors={advisors}
        contractTimes={contractTimes}
        yesNoOptions={yesNoOptions}
      />

      <EditSubmitButton
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
      />

      <EditImageReorderModal
        open={openSortModal}
        mediaItems={mediaItems}
        setMediaItems={setMediaItems}
        previewSrc={previewSrc}
        onClose={() => setOpenSortModal(false)}
        onRemoveClick={handleRemoveClick}
      />
    </div>
  );
}
