import api from "@/lib/axios";
import { ActiveBooking, Booking } from "@/types/booking";

// TODO: DELETE
// export async function fetchPendingBookings() {
//   const res = await api.get<Booking[]>(`/booking/pending`);
//   return res.data;
// }

export async function fetchActiveBooking(
  driverId: string
): Promise<ActiveBooking> {
  const res = await api.get<ActiveBooking>(`/booking/active/${driverId}`);
  return res.data;
}

export const getDriverCompletedBookings = async (
  driverId: string,
  page = 1,
  limit = 5
): Promise<{ bookings: Booking[]; nextPage: number | null }> => {
  const res = await api.get<{ bookings: Booking[]; nextPage: number | null }>(
    `/booking/completed/${driverId}`,
    { params: { page, limit } }
  );

  return res.data;
};
