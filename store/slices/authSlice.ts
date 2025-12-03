import { StateCreator } from "zustand";

export interface AuthSlice {
  phoneNumber: string;
  id?: string;
  approvalStatus?: "pending" | "approved" | "rejected";
  registrationStep: number;
  name: string;
  email: string;
  vehicle: string;
  license: string;
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
  registrationStep: 1,
  name: "",
  email: "",
  vehicle: "",
  license: "",
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
      registrationStep: 1,
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
      name: "",
      email: "",
      vehicle: "",
      token: undefined,
    }),
});
