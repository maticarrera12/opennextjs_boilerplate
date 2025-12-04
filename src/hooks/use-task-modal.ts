import { create } from "zustand";

export type TaskModalType = "create" | "edit";

interface TaskModalState {
  isOpen: boolean;
  type: TaskModalType;
  data?: any; // Can type this strictly if needed
  onOpen: (type: TaskModalType, data?: any) => void;
  onClose: () => void;
}

export const useTaskModal = create<TaskModalState>((set) => ({
  isOpen: false,
  type: "create",
  data: undefined,
  onOpen: (type, data) => set({ isOpen: true, type, data }),
  onClose: () => set({ isOpen: false, data: undefined }),
}));
