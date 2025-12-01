import { fetchActiveBookings } from "@/api/book";
import { useQuery } from "@tanstack/react-query";

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

export const useActiveBookings = (driverId: string) => {
  return useQuery({
    queryKey: ["activeBookings"],
    queryFn: () => fetchActiveBookings(driverId),
  });
};
