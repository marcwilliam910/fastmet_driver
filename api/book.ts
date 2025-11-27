import api from "@/lib/axios";
import { ActiveBooking, Booking } from "@/types/booking";

// TODO: DELETE
export async function fetchPendingBookings() {
  const res = await api.get<Booking[]>(`/booking/pending`);
  return res.data;
}

export async function fetchActiveBookings(
  driverId: string
): Promise<ActiveBooking[]> {
  const res = await api.get<ActiveBooking[]>(`/booking/active/${driverId}`);
  return res.data;
}
