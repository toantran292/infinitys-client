import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
const useFriend = () => {
  const queryClient = useQueryClient();

  const sendFriendRequest = useMutation({
    mutationFn: async (payload: { userId: string }) => {
      const res = await axiosInstance.post(`api/friends/${payload.userId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    }
  });

  const acceptFriendRequest = useMutation({
    mutationFn: async (payload: { userId: string }) => {
      const res = await axiosInstance.post(
        `api/friends/${payload.userId}/accept`
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    }
  });

  const cancelFriendRequest = useMutation({
    mutationFn: async (payload: { userId: string }) => {
      const res = await axiosInstance.post(
        `api/friends/${payload.userId}/cancel`
      );
      return res.data;
    }
  });

  const unfriend = useMutation({
    mutationFn: async (payload: { userId: string }) => {
      const res = await axiosInstance.post(
        `api/friends/${payload.userId}/unfriend`
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    }
  });

  return {
    sendFriendRequest,
    acceptFriendRequest,
    cancelFriendRequest,
    unfriend
  };
};

export default useFriend;
