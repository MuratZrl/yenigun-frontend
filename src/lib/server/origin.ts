// src/lib/server/origin.ts
import "server-only";
import { headers } from "next/headers";

/**
 * Server-side'da (Node) absolute URL üretmek için origin döner.
 * Dev: http://localhost:3000
 * Prod: https://www.yenigunemlak.com (proxy/forwarded header’a göre)
 */
export async function getRequestOrigin(): Promise<string> {
  const h = await headers();

  // Bazı proxy'ler virgülle birden fazla değer döndürebilir; ilkini al.
  const protoRaw = h.get("x-forwarded-proto") ?? "http";
  const hostRaw = h.get("x-forwarded-host") ?? h.get("host");

  const proto = protoRaw.split(",")[0].trim() || "http";
  const host = (hostRaw ?? "").split(",")[0].trim();

  if (!host) {
    throw new Error("Host header bulunamadı; origin üretilemedi.");
  }

  return `${proto}://${host}`;
}
