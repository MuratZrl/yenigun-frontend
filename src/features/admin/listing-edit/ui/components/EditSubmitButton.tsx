// src/features/admin/listing-edit/ui/components/EditSubmitButton.tsx
"use client";

import React from "react";
import { CheckCircle } from "lucide-react";

interface EditSubmitButtonProps {
  onSubmit: () => void;
  isSubmitting: boolean;
}

export default function EditSubmitButton({ onSubmit, isSubmitting }: EditSubmitButtonProps) {
  return (
    <div className="flex justify-end pt-6">
      <button
        type="button"
        onClick={onSubmit}
        disabled={isSubmitting}
        className="px-8 py-2.5 bg-green-600 text-white text-[14px] font-semibold rounded hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center gap-2"
      >
        {isSubmitting ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Güncelleniyor...
          </>
        ) : (
          <>
            <CheckCircle size={16} />
            İlanı Güncelle
          </>
        )}
      </button>
    </div>
  );
}
