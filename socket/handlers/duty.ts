import { useAppStore } from "@/store/useAppStore";
import { Booking } from "@/types/booking";
import { Socket } from "socket.io-client";

export const toggleOnDuty = (
  socket: Socket,
  data: { isOnDuty: boolean; location?: { lat: number; lng: number } }
) => {
  socket.emit("toggleOnDuty", data);
};

export const dutyStatusChanged = (socket: Socket) => {
  const dutyStatusChangedHandler = (data: {
    isOnDuty: boolean;
    pendingBookings?: Booking[];
  }) => {
    // ✅ Access store directly without hooks
    useAppStore.getState().setOnDuty(data.isOnDuty);

    if (data.pendingBookings && data.isOnDuty) {
      useAppStore.getState().setIncomingBooking(data.pendingBookings);
    }
  };
  socket.on("dutyStatusChanged", dutyStatusChangedHandler);

  return () => {
    socket.off("dutyStatusChanged", dutyStatusChangedHandler);
  };
};

export const updateLocation = (
  socket: Socket,
  location: { lat: number; lng: number }
) => {
  socket.emit("updateLocation", location);
};
