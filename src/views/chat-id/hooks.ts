import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { GroupChat } from "@/components/chat-page";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Profile } from "@/views/profile/profile";

export const useGetGroupChatMessage = (group_id?: string) => {
  const { data: groupChatMessage, isLoading } = useQuery({
    queryKey: ["GROUP_CHAT_MESSAGE", group_id],
    queryFn: () =>
      axiosInstance
        .get(`api/chats/groups/${group_id}/messages`)
        .then(({ data }) => data),
    enabled: Boolean(group_id)
  });

  return { groupChatMessage, isLoading };
};

export const useGetGroupChats = (query?: string) => {
  const { data: groupChats, isLoading, refetch: refetchGroupChats } = useQuery<GroupChat[]>({
    queryKey: ["GROUP_CHATS", query],
    queryFn: () => axiosInstance.get(`api/chats/groups`, { params: query ? { q: query } : {} }).then(({ data }) => data)
  });

  return { groupChats, isLoading, refetchGroupChats };
};

export const useGetGroupChat = (group_id?: string) => {
  const { data: groupChat, isLoading } = useQuery<GroupChat>({
    queryKey: ["GROUP_CHAT", group_id],
    queryFn: () =>
      axiosInstance
        .get(`api/chats/groups/${group_id}`)
        .then(({ data }) => data),
    enabled: Boolean(group_id)
  });

  return { groupChat, isLoading };
};

export const useCreateGroupChat = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate: createGroupChat, ...remain } = useMutation({
    mutationFn: (userIds: string[]) =>
      axiosInstance.post(`api/chats/groups`, {
        userIds
      }),
    onSuccess: ({ data }) => {
      queryClient
        .invalidateQueries({
          queryKey: ["GROUP_CHATS"]
        })
        .catch(console.error);
      router.push(`/chat/${data.id}`);
    },
    onError: (error: unknown) => {
      toast.error(`Error changing bank account: ${error}`);
    }
  });

  return {
    createGroupChat,
    ...remain
  };
};

export const useFriendRequest = ({ onSuccess }: { onSuccess: () => void }) => {
  const { mutate: friendRequest, ...remain } = useMutation({
    mutationFn: ({
      userId,
      friend_status
    }: {
      userId: string;
      friend_status: Profile["friend_status"];
    }) => {
      switch (friend_status) {
        case "sent":
          return axiosInstance.post(`api/friends/${userId}/cancel`);
        case "waiting":
          return axiosInstance.post(`api/friends/${userId}/accept`);
        case "friend":
          return axiosInstance.post(`api/friends/${userId}`);
        default:
          return axiosInstance.post(`api/friends/${userId}`);
      }
    },
    onSuccess: () => onSuccess(),
    onError: (error: unknown) => {
      toast.error(`Error changing bank account: ${error}`);
    }
  });

  return { friendRequest, ...remain };
};

export const useRejectFriendRequest = ({
  onSuccess
}: {
  onSuccess: () => void;
}) => {
  const { mutate: rejectFriendRequest, ...remain } = useMutation({
    mutationFn: ({ userId }: { userId: string }) => {
      return axiosInstance.post(`api/friends/${userId}/reject`);
    },
    onSuccess: () => onSuccess(),
    onError: (error: unknown) => {
      toast.error(`Error changing bank account: ${error}`);
    }
  });

  return { rejectFriendRequest, ...remain };
};

export const useGetFriends = (userId?: string) => {
  const { data: friends, isLoading } = useQuery({
    queryKey: ["FRIENDS", userId],
    queryFn: () =>
      axiosInstance
        .get(`api/friends/${userId}`)
        .then(({ data }) => data)
  });

  return { friends, isLoading };
};

export const useGetGroupChatbyMembersIds = (memberIds: string[] = []) => {
  const { data: group, isLoading } = useQuery({
    queryKey: ["GROUP_CHAT_BY_MEMBER_IDS", memberIds],
    queryFn: () => axiosInstance.post(`api/chats/groups/search-by-members`, { memberIds }).then(({ data }) => data),
    enabled: memberIds.length > 0
  });

  return { group, isLoading };
};
