import type { LucideIcon } from "lucide-react";

interface FormSectionProps {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
  gridCols?: string;
}

export function FormSection({ icon: Icon, title, children, gridCols = "grid-cols-6" }: FormSectionProps) {
  return (
    <div className="flex flex-col gap-3 my-5 relative border border-custom-orange rounded-md p-7 bg-white">
      <div className="absolute -top-4 left-5 flex flex-row gap-1 items-center bg-gray-300 border text-sm border-custom-orange px-3 py-1 rounded-sm">
        <Icon size={16} />
        {title}
      </div>
      <div className={`grid ${gridCols} gap-5`}>
        {children}
      </div>
    </div>
  );
}
