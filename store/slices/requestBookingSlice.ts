import { Booking } from "@/types/booking";
import { StateCreator } from "zustand";

export interface RequestBookingSlice {
  incomingBooking: Booking[];
  addIncomingBooking: (b: Booking) => void;
  setIncomingBooking: (b: Booking[]) => void;
  removeIncomingBooking: (bookingId: string) => void;
  clearIncomingBooking: () => void;
}

export const createRequestBookingSlice: StateCreator<RequestBookingSlice> = (
  set
) => ({
  incomingBooking: [],
  addIncomingBooking: (b) =>
    set((state) => ({ incomingBooking: [b, ...state.incomingBooking] })),
  setIncomingBooking: (b) => set({ incomingBooking: b }),
  removeIncomingBooking: (bookingId) =>
    set((state) => ({
      incomingBooking: state.incomingBooking.filter((i) => i._id !== bookingId),
    })),
  clearIncomingBooking: () => set({ incomingBooking: [] }),
});
