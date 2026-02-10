// src/features/admin/admins/model/types.ts

export type AdminUserRole = "admin" | "moderator" | "editor" | (string & {});

export type Gender = "male" | "female" | (string & {});

export type BirthDate = {
  day: number;
  month: number;
  year: number;
};

export type AdminUser = {
  uid: number;
  name: string;
  surname: string;
  mail?: string;
  gsmNumber?: string;
  role: AdminUserRole;
  gender?: Gender;
  profilePicture?: string | null;
  birth?: BirthDate;
};

export type AdminUsersListParams = {
  page?: number;
  limit?: number;
  q?: string;
  role?: string;
};

export type CreateAdminUserPayload = {
  name: string;
  surname: string;
  mail: string;
  gsmNumber: string;
  password: string;
  role: string;
  gender?: string;
  birthDate?: string;
  image?: string;
};

export type UpdateAdminUserPayload = Partial<Omit<CreateAdminUserPayload, "password">> & {
  password?: string;
};

export type PaginationState = {
  page: number; // 0-based (senin mevcut sayfadaki gibi)
  rowsPerPage: number;
};

export type DeleteConfirmState = {
  open: boolean;
  uid: number | null;
  user: AdminUser | null;
};

export type EditUserModalState = {
  open: boolean;
  user: AdminUser | null;
};

export type CreateUserModalState = {
  open: boolean;
  form: CreateAdminUserPayload;
};
