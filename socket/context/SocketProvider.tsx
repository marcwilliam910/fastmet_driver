import { useAppStore } from "@/store/useAppStore";
import React, { createContext, useContext, useEffect } from "react";
import {
  bookingTaken,
  pendingBookingsUpdated,
  receiveBookingRequest,
  sendDriverLocation,
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
  const socket = getSocket("123", "driver", "token");
  const onDuty = useAppStore((state) => state.onDuty);

  // connection
  useEffect(() => {
    socket.connect();

    // // Always-on listeners (like messaging)
    const cleanupDutyStatus = dutyStatusChanged(socket);

    return () => {
      socket.disconnect();
      cleanupDutyStatus();
    };
  }, [socket]);

  // Add booking listener based on onDuty
  useEffect(() => {
    if (!onDuty) return;

    const cleanupReceiveBooking = receiveBookingRequest(socket);
    const cleanupPendingBookings = pendingBookingsUpdated(socket);
    const cleanupBookingTaken = bookingTaken(socket);
    const cleanupSendDriverLocation = sendDriverLocation(socket);

    return () => {
      cleanupReceiveBooking();
      cleanupPendingBookings();
      cleanupBookingTaken();
      cleanupSendDriverLocation();
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
