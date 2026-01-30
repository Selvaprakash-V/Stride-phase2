import { useQuery } from "@tanstack/react-query";
import { userApi } from "../api/users";

export const useUserProfile = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: userApi.getMe,
  });
};
