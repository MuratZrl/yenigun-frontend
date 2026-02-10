// src/providers/ClientProviders.tsx
"use client";

import React from "react";
import { CookiesProvider } from "react-cookie";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { CategoryProvider } from "@/context/CategoryContext";
import { BreadcrumbProvider } from "@/context/BreadcrumbContext";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CookiesProvider>
      <BreadcrumbProvider>
        <CategoryProvider>
          {children}
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </CategoryProvider>
      </BreadcrumbProvider>
    </CookiesProvider>
  );
}
