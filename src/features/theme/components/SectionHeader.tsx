// src/features/theme/components/SectionHeader.tsx
import React from "react";
import { cn } from "../utils/cn";

type Props = {
  kicker?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
};

export function SectionHeader({ kicker, title, description, className }: Props) {
  return (
    <div className={cn("text-center mb-16", className)}>
      {kicker ? (
        <div className="inline-flex items-center gap-3 mb-6">
          <div className="w-12 h-1 bg-gradient-to-r from-brand-blue to-brand-blue2 rounded-full" />
          <span className="text-muted-foreground font-semibold tracking-widest text-sm uppercase">
            {kicker}
          </span>
          <div className="w-12 h-1 bg-gradient-to-l from-brand-blue to-brand-blue2 rounded-full" />
        </div>
      ) : null}

      <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
        {title}
      </h2>

      {description ? (
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          {description}
        </p>
      ) : null}
    </div>
  );
}
