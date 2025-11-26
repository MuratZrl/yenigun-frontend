"use client";

import { CookiesProvider } from "react-cookie";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CookiesProvider>{children}</CookiesProvider>;
}
