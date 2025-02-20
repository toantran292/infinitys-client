import { useQuery } from "@tanstack/react-query";
import instance from "@/common/api";
import { GroupChat } from "@/components/chat-page";

export const useGetGroupChatMessage = (group_id?: string) => {
  const { data: groupChatMessage, isLoading } = useQuery({
    queryKey: ["GROUP_CHAT_MESSAGE", group_id],
    queryFn: () =>
      instance
        .get(`/chats/groups/${group_id}/messages`)
        .then(({ data }) => data),
    enabled: Boolean(group_id)
  });

  return { groupChatMessage, isLoading };
};

export const useGetGroupChats = () => {
  const { data: groupChats, isLoading } = useQuery<GroupChat[]>({
    queryKey: ["GROUP_CHATS"],
    queryFn: () => instance.get(`/chats/groups`).then(({ data }) => data)
  });

  return { groupChats: groupChats, isLoading };
};


export const useGetGroupChat = (group_id?: string) => {
  const { data: groupChat, isLoading } = useQuery<GroupChat>({
    queryKey: ["GROUP_CHAT", group_id],
    queryFn: () => instance.get(`/chats/groups/${group_id}`).then(({ data }) => data),
    enabled: Boolean(group_id)
  });

  return { groupChat, isLoading };
};