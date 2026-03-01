// src/features/admin/listing-create/ui/components/styles.ts

export const inputCls = "w-full border border-gray-300 rounded px-3 py-2 text-[13px] text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white";

export const selectCls = "w-full border border-gray-300 rounded px-3 py-2 text-[13px] text-gray-800 bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer";

export const selectStyles = {
  control: (base: Record<string, unknown>) => ({ ...base, border: "1px solid #D1D5DB", borderRadius: "0.375rem", padding: "1px", fontSize: "13px", minHeight: "38px" }),
  menu: (base: Record<string, unknown>) => ({ ...base, zIndex: 50, fontSize: "13px" }),
  menuPortal: (base: Record<string, unknown>) => ({ ...base, zIndex: 9999 }),
};
