// src/features/ads/ui/components/filter/CategoryOptionBox.client.tsx
"use client";

import React, { useMemo } from "react";
import type { Category, Subcategory, FilterState } from "@/types/advert";

type Props = {
  filters: FilterState;

  categories: Category[];
  selectedCategory: Category | null;

  // çağıran yerleri kırmamak için dursun (kullanılmayacak)
  selectedSubcategory: Subcategory | null;
  selectedSubSubcategory: Subcategory | null;
  onSubcategorySelect: (s: Subcategory | null) => void;
  onSubSubcategorySelect?: (s: Subcategory | null) => void;

  onCategorySelect: (c: Category | null) => void;

  title?: string; // default: "Emlak"
  className?: string;

  withBorder?: boolean;
  maxListHeightClassName?: string; // default: "max-h-[260px]"

  // hiyerarşi indent
  childIndentPx?: number; // default: 10

  // "Emlak seçili" sayılacak filters.type değeri
  rootTypeValue?: string; // default: "Hepsi"

  // opsiyonel: root item (Emlak) listede de görünsün mü?
  showRootItemInList?: boolean; // default: false
};

function cls(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function pickCount(node: any): number | null {
  const v =
    node?.count ??
    node?.totalCount ??
    node?.listingCount ??
    node?.advertCount ??
    node?.total ??
    null;
  return typeof v === "number" ? v : null;
}

function toStr(v: any): string {
  return String(v ?? "").trim();
}

function getNodeId(node: any): string {
  return (
    toStr(node?._id) ||
    toStr(node?.id) ||
    toStr(node?.uid) ||
    toStr(node?.slug) ||
    toStr(node?.name) ||
    "unknown"
  );
}

function getNodeName(node: any): string {
  return toStr(node?.name) || toStr(node?.title) || getNodeId(node);
}

function getChildren(node: any): any[] {
  const a = node?.children;
  if (Array.isArray(a)) return a;
  const b = node?.subcategories;
  if (Array.isArray(b)) return b;
  const c = node?.subCategories;
  if (Array.isArray(c)) return c;
  return [];
}

function looksLikeFlatCategoryList(list: any[]): boolean {
  return list.some((x) => x && (x.parentUid !== undefined || x.parentId !== undefined) && (x.uid !== undefined || x._id !== undefined));
}

type DisplayItem = {
  key: string;
  depth: number;
  node: any;
  id: string;
  name: string;
  count: number | null;
};

function buildTreeFromFlat(rawList: any[]) {
  const byId = new Map<string, any>();
  const roots: any[] = [];

  for (const raw of rawList) {
    const id = toStr(raw?.uid) || toStr(raw?._id) || toStr(raw?.id);
    if (!id) continue;
    if (!byId.has(id)) {
      byId.set(id, { ...raw, __id: id, children: [] as any[] });
    } else {
      const prev = byId.get(id);
      byId.set(id, { ...prev, ...raw, __id: id, children: Array.isArray(prev.children) ? prev.children : [] });
    }
  }

  for (const node of byId.values()) {
    const parentId = toStr(node?.parentUid) || toStr(node?.parentId) || "";
    if (parentId && byId.has(parentId)) {
      byId.get(parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  }

  return { roots };
}

function flattenTree(nodes: any[], depth = 0, out: DisplayItem[] = []) {
  for (const n of nodes) {
    const id = getNodeId(n);
    const name = getNodeName(n);
    const count = pickCount(n);
    out.push({
      key: `${id}:${depth}`,
      depth,
      node: n,
      id,
      name,
      count,
    });
    const kids = getChildren(n);
    if (kids.length) flattenTree(kids, depth + 1, out);
  }
  return out;
}

export default function CategoryOptionsBox(props: Props) {
  const {
    filters,
    categories,
    selectedCategory,
    onCategorySelect,
    title = "Emlak",
    className,
    withBorder = false,
    maxListHeightClassName = "max-h-[260px]",
    childIndentPx = 10,
    rootTypeValue = "Hepsi",
    showRootItemInList = false,
  } = props;

  // Extract all parts of the active type path for highlighting
  const activePathParts = useMemo(() => {
    const t = (filters as any)?.type;
    if (!t || t === rootTypeValue) return [] as string[];
    return String(t)
      .split(" > ")
      .map((p: string) => p.trim())
      .filter(Boolean);
  }, [filters, rootTypeValue]);

  const isRootSelected = useMemo(() => {
    const t = (filters as any)?.type;
    return !t || t === rootTypeValue || activePathParts.length === 0;
  }, [filters, rootTypeValue, activePathParts]);

  const rootBtn = "w-full text-left px-3 py-1 text-[13px] focus:outline-none cursor-pointer";
  const itemBtn = "w-full text-left px-3 py-[2px] text-[13px] leading-[18px] focus:outline-none cursor-pointer";
  const linkTextBase = "text-[#003399] hover:underline";
  const countText = "text-[#999]";

  const { items, rootCount } = useMemo(() => {
    const list = Array.isArray(categories) ? categories : [];
    if (!list.length) return { items: [] as DisplayItem[], rootCount: null as number | null };

    let roots: any[] = list;

    const hasNested = list.some((x) => getChildren(x).length > 0);
    if (!hasNested && looksLikeFlatCategoryList(list as any[])) {
      roots = buildTreeFromFlat(list as any[]).roots;
    }

    const flat = flattenTree(roots);

    const titleNorm = title.trim().toLocaleLowerCase("tr-TR");
    const rootNode = flat.find((x) => x.depth === 0 && x.name.trim().toLocaleLowerCase("tr-TR") === titleNorm) ?? null;

    let filtered = flat;

    if (!showRootItemInList) {
      filtered = filtered.filter((x) => x.name.trim().toLocaleLowerCase("tr-TR") !== titleNorm);
    }

    return {
      items: filtered,
      rootCount: rootNode ? rootNode.count : null,
    };
  }, [categories, title, showRootItemInList]);

  return (
    <div className={cls("w-full min-w-0 bg-white", withBorder && "border border-gray-200", className)}>
      <button type="button" onClick={() => onCategorySelect(null)} className={rootBtn} title={`${title} (tümü)`}>
        <span className={cls(linkTextBase, isRootSelected && "font-semibold")}>
          {title}
        </span>
        {typeof rootCount === "number" && (
          <span className={countText}>{" "}({rootCount.toLocaleString("tr-TR")})</span>
        )}
      </button>

      <div className={cls("overflow-y-auto", maxListHeightClassName)}>
        {items.map((it) => {
          const active = activePathParts.includes(it.name);
          const left = 12 + childIndentPx + it.depth * childIndentPx;

          return (
            <button
              key={it.key}
              type="button"
              onClick={() => onCategorySelect(it.node as Category)}
              className={itemBtn}
              style={{ paddingLeft: left }}
              title={it.name}
            >
              <span className={cls(linkTextBase, active && "font-semibold")}>{it.name}</span>
              {typeof it.count === "number" && <span className={countText}>{" "}({it.count.toLocaleString("tr-TR")})</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}