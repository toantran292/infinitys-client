"use client";

import ChatTopBar from "@/components/ui/chat/chat-top-bar";
import { Profile } from "@/components/profile-page";
import { ChatList } from "@/components/ui/chat/chat-list";
import ChatBottomBar from "@/components/ui/chat/chat-bottombar";
import { memo, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useQuery } from "@tanstack/react-query";
import instance from "@/common/api";
import { useAuth } from "@/providers/auth-provider";
import { useGetGroupChatMessage } from "@/views/chat-id/hooks";

// const useCreateGroupChat = () => {
//   const queryClient = useQueryClient();
//
//   const { mutate: createGroupChat, ...remain } = useMutation({
//     mutationFn: (userId: string) =>
//       instance.post(`/chats/groups`, {
//         recipientId: userId
//       }),
//     onSuccess: () => {
//       toast.success("Bank account successfully changed");
//       queryClient
//         .invalidateQueries({
//           queryKey: ["GROUP_CHATS"]
//         })
//         .catch(console.error);
//     },
//     onError: (error: unknown) => {
//       toast.error(`Error changing bank account: ${error}`);
//     }
//   });
//
//   return { createGroupChat, ...remain };
// }

export interface Message {
  user: Profile;
  content: string;
  room_id: string;
  createdAt: string;
}

export interface GroupChat {
  id: string;
  name: string;
}

export interface ChatPageProps {
  groupChatId: string;
}

const ChatPage = ({ groupChatId }: ChatPageProps) => {
  const { auth } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const { groupChatMessage } = useGetGroupChatMessage(groupChatId);

  const handleSendMessage = (content: string) => {
    if (content.trim() && groupChatId && socket) {
      const result = {
        user: auth.user!,
        room_id: groupChatId,
        content
      };
      socket.emit("send_message", result);
    }
  };

  useEffect(() => {
    setMessages(groupChatMessage ?? []);
  }, [groupChatMessage]);

  useEffect(() => {
    if (!auth.token && groupChatId) {
      console.log("No token, not connecting");
      return;
    } // Nếu chưa có token, không kết nối

    const newSocket = io("http://localhost:20250", {
      auth: {
        user: auth.user,
        token: auth.token
      }
    });

    newSocket.on("receive_message", (data) => {
      console.log("TEST");
      console.log(data);

      setMessages((prev) => [...prev, data]);
    });

    newSocket.on("joined_room", () => {});

    newSocket.on("notifications", (data) => {
      console.log({ notification_data: data });
    });

    setSocket(newSocket);

    return () => {
      newSocket.off("notifications");
      newSocket.off("receive_message");
      newSocket.off("joined_room");
      newSocket.disconnect(); // Ngắt kết nối khi component unmount
    };
  }, [auth.token]);

  useEffect(() => {
    if (groupChatId && socket) {
      socket.emit("join_room", groupChatId);
    }
  }, [socket, groupChatId]);

  return (
    <div className="flex flex-col justify-between w-full h-full overflow-hidden">
      <ChatTopBar />
      <ChatList messages={messages} />
      <ChatBottomBar sendMessage={handleSendMessage} />
    </div>
  );
};

export default memo(ChatPage);
