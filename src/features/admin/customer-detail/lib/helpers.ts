// src/features/admin/customer-detail/lib/helpers.ts

export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}