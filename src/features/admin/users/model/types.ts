// src/features/admin/users/model/types.ts

/**
 * Bu feature: admin/users = MÜŞTERİLER (customers)
 * Admin yetkilileri (admin users) ile karıştırma.
 */

export type UID = string | number;

export type Gender = "male" | "female" | (string & {});

export type CustomerStatus =
  | "Mülk Sahibi"
  | "Satınalan"
  | "Kiralayan"
  | "Özel Müşteri"
  | (string & {});

export type CustomerPhone = {
  number?: string;
  isAbleToSendSMS?: boolean;
};

export type CustomerMailObject = {
  mail?: string;
};

export type CustomerMail = CustomerMailObject | string | null | undefined;

/**
 * Backend response (ham) müşteri modeli
 * Not: Backend burada tutarlı değil, o yüzden bol opsiyon + index signature var.
 */
export type CustomerUser = {
  uid: UID;

  name?: string;
  surname?: string;

  profilePicture?: string | null;

  // Backend bazen { mail: { mail: string } } gibi dönüyor
  mail?: CustomerMail;

  phones?: CustomerPhone[];

  gender?: Gender;
  status?: CustomerStatus;

  // extra alanlar (tcNumber, mernisNo, ideasAboutCustomer, address vs.)
  [key: string]: any;
};

/**
 * UI tarafında kullanmak için normalize edilmiş müşteri.
 * Bu tipte alanların formatı sabit: mail string, phones array vb.
 */
export type NormalizedCustomerUser = {
  uid: UID;
  name: string;
  surname: string;
  fullName: string;

  profilePicture?: string; // normalize ederken null -> undefined
  mail?: string;

  phones: CustomerPhone[];

  gender?: Gender;
  status?: CustomerStatus;

  // adres vb. gösterimler için hamdan taşınabilecek alanlar
  fulladdress?: string;

  // orijinal ham objeyi de istersen sakla
  raw?: CustomerUser;
};

/**
 * Listeleme parametreleri
 * Backend page 1-based bekliyor.
 */
export type UsersListParams = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

export type NoteSearchParams = {
  note: string;
  page?: number;
  limit?: number;
};

export type DeleteCustomerPayload = {
  uid: UID;
};

/**
 * API wrapper envelope (bazı endpointler sarıyor)
 */
export type ApiEnvelope<T> = {
  success?: boolean;
  data?: T;
  message?: string;
  [key: string]: any;
};

/**
 * UI state tipleri
 */
export type PaginationState = {
  page: number; // 0-based UI
  rowsPerPage: number;
  total: number;
};

export type DeleteConfirmState = {
  open: boolean;
  uid: UID | null;
  user: NormalizedCustomerUser | null;
};

export type EditUserModalState = {
  open: boolean;
  user: CustomerUser | null;
};

export type ListUserModalState = {
  open: boolean;
  user: CustomerUser | null;
};

/**
 * Filtre state (senin mevcut sayfadaki formu kapsayacak şekilde)
 * status alanı "selected/options" pattern’ine sahipti.
 */
export type UsersFiltersState = {
  fullname: string;
  email: string;
  phone: string;
  gender: string;
  status: {
    selected: string;
    options: string[];
  };
  turkish_id: string;
  mernis_no: string;
  province: string;
  district: string;
  quarter: string;
};

/**
 * Not arama state
 */
export type NoteSearchState = {
  text: string;
  active: boolean;
  loading: boolean;
};
