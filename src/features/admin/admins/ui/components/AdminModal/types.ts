import type { AdminUser } from "@/features/admin/admins/model/types";

export type FormState = {
  uid: number | string;
  profilePicture: string;
  name: string;
  surname: string;
  mail: string;
  birth: string | Date;
  role: string;
  password: string;
  gsmNumber: string;
  gender: string;
  link: string;
  image?: File | null;
};

export type AdminModalProps = {
  open: boolean;
  mode: "create" | "edit";
  user: AdminUser | null;
  onClose: () => void;
};
