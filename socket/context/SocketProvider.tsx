import { useAuth } from "@/hooks/useAuth";
import { useAppStore } from "@/store/useAppStore";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import React, { createContext, useContext, useEffect, useMemo } from "react";
import { Socket } from "socket.io-client";
import {
  bookingTaken,
  pendingBookingsUpdated,
  receiveBookingRequest,
  sendDriverLocation,
} from "../handlers/booking";
import { availabilityChanged, dutyStatusChanged } from "../handlers/duty";
import { getSocket } from "../socket";

interface SocketContextValue {
  socket: Socket<DefaultEventsMap, DefaultEventsMap> | null;
}

export const SocketContext = createContext<SocketContextValue>({
  socket: null,
});

export default function SocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token } = useAuth();
  const onDuty = useAppStore((state) => state.onDuty);
  const socket = useMemo(() => (token ? getSocket(token) : null), [token]);

  // connection
  useEffect(() => {
    if (!socket) return;

    socket.connect();
    console.log("socket connected");

    // // Always-on listeners (like messaging)
    const cleanupDutyStatus = dutyStatusChanged(socket);

    return () => {
      socket.disconnect();
      cleanupDutyStatus();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Add booking listener based on onDuty
  useEffect(() => {
    if (!onDuty || !socket) return;

    const cleanupReceiveBooking = receiveBookingRequest(socket);
    const cleanupPendingBookings = pendingBookingsUpdated(socket);
    const cleanupBookingTaken = bookingTaken(socket);
    const cleanupSendDriverLocation = sendDriverLocation(socket);
    const cleanupAvailabilityChanged = availabilityChanged(socket);

    return () => {
      cleanupReceiveBooking();
      cleanupPendingBookings();
      cleanupBookingTaken();
      cleanupSendDriverLocation();
      cleanupAvailabilityChanged();
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
  if (!context.socket) throw new Error("Socket is not connected");

  return context.socket;
};
