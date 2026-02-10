// src/features/theme/components/BrandButton.tsx
import React from "react";
import Link from "next/link";
import { cn } from "../utils/cn";

type Variant = "primary" | "secondary" | "accent" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

type Props = {
  href?: string;
  target?: string;
  rel?: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const base =
  "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:pointer-events-none";

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5 text-sm md:text-base",
  lg: "h-12 px-6 text-base",
};

const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-primary-foreground shadow-lg hover:shadow-xl hover:brightness-[1.03]",
  secondary:
    "bg-secondary text-secondary-foreground hover:brightness-[1.02]",
  accent:
    "bg-accent text-accent-foreground shadow-lg hover:shadow-xl hover:brightness-[1.03]",
  outline:
    "border border-border bg-background text-foreground hover:bg-secondary",
  ghost: "bg-transparent text-foreground hover:bg-secondary",
};

export function BrandButton({
  href,
  target,
  rel,
  variant = "primary",
  size = "md",
  className,
  children,
  ...buttonProps
}: Props) {
  const cls = cn(base, sizes[size], variants[variant], className);

  if (href) {
    const isExternal = /^https?:\/\//i.test(href) || href.startsWith("tel:") || href.startsWith("mailto:");
    if (isExternal) {
      return (
        <a href={href} target={target ?? "_blank"} rel={rel ?? "noreferrer"} className={cls}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }

  return (
    <button className={cls} {...buttonProps}>
      {children}
    </button>
  );
}
