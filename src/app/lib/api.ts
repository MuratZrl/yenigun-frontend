
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_API,
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
});

const getClientToken = (): string | null => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const cookies = document.cookie;
    
    const tokenMatch = cookies
      .split("; ")
      .find((row) => row.startsWith("token="));
    
    if (tokenMatch) {
      const token = tokenMatch.split("=")[1];
      
      return token;
    } else {
      
      return null;
    }
  } catch (error) {
   
    return null;
  }
};

api.interceptors.request.use(
  (config) => {
    
    if (typeof window !== "undefined") {
      const token = getClientToken();
      if (token) {
       
        config.headers.Authorization = `Bearer ${token}`;
      } 
    }

   
    return config;
  },
  (error) => {
    console.error("💥 Request interceptor error:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("📤 Error request:", {
      url: error.config?.url,
      method: error.config?.method,
      headers: error.config?.headers
    });
    return Promise.reject(error);
  }
);

export default api;