import { useDutyStore } from "@/store/useDutyStore";
import { useRequestBookingStore } from "@/store/useRequestBookingStore";
import { Booking } from "@/types/booking";
import { Socket } from "socket.io-client";

export const toggleOnDuty = (
  socket: Socket,
  data: { isOnDuty: boolean; location?: { lat: number; lng: number } }
) => {
  socket.emit("toggleOnDuty", data);
};

export const dutyStatusChanged = (socket: Socket) => {
  socket.on(
    "dutyStatusChanged",
    (data: { isOnDuty: boolean; pendingBookings?: Booking[] }) => {
      // ✅ Access store directly without hooks
      useDutyStore.getState().setOnDuty(data.isOnDuty);

      if (data.pendingBookings && data.isOnDuty) {
        useRequestBookingStore
          .getState()
          .setIncomingBooking(data.pendingBookings);
      }
    }
  );
};

export const updateLocation = (
  socket: Socket,
  location: { lat: number; lng: number }
) => {
  socket.emit("updateLocation", location);
};
