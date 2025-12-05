import { fetchActiveBooking, getDriverCompletedBookings } from "@/api/book";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

// TODO: DELETE
// export const useRequestBookings = () => {
//   const isOnDuty = useAppStore((state) => state.onDuty);
//   const wasOnDuty = useRef(false);

//   const query = useQuery({
//     queryKey: ["requestBookings"],
//     queryFn: fetchPendingBookings,
//     enabled: false, // Disable automatic fetching
//   });

//   useEffect(() => {
//     // Only fetch when transitioning from false to true
//     if (isOnDuty && !wasOnDuty.current) {
//       query.refetch();
//     }
//     wasOnDuty.current = isOnDuty;
//   }, [isOnDuty, query]);

//   useEffect(() => {
//     if (query.data && query.dataUpdatedAt) {
//       useAppStore.getState().setIncomingBooking(query.data);
//     }
//   }, [query.data, query.dataUpdatedAt]);

//   useEffect(() => {
//     if (query.error) {
//       console.error("Failed to fetch pending bookings:", query.error);
//     }
//   }, [query.error]);
// };

export const useActiveBooking = (driverId: string) => {
  return useQuery({
    queryKey: ["activeBooking"],
    queryFn: () => fetchActiveBooking(driverId),
  });
};

export const useDriverCompletedBookings = (driverId: string, limit: number) => {
  return useInfiniteQuery({
    queryKey: ["completedBookings", driverId],
    queryFn: ({ pageParam = 1 }) =>
      getDriverCompletedBookings(driverId, pageParam, limit),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
  });
};
