import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createSecureStorage } from "./secureStorage";
import {
  ActiveBookingSlice,
  createActiveBookingSlice,
} from "./slices/activeBookingSlice";
import { AuthSlice, createAuthSlice } from "./slices/authSlice";
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
  DriverLocationSlice &
  AuthSlice;

export const useAppStore = create<AppStore>()(
  persist(
    (...a) => ({
      ...createRequestBookingSlice(...a),
      ...createDutySlice(...a),
      ...createActiveBookingSlice(...a),
      ...createLoadingSlice(...a),
      ...createDriverLocationSlice(...a),
      ...createAuthSlice(...a),
    }),
    {
      name: "fastmet-driver-storage",
      storage: createSecureStorage<{
        phoneNumber: string;
        token: string | null;
        id: string | null;
        registrationStep: number | null;
        approvalStatus: string | null;
        name: string | null;
        email: string | null;
        vehicle: string | null;
        license: string | null;
      }>(),

      partialize: (state) => ({
        phoneNumber: state.phoneNumber,
        token: state.token ?? null,
        id: state.id ?? null,
        registrationStep: state.registrationStep ?? null,
        approvalStatus: state.approvalStatus ?? null,
        name: state.name ?? null,
        email: state.email ?? null,
        vehicle: state.vehicle ?? null,
        license: state.license ?? null,
      }),
    }
  )
);

// export const useAppStore = create<AppStore>()((...a) => ({
//   ...createRequestBookingSlice(...a),
//   ...createDutySlice(...a),
//   ...createActiveBookingSlice(...a),
//   ...createLoadingSlice(...a),
//   ...createDriverLocationSlice(...a),
//   ...createAuthSlice(...a),
// }));

// No persist middleware - state resets on app restart
