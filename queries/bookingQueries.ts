import { fetchPendingBookings } from "@/api/book";
import { useDutyStore } from "@/store/useDutyStore";
import { useRequestBookingStore } from "@/store/useRequestBookingStore";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

// TODO: DELETE
export const useRequestBookings = () => {
  const isOnDuty = useDutyStore((state) => state.onDuty);
  const wasOnDuty = useRef(false);

  const query = useQuery({
    queryKey: ["requestBookings"],
    queryFn: fetchPendingBookings,
    enabled: false, // Disable automatic fetching
  });

  useEffect(() => {
    // Only fetch when transitioning from false to true
    if (isOnDuty && !wasOnDuty.current) {
      query.refetch();
    }
    wasOnDuty.current = isOnDuty;
  }, [isOnDuty, query]);

  useEffect(() => {
    if (query.data && query.dataUpdatedAt) {
      useRequestBookingStore.getState().setIncomingBooking(query.data);
    }
  }, [query.data, query.dataUpdatedAt]);

  useEffect(() => {
    if (query.error) {
      console.error("Failed to fetch pending bookings:", query.error);
    }
  }, [query.error]);
};
