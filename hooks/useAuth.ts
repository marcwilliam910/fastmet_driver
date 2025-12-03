import { useAppStore } from "@/store/useAppStore";

export const useAuth = () => {
  const id = useAppStore((state) => state.id);
  const token = useAppStore((state) => state.token);
  const phoneNumber = useAppStore((state) => state.phoneNumber);
  const approvalStatus = useAppStore((state) => state.approvalStatus);

  return {
    isLoggedIn: !!id && !!token && !!phoneNumber,
    id,
    token,
    phoneNumber,
    approvalStatus,
  };
};
