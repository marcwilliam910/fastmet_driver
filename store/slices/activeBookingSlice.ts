import { Booking } from "@/types/booking";
import { StateCreator } from "zustand";

export interface ActiveBookingSlice {
  activeBooking: Booking | null;
  setActiveBooking: (b: Booking | null) => void;
  clearActiveBooking: () => void;
}

export const createActiveBookingSlice: StateCreator<ActiveBookingSlice> = (
  set
) => ({
  activeBooking: null,
  setActiveBooking: (b) => set({ activeBooking: b }),
  clearActiveBooking: () => set({ activeBooking: null }),
});
