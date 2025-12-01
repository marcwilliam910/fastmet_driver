import { useAppStore } from "@/store/useAppStore";
import { Booking } from "@/types/booking";
import { truncate } from "@/utils/format";
import Toast from "react-native-toast-message";
import { Socket } from "socket.io-client";

export const receiveBookingRequest = (socket: Socket) => {
  const newBookingRequestHandler = (booking: Booking) => {
    // ✅ Access store directly without hooks
    useAppStore.getState().addIncomingBooking(booking);

    Toast.show({
      type: "bookingRequest",
      text1: "New Booking Request",
      text2: `${truncate(booking.pickUp.address, 15)}  ➜  ${truncate(booking.dropOff.address, 15)}`,
      position: "top",
      visibilityTime: 10_000,
      swipeable: true,
      topOffset: 50,
    });
  };
  socket.on("new_booking_request", newBookingRequestHandler);

  return () => {
    socket.off("new_booking_request", newBookingRequestHandler);
  };
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
  const pendingBookingHandler = (data: { bookings: Booking[] }) => {
    useAppStore.getState().setIncomingBooking(data.bookings);
  };

  socket.on("pendingBookingsUpdated", pendingBookingHandler);

  return () => {
    socket.off("pendingBookingsUpdated", pendingBookingHandler);
  };
};

export const bookingTaken = (socket: Socket) => {
  const bookingTakenHandler = ({ bookingId }: { bookingId: string }) => {
    useAppStore.getState().removeIncomingBooking(bookingId);
  };

  socket.on("bookingTaken", bookingTakenHandler);

  return () => {
    socket.off("bookingTaken", bookingTakenHandler);
  };
};

export const sendDriverLocation = (socket: Socket) => {
  const handleLocationRequest = ({
    bookingId,
    clientUserId,
  }: {
    bookingId: string;
    clientUserId: string;
  }) => {
    console.log("handleLocationRequest called");
    if (!bookingId || !clientUserId) return;

    console.log("📥 Client requested driver location for booking:", bookingId);

    // Get current active booking and driver location from Zustand
    const { activeBooking, driverLocation } = useAppStore.getState();

    console.log("ACTIVE ID: ", activeBooking);
    console.log("BOOKING ID: ", bookingId);

    // ✅ Security: Only send location if this is the driver's active booking
    if (activeBooking?._id !== bookingId) {
      console.log("⚠️ Booking ID mismatch, ignoring request");
      return;
    }

    if (!driverLocation) {
      console.log("⚠️ Driver location not available");
      return;
    }

    console.log("📤 Sending driver location to client");

    socket.emit("driverLocation", {
      bookingId,
      clientUserId,
      driverLoc: driverLocation,
    });
  };

  socket.on("requestDriverLocation", handleLocationRequest);

  return () => socket.off("requestDriverLocation", handleLocationRequest);
};
