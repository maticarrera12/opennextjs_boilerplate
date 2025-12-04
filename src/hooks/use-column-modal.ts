import { create } from "zustand";

export type ColumnModalType = "create" | "edit";

interface ColumnModalState {
  isOpen: boolean;
  type: ColumnModalType;
  data?: { id: string; title: string; color?: string | null };
  onOpen: (
    type: ColumnModalType,
    data?: { id: string; title: string; color?: string | null }
  ) => void;
  onClose: () => void;
}

export const useColumnModal = create<ColumnModalState>((set) => ({
  isOpen: false,
  type: "create",
  data: undefined,
  onOpen: (type, data) => set({ isOpen: true, type, data }),
  onClose: () => set({ isOpen: false, data: undefined }),
}));
