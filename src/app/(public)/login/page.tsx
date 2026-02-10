// src/app/login/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import { Poppins } from "next/font/google";
import { EyeClosed, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { loginUser, setAuthData, checkAuth } from "@/lib/auth";

const PoppinsFont = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const Login = () => {
  const router = useRouter();
  const [values, setValues] = useState({
    username: "",
    password: {
      value: "",
      isShow: false,
    },
    isRemember: true,
  });
  const [isError, setIsError] = useState({
    isOpen: false,
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkUserAuth = async () => {
      try {
        console.log("Checking initial auth...");
        const isAuthenticated = await checkAuth();
        console.log("Auth result:", isAuthenticated);

        if (isAuthenticated) {
          router.push("/admin/emlak");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkUserAuth();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setIsError({ isOpen: false, message: "" });

    try {
      console.log("🚀 Login form submitted with:", {
        username: values.username,
        passwordLength: values.password.value.length,
      });

      const result = await loginUser(values.username, values.password.value);
      console.log("📋 Login result:", result);

      if (result.success && result.data) {
        console.log("✅ Login successful, setting auth data...");

        if (!result.data.access_token) {
          console.error("❌ No access_token in result data");
          setIsError({
            isOpen: true,
            message: "Giriş başarılı ama token alınamadı",
          });
          return;
        }

        setAuthData(result.data);

        console.log("🔄 Redirecting in 1 second...");
        setTimeout(() => {
          router.push("/admin/emlak");
        }, 1000);
      } else {
        console.log("❌ Login failed:", result.message);
        setIsError({
          isOpen: true,
          message: result.message || "Giriş başarısız oldu",
        });
      }
    } catch (error) {
      console.error("💥 Login process error:", error);
      setIsError({
        isOpen: true,
        message: "Giriş sırasında bir hata oluştu",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-900">
        <div className="text-white text-lg">Giriş kontrol ediliyor...</div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full flex items-center justify-center bg-gray-900">
      <img
        src="/home_1.jpg"
        alt="login background"
        className="absolute inset-0 object-cover h-full w-full opacity-50 select-none"
      />
      <div
        className="relative z-10 bg-gray-900/80 backdrop-blur-sm border text-white border-custom-orange shadow-2xl p-8 md:p-10 rounded-xl w-full max-w-md mx-4"
        style={PoppinsFont.style}
      >
        <h1 className="text-3xl font-semibold text-center mb-6">Giriş Yap</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Form içeriği aynı */}
          <div className="relative">
            <input
              type="email"
              id="email"
              name="email"
              autoComplete="email"
              value={values.username}
              className="py-3 px-4 w-full border-b focus:outline-none text-white border-custom-orange-dark bg-transparent rounded-t-md"
              onChange={(e) =>
                setValues({ ...values, username: e.target.value })
              }
              required
            />
            <label
              htmlFor="email"
              className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                values.username
                  ? "text-custom-orange text-sm -top-5"
                  : "text-gray-400 top-3"
              }`}
            >
              E-Posta
            </label>
          </div>

          <div className="relative">
            <input
              type={values.password.isShow ? "text" : "password"}
              id="password"
              name="password"
              autoComplete="current-password"
              value={values.password.value}
              onChange={(e) =>
                setValues({
                  ...values,
                  password: { ...values.password, value: e.target.value },
                })
              }
              className="py-3 px-4 pr-10 w-full border-b focus:outline-none text-white border-custom-orange-dark bg-transparent rounded-t-md"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-3 text-gray-400 hover:text-white transition-colors"
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
              {values.password.isShow ? <EyeClosed /> : <Eye />}
            </button>
            <label
              htmlFor="password"
              className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                values.password.value
                  ? "text-custom-orange text-sm -top-5"
                  : "text-gray-400 top-3"
              }`}
            >
              Şifre
            </label>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isRemember"
                checked={values.isRemember}
                onChange={(e) =>
                  setValues({ ...values, isRemember: e.target.checked })
                }
                className="w-4 h-4 text-custom-orange bg-gray-800 rounded focus:ring-custom-orange"
              />
              <span className="text-sm">Beni Hatırla</span>
            </label>
          </div>

          {isError.isOpen && (
            <div className="bg-red-900/50 text-red-300 py-2 px-4 rounded-md text-center text-sm">
              {isError.message}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="py-3 px-4 bg-custom-orange text-black font-medium rounded-md hover:bg-custom-orange-dark hover:text-white transition-colors duration-300 flex items-center justify-center gap-2"
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
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
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
  );
};

export default Login;
