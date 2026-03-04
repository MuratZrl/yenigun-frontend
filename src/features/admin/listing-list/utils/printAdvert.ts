// src/features/admin/listing-list/utils/printAdvert.ts

import type { Advert } from "../types";
import { renderAddressSafely } from "../../listing-archived/utils/addressFormat";

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

  // Detail fields (skip null/empty values)
  if (ad.details) {
    for (const [key, val] of Object.entries(ad.details)) {
      if (SKIP_KEYS.has(key)) continue;
      if (val == null || val === "") continue;
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
        `<tr><td>${escapeHtml(label)}</td><td>${escapeHtml(value)}</td></tr>`
    )
    .join("");
}

/** Opens a new window with A4-formatted advert details and triggers print */
export interface PrintOptions {
  showPrice?: boolean;
}

export function printAdvert(ad: Advert, options?: PrintOptions): void {
  const { showPrice = true } = options || {};
  const typeLabel = `${ad.steps.second} ${ad.steps.first}`.toUpperCase().trim();
  const validPhotos = (ad.photos || []).filter((p) => typeof p === "string" && p.trim() !== "");
  const gridPhotos = validPhotos.slice(0, 7);
  const extraCount = validPhotos.length - 7;
  const detailRows = buildDetailRows(ad);
  const advisorName = `${ad.advisor.name || ""} ${ad.advisor.surname || ""}`.trim() || "Belirtilmemiş";
  const advisorPhoto = ad.advisor.profilePicture || "";
  const customerPhones = ad.customer?.phones?.map((p) => (p.number?.startsWith("0") ? p.number : `0${p.number}`)).join(", ") || "";


  const html = `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<title>${escapeHtml(ad.title)} - Yazdır</title>
<style>
  @page { size: A4; margin: 14mm; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: "Segoe UI", Roboto, -apple-system, BlinkMacSystemFont, Arial, sans-serif;
    font-size: 13px;
    color: #2d3436;
    background: #fff;
    line-height: 1.5;
  }

  .page { max-width: 210mm; margin: 0 auto; }

  /* Header */
  .header {
    background: linear-gradient(135deg, #035DBA, #0470d6);
    padding: 14px 28px;
    text-align: center;
  }
  .header h1 {
    font-size: 22px;
    font-weight: 800;
    color: #fff;
    letter-spacing: 3px;
    text-transform: uppercase;
  }

  /* Title Section */
  .title-section { padding: 20px 28px 16px; }
  .type-badge {
    display: inline-block;
    background: #e8f0fe;
    color: #035DBA;
    font-size: 11px;
    font-weight: 700;
    padding: 3px 12px;
    border-radius: 20px;
    letter-spacing: 1px;
    text-transform: uppercase;
    margin-bottom: 8px;
  }
  .title-section h2 {
    font-size: 18px;
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 4px;
  }
  .title-section .location {
    font-size: 12px;
    color: #636e72;
  }

  /* Content */
  .content { display: flex; gap: 24px; padding: 0 28px 20px; }
  .col-photo { width: 55%; flex-shrink: 0; }
  .col-details { flex: 1; min-width: 0; }

  .photo-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 6px;
  }
  .photo-grid .photo-cell {
    border-radius: 6px;
    overflow: hidden;
    position: relative;
    aspect-ratio: 4/3;
  }
  .photo-grid .photo-cell.main {
    grid-column: 1 / -1;
    aspect-ratio: 16/9;
  }
  .photo-grid .photo-cell img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  .photo-grid .photo-cell .more-overlay {
    position: absolute;
    inset: 0;
    background: rgba(3, 93, 186, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 14px;
    font-weight: 700;
    text-align: center;
  }

  /* Details Table */
  .details-card table { width: 100%; border-collapse: collapse; font-size: 12px; }
  .details-card tr { border-bottom: 1px solid #e9ecef; }
  .details-card tr:last-child { border-bottom: none; }
  .details-card td { padding: 8px 0; }
  .details-card td:first-child {
    font-weight: 600;
    color: #2d3436;
    white-space: nowrap;
    width: 45%;
    padding-right: 12px;
  }
  .details-card td:last-child { color: #636e72; }

  /* Price */
  .price-section {
    margin: 0 28px;
    padding: 16px 0;
    border-top: 2px solid #035DBA;
    display: flex;
    align-items: baseline;
    gap: 10px;
  }
  .price-section .price-label {
    font-size: 13px;
    color: #035DBA;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .price-section .price-value {
    font-size: 28px;
    font-weight: 800;
    color: #035DBA;
  }
  .price-section .price-currency {
    font-size: 16px;
    font-weight: 600;
    color: #035DBA;
  }

  /* Advisor */
  .advisor-section {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-top: 12px;
    padding: 14px 18px;
    border: 1px solid #e9ecef;
    border-radius: 10px;
  }
  .advisor-section img {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #035DBA;
  }
  .avatar-placeholder {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: #e8f0fe;
    border: 2px solid #035DBA;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .avatar-placeholder svg { width: 28px; height: 28px; }
  .advisor-info .label {
    font-size: 10px;
    color: #b2bec3;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .advisor-info .name {
    font-size: 14px;
    font-weight: 700;
    color: #2d3436;
  }
  .advisor-info .phone {
    font-size: 12px;
    color: #0984e3;
    margin-top: 2px;
  }

  /* Logo */
  .logo-section {
    margin-top: 12px;
    text-align: center;
  }
  .logo-section img {
    max-width: 140px;
    height: auto;
  }

  /* Footer */
  .footer {
    margin-top: 20px;
    padding: 12px 28px;
    border-top: 1px solid #e9ecef;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 10px;
    color: #b2bec3;
  }

  @media print {
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .page { max-width: none; }
    .photo-grid .photo-cell { break-inside: avoid; }
  }
</style>
</head>
<body>
<div class="page">
  <!-- Header -->
  <div class="header">
    <h1>Yenigün Emlak</h1>
  </div>

  <!-- Title Section -->
  <div class="title-section">
    <div class="type-badge">${escapeHtml(typeLabel)}</div>
    <h2>${escapeHtml(ad.title)}</h2>
    <div class="location">${escapeHtml(renderAddressSafely(ad.address))}</div>
  </div>

  <!-- Content: Photo + Details -->
  <div class="content">
    <div class="col-details">
      <div class="details-card">
        <table>${detailRows}</table>
      </div>
    </div>
    <div class="col-photo">
      ${gridPhotos.length > 0 ? `<div class="photo-grid">
        ${gridPhotos.map((p, i) => {
          const isMain = i === 0;
          const isLast = i === gridPhotos.length - 1 && extraCount > 0;
          return `<div class="photo-cell${isMain ? " main" : ""}">
            <img src="${escapeHtml(p)}" alt="Fotoğraf ${i + 1}" />
            ${isLast ? `<div class="more-overlay">+${extraCount} Fotoğraf Daha</div>` : ""}
          </div>`;
        }).join("")}
      </div>` : ""}
      <div class="logo-section">
        <img src="/logo.png" alt="Yenigün Emlak" />
      </div>
      <div class="advisor-section">
        ${advisorPhoto ? `<img src="${escapeHtml(advisorPhoto)}" alt="Danışman" />` : `<div class="avatar-placeholder"><svg viewBox="0 0 24 24" fill="#035DBA" xmlns="http://www.w3.org/2000/svg"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg></div>`}
        <div class="advisor-info">
          <div class="label">Emlak Danışmanı</div>
          <div class="name">${escapeHtml(advisorName)}</div>
          ${customerPhones ? `<div class="phone">Tel: ${escapeHtml(customerPhones)}</div>` : ""}
        </div>
      </div>
    </div>
  </div>

  ${showPrice ? `<!-- Price -->
  <div class="price-section">
    <div class="price-label">Fiyat:</div>
    <div class="price-value">${escapeHtml(String(ad.fee))}</div>
    <div class="price-currency">TL</div>
  </div>` : ""}

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
