// src/features/ilanlar/ui/components/filter/CategoryOptionBox.client.tsx
"use client";

import React, { useMemo, useState, useCallback, useEffect, useRef } from "react";
import type { Category, Subcategory, Feature, FilterState } from "@/types/advert";
import api from "@/lib/api";

/* ── Types ── */

type Props = {
  filters: FilterState;

  categories: Category[];
  selectedCategory: Category | null;

  selectedSubcategory: Subcategory | null;
  selectedSubSubcategory: Subcategory | null;
  onSubcategorySelect: (s: Subcategory | null) => void;
  onSubSubcategorySelect?: (s: Subcategory | null) => void;

  onCategorySelect: (c: Category | null) => void;

  title?: string;
  className?: string;
  withBorder?: boolean;
};

interface NavigateChild {
  uid: number;
  name: string;
  advertCount: number;
}

interface NavigateResponse {
  success: boolean;
  data: {
    path: { uid: number; name: string }[];
    children: NavigateChild[];
    totalAdverts: number;
  };
}

/** A loose shape that covers both Category & Subcategory (and nested variants). */
type RawCategoryNode = {
  uid?: string | number;
  _id?: string;
  id?: string;
  name?: string;
  title?: string;
  parentUid?: string;
  parentId?: string;
  subcategories?: RawCategoryNode[];
  subCategories?: RawCategoryNode[];
  children?: RawCategoryNode[];
  features?: Feature[];
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
};

/* ── Helpers ── */

function toStr(v: string | number | undefined | null): string {
  return String(v ?? "").trim();
}

function nodeUid(n: RawCategoryNode | null | undefined): string {
  return toStr(n?.uid) || toStr(n?._id) || toStr(n?.id) || "";
}

function nodeName(n: RawCategoryNode | null | undefined): string {
  return toStr(n?.name) || toStr(n?.title) || "";
}

/* ── Tree builder (for category prop) ── */

type TreeNode = {
  uid: string;
  name: string;
  children: TreeNode[];
  raw: RawCategoryNode;
};

function buildTree(flatList: RawCategoryNode[]): TreeNode[] {
  if (!Array.isArray(flatList) || !flatList.length) return [];

  const hasNested = flatList.some(
    (x) =>
      (Array.isArray(x?.subcategories) && x.subcategories.length > 0) ||
      (Array.isArray(x?.children) && x.children.length > 0),
  );

  if (hasNested) return flatList.map(convertNestedNode);

  const byId = new Map<string, TreeNode>();
  const roots: TreeNode[] = [];

  for (const raw of flatList) {
    const uid = nodeUid(raw);
    if (!uid) continue;
    if (!byId.has(uid)) {
      byId.set(uid, { uid, name: nodeName(raw), children: [], raw });
    } else {
      const existing = byId.get(uid)!;
      existing.name = nodeName(raw) || existing.name;
      existing.raw = { ...existing.raw, ...raw };
    }
  }

  for (const raw of flatList) {
    const uid = nodeUid(raw);
    if (!uid) continue;
    const node = byId.get(uid)!;
    const parentUid = toStr(raw?.parentUid) || toStr(raw?.parentId) || "";
    if (parentUid && byId.has(parentUid)) {
      byId.get(parentUid)!.children.push(node);
    } else if (!parentUid || parentUid === "null") {
      roots.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}

function convertNestedNode(n: RawCategoryNode): TreeNode {
  const kids = n?.subcategories || n?.children || n?.subCategories || [];
  return {
    uid: nodeUid(n),
    name: nodeName(n),
    children: Array.isArray(kids) ? kids.map(convertNestedNode) : [],
    raw: n,
  };
}

/* ── Navigate hook — single request per visible level ── */

function useNavigateCounts(nodes: TreeNode[]): Map<string, number | null> {
  const [counts, setCounts] = useState<Map<string, number | null>>(new Map());
  const abortRef = useRef<AbortController | null>(null);

  const uidsKey = nodes.map((n) => n.uid).join(",");

  useEffect(() => {
    if (!nodes.length) {
      setCounts(new Map());
      return;
    }

    if (abortRef.current) abortRef.current.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    // Init as loading
    setCounts(new Map(nodes.map((n) => [n.uid, null])));

    const fetchCounts = async () => {
      try {
        // Find common parent: if all nodes share the same parent uid, use it
        // Otherwise fetch individually
        const parentUid = nodes[0]?.raw?.parentUid || nodes[0]?.raw?.parentId;
        const allSameParent =
          parentUid && nodes.every((n) => (n.raw?.parentUid || n.raw?.parentId) === parentUid);

        if (allSameParent && parentUid) {
          // Single request for the parent — gets all children with counts
          const res = await api.get<NavigateResponse>(
            `/categories/navigate?uid=${parentUid}`,
            { signal: ctrl.signal },
          );
          const data = res?.data?.data ?? res?.data;
          const apiChildren: NavigateChild[] = Array.isArray(data?.children) ? data.children : [];

          const next = new Map<string, number | null>();
          for (const node of nodes) {
            const match = apiChildren.find(
              (c) => String(c.uid) === node.uid || c.name.toLowerCase() === node.name.toLowerCase(),
            );
            next.set(node.uid, match?.advertCount ?? 0);
          }
          if (!ctrl.signal.aborted) setCounts(next);
        } else {
          // Top-level nodes — fetch without uid (root level)
          const res = await api.get<NavigateResponse>("/categories/navigate", {
            signal: ctrl.signal,
          });
          const data = res?.data?.data ?? res?.data;
          const apiChildren: NavigateChild[] = Array.isArray(data?.children) ? data.children : [];

          const next = new Map<string, number | null>();
          for (const node of nodes) {
            const match = apiChildren.find(
              (c) => String(c.uid) === node.uid || c.name.toLowerCase() === node.name.toLowerCase(),
            );
            next.set(node.uid, match?.advertCount ?? 0);
          }
          if (!ctrl.signal.aborted) setCounts(next);
        }
      } catch {
        if (!ctrl.signal.aborted) {
          setCounts(new Map(nodes.map((n) => [n.uid, 0])));
        }
      }
    };

    fetchCounts();

    return () => ctrl.abort();
  }, [uidsKey]); // eslint-disable-line react-hooks/exhaustive-deps

  return counts;
}

/* ── Styles ── */

const linkBase = "text-[#003399] hover:underline cursor-pointer";
const countStyle = "text-[#999] ml-1 text-[12px]";
const labelStyle = "text-[#003399] font-semibold hover:underline cursor-pointer";

function CountBadge({ count }: { count: number | null }) {
  if (count === null) {
    return <span className={countStyle}>(...)</span>;
  }
  return <span className={countStyle}>({count.toLocaleString("tr-TR")})</span>;
}

/* ── Component ── */

export default function CategoryOptionsBox({
  filters,
  categories,
  onCategorySelect,
  title = "Emlak",
  className,
  withBorder = false,
}: Props) {
  const tree = useMemo(() => buildTree(categories), [categories]);

  const { topLevel } = useMemo(() => {
    const titleNorm = title.trim().toLocaleLowerCase("tr-TR");
    const root = tree.find((n) => n.name.trim().toLocaleLowerCase("tr-TR") === titleNorm);
    if (root) return { topLevel: root.children };
    return { topLevel: tree };
  }, [tree, title]);

  const activePathParts = useMemo(() => {
    const t = filters.type;
    if (!t || t === "Hepsi") return [] as string[];
    return t.split(" > ").map((p) => p.trim()).filter(Boolean);
  }, [filters]);

  const { selectedL0, selectedL1 } = useMemo<{
    selectedL0: TreeNode | null;
    selectedL1: TreeNode | null;
  }>(() => {
    if (activePathParts.length === 0) return { selectedL0: null, selectedL1: null };

    const l0Match = topLevel.find((n) => activePathParts.includes(n.name)) ?? null;
    if (!l0Match) return { selectedL0: null, selectedL1: null };

    const l1Match = l0Match.children.find((n) => activePathParts.includes(n.name)) ?? null;
    return { selectedL0: l0Match, selectedL1: l1Match };
  }, [activePathParts, topLevel]);

  const visibleNodes = useMemo(() => {
    if (!selectedL0) return topLevel;
    if (!selectedL1) return selectedL0.children;
    return selectedL1.children;
  }, [selectedL0, selectedL1, topLevel]);

  // Single /categories/navigate request per visible level
  const counts = useNavigateCounts(visibleNodes);

  const handleRootClick = useCallback(() => {
    onCategorySelect(null);
  }, [onCategorySelect]);

  const handleNodeClick = useCallback(
    (node: TreeNode) => {
      onCategorySelect(node.raw as unknown as Category);
    },
    [onCategorySelect],
  );

  return (
    <div
      className={[
        "w-full min-w-0 bg-white",
        withBorder ? "border border-gray-200" : "",
        className || "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Root: "Emlak" — no count */}
      <button
        type="button"
        onClick={handleRootClick}
        className="w-full text-left px-3 py-0.5 text-[13px] focus:outline-none cursor-pointer"
      >
        <span className={`${linkBase} ${!selectedL0 ? "font-bold" : "font-semibold"}`}>
          {title}
        </span>
      </button>

      <div className="overflow-y-auto max-h-[400px]">
        {/* ── No selection → show all L0 items with counts ── */}
        {!selectedL0 &&
          topLevel.map((l0) => (
            <button
              key={l0.uid}
              type="button"
              onClick={() => handleNodeClick(l0)}
              className="w-full text-left px-3 py-[1px] text-[13px] leading-[20px] focus:outline-none cursor-pointer"
              style={{ paddingLeft: 20 }}
            >
              <span className={linkBase}>{l0.name}</span>
              <CountBadge count={counts.get(l0.uid) ?? null} />
            </button>
          ))}

        {/* ── L0 selected, no L1 → L0 label + its children with counts ── */}
        {selectedL0 && !selectedL1 && (
          <>
            <div
              className="px-3 py-[1px] text-[13px] leading-[20px]"
              style={{ paddingLeft: 20 }}
            >
              <span className={labelStyle} onClick={() => handleNodeClick(selectedL0)} role="button" tabIndex={0}>
                {selectedL0.name}
              </span>
            </div>

            {selectedL0.children.map((l1) => (
              <button
                key={l1.uid}
                type="button"
                onClick={() => handleNodeClick(l1)}
                className="w-full text-left px-3 py-[1px] text-[13px] leading-[20px] focus:outline-none cursor-pointer"
                style={{ paddingLeft: 36 }}
              >
                <span className={linkBase}>{l1.name}</span>
                <CountBadge count={counts.get(l1.uid) ?? null} />
              </button>
            ))}
          </>
        )}

        {/* ── L0 + L1 selected → clickable labels + L1's children with counts ── */}
        {selectedL0 && selectedL1 && (
          <>
            <button
              type="button"
              onClick={() => handleNodeClick(selectedL0)}
              className="w-full text-left px-3 py-[1px] text-[13px] leading-[20px] focus:outline-none cursor-pointer"
              style={{ paddingLeft: 20 }}
            >
              <span className={labelStyle}>{selectedL0.name}</span>
            </button>

            <button
              type="button"
              onClick={() => handleNodeClick(selectedL1)}
              className="w-full text-left px-3 py-[1px] text-[13px] leading-[20px] focus:outline-none cursor-pointer"
              style={{ paddingLeft: 36 }}
            >
              <span className={labelStyle}>{selectedL1.name}</span>
            </button>

            {selectedL1.children.map((l2) => (
              <button
                key={l2.uid}
                type="button"
                onClick={() => handleNodeClick(l2)}
                className="w-full text-left px-3 py-[1px] text-[13px] leading-[20px] focus:outline-none cursor-pointer"
                style={{ paddingLeft: 52 }}
              >
                <span className={`${linkBase} ${activePathParts.includes(l2.name) ? "font-semibold" : ""}`}>
                  {l2.name}
                </span>
                <CountBadge count={counts.get(l2.uid) ?? null} />
              </button>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
