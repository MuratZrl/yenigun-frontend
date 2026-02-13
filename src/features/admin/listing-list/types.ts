// src/features/admin/emlak-list/types.ts

// Re-export shared types — same Advert shape
export type {
  Advert,
  AdvertAddress,
  AdvertCustomer,
  AdvertAdvisor,
  AdminNoteModal,
  DeleteConfirmModal,
  AdUserNotesModal,
} from "../listing-archived/types";

export { EMPTY_FILTERS } from "../listing-archived/types";
export type { FilterState } from "../listing-archived/types";