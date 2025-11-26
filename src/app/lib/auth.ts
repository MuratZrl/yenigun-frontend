"use client";

import api from "./api";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  link: string;
}

export interface AuthResponse {
  success: boolean;
  data?: {
    access_token: string;
    user: IUser;
  };
  message?: string;
}

export interface AuthData {
  access_token: string;
  user: IUser;
}

const isClient = (): boolean => {
  return typeof window !== "undefined";
};

export const setClientToken = (token: string, expiresInDays: number = 30): void => {
  if (!isClient()) return;

  const date = new Date();
  date.setTime(date.getTime() + expiresInDays * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  const secureFlag = window.location.protocol === "https:" ? "; Secure" : "";

  document.cookie = `token=${token}; ${expires}; path=/; SameSite=Lax${secureFlag}`;
};

export const getClientToken = (): string | null => {
  if (!isClient()) return null;

  try {
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    return cookieValue || null;
  } catch (error) {
   
    return null;
  }
};

export const removeClientToken = (): void => {
  if (!isClient()) return;

  document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
};

export const setClientUser = (user: IUser): void => {
  if (!isClient()) return;


    localStorage.setItem("user", JSON.stringify(user));
  
};

export const getClientUser = (): IUser | null => {
  if (!isClient()) return null;

  try {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    
    return null;
  }
};

export const removeClientUser = (): void => {
  if (!isClient()) return;

  
    localStorage.removeItem("user");

};

export const setAuthData = (data: AuthData): void => {


  setClientToken(data.access_token);
  setClientUser(data.user);
  
};

export const getCurrentUserId = (): string | null => {
  const user = getClientUser();
  return user?._id || null;
};

export const loginUser = async (mail: string, password: string): Promise<AuthResponse> => {
  try {
    
    const response = await api.post("/user/login", {
      mail,
      password,
    });

   
    if (response.data.success && response.data.data) {
      
      const token = response.data.data.token || response.data.data.access_token;
      
      if (!token) {
        return {
          success: false,
          message: "Sunucudan token alınamadı",
        };
      }

      
      return {
        success: true,
        data: {
          access_token: token,
          user: response.data.data.user
        },
      };
    }

    return {
      success: false,
      message: response.data.message || "Giriş başarısız oldu",
    };

  } catch (err: any) {
    
    if (err.response?.status === 401) {
      return {
        success: false,
        message: "Kullanıcı adı veya şifre hatalı",
      };
    }

    return {
      success: false,
      message: err.response?.data?.message || "Bir hata oluştu. Lütfen tekrar deneyin.",
    };
  }
};

export const logoutUser = (): void => {
  removeClientToken();
  removeClientUser();
  
  window.location.href = "/login";
};

export const checkAuth = async (): Promise<boolean> => {
  try {
    const token = getClientToken();
    
    if (!token) {
      return false;
    }

    const response = await api.get("/user/auth");
    
    return response.data.success;

  } catch (error: any) {
    console.error("Auth check failed:", {
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    });

    if (error.response?.status === 401) {
      removeClientToken();
      removeClientUser();
    }

    return false;
  }
};

export const updateUserProfile = async (userData: Partial<IUser>): Promise<any> => {
  try {
    const response = await api.put("/user/profile", userData);
    
    if (response.data.success && response.data.data.user) {
      setClientUser(response.data.data.user);
    }

    return response.data;

  } catch (error: any) {
     throw error;
  }
};

export const isAuthenticated = async (): Promise<boolean> => {
  return await checkAuth();
};

export const getAuthHeaders = (): { Authorization: string } | {} => {
  const token = getClientToken();
  
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }

  return {};
};

export const clearAuthData = (): void => {
  removeClientToken();
  removeClientUser();
};