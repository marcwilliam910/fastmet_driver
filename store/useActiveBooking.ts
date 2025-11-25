import { Booking } from "@/types/booking";
import { create } from "zustand";

interface ActiveBookingState {
  activeBooking: Booking | null;
  setActiveBooking: (b: Booking | null) => void;
  clearActiveBooking: () => void;
}

export const useActiveBookingStore = create<ActiveBookingState>((set) => ({
  activeBooking: null,
  setActiveBooking: (b) => set({ activeBooking: b }),
  clearActiveBooking: () => set({ activeBooking: null }),
}));
