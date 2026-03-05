// src/features/admin/listing-create/ui/components/AdDetailSection.tsx
"use client";

import React from "react";
import RichTextEditor from "@/components/ui/RichTextEditor";

import type { FormData } from "@/types/property";
import type { FormDataValue, DynamicFeature, FeatureValue } from "../../model/types";
import { selVal, formatNumber } from "../../model/utils";

import Section from "./Section";
import FieldRow from "./FieldRow";
import { inputCls, selectCls } from "./styles";

interface AdDetailSectionProps {
  /* basic info */
  fourthStep: FormData;
  updateFourthStep: (field: keyof FormData, value: FormDataValue) => void;
  content: string;
  setContent: (c: string) => void;
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPriceValueChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPriceTypeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onAdminNoteChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  currencyOptions: string[];

  /* toggle/change handlers */
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

  /* dynamic features */
  allFeatures: DynamicFeature[];
  featureValues: Record<string, FeatureValue>;
  handleFeatureChange: (id: string, value: FeatureValue, type?: string) => void;

  /* hidden fields */
  hiddenFields: Set<string>;
  hideField: (key: string) => void;
  restoreAllFields: () => void;

  /** true when the first-step category is "Konut" or "Bina" */
  isKonutOrBina: boolean;
  /** true when the first-step category is "Arsa" or "Arazi" */
  isArsaOrArazi: boolean;
  /** true when the second-step is "Satılık" or "Devren Satılık" */
  isSatilik: boolean;
}

export default function AdDetailSection({
  fourthStep, updateFourthStep,
  content, setContent,
  onTitleChange, onPriceValueChange, onPriceTypeChange, onAdminNoteChange,
  currencyOptions,
  onElevatorToggle, onInSiteToggle, onBalconyToggle, onIsFurnishedToggle,
  onHeatingChange, onDeedStatusChange, onWhichSideChange, onZoningStatusChange,
  heatingOptions, deedStatusOptions, directionOptions, zoningStatusOptions,
  allFeatures, featureValues, handleFeatureChange,
  hiddenFields, hideField, restoreAllFields,
  isKonutOrBina, isArsaOrArazi, isSatilik,
}: AdDetailSectionProps) {
  const formattedPrice = formatNumber(fourthStep.price.value);

  return (
    <Section title="İlan Detayları" defaultOpen={true}>
      <FieldRow label="İlan Başlığı" required>
        <input type="text" value={fourthStep.title} onChange={onTitleChange} maxLength={64} placeholder="Örn: Deniz Manzaralı Modern Daire" className={inputCls} />
        <p className="text-[11px] text-gray-400 mt-1 text-right">{fourthStep.title.length}/64</p>
      </FieldRow>

      <FieldRow label="Açıklama" required>
        <RichTextEditor content={content} setContent={setContent} placeholder="İlan açıklamasını detaylı yazın..." />
      </FieldRow>

      <FieldRow label="Fiyat" required>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input type="text" value={formattedPrice} onChange={onPriceValueChange} placeholder="0" className={`${inputCls} pr-16`} />
            <select
              value={fourthStep.price.type}
              onChange={onPriceTypeChange}
              className="absolute right-1 top-1/2 -translate-y-1/2 border-0 bg-gray-100 rounded px-2 py-1 text-[13px] text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
            >
              {currencyOptions.map((o, i) => <option key={`cur-${i}`} value={o}>{o}</option>)}
            </select>
          </div>
        </div>
      </FieldRow>

      {isKonutOrBina && !hiddenFields.has("grossArea") && (
      <FieldRow label="m² (Brüt)" fieldKey="grossArea" onHide={hideField}>
        <input type="number" value={fourthStep.grossArea || ""} onChange={e => updateFourthStep("grossArea", Number(e.target.value))} placeholder="m² brüt alan" className={inputCls} />
      </FieldRow>
      )}

      {isKonutOrBina && !hiddenFields.has("netArea") && (
      <FieldRow label="m² (Net)" fieldKey="netArea" onHide={hideField}>
        <input type="number" value={fourthStep.netArea || ""} onChange={e => updateFourthStep("netArea", Number(e.target.value))} placeholder="m² net alan" className={inputCls} />
      </FieldRow>
      )}

      {isKonutOrBina && !hiddenFields.has("roomCount") && (
      <FieldRow label="Oda Sayısı" fieldKey="roomCount" onHide={hideField}>
        <select value={selVal(fourthStep.roomCount)} onChange={e => updateFourthStep("roomCount", e.target.value)} className={selectCls}>
          <option value="">Seçiniz</option>
          {["1+0","1+1","2+0","2+1","3+0","3+1","3+2","4+1","4+2","5+1","5+2","5+3","6+1","6+2","6+3","7+","8+","9+","10+"].map((v, i) => <option key={`room-${i}`} value={v}>{v}</option>)}
        </select>
      </FieldRow>
      )}

      {isKonutOrBina && !hiddenFields.has("buildingAge") && (
      <FieldRow label="Bina Yaşı" fieldKey="buildingAge" onHide={hideField}>
        <select value={selVal(fourthStep.buildingAge)} onChange={e => updateFourthStep("buildingAge", Number(e.target.value))} className={selectCls}>
          <option value="">Seçiniz</option>
          {["0 (Sıfır)","1","2","3","4","5-10","11-15","16-20","21-25","26-30","31+"].map((v, i) => <option key={`age-${i}`} value={v}>{v}</option>)}
        </select>
      </FieldRow>
      )}

      {!hiddenFields.has("floor") && (
      <FieldRow label="Bulunduğu Kat" fieldKey="floor" onHide={hideField}>
        <select value={selVal(fourthStep.floor)} onChange={e => updateFourthStep("floor", Number(e.target.value))} className={selectCls}>
          <option value="">Seçiniz</option>
          {["Bodrum Kat","Zemin Kat","Bahçe Katı","Yüksek Giriş","Giriş Kat","Müstakil","Kot 1","Kot 2","Kot 3","1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","30+","Çatı Katı","Villa Tipi"].map((v, i) => <option key={`floor-${i}`} value={v}>{v}</option>)}
        </select>
      </FieldRow>
      )}

      {!hiddenFields.has("totalFloors") && (
      <FieldRow label="Kat Sayısı" fieldKey="totalFloors" onHide={hideField}>
        <select value={selVal(fourthStep.totalFloor)} onChange={e => updateFourthStep("totalFloor", Number(e.target.value))} className={selectCls}>
          <option value="">Seçiniz</option>
          {Array.from({length: 40}, (_, i) => String(i + 1)).map((v, i) => <option key={`tfloor-${i}`} value={v}>{v}</option>)}
        </select>
      </FieldRow>
      )}

      {!hiddenFields.has("heating") && (
      <FieldRow label="Isıtma" fieldKey="heating" onHide={hideField}>
        <select value={selVal(fourthStep.heating)} onChange={onHeatingChange} className={selectCls}>
          <option value="">Seçiniz</option>
          {heatingOptions.map((o, i) => <option key={`heat-${i}`} value={o}>{o}</option>)}
        </select>
      </FieldRow>
      )}

      {!hiddenFields.has("bathroomCount") && (
      <FieldRow label="Banyo Sayısı" fieldKey="bathroomCount" onHide={hideField}>
        <select value={selVal(fourthStep.bathroomCount)} onChange={e => updateFourthStep("bathroomCount", e.target.value)} className={selectCls}>
          <option value="">Seçiniz</option>
          {["Yok","1","2","3","4","5","6","7+"].map((v, i) => <option key={`bath-${i}`} value={v}>{v}</option>)}
        </select>
      </FieldRow>
      )}

      {!hiddenFields.has("balcony") && (
      <FieldRow label="Balkon" fieldKey="balcony" onHide={hideField}>
        <select value={selVal(fourthStep.balcony)} onChange={e => onBalconyToggle(e.target.value)} className={selectCls}>
          <option value="">Seçiniz</option>
          <option value="Evet">Var</option>
          <option value="Hayır">Yok</option>
        </select>
      </FieldRow>
      )}

      {!hiddenFields.has("elevator") && (
      <FieldRow label="Asansör" fieldKey="elevator" onHide={hideField}>
        <select value={selVal(fourthStep.elevator)} onChange={e => onElevatorToggle(e.target.value)} className={selectCls}>
          <option value="">Seçiniz</option>
          <option value="Evet">Var</option>
          <option value="Hayır">Yok</option>
        </select>
      </FieldRow>
      )}

      {!hiddenFields.has("parking") && (
      <FieldRow label="Otopark" fieldKey="parking" onHide={hideField}>
        <select value={selVal(fourthStep.parking)} onChange={e => updateFourthStep("parking", e.target.value)} className={selectCls}>
          <option value="">Seçiniz</option>
          <option value="Açık Otopark">Açık Otopark</option>
          <option value="Kapalı Otopark">Kapalı Otopark</option>
          <option value="Açık &amp; Kapalı Otopark">Açık &amp; Kapalı Otopark</option>
          <option value="Yok">Yok</option>
        </select>
      </FieldRow>
      )}

      {!hiddenFields.has("isFurnished") && (
      <FieldRow label="Eşyalı" fieldKey="isFurnished" onHide={hideField}>
        <select value={selVal(fourthStep.isFurnished)} onChange={e => onIsFurnishedToggle(e.target.value)} className={selectCls}>
          <option value="">Seçiniz</option>
          <option value="Evet">Evet</option>
          <option value="Hayır">Hayır</option>
        </select>
      </FieldRow>
      )}

      {!hiddenFields.has("inSite") && (
      <FieldRow label="Site İçinde" fieldKey="inSite" onHide={hideField}>
        <select value={selVal(fourthStep.inSite)} onChange={e => onInSiteToggle(e.target.value)} className={selectCls}>
          <option value="">Seçiniz</option>
          <option value="Evet">Evet</option>
          <option value="Hayır">Hayır</option>
        </select>
      </FieldRow>
      )}

      {isSatilik && !hiddenFields.has("deedStatus") && (
      <FieldRow label="Tapu Durumu" fieldKey="deedStatus" onHide={hideField}>
        <select value={selVal(fourthStep.deedStatus)} onChange={onDeedStatusChange} className={selectCls}>
          <option value="">Seçiniz</option>
          {deedStatusOptions.map((o, i) => <option key={`deed-${i}`} value={o}>{o}</option>)}
        </select>
      </FieldRow>
      )}

      {!hiddenFields.has("whichSide") && (
      <FieldRow label="Cephe" fieldKey="whichSide" onHide={hideField}>
        <select value={selVal(fourthStep.whichSide)} onChange={onWhichSideChange} className={selectCls}>
          <option value="">Seçiniz</option>
          {directionOptions.map((o, i) => <option key={`dir-${i}`} value={o}>{o}</option>)}
        </select>
      </FieldRow>
      )}

      {isArsaOrArazi && !hiddenFields.has("zoningStatus") && (
      <FieldRow label="İmar Durumu" fieldKey="zoningStatus" onHide={hideField}>
        <select value={selVal(fourthStep.zoningStatus)} onChange={onZoningStatusChange} className={selectCls}>
          <option value="">Seçiniz</option>
          {zoningStatusOptions.map((o, i) => <option key={`zone-${i}`} value={o}>{o}</option>)}
        </select>
      </FieldRow>
      )}

      {/* Dynamic features from category tree */}
      {allFeatures.map((f) => !hiddenFields.has(f._id) && (
        <FieldRow key={f._id} label={f.name} fieldKey={f._id} onHide={hideField}>
          {f.type === "boolean" ? (
            <select value={featureValues[f._id] === true ? "Evet" : featureValues[f._id] === false ? "Hayır" : ""} onChange={e => handleFeatureChange(f._id, e.target.value === "Evet", "boolean")} className={selectCls}>
              <option value="">Seçiniz</option>
              <option value="Evet">Evet</option>
              <option value="Hayır">Hayır</option>
            </select>
          ) : f.type === "single_select" || f.type === "select" ? (
            <select value={String(featureValues[f._id] ?? "")} onChange={e => handleFeatureChange(f._id, e.target.value, "single_select")} className={selectCls}>
              <option value="">Seçiniz</option>
              {(f.options ?? []).map((o: string, i: number) => <option key={`${f._id}-opt-${i}`} value={o}>{o}</option>)}
            </select>
          ) : f.type === "multi_select" ? (
            <div className="flex flex-wrap gap-3">
              {(f.options ?? []).map((o: string, i: number) => {
                const raw = featureValues[f._id];
                const sel: string[] = Array.isArray(raw) ? raw : [];
                const checked = sel.includes(o);
                return (
                  <label key={`${f._id}-ms-${i}`} className="flex items-center gap-1.5 text-[13px] text-gray-700 cursor-pointer">
                    <input type="checkbox" checked={checked} onChange={() => handleFeatureChange(f._id, checked ? sel.filter((x) => x !== o) : [...sel, o], "multi_select")} className="rounded border-gray-300" />
                    {o}
                  </label>
                );
              })}
            </div>
          ) : f.type === "number" ? (
            <input type="number" placeholder={f.name} value={String(featureValues[f._id] ?? "")} onChange={e => handleFeatureChange(f._id, Number(e.target.value), "number")} className={inputCls} />
          ) : (
            <input type="text" placeholder={f.name} value={String(featureValues[f._id] ?? "")} onChange={e => handleFeatureChange(f._id, e.target.value, "text")} className={inputCls} />
          )}
        </FieldRow>
      ))}

      <FieldRow label="Admin Notu">
        <textarea value={fourthStep.adminNote} onChange={onAdminNoteChange} rows={3} placeholder="Sadece adminlerin göreceği notlar..." className={inputCls} />
        <p className="text-[11px] text-gray-400 mt-1">Bu not sadece admin panelinde görüntülenecektir.</p>
      </FieldRow>

      {hiddenFields.size > 0 && (
        <div className="py-3">
          <button
            type="button"
            onClick={restoreAllFields}
            className="text-[12px] text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
            Gizlenen alanları geri getir ({hiddenFields.size})
          </button>
        </div>
      )}
    </Section>
  );
}
