// src/features/admin/listing-list/utils/printAdvert.ts

import type { Advert } from "../types";
import { renderAddressSafely } from "../../listing-archived/utils/addressFormat";
import { getFirstValidPhoto } from "../../listing-archived/utils/photoHelpers";

/** Turkish labels for known detail keys */
const DETAIL_LABELS: Record<string, string> = {
  netArea: "m² (Net)",
  grossArea: "m² (Brüt)",
  roomCount: "Oda Sayısı",
  buildingAge: "Bina Yaşı",
  floor: "Bulunduğu Kat",
  totalFloor: "Kat Sayısı",
  heating: "Isıtma",
  bathCount: "Banyo Sayısı",
  elevator: "Asansör",
  balcony: "Balkon",
  furniture: "Eşyalı",
  inSite: "Site İçerisinde",
  parking: "Otopark",
  whichSide: "Cephe",
  deed: "Tapu Durumu",
  zoningStatus: "İmar Durumu",
};

/** Known fac_* slug → Turkish title mapping */
const FAC_LABELS: Record<string, string> = {
  "ic-ozellikler": "İç Özellikler",
  "dis-ozellikler": "Dış Özellikler",
  "muhit": "Muhit",
  "ulasim": "Ulaşım",
  "engelli-ozellikler": "Engelli Özellikleri",
  "goruntu": "Manzara",
  "konut-tipi": "Konut Tipi",
  "altyapi": "Altyapı",
  "cephe": "Cephe",
  "cevre": "Çevre",
  "peyzaj": "Peyzaj",
  "site-ozellikleri": "Site Özellikleri",
};

/** Keys to skip when iterating details */
const SKIP_KEYS = new Set(["__v", "_id", "id"]);

function formatValue(val: unknown): string {
  if (val === true) return "Evet";
  if (val === false) return "Hayır";
  if (val == null || val === "") return "-";
  return String(val);
}

function formatDate(timestamp: number): string {
  const d = new Date(timestamp);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("tr-TR", { day: "2-digit", month: "long", year: "numeric" });
}

function escapeHtml(val: unknown): string {
  const str = val == null ? "" : String(val);
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/** Builds detail rows HTML from ad.details + meta fields */
function buildDetailRows(ad: Advert): string {
  const rows: Array<[string, string]> = [];

  // Meta fields first
  rows.push(["İlan No", ad.uid]);
  rows.push(["İlan Tarihi", formatDate(ad.created.createdTimestamp)]);

  // Detail fields
  if (ad.details) {
    for (const [key, val] of Object.entries(ad.details)) {
      if (SKIP_KEYS.has(key)) continue;
      const label = DETAIL_LABELS[key] || key;
      rows.push([label, formatValue(val)]);
    }
  }

  // Address
  const address = renderAddressSafely(ad.address);
  if (address) rows.push(["Adres", address]);

  return rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:5px 10px;font-weight:600;color:#333;white-space:nowrap;border-bottom:1px solid #eee;">${escapeHtml(label)}</td><td style="padding:5px 10px;color:#555;border-bottom:1px solid #eee;">${escapeHtml(value)}</td></tr>`
    )
    .join("");
}

/** Extract feature values into grouped sections for printing */
function buildFeaturesHtml(ad: Advert): string {
  const featureValues = (ad as any)?.featureValues;
  if (!Array.isArray(featureValues) || featureValues.length === 0) return "";

  const sections: Array<{ title: string; values: string[] }> = [];

  for (const fv of featureValues) {
    const featureId = String(fv?.featureId ?? "").trim();
    if (!featureId) continue;

    // Extract values
    let values: string[] = [];
    if (Array.isArray(fv.value)) {
      values = fv.value.map((v: unknown) => String(v).trim()).filter(Boolean);
    } else if (typeof fv.value === "string" && fv.value.trim()) {
      values = fv.value.split(",").map((v: string) => v.trim()).filter(Boolean);
    }
    if (values.length === 0) continue;
    // Skip purely numeric single values (likely mismatched fields)
    if (values.length === 1 && /^\d+$/.test(values[0])) continue;

    // Determine section title
    let title = "";
    if (featureId.startsWith("fac_")) {
      const slug = featureId.replace("fac_", "");
      title = FAC_LABELS[slug] || slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    } else {
      title = fv.name || fv.title || featureId;
    }

    sections.push({ title, values });
  }

  if (sections.length === 0) return "";

  let html = `
  <div class="features-section">
    <h3>Özellikler</h3>`;

  for (const section of sections) {
    html += `
    <div class="feature-group">
      <div class="feature-title">${escapeHtml(section.title)}</div>
      <div class="feature-grid">`;
    for (const val of section.values) {
      html += `<span class="feature-item">✓ ${escapeHtml(val)}</span>`;
    }
    html += `</div>
    </div>`;
  }

  html += `
  </div>`;
  return html;
}

/** Opens a new window with A4-formatted advert details and triggers print */
export function printAdvert(ad: Advert): void {
  const typeLabel = `${ad.steps.second} ${ad.steps.first}`.toUpperCase().trim();
  const photo = getFirstValidPhoto(ad.photos);
  const detailRows = buildDetailRows(ad);
  const advisorName = `${ad.advisor.name || ""} ${ad.advisor.surname || ""}`.trim() || "Belirtilmemiş";
  const customerPhones = ad.customer?.phones?.map((p) => (p.number?.startsWith("0") ? p.number : `0${p.number}`)).join(", ") || "";
  const thoughts = ((ad as any)?.thoughts as string) || "";
  const featuresHtml = buildFeaturesHtml(ad);

  const html = `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<title>${escapeHtml(ad.title)} - Yazdır</title>
<style>
  @page { size: A4; margin: 12mm; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; font-size: 13px; color: #333; background: #fff; }

  .page { max-width: 210mm; margin: 0 auto; }

  .header { background: #FFD700; padding: 16px 24px; text-align: center; }
  .header h1 { font-size: 28px; font-weight: 900; color: #000; letter-spacing: 2px; }

  .title-bar { padding: 10px 24px; border-bottom: 1px solid #ddd; }
  .title-bar h2 { font-size: 14px; font-weight: 600; color: #333; }
  .title-bar .location { font-size: 11px; color: #888; margin-top: 2px; }

  .content { display: flex; gap: 20px; padding: 16px 24px; }
  .left { flex: 1; min-width: 0; }
  .right { width: 220px; flex-shrink: 0; }

  table { width: 100%; border-collapse: collapse; font-size: 12px; }

  .price-row { padding: 10px 24px; border-top: 2px solid #000; }
  .price-row span { font-size: 20px; font-weight: 800; color: #000; }

  .photo-box { width: 100%; border-radius: 6px; overflow: hidden; border: 1px solid #ddd; margin-bottom: 12px; }
  .photo-box img { width: 100%; height: auto; display: block; }

  .advisor-card { border: 1px solid #ddd; border-radius: 6px; padding: 10px; font-size: 12px; }
  .advisor-card .label { font-size: 10px; color: #888; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
  .advisor-card .name { font-weight: 700; color: #333; }
  .advisor-card .phone { color: #035DBA; margin-top: 4px; }

  .description { padding: 16px 24px; border-top: 1px solid #ddd; }
  .description h3 { font-size: 14px; font-weight: 700; color: #c00; margin-bottom: 8px; text-transform: uppercase; }
  .description p { font-size: 12px; line-height: 1.6; color: #444; white-space: pre-wrap; }

  .thoughts-section { padding: 16px 24px; border-top: 1px solid #ddd; }
  .thoughts-section h3 { font-size: 14px; font-weight: 700; color: #005299; margin-bottom: 8px; text-transform: uppercase; }
  .thoughts-section p { font-size: 12px; line-height: 1.6; color: #444; white-space: pre-wrap; }

  .features-section { padding: 16px 24px; border-top: 1px solid #ddd; }
  .features-section h3 { font-size: 14px; font-weight: 700; color: #005299; margin-bottom: 12px; text-transform: uppercase; }
  .feature-group { margin-bottom: 10px; }
  .feature-title { font-size: 12px; font-weight: 700; color: #005299; margin-bottom: 6px; border-bottom: 1px solid #e0e0e0; padding-bottom: 3px; }
  .feature-grid { display: flex; flex-wrap: wrap; gap: 2px 16px; }
  .feature-item { font-size: 11px; color: #333; padding: 2px 0; white-space: nowrap; }

  .footer { padding: 12px 24px; border-top: 1px solid #ddd; display: flex; justify-content: space-between; font-size: 10px; color: #999; margin-top: 16px; }

  @media print {
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .page { max-width: none; }
  }
</style>
</head>
<body>
<div class="page">
  <!-- Header -->
  <div class="header">
    <h1>${escapeHtml(typeLabel)}</h1>
  </div>

  <!-- Title -->
  <div class="title-bar">
    <h2>${escapeHtml(ad.title)}</h2>
    <div class="location">${escapeHtml(renderAddressSafely(ad.address))}</div>
  </div>

  <!-- Content: Details + Photo -->
  <div class="content">
    <div class="left">
      <table>${detailRows}</table>
    </div>
    <div class="right">
      ${photo ? `<div class="photo-box"><img src="${escapeHtml(photo)}" alt="Fotoğraf" /></div>` : ""}
      <div class="advisor-card">
        <div class="label">Danışman Bilgisi</div>
        <div class="name">${escapeHtml(advisorName)}</div>
        ${customerPhones ? `<div class="phone">Tel: ${escapeHtml(customerPhones)}</div>` : ""}
      </div>
    </div>
  </div>

  <!-- Price -->
  <div class="price-row">
    <span>Fiyat: ${escapeHtml(String(ad.fee))}</span>
  </div>

  ${ad.adminNote ? `
  <!-- Admin Note -->
  <div class="description">
    <h3>Admin Notu</h3>
    <p>${escapeHtml(ad.adminNote)}</p>
  </div>
  ` : ""}

  ${thoughts.trim() ? `
  <!-- Açıklama / Thoughts -->
  <div class="thoughts-section">
    <h3>Açıklama</h3>
    <p>${escapeHtml(thoughts)}</p>
  </div>
  ` : ""}

  ${featuresHtml}

  <!-- Footer -->
  <div class="footer">
    <span>İlan No: ${escapeHtml(ad.uid)}</span>
    <span>yenigunemlak.com</span>
  </div>
</div>

<script>
  window.onload = function() {
    setTimeout(function() { window.print(); }, 300);
  };
  window.onafterprint = function() { window.close(); };
</script>
</body>
</html>`;

  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
  }
}
