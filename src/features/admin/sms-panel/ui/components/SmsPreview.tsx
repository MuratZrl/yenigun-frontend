// src/features/admin/sms-panel/ui/components/SmsPreview.tsx
"use client";

import React from "react";
import {
  Smartphone,
  ChevronLeft,
  Phone,
  MoreVertical,
  Send,
  Paperclip,
  Smile,
  Signal,
  Battery,
  Wifi,
} from "lucide-react";

type Props = {
  message: string;
  charCount: number;
  smsSegments: number;
};

export default function SmsPreview({ message, charCount, smsSegments }: Props) {
  const now = new Date();
  const timeStr = now.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Smartphone size={18} className="text-gray-500" />
        <h3 className="text-sm font-semibold text-gray-700">Mesaj Önizleme</h3>
      </div>

      {/* Phone mockup */}
      <div className="mx-auto w-72">
        <div className="bg-gray-900 rounded-[2.5rem] p-3 shadow-xl">
          {/* Notch */}
          <div className="flex justify-center mb-1">
            <div className="w-28 h-6 bg-gray-900 rounded-b-2xl relative flex items-center justify-center">
              <div className="w-3 h-3 bg-gray-800 rounded-full border-2 border-gray-700" />
            </div>
          </div>

          {/* Screen */}
          <div className="bg-white rounded-2xl overflow-hidden min-h-[460px] flex flex-col">
            {/* Status bar */}
            <div className="bg-blue-900 px-4 py-1.5 flex items-center justify-between">
              <span className="text-white text-[10px] font-medium">{timeStr}</span>
              <div className="flex items-center gap-1.5">
                <Signal size={10} className="text-white" />
                <Wifi size={10} className="text-white" />
                <Battery size={10} className="text-white" />
              </div>
            </div>

            {/* App header */}
            <div className="bg-blue-900 px-3 pb-3 flex items-center gap-2">
              <ChevronLeft size={20} className="text-white/70" />
              <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                YE
              </div>  
              <div className="flex-1 min-w-0">
                <div className="text-white text-xs font-semibold">Yenigün Emlak</div>
                <div className="text-blue-300 text-[10px]">İş numarası</div>
              </div>
              <Phone size={16} className="text-white/70" />
              <MoreVertical size={16} className="text-white/70" />
            </div>

            {/* Message area */}
            <div className="flex-1 px-3 py-2 bg-gray-100 flex flex-col justify-end gap-1.5"
              style={{
                backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e5e7eb' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
              }}
            >
              {message ? (
                <>
                  {/* Date label */}
                  <div className="flex justify-center mb-1">
                    <span className="text-[9px] text-gray-500 bg-white/80 px-2.5 py-0.5 rounded-full shadow-sm">
                      Bugün
                    </span>
                  </div>

                  {/* Message bubble */}
                  <div className="flex justify-start">
                    <div className="bg-white text-gray-800 text-[11px] leading-relaxed p-2.5 rounded-xl rounded-tl-sm max-w-[85%] break-words shadow-sm">
                      <p>{message}</p>
                      <div className="flex items-center justify-end gap-1 mt-1">
                        <span className="text-[9px] text-gray-400">{timeStr}</span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-gray-400 text-xs text-center">
                  Mesaj yazarak önizleme görün
                </div>
              )}
            </div>

            {/* Message input bar */}
            <div className="bg-white border-t border-gray-200 px-2 py-2 flex items-center gap-2">
              <Smile size={18} className="text-gray-400 flex-shrink-0" />
              <div className="flex-1 bg-gray-100 rounded-full px-3 py-1.5 flex items-center justify-between">
                <span className="text-[10px] text-gray-400">Mesaj yazın...</span>
                <Paperclip size={14} className="text-gray-400" />
              </div>
              <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                <Send size={12} className="text-white ml-0.5" />
              </div>
            </div>

            {/* Character info */}
            <div className="px-3 py-1.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
              <span className="text-[9px] text-gray-400">
                {charCount} / 160 karakter
              </span>
              <span className="text-[9px] text-gray-400">
                {smsSegments} SMS
              </span>
            </div>
          </div>

          {/* Home bar */}
          <div className="flex justify-center mt-2">
            <div className="w-16 h-1 bg-gray-600 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
