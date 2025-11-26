import { StateCreator } from "zustand";

export interface DutySlice {
  onDuty: boolean;
  setOnDuty: (v: boolean) => void;
}

export const createDutySlice: StateCreator<DutySlice> = (set) => ({
  onDuty: false,
  setOnDuty: (v) => set({ onDuty: v }),
});
