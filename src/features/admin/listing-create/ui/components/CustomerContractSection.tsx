// src/features/admin/listing-create/ui/components/CustomerContractSection.tsx
"use client";

import React from "react";
import Select from "react-select";

import type { FormData } from "@/types/property";
import type Customer from "@/types/customers";
import type { Advisor } from "@/types/advert";
import type { FormDataValue } from "../../model/types";
import { turkishFilterOption } from "../../model/utils";

import Section from "./Section";
import FieldRow from "./FieldRow";
import { inputCls, selectCls, selectStyles } from "./styles";

interface CustomerContractSectionProps {
  fourthStep: FormData;
  updateFourthStep: (field: keyof FormData, value: FormDataValue) => void;
  updateNestedFourthStep: (parent: keyof FormData, child: string, value: string) => void;
  customers: Customer[];
  advisors: Advisor[];
  contractTimes: string[];
  yesNoOptions: string[];
}

export default function CustomerContractSection({
  fourthStep, updateFourthStep, updateNestedFourthStep,
  customers, advisors, contractTimes, yesNoOptions,
}: CustomerContractSectionProps) {
  return (
    <Section title="Müşteri & Sözleşme" defaultOpen={true}>
      <FieldRow label="Müşteri" required>
        <Select
          options={[
            { value: "", label: "Müşteri Seçin" },
            ...customers.map((c: Customer) => ({
              value: c.uid,
              label: `${c.name} ${c.surname} - ${c.phones?.[0]?.number || "Telefon yok"}`,
            })),
          ]}
          value={fourthStep.customer ? {
            value: fourthStep.customer,
            label: (() => { const c = customers.find((x: Customer) => x.uid === fourthStep.customer); return c ? `${c.name} ${c.surname}` : ""; })(),
          } : null}
          onChange={(v) => updateFourthStep("customer", v?.value ?? "")}
          placeholder="Müşteri seçin"
          filterOption={turkishFilterOption}
          menuPortalTarget={typeof document !== "undefined" ? document.body : undefined}
          styles={{ ...selectStyles, menuPortal: (base: Record<string, unknown>) => ({ ...base, zIndex: 9999 }) }}
        />
      </FieldRow>

      <FieldRow label="Danışman" required>
        <select value={fourthStep.advisor} onChange={e => updateFourthStep("advisor", e.target.value)} className={selectCls}>
          <option value="">Danışman Seçin</option>
          {advisors.map((a, i) => <option key={`adv-${i}`} value={a.uid?.toString() ?? ""}>{a.name} {a.surname}</option>)}
        </select>
      </FieldRow>

      <FieldRow label="Sözleşme No">
        <input type="text" value={fourthStep.contract_no} onChange={e => updateFourthStep("contract_no", e.target.value)} placeholder="Sözleşme numarası" className={inputCls} />
      </FieldRow>

      <FieldRow label="Sözleşme Tarihi">
        <input
          type="text"
          inputMode="numeric"
          placeholder="dd/mm/yy"
          maxLength={8}
          value={fourthStep.contract_date}
          onChange={e => {
            const raw = e.target.value.replace(/[^0-9]/g, "").slice(0, 6);
            let d = raw.slice(0, 2);
            let m = raw.slice(2, 4);
            const y = raw.slice(4, 6);
            if (d.length === 2) d = String(Math.min(31, Math.max(1, parseInt(d)))).padStart(2, "0");
            if (m.length === 2) m = String(Math.min(12, Math.max(1, parseInt(m)))).padStart(2, "0");
            let formatted = d;
            if (raw.length > 2) formatted += `/${m}`;
            if (raw.length > 4) formatted += `/${y}`;
            updateFourthStep("contract_date", formatted);
          }}
          className={inputCls}
        />
      </FieldRow>

      <FieldRow label="Sözleşme Süresi">
        <select value={fourthStep.contract_time.value} onChange={e => updateNestedFourthStep("contract_time", "value", e.target.value)} className={selectCls}>
          <option value="">Seçiniz</option>
          {contractTimes.map((o, i) => <option key={`ct-${i}`} value={o}>{o}</option>)}
        </select>
      </FieldRow>

      <FieldRow label="EIDS">
        <select value={fourthStep.eids.value} onChange={e => updateNestedFourthStep("eids", "value", e.target.value)} className={selectCls}>
          {yesNoOptions.map((o, i) => <option key={`yn-${i}`} value={o}>{o}</option>)}
        </select>
      </FieldRow>

      {fourthStep.eids.value === "Evet" && (
        <>
          <FieldRow label="EIDS No">
            <input type="text" value={fourthStep.eids.no} onChange={e => updateNestedFourthStep("eids", "no", e.target.value)} placeholder="EIDS numarası" className={inputCls} />
          </FieldRow>
          <FieldRow label="EIDS Tarihi">
            <input type="date" value={fourthStep.eids.date} onChange={e => updateNestedFourthStep("eids", "date", e.target.value)} className={inputCls} />
          </FieldRow>
        </>
      )}
    </Section>
  );
}
