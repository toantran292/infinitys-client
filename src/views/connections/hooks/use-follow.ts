import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";

export const usePageFollowActions = () => {
  const queryClient = useQueryClient();
  // Mutation để theo dõi trang
  const followMutation = useMutation({
    mutationFn: async (pageId: string) => {
      return await axiosInstance.post(`/api/pages/${pageId}/follow`);
    },
    onSuccess: () => {
      toast.success("Đã theo dõi trang.");
      queryClient.invalidateQueries(["followedPages"]);
    },
    onError: () => {
      toast.error("Không thể theo dõi trang.");
    }
  });

  // Mutation để hủy theo dõi trang
  const unfollowMutation = useMutation({
    mutationFn: async (pageId: string) => {
      return await axiosInstance.post(`/api/pages/${pageId}/unfollow`);
    },
    onSuccess: () => {
      toast.success("Đã hủy theo dõi trang.");
      queryClient.invalidateQueries(["followedPages"]);
    },
    onError: () => {
      toast.error("Không thể hủy theo dõi trang.");
    }
  });

  return {
    followPage: followMutation.mutate,
    isFollowing: followMutation.isPending,
    unfollowPage: unfollowMutation.mutate,
    isUnfollowing: unfollowMutation.isPending
  };
};
