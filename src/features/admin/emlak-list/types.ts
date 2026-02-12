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
} from "../emlak-archived/types";

export { EMPTY_FILTERS } from "../emlak-archived/types";
export type { FilterState } from "../emlak-archived/types";