// src/features/ads/ui/components/filter/FilterActions.client.tsx
"use client";

import React from "react";

type Props = {
  totalItems: number;
  onFilter: () => Promise<void>;
  setCurrentPage?: React.Dispatch<React.SetStateAction<number>>;
  className?: string;
  label?: string; // default: "Ara"

  // ✅ otomatik filtreleme modu (controller yönetiyor)
  autoApply: boolean;
  setAutoApply: React.Dispatch<React.SetStateAction<boolean>>;

  autoApplyLabel?: string; // default: "Seçtikçe sonuç getir"
};

function cls(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export default function FilterActions({
  onFilter,
  setCurrentPage,
  className,
  label = "Ara",
  autoApply,
  setAutoApply,
  autoApplyLabel = "Seçtikçe sonuç getir",
}: Props) {
  const [pending, setPending] = React.useState(false);
  const [isStuck, setIsStuck] = React.useState(false);
  const sentinelRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // When sentinel is NOT visible, the sticky bar is floating
        setIsStuck(!entry.isIntersecting);
      },
      { threshold: 0 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  const runFilter = async () => {
    if (pending) return;
    setPending(true);
    try {
      if (setCurrentPage) setCurrentPage(1);
      await onFilter();
    } finally {
      setPending(false);
    }
  };

  const onToggleAuto = (next: boolean) => {
    // ✅ artık burada runFilter yok; controller auto-apply'i zaten debounced uygular
    setAutoApply(next);
  };

  return (
    <>
      <div
        className={cls(
          "sticky bottom-4 z-10 bg-white pt-3 pb-3 flex flex-col items-center transition-shadow duration-200",
          isStuck && "shadow-[0_-8px_24px_rgba(0,0,0,0.18)]",
          className,
        )}
      >
        <div className="w-4/5 flex items-center justify-between mb-2">
          <label className="flex items-center gap-2 text-[13px] text-gray-800 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={autoApply}
              onChange={(e) => onToggleAuto(e.target.checked)}
              className="h-4 w-4 accent-orange-500"
            />
            <span>{autoApplyLabel}</span>
          </label>

          <button
            type="button"
            title="Seçtikçe sonuç getir: filtre değiştikçe otomatik arama yapılır."
            className="h-5 w-5 rounded-full border border-gray-300 text-[12px] leading-[18px] text-gray-600 flex items-center justify-center hover:bg-gray-50"
          >
            ?
          </button>
        </div>

        {!autoApply && (
          <button
            type="button"
            onClick={runFilter}
            disabled={pending}
            className={cls(
              "w-4/5 bg-linear-to-b from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white py-2.5 font-semibold text-sm transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98]",
              pending && "opacity-70 cursor-not-allowed",
            )}
          >
            {label}
          </button>
        )}
      </div>
      {/* Sentinel: when this is visible, the bar is at its natural position */}
      <div ref={sentinelRef} className="h-px w-full" />
    </>
  );
}
