// src/features/admin/categories/ui/CategoriesPage.client.tsx
"use client";

import { Plus } from "lucide-react";
import AdminLayout from "@/components/layout/AdminLayout";

import TreeNode from "@/features/admin/categories/components/TreeNode";
import EmptyState from "@/features/admin/categories/components/EmptyState";

import CategoryNameModal from "@/features/admin/categories/model/CategoryNameModel";
import AttributeModal from "@/features/admin/categories/model/AttributeModel";
import FacilityModal from "@/features/admin/categories/model/FacilityModel";
import DeleteModal from "@/features/admin/categories/model/DeleteModel";

import { useCategoriesController } from "@/features/admin/categories/hooks/useCategoriesController";

export default function CategoriesPage() {
  const c = useCategoriesController();

  if (c.loading) {
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
                  onClick={c.openCreateRoot}
                  className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 font-semibold shadow-lg hover:shadow-xl"
                >
                  <Plus size={24} />
                  Yeni Ana Kategori
                </button>
              </div>
            </div>

            {/* Tree */}
            <div className="space-y-6">
              {c.tree.length === 0 ? (
                <EmptyState onAddCategory={c.openCreateRoot} />
              ) : (
                c.tree.map((node) => (
                  <TreeNode
                    key={node.uid}
                    node={node}
                    level={0}
                    expanded={c.expanded}
                    onToggle={c.toggleExpand}
                    onAddChild={c.openCreateChild}
                    onEdit={c.openEdit}
                    onDelete={c.openDelete}
                    onAddAttribute={c.openAttr}
                    onAddFacility={c.openFac}
                    onRefresh={c.fetchTree}
                  />
                ))
              )}
            </div>
          </div>
        </div>

        {/* Modals */}
        <CategoryNameModal
          isOpen={c.nameModal.isOpen}
          onClose={c.closeNameModal}
          onSubmit={c.handleNameSubmit}
          mode={c.nameModal.mode}
          initialName={c.nameModal.initialName}
          parentName={c.nameModal.parentName}
        />

        <AttributeModal
          isOpen={c.attrModal.isOpen}
          onClose={c.closeAttrModal}
          onSuccess={c.fetchTree}
          categoryUid={c.attrModal.categoryUid}
          categoryName={c.attrModal.categoryName}
        />

        <FacilityModal
          isOpen={c.facModal.isOpen}
          onClose={c.closeFacModal}
          onSuccess={c.fetchTree}
          categoryUid={c.facModal.categoryUid}
          categoryName={c.facModal.categoryName}
        />

        <DeleteModal
          isOpen={c.deleteModal.isOpen}
          onClose={c.closeDeleteModal}
          onConfirm={c.handleDelete}
          title="Kategori Sil"
          message={`"${c.deleteModal.node?.name || ""}" kategorisini silmek istediğinizden emin misiniz? Alt kategoriler ve özellikleri de silinecektir. Bu işlem geri alınamaz.`}
          loading={c.deleteModal.loading}
        />
      </AdminLayout>
    </div>
  );
}