// src/features/admin/users/index.ts

// API (sadece runtime exportlar, type çakışmasını engeller)
export {
  usersApi,
  listCustomers,
  listAllCustomers,
  searchCustomersByNote,
  deleteCustomer,
} from "./api/usersApi";

// Hooks
export * from "./hooks/useUsersController";

// Model (types tek kaynak)
export * from "./model/types";
export * from "./model/utils";

// UI (page)
export { default as CustomersPage } from "./ui/CustomersPage.client";

// UI Components
export { default as CustomersHeader } from "./ui/components/CustomersHeader";
export { default as CustomersSearchBar } from "./ui/components/CustomersSearchBar";
export { default as CustomersNoteSearchBar } from "./ui/components/CustomersNoteSearchBar";
export { default as CustomersActiveFilterBanner } from "./ui/components/CustomersActiveFilterBanner";

export { default as CustomersStates } from "./ui/components/CustomersStates";
export { default as CustomersGrid } from "./ui/components/CustomersGrid";
export { default as CustomersTable } from "./ui/components/CustomersTable";

export { default as CustomerCard } from "./ui/components/CustomerCard";
export { default as CustomersTableRow } from "./ui/components/CustomersTableRow";
