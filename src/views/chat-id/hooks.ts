import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import instance from "@/common/api";
import { GroupChat } from "@/components/chat-page";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Profile } from "@/components/profile-page";

export const useGetGroupChatMessage = (group_id?: string) => {
  const { data: groupChatMessage, isLoading } = useQuery({
    queryKey: ["GROUP_CHAT_MESSAGE", group_id],
    queryFn: () =>
      instance
        .get(`api/chats/groups/${group_id}/messages`)
        .then(({ data }) => data),
    enabled: Boolean(group_id)
  });

  return { groupChatMessage, isLoading };
};

export const useGetGroupChats = () => {
  const { data: groupChats, isLoading } = useQuery<GroupChat[]>({
    queryKey: ["GROUP_CHATS"],
    queryFn: () => instance.get(`api/chats/groups`).then(({ data }) => data)
  });

  return { groupChats: groupChats, isLoading };
};

export const useGetGroupChat = (group_id?: string) => {
  const { data: groupChat, isLoading } = useQuery<GroupChat>({
    queryKey: ["GROUP_CHAT", group_id],
    queryFn: () =>
      instance.get(`api/chats/groups/${group_id}`).then(({ data }) => data),
    enabled: Boolean(group_id)
  });

  return { groupChat, isLoading };
};

export const useCreateGroupChat = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate: createGroupChat, ...remain } = useMutation({
    mutationFn: (userId: string) =>
      instance.post(`api/chats/groups/recipients/${userId}`),
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
          return instance.post(`api/friends/${userId}/cancel`);
        case "waiting":
          return instance.post(`api/friends/${userId}/accept`);
        case "friend":
          return instance.post(`api/friends/${userId}`);
        default:
          return instance.post(`api/friends/${userId}`);
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
      return instance.post(`api/friends/${userId}/reject`);
    },
    onSuccess: () => onSuccess(),
    onError: (error: unknown) => {
      toast.error(`Error changing bank account: ${error}`);
    }
  });

  return { rejectFriendRequest, ...remain };
};
