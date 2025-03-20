import { useQuery } from "@tanstack/react-query";
import { instance } from "@/lib/axios-instance";
import { Profile } from "@/views/profile/types";

export function useProfile(userId: string | undefined) {
    return useQuery({
        queryKey: ["PROFILE", userId],
        queryFn: async () => {
            if (!userId) return null;
            const response = await instance.get(`api/users/${userId}`);
            return response.data as Profile;
        },
        enabled: !!userId,
    });
} 