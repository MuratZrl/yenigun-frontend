// Spec row group component with optional header
import React from "react";
import DesktopSpecRow from "./DesktopSpecRow";
import type { Row } from "../../types";

type Props = {
  title?: string;
  rows: Row[];
  showDivider?: boolean;
};

export default function SpecRowGroup({ title, rows, showDivider = true }: Props) {
  if (rows.length === 0) return null;

  return (
    <>
      {showDivider && <div className="mt-4 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />}

      {title && (
        <div className="mt-3 text-sm font-semibold text-gray-700">
          {title}
        </div>
      )}

      <div className="mt-2">
        {rows.map((r) => (
          <DesktopSpecRow
            key={r.label}
            label={r.label}
            value={r.value}
            important={r.important}
            valueClassName={r.valueClassName}
          />
        ))}
      </div>
    </>
  );
}
