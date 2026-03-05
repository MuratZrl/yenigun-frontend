import type { ContractPartKey } from "./types";

interface ContractFieldProps {
  label: string;
  name: string;
  part: ContractPartKey;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, part: ContractPartKey) => void;
  type?: string;
  colSpan?: string;
  required?: boolean;
}

export function ContractField({
  label,
  name,
  part,
  value,
  onChange,
  type = "text",
  colSpan = "col-span-2",
  required = true,
}: ContractFieldProps) {
  return (
    <div className={`flex flex-col ${colSpan} gap-2`}>
      <label className="text-sm">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        className="border border-gray-500 bg-transparent p-2 rounded"
        value={value}
        onChange={(e) => onChange(e, part)}
      />
    </div>
  );
}
