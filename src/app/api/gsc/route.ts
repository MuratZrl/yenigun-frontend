// src/app/api/gsc/route.ts
import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

/* ──────────── In-memory cache ──────────── */

type CacheEntry = {
  data: unknown;
  timestamp: number;
};

const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

/* ──────────── GSC Auth ──────────── */

function getGSCClient() {
  const clientEmail = process.env.GSC_CLIENT_EMAIL;
  const privateKey = process.env.GSC_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!clientEmail || !privateKey) {
    throw new Error("GSC credentials not configured");
  }

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/webmasters.readonly"],
  });

  return google.webmasters({ version: "v3", auth });
}

/* ──────────── Helpers ──────────── */

type Dimension = "query" | "page" | "device" | "country" | "date";

interface GSCQueryParams {
  siteUrl: string;
  startDate: string;
  endDate: string;
  dimensions?: Dimension[];
  rowLimit?: number;
}

async function querySearchAnalytics(params: GSCQueryParams) {
  const client = getGSCClient();
  const res = await client.searchanalytics.query({
    siteUrl: params.siteUrl,
    requestBody: {
      startDate: params.startDate,
      endDate: params.endDate,
      dimensions: params.dimensions ?? [],
      rowLimit: params.rowLimit ?? 1000,
    },
  });
  return res.data;
}

function getDateRange(period: string): { startDate: string; endDate: string } {
  const end = new Date();
  end.setDate(end.getDate() - 2); // GSC data has ~2-day lag

  let daysBack = 28;
  if (period === "1d") daysBack = 1;
  else if (period === "7d") daysBack = 7;
  else if (period === "90d") daysBack = 90;
  else if (period === "28d") daysBack = 28;

  const start = new Date(end);
  start.setDate(start.getDate() - daysBack + 1);

  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  return { startDate: fmt(start), endDate: fmt(end) };
}

/* ──────────── GET handler ──────────── */

export async function GET(req: NextRequest) {
  // Auth guard: require admin token
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = req.nextUrl;
    const period = searchParams.get("period") || "28d";
    const siteUrl =
      process.env.GSC_SITE_URL || "https://www.yenigunemlak.com";
    const { startDate, endDate } = getDateRange(period);

    // First, list available sites to find the correct siteUrl
    const client = getGSCClient();
    const sitesRes = await client.sites.list();
    const availableSites = sitesRes.data.siteEntry?.map((s) => s.siteUrl) ?? [];
    console.log("GSC available sites:", availableSites);

    // Try to find the matching site URL
    let resolvedSiteUrl = siteUrl;
    if (availableSites.length > 0 && !availableSites.includes(siteUrl)) {
      // Try common variants
      const variants = [
        siteUrl,
        "sc-domain:yenigunemlak.com",
        "https://yenigunemlak.com/",
        "https://www.yenigunemlak.com/",
        "https://yenigunemlak.com",
        "https://www.yenigunemlak.com",
        "http://yenigunemlak.com/",
        "http://www.yenigunemlak.com/",
      ];
      const match = variants.find((v) => availableSites.includes(v));
      if (match) {
        resolvedSiteUrl = match;
        console.log("GSC resolved siteUrl:", resolvedSiteUrl);
      } else {
        // Use the first available site as fallback
        resolvedSiteUrl = availableSites[0] ?? siteUrl;
        console.log("GSC fallback to first available site:", resolvedSiteUrl);
      }
    }

    // Check cache
    const cacheKey = `${period}-${startDate}-${endDate}-${resolvedSiteUrl}`;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return NextResponse.json({
        success: true,
        period,
        startDate,
        endDate,
        data: cached.data,
        cached: true,
      });
    }

    // Fire all 6 queries in parallel
    const [totals, byDate, byPage, byDevice, byQuery, byCountry] =
      await Promise.all([
        // 1. Totals (no dimensions)
        querySearchAnalytics({ siteUrl: resolvedSiteUrl, startDate, endDate }),

        // 2. By date — for trend chart
        querySearchAnalytics({
          siteUrl: resolvedSiteUrl,
          startDate,
          endDate,
          dimensions: ["date"],
        }),

        // 3. By page — top clicked pages (fetch more so client can filter for advert pages)
        querySearchAnalytics({
          siteUrl: resolvedSiteUrl,
          startDate,
          endDate,
          dimensions: ["page"],
          rowLimit: 100,
        }),

        // 4. By device — device distribution
        querySearchAnalytics({
          siteUrl: resolvedSiteUrl,
          startDate,
          endDate,
          dimensions: ["device"],
        }),

        // 5. By query — popular search terms
        querySearchAnalytics({
          siteUrl: resolvedSiteUrl,
          startDate,
          endDate,
          dimensions: ["query"],
          rowLimit: 10,
        }),

        // 6. By country — search by country
        querySearchAnalytics({
          siteUrl: resolvedSiteUrl,
          startDate,
          endDate,
          dimensions: ["country"],
          rowLimit: 10,
        }),
      ]);

    const data = {
      totals: totals.rows?.[0] ?? null,
      byDate: byDate.rows ?? [],
      byPage: byPage.rows ?? [],
      byDevice: byDevice.rows ?? [],
      byQuery: byQuery.rows ?? [],
      byCountry: byCountry.rows ?? [],
    };

    // Store in cache
    cache.set(cacheKey, { data, timestamp: Date.now() });

    return NextResponse.json({
      success: true,
      period,
      startDate,
      endDate,
      data,
    });
  } catch (err: unknown) {
    // Extract detailed error info for debugging
    const gaxiosErr = err as {
      message?: string;
      code?: string | number;
      response?: { status?: number; statusText?: string; data?: unknown };
      errors?: unknown[];
    };

    const status = gaxiosErr.response?.status;
    const message = gaxiosErr.message ?? "GSC API error";
    const details = gaxiosErr.response?.data ?? gaxiosErr.errors ?? null;

    console.error("GSC API error:", {
      message,
      status,
      details: JSON.stringify(details, null, 2),
    });

    // Provide actionable error messages
    let userMessage = message;
    if (status === 403) {
      userMessage =
        "Erisim reddedildi (403). Servis hesabi Google Search Console'a eklenmemis olabilir.";
    } else if (status === 401) {
      userMessage =
        "Kimlik dogrulamasi basarisiz (401). Servis hesabi bilgileri hatali olabilir.";
    } else if (message.includes("error:1E08010C") || message.includes("DECODER")) {
      userMessage =
        "Private key formati hatali. .env.local dosyasindaki GSC_PRIVATE_KEY degerini kontrol edin.";
    }

    return NextResponse.json(
      { success: false, error: userMessage, debug: { status, message } },
      { status: 500 }
    );
  }
}
