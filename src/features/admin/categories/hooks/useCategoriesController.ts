// src/features/admin/categories/hooks/useCategoriesController.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";

import type { CategoryNode } from "@/features/admin/categories/lib/types";
import { CategoryAPI } from "@/features/admin/categories/lib/api";
import { errMsg } from "@/features/admin/categories/lib/helpers";

/* ── Modal state types ── */

export type NameModalState = {
  isOpen: boolean;
  mode: "create" | "edit";
  initialName: string;
  parentUid?: number;
  parentName?: string;
  editUid?: number;
};

export type AttrModalState = {
  isOpen: boolean;
  categoryUid: number;
  categoryName: string;
};

export type FacModalState = {
  isOpen: boolean;
  categoryUid: number;
  categoryName: string;
};

export type DeleteModalState = {
  isOpen: boolean;
  node: CategoryNode | null;
  loading: boolean;
};

/* ── Hook ── */

export function useCategoriesController() {
  const [tree, setTree] = useState<CategoryNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  /* ── Modal state ── */
  const [nameModal, setNameModal] = useState<NameModalState>({
    isOpen: false,
    mode: "create",
    initialName: "",
  });

  const [attrModal, setAttrModal] = useState<AttrModalState>({
    isOpen: false,
    categoryUid: 0,
    categoryName: "",
  });

  const [facModal, setFacModal] = useState<FacModalState>({
    isOpen: false,
    categoryUid: 0,
    categoryName: "",
  });

  const [deleteModal, setDeleteModal] = useState<DeleteModalState>({
    isOpen: false,
    node: null,
    loading: false,
  });

  /* ── Fetch tree ── */
  const fetchTree = useCallback(async () => {
    try {
      setLoading(true);
      const res = await CategoryAPI.getTree();
      const data =
        res.data?.data?.tree || res.data?.tree || res.data?.data || [];
      const arr = Array.isArray(data) ? data : [];
      setTree(arr);

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
    [nameModal, fetchTree],
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
  const openCreateRoot = useCallback(
    () => setNameModal({ isOpen: true, mode: "create", initialName: "" }),
    [],
  );

  const openCreateChild = useCallback(
    (parentUid: number, parentName: string) =>
      setNameModal({
        isOpen: true,
        mode: "create",
        initialName: "",
        parentUid,
        parentName,
      }),
    [],
  );

  const openEdit = useCallback(
    (node: CategoryNode) =>
      setNameModal({
        isOpen: true,
        mode: "edit",
        initialName: node.name,
        editUid: node.uid,
      }),
    [],
  );

  const openDelete = useCallback(
    (node: CategoryNode) =>
      setDeleteModal({ isOpen: true, node, loading: false }),
    [],
  );

  const openAttr = useCallback(
    (uid: number, name: string) =>
      setAttrModal({ isOpen: true, categoryUid: uid, categoryName: name }),
    [],
  );

  const openFac = useCallback(
    (uid: number, name: string) =>
      setFacModal({ isOpen: true, categoryUid: uid, categoryName: name }),
    [],
  );

  const closeNameModal = useCallback(
    () => setNameModal((p) => ({ ...p, isOpen: false })),
    [],
  );

  const closeAttrModal = useCallback(
    () => setAttrModal((p) => ({ ...p, isOpen: false })),
    [],
  );

  const closeFacModal = useCallback(
    () => setFacModal((p) => ({ ...p, isOpen: false })),
    [],
  );

  const closeDeleteModal = useCallback(
    () => setDeleteModal({ isOpen: false, node: null, loading: false }),
    [],
  );

  return {
    /* data */
    tree,
    loading,
    expanded,

    /* modals */
    nameModal,
    attrModal,
    facModal,
    deleteModal,

    /* actions */
    fetchTree,
    toggleExpand,
    handleNameSubmit,
    handleDelete,

    /* open helpers */
    openCreateRoot,
    openCreateChild,
    openEdit,
    openDelete,
    openAttr,
    openFac,

    /* close helpers */
    closeNameModal,
    closeAttrModal,
    closeFacModal,
    closeDeleteModal,
  };
}