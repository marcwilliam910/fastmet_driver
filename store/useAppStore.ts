import { create } from "zustand";
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

// export const useAppStore = create<AppStore>()(
//   persist(
//     (...a) => ({
//       ...createRequestBookingSlice(...a),
//       ...createDutySlice(...a),
//       ...createActiveBookingSlice(...a),
//       ...createLoadingSlice(...a),
//       ...createDriverLocationSlice(...a),
//       ...createAuthSlice(...a),
//     }),
//     {
//       name: "fastmet-driver-storage",
//       storage: createSecureStorage<AppStore>(),
//       // Only persist auth data (prevents persisting temporary data)
//       // @ts-ignore - partialize is valid but type might be strict

//       partialize: (state) => ({
//         phoneNumber: state.phoneNumber,
//         token: state.token,
//         id: state.id,
//         isProfileComplete: state.isProfileComplete,
//         approvalStatus: state.approvalStatus,
//         name: state.name,
//         email: state.email,
//         vehicle: state.vehicle,
//       }),
//     }
//   )
// );

export const useAppStore = create<AppStore>()((...a) => ({
  ...createRequestBookingSlice(...a),
  ...createDutySlice(...a),
  ...createActiveBookingSlice(...a),
  ...createLoadingSlice(...a),
  ...createDriverLocationSlice(...a),
  ...createAuthSlice(...a),
}));

// No persist middleware - state resets on app restart
