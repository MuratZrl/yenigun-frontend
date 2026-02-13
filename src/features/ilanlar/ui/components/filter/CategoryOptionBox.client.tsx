// src/features/ilanlar/ui/components/filter/CategoryOptionBox.client.tsx
"use client";

import React, { useMemo, useState, useCallback, useEffect, useRef } from "react";
import type { Category, Subcategory, FilterState } from "@/types/advert";
import api from "@/lib/api";

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

/* ── Helpers ── */

function toStr(v: any): string {
  return String(v ?? "").trim();
}

function nodeUid(n: any): string {
  return toStr(n?.uid) || toStr(n?._id) || toStr(n?.id) || "";
}

function nodeName(n: any): string {
  return toStr(n?.name) || toStr(n?.title) || "";
}

/* ── Tree builder ── */

type TreeNode = {
  uid: string;
  name: string;
  children: TreeNode[];
  raw: any;
};

function buildTree(flatList: any[]): TreeNode[] {
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

function convertNestedNode(n: any): TreeNode {
  const kids = n?.subcategories || n?.children || n?.subCategories || [];
  return {
    uid: nodeUid(n),
    name: nodeName(n),
    children: Array.isArray(kids) ? kids.map(convertNestedNode) : [],
    raw: n,
  };
}

/* ── Count fetcher ── */

const ACTION_KEYWORDS = new Set([
  "Satılık", "Kiralık", "Günlük Kiralık", "Devren Satılık",
  "Devren Kiralık", "Kat Karşılığı Satılık", "Turistik Günlük Kiralık",
]);

const GROUPING_NODES = new Set([
  "Konut", "İş Yeri", "İşyeri", "Arazi", "Emlak",
]);

function buildCountParams(pathNames: string[]): Record<string, string> {
  const params: Record<string, string> = {
    page: "1",
    limit: "1",
    sortBy: "date",
    sortOrder: "desc",
  };

  let action: string | null = null;
  let subType: string | null = null;
  let groupNode: string | null = null;

  for (const part of pathNames) {
    if (GROUPING_NODES.has(part)) {
      groupNode = part;
      continue;
    }
    if (ACTION_KEYWORDS.has(part)) {
      action = part;
    } else if (!subType) {
      subType = part;
    }
  }

  if (subType) {
    params.category = subType;
  } else if (groupNode) {
    params.category = groupNode;
  }

  if (action) {
    params.type = action;
  }

  return params;
}

function getPathForNode(node: TreeNode, parents: TreeNode[]): string[] {
  return [...parents.map((p) => p.name), node.name];
}

async function fetchCountForParams(params: Record<string, string>): Promise<number> {
  try {
    const qs = new URLSearchParams(params).toString();
    const res = await api.get(`/advert/search?${qs}`);
    const data = res?.data ?? res;
    return data?.pagination?.totalItems ?? 0;
  } catch {
    return 0;
  }
}

function useCategoryCounts(nodes: TreeNode[], parents: TreeNode[]): Map<string, number | null> {
  const [counts, setCounts] = useState<Map<string, number | null>>(new Map());
  const abortRef = useRef<AbortController | null>(null);

  const nodesKey = nodes.map((n) => n.uid).join(",");

  useEffect(() => {
    if (!nodes.length) {
      setCounts(new Map());
      return;
    }

    if (abortRef.current) abortRef.current.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    setCounts(new Map(nodes.map((n) => [n.uid, null])));

    const fetchAll = async () => {
      const results = await Promise.allSettled(
        nodes.map(async (node) => {
          const path = getPathForNode(node, parents);
          const params = buildCountParams(path);
          const count = await fetchCountForParams(params);
          return { uid: node.uid, count };
        }),
      );

      if (ctrl.signal.aborted) return;

      const next = new Map<string, number | null>();
      for (const r of results) {
        if (r.status === "fulfilled") {
          next.set(r.value.uid, r.value.count);
        }
      }
      setCounts(next);
    };

    fetchAll();

    return () => {
      ctrl.abort();
    };
  }, [nodesKey]); // eslint-disable-line react-hooks/exhaustive-deps

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

  const [selectedL0, setSelectedL0] = useState<TreeNode | null>(null);
  const [selectedL1, setSelectedL1] = useState<TreeNode | null>(null);

  const activePathParts = useMemo(() => {
    const t = (filters as any)?.type;
    if (!t || t === "Hepsi") return [] as string[];
    return String(t).split(" > ").map((p: string) => p.trim()).filter(Boolean);
  }, [filters]);

  useEffect(() => {
    if (activePathParts.length === 0) {
      setSelectedL0(null);
      setSelectedL1(null);
      return;
    }

    const l0Match = topLevel.find((n) => activePathParts.includes(n.name));
    if (l0Match) {
      setSelectedL0(l0Match);
      const l1Match = l0Match.children.find((n) => activePathParts.includes(n.name));
      setSelectedL1(l1Match || null);
    } else {
      setSelectedL0(null);
      setSelectedL1(null);
    }
  }, [activePathParts, topLevel]);

  const visibleNodes = useMemo(() => {
    if (!selectedL0) return topLevel;
    if (!selectedL1) return selectedL0.children;
    return selectedL1.children;
  }, [selectedL0, selectedL1, topLevel]);

  const parentPath = useMemo((): TreeNode[] => {
    if (!selectedL0) return [];
    if (!selectedL1) return [selectedL0];
    return [selectedL0, selectedL1];
  }, [selectedL0, selectedL1]);

  const counts = useCategoryCounts(visibleNodes, parentPath);

  const handleRootClick = useCallback(() => {
    setSelectedL0(null);
    setSelectedL1(null);
    onCategorySelect(null);
  }, [onCategorySelect]);

  const handleL0Click = useCallback(
    (node: TreeNode) => {
      setSelectedL0(node);
      setSelectedL1(null);
      onCategorySelect(node.raw as Category);
    },
    [onCategorySelect],
  );

  const handleL0LabelClick = useCallback(
    (node: TreeNode) => {
      setSelectedL0(node);
      setSelectedL1(null);
      onCategorySelect(node.raw as Category);
    },
    [onCategorySelect],
  );

  const handleL1Click = useCallback(
    (node: TreeNode) => {
      setSelectedL1(node);
      onCategorySelect(node.raw as Category);
    },
    [onCategorySelect],
  );

  const handleL1LabelClick = useCallback(
    (node: TreeNode) => {
      setSelectedL1(node);
      onCategorySelect(node.raw as Category);
    },
    [onCategorySelect],
  );

  const handleL2Click = useCallback(
    (node: TreeNode) => {
      onCategorySelect(node.raw as Category);
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
        className="w-full text-left px-3 py-1.5 text-[13px] focus:outline-none cursor-pointer"
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
              onClick={() => handleL0Click(l0)}
              className="w-full text-left px-3 py-[3px] text-[13px] leading-[20px] focus:outline-none cursor-pointer"
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
              className="px-3 py-[3px] text-[13px] leading-[20px]"
              style={{ paddingLeft: 20 }}
            >
              <span className={labelStyle} onClick={() => handleL0LabelClick(selectedL0)} role="button" tabIndex={0}>
                {selectedL0.name}
              </span>
            </div>

            {selectedL0.children.map((l1) => (
              <button
                key={l1.uid}
                type="button"
                onClick={() => handleL1Click(l1)}
                className="w-full text-left px-3 py-[3px] text-[13px] leading-[20px] focus:outline-none cursor-pointer"
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
              onClick={() => handleL0LabelClick(selectedL0)}
              className="w-full text-left px-3 py-[3px] text-[13px] leading-[20px] focus:outline-none cursor-pointer"
              style={{ paddingLeft: 20 }}
            >
              <span className={labelStyle}>{selectedL0.name}</span>
            </button>

            <button
              type="button"
              onClick={() => handleL1LabelClick(selectedL1)}
              className="w-full text-left px-3 py-[3px] text-[13px] leading-[20px] focus:outline-none cursor-pointer"
              style={{ paddingLeft: 36 }}
            >
              <span className={labelStyle}>{selectedL1.name}</span>
            </button>

            {selectedL1.children.map((l2) => (
              <button
                key={l2.uid}
                type="button"
                onClick={() => handleL2Click(l2)}
                className="w-full text-left px-3 py-[3px] text-[13px] leading-[20px] focus:outline-none cursor-pointer"
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