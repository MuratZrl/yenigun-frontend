"use client";
import React from "react";
import { motion } from "framer-motion";
import { User, FileText, Calendar, Clock, Hash, Key } from "lucide-react";
import { FormData } from "@/app/types/property";
import Select from "react-select";
import SimpleInput from "@/app/components/ui/SimpleInput";
import SimpleSelect from "@/app/components/ui/SimpleSelect";
import QuestionToggle from "@/app/components/ui/QuestionToggle";
import Customer from "@/app/types/customers";
import Advisor from "@/app/types/advisor";
import { useMemo } from "react";

interface OtherInfoTabProps {
  fourthStep: FormData;
  customers: Customer[];
  advisors: Advisor[];
  isActiveAd: boolean;
  setIsActiveAd: (active: boolean) => void;
  onCustomerChange: (value: any) => void;
  onAdvisorChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onContractNoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onContractDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onContractTimeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onEidsValueChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onEidsNoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEidsDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onAdvisorProfileToggle: (value: string) => void;
  onAgendaEmlakToggle: (value: string) => void;
  onHomepageEmlakToggle: (value: string) => void;
  onNewEmlakToggle: (value: string) => void;
  onChanceEmlakToggle: (value: string) => void;
  onSpecialEmlakToggle: (value: string) => void;
  onOnwebEmlakToggle: (value: string) => void;
  contractTimes: any[];
  yesNoOptions: any[];
  keyOptions: any[];
}

export default function OtherInfoTab({
  fourthStep,
  customers,
  advisors,
  isActiveAd,
  setIsActiveAd,
  onCustomerChange,
  onAdvisorChange,
  onContractNoChange,
  onContractDateChange,
  onContractTimeChange,
  onEidsValueChange,
  onEidsNoChange,
  onEidsDateChange,
  onKeyChange,
  onAdvisorProfileToggle,
  onAgendaEmlakToggle,
  onHomepageEmlakToggle,
  onNewEmlakToggle,
  onChanceEmlakToggle,
  onSpecialEmlakToggle,
  onOnwebEmlakToggle,
  contractTimes,
  yesNoOptions,
  keyOptions,
}: OtherInfoTabProps) {
  const getSelectedCustomer = () => {
    if (!fourthStep.customer) return null;

    const selectedCustomer = customers.find(
      (item: Customer) => item.uid?.toString() === fourthStep.customer,
    );

    if (!selectedCustomer) return null;

    return {
      value: fourthStep.customer,
      label: `${selectedCustomer.name} ${selectedCustomer.surname} - ${
        selectedCustomer.phones[0]?.number || "Telefon yok"
      }`,
    };
  };

  const customerOptions = useMemo(
    () =>
      customers.map((c: Customer) => ({
        value: c.uid?.toString() || "",
        label: `${c.name} ${c.surname} - ${
          c.phones?.[0]?.number || "Telefon yok"
        }`,
      })),
    [customers],
  );

  const selectedCustomer = useMemo(() => {
    return (
      customerOptions.find((opt) => opt.value === fourthStep.customer) || null
    );
  }, [customerOptions, fourthStep.customer]);

  const fallbackAdvisorOption =
    fourthStep.advisor && advisors.length === 0
      ? [
          {
            value: fourthStep.advisor,
            label: "Mevcut Danışman (yükleniyor...)",
          },
        ]
      : [];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Müşteri & Sözleşme
          </h3>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-900">
              Müşteri
            </label>

            <Select
              options={customerOptions}
              value={selectedCustomer}
              onChange={(option) => onCustomerChange(option?.value || "")}
              placeholder="Müşteri seçin"
              isSearchable
              menuPortalTarget={
                typeof document !== "undefined" ? document.body : null
              }
              styles={{
                control: (base) => ({
                  ...base,
                  border: "1px solid #D1D5DB",
                  borderRadius: "0.5rem",
                  padding: "0.25rem",
                  minHeight: "48px",
                }),
                menuPortal: (base) => ({
                  ...base,
                  zIndex: 9999,
                }),
                menu: (base) => ({
                  ...base,
                  zIndex: 9999,
                }),
                option: (base, state) => ({
                  ...base,
                  backgroundColor: state.isFocused ? "#f3f4f6" : "white",
                  color: "#374151",
                  cursor: "pointer",
                }),
                placeholder: (base) => ({
                  ...base,
                  color: "#9CA3AF",
                }),
              }}
            />
          </div>

          <SimpleSelect
            label="Danışman"
            value={fourthStep.advisor}
            onChange={onAdvisorChange}
            options={[
              { value: "", label: "Danışman Seçin" },
              ...fallbackAdvisorOption,
              ...advisors.map((a: any) => ({
                value: a.uid?.toString() || "",
                label: `${a.name} ${a.surname}`,
              })),
            ]}
            icon={User}
          />

          <SimpleInput
            label="Sözleşme No"
            value={fourthStep.contract_no}
            onChange={onContractNoChange}
            placeholder="Sözleşme numarası"
            icon={FileText}
          />

          <div className="grid grid-cols-2 gap-4">
            <SimpleInput
              label="Sözleşme Tarihi"
              value={fourthStep.contract_date}
              onChange={onContractDateChange}
              type="date"
              icon={Calendar}
            />
            <SimpleSelect
              label="Sözleşme Süresi"
              value={fourthStep.contract_time.value}
              onChange={onContractTimeChange}
              options={contractTimes}
              icon={Clock}
            />
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-900">
              E-İlan Doğrulama Sistemi (EIDS)
            </label>
            <SimpleSelect
              value={fourthStep.eids.value}
              onChange={onEidsValueChange}
              options={yesNoOptions}
            />
          </div>

          {fourthStep.eids.value === "Evet" && (
            <div className="grid grid-cols-2 gap-4">
              <SimpleInput
                label="EIDS Numarası"
                value={fourthStep.eids.no}
                onChange={onEidsNoChange}
                placeholder="EIDS numarası"
                icon={Hash}
              />
              <SimpleInput
                label="EIDS Tarihi"
                value={fourthStep.eids.date}
                onChange={onEidsDateChange}
                type="date"
                icon={Calendar}
              />
            </div>
          )}
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Diğer Bilgiler
          </h3>

          <SimpleSelect
            label="Anahtar Kimde"
            value={fourthStep.key.value}
            onChange={onKeyChange}
            options={keyOptions}
            icon={Key}
          />

          <div className="flex items-center justify-between p-4 border border-gray-300 rounded-lg">
            <span className="font-medium text-gray-900">İlan Aktif</span>
            <button
              type="button"
              onClick={() => setIsActiveAd(!isActiveAd)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                isActiveAd ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                  isActiveAd ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Soru & Ayarlar
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <QuestionToggle
                label="Danışman Profili Görünsün"
                value={fourthStep.advisor_profile.value}
                onChange={onAdvisorProfileToggle}
              />
              <QuestionToggle
                label="Ajanda Emlak"
                value={fourthStep.agenda_emlak.value}
                onChange={onAgendaEmlakToggle}
              />
              <QuestionToggle
                label="Anasayfa Emlak"
                value={fourthStep.homepage_emlak.value}
                onChange={onHomepageEmlakToggle}
              />
              <QuestionToggle
                label="Yeni Emlak"
                value={fourthStep.new_emlak.value}
                onChange={onNewEmlakToggle}
              />
              <QuestionToggle
                label="Şanslı Emlak"
                value={fourthStep.chance_emlak.value}
                onChange={onChanceEmlakToggle}
              />
              <QuestionToggle
                label="Özel Emlak"
                value={fourthStep.special_emlak.value}
                onChange={onSpecialEmlakToggle}
              />
              <QuestionToggle
                label="Web'de Yayınla"
                value={fourthStep.onweb_emlak.value}
                onChange={onOnwebEmlakToggle}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
