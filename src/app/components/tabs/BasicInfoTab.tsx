"use client";
import React from "react";
import { motion } from "framer-motion";
import { FileText, DollarSign } from "lucide-react";
import { FormData } from "@/app/types/property";
import Editor from "@/app/components/CkEditor";
import SimpleInput from "@/app/components/ui/SimpleInput";
import SimpleSelect from "@/app/components/ui/SimpleSelect";
import SimpleTextarea from "@/app/components/ui/SimpleTextarea";

interface BasicInfoTabProps {
  fourthStep: FormData;
  content: string;
  setContent: (content: string) => void;
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPriceValueChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPriceTypeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onAdminNoteChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  currencyOptions: any[];
}

export default function BasicInfoTab({
  fourthStep,
  content,
  setContent,
  onTitleChange,
  onPriceValueChange,
  onPriceTypeChange,
  onAdminNoteChange,
  currencyOptions,
}: BasicInfoTabProps) {
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
            İlan Bilgileri
          </h3>
          <SimpleInput
            label="İlan Başlığı"
            value={fourthStep.title}
            onChange={onTitleChange}
            placeholder="Örn: Deniz Manzaralı Modern Daire"
            icon={FileText}
          />

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Açıklama
            </label>
            <Editor content={content} setContent={setContent} />
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Fiyat Bilgileri
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <SimpleInput
              label="Fiyat"
              value={fourthStep.price.value}
              onChange={onPriceValueChange}
              placeholder="0"
              icon={DollarSign}
            />

            <SimpleSelect
              label="Para Birimi"
              value={fourthStep.price.type}
              onChange={onPriceTypeChange}
              options={currencyOptions}
              icon={DollarSign}
            />
          </div>

          <SimpleTextarea
            label="Admin Notu"
            value={fourthStep.adminNote}
            onChange={onAdminNoteChange}
            placeholder="Admin notu yazın..."
            rows={4}
          />
        </div>
      </div>
    </motion.div>
  );
}
