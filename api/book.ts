import api from "@/lib/axios";
import { Booking } from "@/types/booking";

export async function fetchPendingBookings() {
  const res = await api.get<Booking[]>(`/booking/pending`);
  return res.data;
}
