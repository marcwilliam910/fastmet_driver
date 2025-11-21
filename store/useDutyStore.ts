import { create } from "zustand";

interface DutyState {
  onDuty: boolean;
  setOnDuty: (v: boolean) => void;
}

export const useDutyStore = create<DutyState>((set) => ({
  onDuty: false,
  setOnDuty: (v) => set({ onDuty: v }),
}));
