import { useRequestBookings } from "@/queries/bookingQueries";
import { useDutyStore } from "@/store/useDutyStore";
import React, { createContext, useContext, useEffect } from "react";
import { receiveBookingRequest } from "../handlers/booking";
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
  const onDuty = useDutyStore((state) => state.onDuty); // ✅ Totally fine!

  // Activate the query - it will fetch when onDuty becomes true
  useRequestBookings();

  // connection
  useEffect(() => {
    socket.connect();

    // // Always-on listeners (like messaging)

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  // Add booking listener based on onDuty
  useEffect(() => {
    if (onDuty) {
      receiveBookingRequest(socket);
    } else {
      socket.off("new_booking_request");
    }

    return () => {
      socket.off("new_booking_request");
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
