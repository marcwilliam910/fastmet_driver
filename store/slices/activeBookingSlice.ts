import { Booking } from "@/types/booking";
import { StateCreator } from "zustand";

export interface ActiveBookingSlice {
  activeBooking: Booking | null;
  setActiveBooking: (b: Booking | null) => void;
  clearActiveBooking: () => void;

  navigationStage: "TO_PICKUP" | "TO_DROPOFF";
  setNavigationStage: (stage: "TO_PICKUP" | "TO_DROPOFF") => void;
}

export const createActiveBookingSlice: StateCreator<ActiveBookingSlice> = (
  set
) => ({
  activeBooking: null,
  setActiveBooking: (b) => set({ activeBooking: b }),
  clearActiveBooking: () => set({ activeBooking: null }),

  navigationStage: "TO_PICKUP" as "TO_PICKUP" | "TO_DROPOFF",
  setNavigationStage: (stage) => set({ navigationStage: stage }),
});
