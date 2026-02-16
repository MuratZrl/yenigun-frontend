// src/features/auth/ui/LoginPage.client.tsx
"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { EyeClosed, Eye, Mail, Lock, ArrowLeft } from "lucide-react";
import useLogin from "../hooks/useLogin";

export default function LoginPage() {
  const router = useRouter();
  const {
    values,
    setValues,
    isError,
    isLoading,
    isCheckingAuth,
    handleSubmit,
  } = useLogin();

  if (isCheckingAuth) {
    return (
      <div className="h-dvh w-full flex items-center justify-center bg-[#1a2332]">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin h-8 w-8 text-blue-400" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span className="text-white/70 text-sm">Giriş kontrol ediliyor...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-dvh w-full flex items-center justify-center bg-[#1a2332]">
      {/* Background image */}
      <img
        src="/home_1.jpg"
        alt=""
        className="absolute inset-0 object-cover h-full w-full opacity-60 select-none pointer-events-none"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a2332]/60 via-[#1a2332]/40 to-[#1a2332]/70" />

      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="absolute top-6 left-6 z-20 flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Geri
      </button>

      {/* Login card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image
            src="/logo.png"
            alt="Yenigün Emlak"
            width={180}
            height={40}
            className="h-10 w-auto opacity-90"
          />
        </div>

        <div className="bg-[#2f3b4a]/90 backdrop-blur-md border border-white/10 shadow-2xl rounded-2xl p-8 md:p-10">
          <h1 className="text-2xl font-semibold text-center text-white mb-1">
            Hoş Geldiniz
          </h1>
          <p className="text-sm text-white/50 text-center mb-8">
            Devam etmek için giriş yapın
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Email field */}
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                id="email"
                name="email"
                autoComplete="email"
                value={values.username}
                placeholder="E-Posta"
                className="w-full h-12 rounded-lg bg-white/5 border border-white/10 text-white pl-10 pr-4 text-sm outline-none transition-all duration-200 focus:border-blue-400/50 focus:bg-white/10 focus:ring-1 focus:ring-blue-400/25 placeholder:text-white/30"
                onChange={(e) =>
                  setValues({ ...values, username: e.target.value })
                }
                required
              />
            </div>

            {/* Password field */}
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type={values.password.isShow ? "text" : "password"}
                id="password"
                name="password"
                autoComplete="current-password"
                value={values.password.value}
                placeholder="Şifre"
                onChange={(e) =>
                  setValues({
                    ...values,
                    password: { ...values.password, value: e.target.value },
                  })
                }
                className="w-full h-12 rounded-lg bg-white/5 border border-white/10 text-white pl-10 pr-11 text-sm outline-none transition-all duration-200 focus:border-blue-400/50 focus:bg-white/10 focus:ring-1 focus:ring-blue-400/25 placeholder:text-white/30"
                required
              />
              <button
                type="button"
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                onClick={() =>
                  setValues({
                    ...values,
                    password: {
                      ...values.password,
                      isShow: !values.password.isShow,
                    },
                  })
                }
                tabIndex={-1}
              >
                {values.password.isShow ? (
                  <EyeClosed className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Remember me */}
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                name="isRemember"
                checked={values.isRemember}
                onChange={(e) =>
                  setValues({ ...values, isRemember: e.target.checked })
                }
                className="w-4 h-4 rounded bg-white/5 border-white/20 text-blue-500 focus:ring-blue-400/25 focus:ring-offset-0"
              />
              <span className="text-sm text-white/50">Beni Hatırla</span>
            </label>

            {/* Error message */}
            {isError.isOpen && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-300 py-2.5 px-4 rounded-lg text-center text-sm">
                {isError.message}
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="h-12 bg-gradient-to-b from-white/20 via-white/5 to-transparent text-white font-medium rounded-lg border border-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_2px_8px_rgba(0,0,0,0.3)] hover:brightness-110 active:brightness-90 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Giriş Yapılıyor...
                </>
              ) : (
                "Giriş Yap"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
