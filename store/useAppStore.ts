import { create } from "zustand";
import {
  ActiveBookingSlice,
  createActiveBookingSlice,
} from "./slices/activeBookingSlice";
import {
  createDriverLocationSlice,
  DriverLocationSlice,
} from "./slices/driverLocSlice";
import { createDutySlice, DutySlice } from "./slices/dutySlice";
import { createLoadingSlice, LoadingSlice } from "./slices/loadingStore";
import {
  createRequestBookingSlice,
  RequestBookingSlice,
} from "./slices/requestBookingSlice";

export type AppStore = RequestBookingSlice &
  DutySlice &
  ActiveBookingSlice &
  LoadingSlice &
  DriverLocationSlice;

export const useAppStore = create<AppStore>()((...a) => ({
  ...createRequestBookingSlice(...a),
  ...createDutySlice(...a),
  ...createActiveBookingSlice(...a),
  ...createLoadingSlice(...a),
  ...createDriverLocationSlice(...a),
}));
