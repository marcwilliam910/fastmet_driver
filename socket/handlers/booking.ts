import { useDutyStore } from "@/store/useDutyStore";
import { useRequestBookingStore } from "@/store/useRequestBookingStore";
import { Booking } from "@/types/booking";
import { truncate } from "@/utils/format";
import Toast from "react-native-toast-message";
import { Socket } from "socket.io-client";

export const toggleOnDuty = (
  socket: Socket,
  data: { isOnDuty: boolean; location?: { lat: number; lng: number } }
) => {
  socket.emit("toggleDuty", data);
};

export const dutyStatusChanged = (socket: Socket) => {
  socket.on("dutyStatusChanged", (data: { isOnDuty: boolean }) => {
    // ✅ Access store directly without hooks
    useDutyStore.getState().setOnDuty(data.isOnDuty);
  });
};

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
