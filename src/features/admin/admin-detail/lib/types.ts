// src/features/admin/admin-detail/lib/types.ts

export type BirthDate = {
  day: number | null;
  month: number | null;
  year: number | null;
};

export type AdminDetailUser = {
  uid: number;
  name: string;
  surname: string;
  mail?: string;
  gsmNumber?: string;
  role: string;
  gender?: string;
  profilePicture?: string | null;
  birth?: BirthDate;
  createdAt?: string;
};
