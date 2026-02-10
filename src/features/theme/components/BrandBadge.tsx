// src/features/theme/components/BrandBadge.tsx
import React from "react";
import { cn } from "../utils/cn";

type Variant = "primary" | "accent" | "secondary";

export function BrandBadge({
  variant = "secondary",
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: Variant }) {
  const map: Record<Variant, string> = {
    primary: "bg-primary text-primary-foreground",
    accent: "bg-accent text-accent-foreground",
    secondary: "bg-secondary text-secondary-foreground",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        map[variant],
        className
      )}
      {...props}
    />
  );
}
