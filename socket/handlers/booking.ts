import { useRequestBookingStore } from "@/store/useRequestBookingStore";
import { Booking } from "@/types/booking";
import { truncate } from "@/utils/format";
import Toast from "react-native-toast-message";
import { Socket } from "socket.io-client";

export const receiveBookingRequest = (socket: Socket) => {
  socket.on("new_booking_request", (booking: Booking) => {
    // ✅ Access store directly without hooks
    useRequestBookingStore.getState().addIncomingBooking(booking);

    Toast.show({
      type: "bookingRequest",
      text1: "New Booking Request",
      text2: `${truncate(booking.pickUp.address, 15)}  ➜  ${truncate(booking.dropOff.address, 15)}`,
      position: "top",
      visibilityTime: 7000,
      swipeable: true,
      topOffset: 50,
    });
  });
};

export const acceptBooking = (
  socket: Socket,
  payload: {
    bookingId: string;
    driverData: { id: string; name: string; rating: number };
  }
) => {
  socket.emit("acceptBooking", payload);
};

export const pendingBookingsUpdated = (socket: Socket) => {
  socket.on("pendingBookingsUpdated", (data: { bookings: Booking[] }) => {
    useRequestBookingStore.getState().setIncomingBooking(data.bookings);
  });
};
