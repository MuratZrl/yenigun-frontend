import { useCallback, useRef, useState } from "react";
import { toast } from "react-toastify";
import api from "@/lib/api";

import type { AdminUser } from "@/features/admin/admins/model/types";
import type { FormState } from "./types";
import { EMPTY_FORM, buildFormFromUser, cleanPhoneNumber } from "./utils";

interface UseAdminModalArgs {
  open: boolean;
  mode: "create" | "edit";
  user: AdminUser | null;
  onClose: () => void;
}

export function useAdminModal({ open, mode, user, onClose }: UseAdminModalArgs) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [fileName, setFileName] = useState("");
  const [prevOpen, setPrevOpen] = useState(false);

  if (open && !prevOpen) {
    if (mode === "edit" && user) {
      setForm(buildFormFromUser(user));
    } else {
      setForm(EMPTY_FORM);
    }
    setFileName("");
  }
  if (open !== prevOpen) {
    setPrevOpen(open);
  }

  const handleClose = useCallback(() => {
    onClose();
    setForm(EMPTY_FORM);
    setFileName("");
  }, [onClose]);

  const handleSubmitCreate = useCallback(() => {
    const cleanedGsmNumber = cleanPhoneNumber(form.gsmNumber);

    let birthPayload: { day: number; month: number; year: number } | undefined;
    if (form.birth) {
      const iso = typeof form.birth === "string" ? form.birth : "";
      if (iso && iso.includes("-")) {
        const d = new Date(iso);
        birthPayload = {
          day: d.getDate(),
          month: d.getMonth() + 1,
          year: d.getFullYear(),
        };
      } else if (form.birth instanceof Date) {
        birthPayload = {
          day: form.birth.getDate(),
          month: form.birth.getMonth() + 1,
          year: form.birth.getFullYear(),
        };
      }
    }

    api
      .post("/admin/create-admin", {
        name: form.name,
        surname: form.surname,
        mail: form.mail,
        gender: form.gender === "Erkek" ? "male" : "female",
        gsmNumber: cleanedGsmNumber,
        password: form.password,
        role: form.role,
        birth: birthPayload,
      })
      .then((res) => {
        toast.success("Yetkili başarıyla oluşturuldu.");
        if (!form.image) return;

        const formData = new FormData();
        formData.append("uid", res.data.data.uid);
        formData.append("image", form.image);

        api.post("/admin/upload-user-image", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      })
      .catch((err: unknown) => {
        const message =
          err instanceof Error ? err.message : "Yetkili oluşturulurken bir hata oluştu.";
        toast.error(message);
      });

    handleClose();
  }, [form, handleClose]);

  const handleSubmitEdit = useCallback(() => {
    const cleanedGsmNumber = cleanPhoneNumber(form.gsmNumber);
    const birthDate = form.birth instanceof Date ? form.birth : null;

    api
      .post("/admin/update-admin", {
        uid: form.uid,
        name: form.name,
        surname: form.surname,
        mail: form.mail,
        birth: birthDate
          ? {
              day: birthDate.getDate(),
              month: birthDate.getMonth(),
              year: birthDate.getFullYear(),
            }
          : undefined,
        role: form.role,
        password: form.password,
        gsmNumber: cleanedGsmNumber,
        link: form.link,
        gender: form.gender === "Erkek" ? "male" : "female",
      })
      .then(() => {
        toast.success("Yetkili başarıyla güncellendi.");
        handleClose();
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      })
      .catch((err: unknown) => {
        toast.error("Yetkili güncellenirken bir hata oluştu.");
        console.log(err);
        handleClose();
      });
  }, [form, handleClose]);

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (mode === "create") {
        handleSubmitCreate();
      } else {
        handleSubmitEdit();
      }
    },
    [mode, handleSubmitCreate, handleSubmitEdit]
  );

  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setForm((prev) => ({ ...prev, image: file }));
    }
  }, []);

  return {
    fileInputRef,
    form,
    setForm,
    fileName,
    handleClose,
    handleSubmit,
    handleImageChange,
  };
}
