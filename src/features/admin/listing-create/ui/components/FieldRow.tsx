// src/features/admin/listing-create/ui/components/FieldRow.tsx
import React from "react";

export default function FieldRow({ label, required, children, fieldKey, onHide }: { label: string; required?: boolean; children: React.ReactNode; fieldKey?: string; onHide?: (key: string) => void }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-2 md:gap-4 py-3 border-b border-gray-100 last:border-b-0 items-start">
      <label className="text-[13px] font-semibold text-gray-800 pt-2 flex items-center gap-1.5">
        {fieldKey && onHide && (
          <button
            type="button"
            onClick={() => onHide(fieldKey)}
            title="Bu alanı gizle"
            className="text-gray-300 hover:text-red-500 transition-colors shrink-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        )}
        <span>{label}{required && <span className="text-red-500 ml-0.5">*</span>}</span>
      </label>
      <div>{children}</div>
    </div>
  );
}
