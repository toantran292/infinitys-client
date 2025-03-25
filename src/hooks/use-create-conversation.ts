import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";

export const useCreateConversation = () => {
  const queryClient = useQueryClient();

  const createUserUser = useMutation({
    mutationFn: async (payload: { userId: string }) => {
      const res = await axiosInstance.post(
        `api/chats/conversations/user-user`,
        payload
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["conversations"]
      });
    }
  });

  const createGroupUser = useMutation({
    mutationFn: async (payload: { userIds: string[] }) => {
      const res = await axiosInstance.post(
        `api/chats/conversations/group  `,
        payload
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["conversations"]
      });
    }
  });

  const createUserPage = useMutation({
    mutationFn: async (payload: { pageId: string }) => {
      const res = await axiosInstance.post(
        `api/chats/conversations/user-page`,
        payload
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["conversations"]
      });
    }
  });

  return {
    createUserUser,
    createGroupUser,
    createUserPage
  };
};
