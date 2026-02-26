// src/features/admin/sidebar/data/links.tsx

import React from "react";
import {
  Archive,
  BarChart3,
  BookA,
  Building,
  FileText,
  Home,
  Mail,
  MessageSquareText,
  Send,
  Shield,
  Users,
} from "lucide-react";

import type { SidebarLink } from "../lib/types";

export const adminLinks: SidebarLink[] = [
  {
    key: "emlak",
    name: "Emlak Yönetimi",
    url: "/admin/emlak",
    icon: <Home size={20} />,
    dropdown: [
      {
        key: "emlak-all",
        name: "Tüm İlanlar",
        url: "/admin/emlak",
        icon: <Building size={18} />,
      },
      {
        key: "emlak-archived",
        name: "Arşivlenen İlanlar",
        url: "/admin/emlak/archived",
        icon: <Archive size={18} />,
      },
    ],
  },
  {
    key: "categories",
    name: "Kategori Yönetimi",
    url: "/admin/categories",
    icon: <BookA size={20} />,
  },
  {
    key: "users",
    name: "Müşteri Yönetimi",
    url: "/admin/customers",
    icon: <Users size={20} />,
  },
  {
    key: "admins",
    name: "Yetkili Yönetimi",
    url: "/admin/admins",
    icon: <Shield size={20} />,
  },
  {
    key: "message",
    name: "Mesaj Paneli",
    url: "/admin/message",
    icon: <Mail size={20} />,
  },
  {
    key: "sms-panel",
    name: "SMS Paneli",
    url: "/admin/sms-panel",
    icon: <MessageSquareText size={20} />,
  },
  {
    key: "contracts",
    name: "Sözleşmeler",
    url: "/admin/contracts",
    icon: <FileText size={20} />,
  },
  {
    key: "statistics",
    name: "İstatistikler",
    url: "/admin/statistics",
    icon: <BarChart3 size={20} />,
  },
  {
    key: "mail",
    name: "Mail Giriş",
    url: "https://mail.hostinger.com/",
    icon: <Send size={20} />,
    blank: true,
  },
];
