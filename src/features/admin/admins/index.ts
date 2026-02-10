// src/features/admin/admins/index.ts

// API
export * from "./api/adminUsersApi";

// Hooks
export * from "./hooks/useAdminUsersController";

// Model
export * from "./model/types";
export * from "./model/utils";

// UI (sayfa + parçalar)
export { default as AdminUsersPage } from "./ui/AdminUsersPage.client";

// Components
export { default as UsersHeader } from "./ui/components/UsersHeader";
export { default as UsersFiltersBar } from "./ui/components/UsersFiltersBar";
export { default as UsersDesktopTable } from "./ui/components/UsersDesktopTable";
export { default as UsersMobileList } from "./ui/components/UsersMobileList";

export { default as Avatar } from "./ui/components/Avatar";
export { default as StatusBadge } from "./ui/components/StatusBadge";

// Optional: state helper component (varsa)
export * from "./ui/components/UsersStates";
