import { useRequestBookingStore } from "@/store/useRequestBookingStore";
import { Booking } from "@/types/booking";
import { Socket } from "socket.io-client";

export const toggleOnDuty = (
  socket: Socket,
  data: { isOnDuty: boolean; location?: { lat: number; long: number } }
) => {
  socket.emit("toggleDuty", data);
};

export const receiveBookingRequest = (socket: Socket) => {
  socket.on("new_booking_request", (booking: Booking) => {
    const { addIncomingBooking } = useRequestBookingStore();
    addIncomingBooking(booking);
  });
};
