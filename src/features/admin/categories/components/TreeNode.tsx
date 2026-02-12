// src/features/admin/categories/components/TreeNode.tsx
"use client";

import {
  Plus,
  Edit2,
  Trash2,
  Folder,
  FolderOpen,
  ChevronDown,
  ChevronRight,
  Settings,
  Tag,
} from "lucide-react";
import type { CategoryNode } from "../lib/types";
import { countDescendants } from "../lib/helpers";
import AttributeItem from "./AttributeItem";
import FacilityItem from "./FacilityItem";

interface Props {
  node: CategoryNode;
  level: number;
  expanded: Set<number>;
  onToggle: (uid: number) => void;
  onAddChild: (parentUid: number, parentName: string) => void;
  onEdit: (node: CategoryNode) => void;
  onDelete: (node: CategoryNode) => void;
  onAddAttribute: (uid: number, name: string) => void;
  onAddFacility: (uid: number, name: string) => void;
  onRefresh: () => void;
}

export default function TreeNode({
  node,
  level,
  expanded,
  onToggle,
  onAddChild,
  onEdit,
  onDelete,
  onAddAttribute,
  onAddFacility,
  onRefresh,
}: Props) {
  const isExpanded = expanded.has(node.uid);
  const hasContent =
    node.children.length > 0 ||
    node.attributes.length > 0 ||
    node.facilities.length > 0;

  const bgColor =
    level === 0
      ? "bg-gradient-to-br from-gray-500 to-gray-600"
      : level === 1
      ? "bg-gradient-to-br from-blue-600 to-blue-700"
      : level === 2
      ? "bg-gradient-to-br from-green-500 to-green-600"
      : "bg-gradient-to-br from-purple-500 to-purple-600";

  const iconSize = Math.max(14, 22 - level * 2);
  const boxSize = Math.max(32, 48 - level * 4);

  return (
    <div
      className={`rounded-xl border border-gray-200 overflow-hidden ${
        level === 0 ? "bg-white shadow-sm" : "bg-gray-50"
      }`}
    >
      {/* Header */}
      <div className={level === 0 ? "p-6" : "p-4"}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            {hasContent ? (
              <button
                onClick={() => onToggle(node.uid)}
                className="p-1 hover:bg-blue-50 rounded-lg text-blue-600"
              >
                {isExpanded ? (
                  <ChevronDown size={20} />
                ) : (
                  <ChevronRight size={20} />
                )}
              </button>
            ) : (
              <div className="w-7" />
            )}

            <div
              className={`${bgColor} rounded-xl flex items-center justify-center shadow-lg`}
              style={{ width: boxSize, height: boxSize }}
            >
              {isExpanded ? (
                <FolderOpen size={iconSize} className="text-white" />
              ) : (
                <Folder size={iconSize} className="text-white" />
              )}
            </div>

            <div className="flex-1">
              <h3
                className={`font-bold text-gray-900 ${
                  level === 0
                    ? "text-xl"
                    : level === 1
                    ? "text-lg"
                    : "text-base"
                }`}
              >
                {node.name}
                <span className="ml-2 text-xs font-normal text-gray-400">
                  uid: {node.uid}
                </span>
              </h3>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>{countDescendants(node)} alt kategori</span>
                <span>•</span>
                <span>{node.attributes.length} özellik</span>
                <span>•</span>
                <span>{node.facilities.length} tesis</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => onAddChild(node.uid, node.name)}
              className="flex items-center gap-1.5 px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-sm font-medium shadow-sm"
            >
              <Plus size={14} />
              <span className="hidden sm:inline">Alt Kategori</span>
            </button>
            <button
              onClick={() => onAddAttribute(node.uid, node.name)}
              className="flex items-center gap-1.5 px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 text-sm font-medium shadow-sm"
            >
              <Plus size={14} />
              <span className="hidden sm:inline">Özellik</span>
            </button>
            <button
              onClick={() => onAddFacility(node.uid, node.name)}
              className="flex items-center gap-1.5 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm font-medium shadow-sm"
            >
              <Plus size={14} />
              <span className="hidden sm:inline">Tesis</span>
            </button>
            <button
              onClick={() => onEdit(node)}
              className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={() => onDelete(node)}
              className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Expanded content */}
      {isExpanded && hasContent && (
        <div className="border-t border-gray-200">
          <div className={`${level === 0 ? "p-6" : "p-4"} space-y-3`}>
            {/* Attributes */}
            {node.attributes.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                  <Settings size={12} /> Özellikler ({node.attributes.length})
                </h4>
                {[...node.attributes]
                  .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                  .map((attr) => (
                    <AttributeItem
                      key={attr.id}
                      attr={attr}
                      categoryUid={node.uid}
                      onDeleted={onRefresh}
                    />
                  ))}
              </div>
            )}

            {/* Facilities */}
            {node.facilities.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                  <Tag size={12} /> Tesis Özellikleri ({node.facilities.length})
                </h4>
                {node.facilities.map((fac) => (
                  <FacilityItem
                    key={fac.title}
                    facility={fac}
                    categoryUid={node.uid}
                    onDeleted={onRefresh}
                  />
                ))}
              </div>
            )}

            {/* Children (recursive) */}
            {node.children.length > 0 && (
              <div className="space-y-3">
                {node.children.map((child) => (
                  <TreeNode
                    key={child.uid}
                    node={child}
                    level={level + 1}
                    expanded={expanded}
                    onToggle={onToggle}
                    onAddChild={onAddChild}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onAddAttribute={onAddAttribute}
                    onAddFacility={onAddFacility}
                    onRefresh={onRefresh}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}