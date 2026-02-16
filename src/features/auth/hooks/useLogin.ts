// src/features/auth/hooks/useLogin.ts
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginUser, setAuthData, checkAuth } from "@/lib/auth";

export default function useLogin() {
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
          router.replace("/");
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

        await setAuthData(result.data);

        router.replace("/");
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

  return {
    values,
    setValues,
    isError,
    isLoading,
    isCheckingAuth,
    handleSubmit,
  };
}
