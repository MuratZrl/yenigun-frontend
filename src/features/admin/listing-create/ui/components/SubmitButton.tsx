// src/features/admin/listing-create/ui/components/SubmitButton.tsx
"use client";

import React from "react";
import { CheckCircle } from "lucide-react";

interface SubmitButtonProps {
  onSubmit: (e?: React.SyntheticEvent) => void;
  isSubmitting: boolean;
}

export default function SubmitButton({ onSubmit, isSubmitting }: SubmitButtonProps) {
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
            Yayınlanıyor...
          </>
        ) : (
          <>
            <CheckCircle size={16} />
            İlanı Yayınla
          </>
        )}
      </button>
    </div>
  );
}
