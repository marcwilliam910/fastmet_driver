import { StateCreator } from "zustand";

export interface AuthSlice {
  phoneNumber: string;
  id?: string;
  approvalStatus?: "pending" | "approved" | "rejected";
  isProfileComplete?: boolean;
  name: string;
  email: string;
  vehicle: string;
  token?: string;

  // Actions
  setAuthData: (
    data: Partial<Omit<AuthSlice, "setAuthData" | "clearAuthData" | "logout">>
  ) => void;
  clearAuthData: () => void;
  logout: () => void;
}

export const createAuthSlice: StateCreator<AuthSlice> = (set) => ({
  phoneNumber: "",
  id: undefined,
  approvalStatus: undefined,
  isProfileComplete: false,
  name: "",
  email: "",
  vehicle: "",
  token: undefined,

  setAuthData: (data) =>
    set((state) => ({
      ...state,
      ...data,
    })),

  clearAuthData: () =>
    set({
      phoneNumber: "",
      id: undefined,
      approvalStatus: undefined,
      isProfileComplete: false,
      name: "",
      email: "",
      vehicle: "",
      token: undefined,
    }),

  logout: () =>
    set({
      phoneNumber: "",
      id: undefined,
      approvalStatus: undefined,
      isProfileComplete: false,
      name: "",
      email: "",
      vehicle: "",
      token: undefined,
    }),
});
