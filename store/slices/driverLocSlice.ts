import { StateCreator } from "zustand";

type DriverLocation = {
  lat: number;
  lng: number;
  heading: number | null;
};

export interface DriverLocationSlice {
  driverLocation: DriverLocation | null;
  setDriverLocation: (loc: DriverLocation) => void;

  isDriving: boolean;
  setIsDriving: (state: boolean) => void;
}

export const createDriverLocationSlice: StateCreator<DriverLocationSlice> = (
  set
) => ({
  driverLocation: null,
  setDriverLocation: (loc) => set({ driverLocation: loc }),

  isDriving: false,
  setIsDriving: (state) => set({ isDriving: state }),
});
