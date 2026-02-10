export default function formatPhoneNumber(phoneNumber: string): string {
  const cleaned = phoneNumber.replace(/\D/g, "");

  if (cleaned.length < 10) {
    return phoneNumber;
  }

  const normalized =
    cleaned.startsWith("0") && cleaned.length === 11
      ? cleaned.substring(1)
      : cleaned;

  if (normalized.length === 10) {
    const areaCode = normalized.slice(0, 3);
    const firstPart = normalized.slice(3, 6);
    const secondPart = normalized.slice(6, 8);
    const thirdPart = normalized.slice(8);

    return `0 (${areaCode}) ${firstPart} ${secondPart} ${thirdPart}`;
  }

  return phoneNumber;
}
