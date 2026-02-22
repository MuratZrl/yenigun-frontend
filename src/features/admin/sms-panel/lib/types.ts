// src/features/admin/sms-panel/lib/types.ts

export type RecipientType = "all" | "specific" | "city" | "category";

export type CustomerCategory = "Kiracı" | "Ev Sahibi" | "Mülk Sahibi";

export type SmsStatus = "sent" | "failed" | "pending";

export type SmsStats = {
  remainingQuota: number;
  totalSent: number;
  successCount: number;
  failCount: number;
};

export type SmsHistoryItem = {
  id: string;
  recipientName: string;
  recipientPhone: string;
  message: string;
  status: SmsStatus;
  sentAt: string;
};

export type SmsComposeState = {
  recipientType: RecipientType;
  selectedCities: string[];
  selectedDistricts: string[];
  selectedCategory: CustomerCategory | "";
  message: string;
};

export type SmsTab = "compose" | "history" | "stats";
