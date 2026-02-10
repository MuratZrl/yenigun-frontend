// src/context/BreadcrumbContext.tsx
"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export type RightLink = {
  label: string;
  href: string;
};

type BreadcrumbState = {
  ownerPathname: string; // breadcrumb'ı hangi route set etti
  items: BreadcrumbItem[];
  rightLinks?: RightLink[];
} | null;

type BreadcrumbContextType = {
  state: BreadcrumbState;
  setState: (next: BreadcrumbState) => void;

  // Hepsini zorla siler (genelde gereksiz)
  clearAll: () => void;

  // Sadece "owner" olan route temizleyebilir
  clearIfOwner: (ownerPathname: string) => void;
};

const BreadcrumbContext = createContext<BreadcrumbContextType | null>(null);

export function BreadcrumbProvider({ children }: { children: ReactNode }) {
  const [state, setStateInternal] = useState<BreadcrumbState>(null);

  const setState = useCallback((next: BreadcrumbState) => {
    setStateInternal(next);
  }, []);

  const clearAll = useCallback(() => {
    setStateInternal(null);
  }, []);

  const clearIfOwner = useCallback((ownerPathname: string) => {
    setStateInternal((prev) => {
      if (!prev) return prev;
      return prev.ownerPathname === ownerPathname ? null : prev;
    });
  }, []);

  const value = useMemo<BreadcrumbContextType>(
    () => ({ state, setState, clearAll, clearIfOwner }),
    [state, setState, clearAll, clearIfOwner]
  );

  return (
    <BreadcrumbContext.Provider value={value}>
      {children}
    </BreadcrumbContext.Provider>
  );
}

export function useBreadcrumbContext() {
  const ctx = useContext(BreadcrumbContext);
  if (!ctx) {
    throw new Error("useBreadcrumbContext must be used within a BreadcrumbProvider");
  }
  return ctx;
}

/**
 * Sayfa bazlı breadcrumb set etmek için hook.
 * Kritik: clearBreadcrumb artık "sadece owner ise" temizler.
 */
export function useBreadcrumb() {
  const pathname = usePathname() || "/";
  const { state, setState, clearIfOwner } = useBreadcrumbContext();

  const setBreadcrumb = useCallback(
    (items: BreadcrumbItem[], rightLinks?: RightLink[]) => {
      setState({
        ownerPathname: pathname,
        items: Array.isArray(items) ? items : [],
        rightLinks,
      });
    },
    [pathname, setState]
  );

  const clearBreadcrumb = useCallback(() => {
    clearIfOwner(pathname);
  }, [clearIfOwner, pathname]);

  return { pathname, state, setBreadcrumb, clearBreadcrumb };
}
