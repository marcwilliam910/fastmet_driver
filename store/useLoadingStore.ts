import { create } from "zustand";

export const useLoadingStore = create<{
  isLoading: boolean;
  setLoading: (isLoading: boolean) => void;
}>((set) => ({
  isLoading: false,
  setLoading: (isLoading: boolean) => set({ isLoading }),
}));
