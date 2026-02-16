// src/features/admin/statistics/ui/components/audience/SessionsByCountryCard.client.tsx
"use client";

import { Globe } from "lucide-react";

const countries = [
  { name: "Türkiye", flag: "🇹🇷", sessions: 14230, percent: 82, color: "#1f2937" },
  { name: "Almanya", flag: "🇩🇪", sessions: 1240, percent: 7, color: "#3b82f6" },
  { name: "ABD", flag: "🇺🇸", sessions: 860, percent: 5, color: "#8b5cf6" },
  { name: "Birleşik Krallık", flag: "🇬🇧", sessions: 520, percent: 3, color: "#06b6d4" },
  { name: "Diğer", flag: "🌍", sessions: 490, percent: 3, color: "#9ca3af" },
];

const totalSessions = countries.reduce((a, c) => a + c.sessions, 0);

export default function SessionsByCountryCard() {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 h-full">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-semibold text-gray-900">
          Ülkelere Göre Oturumlar
        </h3>
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <Globe size={14} />
          <span>{totalSessions.toLocaleString("tr-TR")} toplam</span>
        </div>
      </div>

      {/* Stacked bar */}
      <div className="flex h-3 rounded-full overflow-hidden mb-6">
        {countries.map((c) => (
          <div
            key={c.name}
            style={{ width: `${c.percent}%`, backgroundColor: c.color }}
            className="transition-all duration-500 first:rounded-l-full last:rounded-r-full"
          />
        ))}
      </div>

      {/* Country list */}
      <div className="space-y-3">
        {countries.map((country) => (
          <div
            key={country.name}
            className="flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg leading-none">{country.flag}</span>
              <div>
                <p className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                  {country.name}
                </p>
                <p className="text-xs text-gray-400">
                  {country.sessions.toLocaleString("tr-TR")} oturum
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-20 bg-gray-100 rounded-full h-1.5">
                <div
                  className="h-1.5 rounded-full transition-all duration-500"
                  style={{
                    width: `${country.percent}%`,
                    backgroundColor: country.color,
                  }}
                />
              </div>
              <span className="text-sm font-semibold text-gray-900 w-10 text-right">
                %{country.percent}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
