import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { Profile } from "@/types/job";

export function useProfile(userId: string | undefined) {
  return useQuery({
    queryKey: ["PROFILE", userId],
    queryFn: async () => {
      if (!userId) return null;
      const response = await axiosInstance.get(`api/users/${userId}`);
      return response.data as Profile;
    },
    enabled: !!userId
  });
}
