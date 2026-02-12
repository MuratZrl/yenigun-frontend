// src/app/(admin)/admin/categories/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus } from "lucide-react";
import { toast } from "react-toastify";
import AdminLayout from "@/components/layout/AdminLayout";

import type { CategoryNode } from "@/features/admin/categories/lib/types";
import { CategoryAPI } from "@/features/admin/categories/lib/api";
import { errMsg } from "@/features/admin/categories/lib/helpers";

import TreeNode from "@/features/admin/categories/components/TreeNode";
import EmptyState from "@/features/admin/categories/components/EmptyState";

import CategoryNameModal from "@/features/admin/categories/model/CategoryNameModel";
import AttributeModal from "@/features/admin/categories/model/AttributeModel";
import FacilityModal from "@/features/admin/categories/model/FacilityModel";
import DeleteModal from "@/features/admin/categories/model/DeleteModel";

export default function CategoriesPage() {
  const [tree, setTree] = useState<CategoryNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  /* ── Modal state ── */
  const [nameModal, setNameModal] = useState<{
    isOpen: boolean;
    mode: "create" | "edit";
    initialName: string;
    parentUid?: number;
    parentName?: string;
    editUid?: number;
  }>({ isOpen: false, mode: "create", initialName: "" });

  const [attrModal, setAttrModal] = useState({
    isOpen: false,
    categoryUid: 0,
    categoryName: "",
  });

  const [facModal, setFacModal] = useState({
    isOpen: false,
    categoryUid: 0,
    categoryName: "",
  });

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    node: CategoryNode | null;
    loading: boolean;
  }>({ isOpen: false, node: null, loading: false });

  /* ── Fetch tree ── */
  const fetchTree = useCallback(async () => {
    try {
      setLoading(true);
      const res = await CategoryAPI.getTree();
      const data =
        res.data?.data?.tree || res.data?.tree || res.data?.data || [];
      const arr = Array.isArray(data) ? data : [];
      setTree(arr);

      // Auto-expand root nodes on first load
      if (arr.length) {
        setExpanded((prev) => {
          const next = new Set(prev);
          arr.forEach((n: CategoryNode) => next.add(n.uid));
          return next;
        });
      }
    } catch (err: any) {
      toast.error("Kategoriler yüklenemedi");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTree();
  }, [fetchTree]);

  /* ── Toggle expand ── */
  const toggleExpand = useCallback((uid: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(uid) ? next.delete(uid) : next.add(uid);
      return next;
    });
  }, []);

  /* ── Name modal submit ── */
  const handleNameSubmit = useCallback(
    async (name: string) => {
      if (nameModal.mode === "create") {
        await CategoryAPI.createCategory(name, nameModal.parentUid);
        toast.success("Kategori oluşturuldu");
      } else if (nameModal.editUid) {
        await CategoryAPI.updateCategory(nameModal.editUid, name);
        toast.success("Kategori güncellendi");
      }
      fetchTree();
    },
    [nameModal, fetchTree]
  );

  /* ── Delete ── */
  const handleDelete = useCallback(async () => {
    if (!deleteModal.node) return;
    setDeleteModal((prev) => ({ ...prev, loading: true }));
    try {
      await CategoryAPI.deleteCategory(deleteModal.node.uid);
      toast.success(`"${deleteModal.node.name}" silindi`);
      setDeleteModal({ isOpen: false, node: null, loading: false });
      fetchTree();
    } catch (err: any) {
      toast.error(errMsg(err));
      setDeleteModal((prev) => ({ ...prev, loading: false }));
    }
  }, [deleteModal.node, fetchTree]);

  /* ── Open helpers ── */
  const openCreateRoot = () =>
    setNameModal({ isOpen: true, mode: "create", initialName: "" });

  const openCreateChild = (parentUid: number, parentName: string) =>
    setNameModal({
      isOpen: true,
      mode: "create",
      initialName: "",
      parentUid,
      parentName,
    });

  const openEdit = (node: CategoryNode) =>
    setNameModal({
      isOpen: true,
      mode: "edit",
      initialName: node.name,
      editUid: node.uid,
    });

  const openDelete = (node: CategoryNode) =>
    setDeleteModal({ isOpen: true, node, loading: false });

  const openAttr = (uid: number, name: string) =>
    setAttrModal({ isOpen: true, categoryUid: uid, categoryName: name });

  const openFac = (uid: number, name: string) =>
    setFacModal({ isOpen: true, categoryUid: uid, categoryName: name });

  /* ── Loading state ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Kategoriler Yükleniyor
          </h2>
          <p className="text-gray-600">Kategori verileri hazırlanıyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <AdminLayout>
        <div className="flex-1 p-6 lg:p-8 bg-gray-50 min-h-screen">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div>
                  <h1 className="text-2xl lg:text-4xl font-bold text-gray-900 mb-3">
                    Kategori Yönetimi
                  </h1>
                  <p className="text-gray-600 text-lg max-w-2xl">
                    Kategori, alt kategori, özellik ve tesis özelliklerini
                    yönetin.
                  </p>
                </div>
                <button
                  onClick={openCreateRoot}
                  className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 font-semibold shadow-lg hover:shadow-xl"
                >
                  <Plus size={24} />
                  Yeni Ana Kategori
                </button>
              </div>
            </div>

            {/* Tree */}
            <div className="space-y-6">
              {tree.length === 0 ? (
                <EmptyState onAddCategory={openCreateRoot} />
              ) : (
                tree.map((node) => (
                  <TreeNode
                    key={node.uid}
                    node={node}
                    level={0}
                    expanded={expanded}
                    onToggle={toggleExpand}
                    onAddChild={openCreateChild}
                    onEdit={openEdit}
                    onDelete={openDelete}
                    onAddAttribute={openAttr}
                    onAddFacility={openFac}
                    onRefresh={fetchTree}
                  />
                ))
              )}
            </div>
          </div>
        </div>

        {/* Modals */}
        <CategoryNameModal
          isOpen={nameModal.isOpen}
          onClose={() => setNameModal((p) => ({ ...p, isOpen: false }))}
          onSubmit={handleNameSubmit}
          mode={nameModal.mode}
          initialName={nameModal.initialName}
          parentName={nameModal.parentName}
        />

        <AttributeModal
          isOpen={attrModal.isOpen}
          onClose={() => setAttrModal((p) => ({ ...p, isOpen: false }))}
          onSuccess={fetchTree}
          categoryUid={attrModal.categoryUid}
          categoryName={attrModal.categoryName}
        />

        <FacilityModal
          isOpen={facModal.isOpen}
          onClose={() => setFacModal((p) => ({ ...p, isOpen: false }))}
          onSuccess={fetchTree}
          categoryUid={facModal.categoryUid}
          categoryName={facModal.categoryName}
        />

        <DeleteModal
          isOpen={deleteModal.isOpen}
          onClose={() =>
            setDeleteModal({ isOpen: false, node: null, loading: false })
          }
          onConfirm={handleDelete}
          title="Kategori Sil"
          message={`"${deleteModal.node?.name || ""}" kategorisini silmek istediğinizden emin misiniz? Alt kategoriler ve özellikleri de silinecektir. Bu işlem geri alınamaz.`}
          loading={deleteModal.loading}
        />
      </AdminLayout>
    </div>
  );
}