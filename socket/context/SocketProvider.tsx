import { useAppStore } from "@/store/useAppStore";
import React, { createContext, useContext, useEffect } from "react";
import {
  bookingTaken,
  pendingBookingsUpdated,
  receiveBookingRequest,
} from "../handlers/booking";
import { dutyStatusChanged } from "../handlers/duty";
import { getSocket } from "../socket";

interface SocketContextType {
  socket: ReturnType<typeof getSocket>;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export default function SocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const socket = getSocket("driverId", "driver", "token");
  const onDuty = useAppStore((state) => state.onDuty);

  // Activate the query - it will fetch when onDuty becomes true
  // useRequestBookings();

  // connection
  useEffect(() => {
    socket.connect();

    // // Always-on listeners (like messaging)
    dutyStatusChanged(socket);

    return () => {
      socket.disconnect();
      socket.off("dutyStatusChanged");
    };
  }, [socket]);

  // Add booking listener based on onDuty
  useEffect(() => {
    if (onDuty) {
      receiveBookingRequest(socket);
      pendingBookingsUpdated(socket);
      bookingTaken(socket);
    }

    return () => {
      socket.off("new_booking_request");
      socket.off("pendingBookingsUpdated");
      socket.off("bookingTaken");
    };
  }, [onDuty, socket]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) throw new Error("useSocket must be used within SocketProvider");
  return context.socket;
};
