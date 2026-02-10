// src/features/theme/components/BrandCard.tsx
import React from "react";
import { cn } from "../utils/cn";

type Props = React.HTMLAttributes<HTMLDivElement>;

export function BrandCard({ className, ...props }: Props) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card text-card-foreground shadow-lg",
        className
      )}
      {...props}
    />
  );
}
