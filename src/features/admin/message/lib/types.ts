// src/features/admin/message/lib/types.ts

export type MessagePhone = {
  number: string;
  isAbleToSendSMS?: boolean;
};

export type MessageUser = {
  uid: string;
  id?: number;
  name: string;
  surname: string;
  image?: string;
  mail: { mail: string };
  gender: string;
  status: string;
  phones: MessagePhone[];
  city?: string;
  county?: string;
  neighbourhood?: string;
  tcNumber?: string;
  mernisNo?: string;
};

export type MessageGroup = {
  uid: number;
  name: string;
  users: number[];
  description: string;
};

export type FilterValues = {
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

export type SendMessageState = {
  open: boolean;
  type: string[];
  users: (string | number)[];
};

export type EditModalState = {
  open: boolean;
  group: MessageGroup | Record<string, never>;
};

export const DEFAULT_FILTER_VALUES: FilterValues = {
  fullname: "",
  email: "",
  phone: "",
  gender: "",
  status: {
    selected: "",
    options: ["Mülk Sahibi", "Satınalan", "Kiralayan", "Özel Müşteri"],
  },
  turkish_id: "",
  mernis_no: "",
  province: "",
  district: "",
  quarter: "",
};

export const DEFAULT_GROUPS: MessageGroup[] = [
  {
    uid: 1,
    name: "Sakarya Grubu",
    users: [1, 2],
    description:
      "Sakarya ilindeki tüm yenigün emlak müşterileri (kiracılar, ev sahipleri ve özel müşteriler)",
  },
  {
    uid: 2,
    name: "Ankara Ev Sahipleri",
    users: [2],
    description:
      "Ankara ilindeki tüm yenigün emlak müşterileri (sadece ev sahipleri)",
  },
  {
    uid: 3,
    name: "Özel Müşteriler",
    users: [1, 2],
    description: "Yenigün emlak tüm özel müşterileri",
  },
];