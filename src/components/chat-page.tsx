"use client";

import ChatTopBar from "@/components/ui/chat/chat-top-bar";
import { ChatList } from "@/components/ui/chat/chat-list";
import ChatBottomBar from "@/components/ui/chat/chat-bottombar";
import { memo, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@/providers/auth-provider";
import { useGetGroupChatMessage, useGetGroupChats } from "@/views/chat-id/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { useGroupChat } from "@/providers/group-chat-provider";
export interface Profile {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  avatar?: {
    url: string;
  };
  isOnline?: boolean;
}

export interface Message {
  id: string;
  user: Profile;
  content: string;
  room_id: string;
  createdAt: string;
  isRead?: boolean;
}

export interface GroupChatMember {
  id: string;
  user: Profile;
  groupChatId: string;
}

export interface GroupChat {
  id: string;
  name: string;
  groupChatMembers: GroupChatMember[];
  messages?: Message[];
  members?: Profile[];
  lastMessage?: Message;
}

export interface ChatPageProps {
  groupChatId: string;
}

const ChatPage = ({ groupChatId }: ChatPageProps) => {
  const { user, accessToken } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const queryClient = useQueryClient();
  const { groupChatMessage } = useGetGroupChatMessage(groupChatId);
  const { refetchGroupChats } = useGroupChat();

  const handleSendMessage = (content: string) => {
    if (content.trim() && groupChatId && socket) {
      const result = {
        user: user!,
        room_id: groupChatId,
        content
      };
      socket.emit("send_message", result);
      refetchGroupChats();
    }
  };

  useEffect(() => {
    setMessages(groupChatMessage ?? []);
  }, [groupChatMessage]);

  useEffect(() => {
    if (!accessToken && groupChatId) {
      console.log({ accessToken, groupChatId });
      console.log("No token, not connecting");
      return;
    }

    const newSocket = io("http://localhost:20250/chats", {
      auth: {
        user,
        token: accessToken
      }
    });

    newSocket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    newSocket.on("joined_room", () => { });

    newSocket.on("notifications", (data) => {
      console.log({ notification_data: data });
    });

    newSocket.on("connect", () => {
      console.log("Socket connected!");
    });

    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    newSocket.on("error", (error) => {
      console.error("Socket error:", error);
    });

    setSocket(newSocket);

    return () => {
      newSocket.off("notifications");
      newSocket.off("receive_message");
      newSocket.off("joined_room");
      newSocket.disconnect();
    };
  }, [accessToken]);

  useEffect(() => {
    if (groupChatId && socket) {
      socket.emit("join_room", groupChatId);
    }
  }, [socket, groupChatId]);

  return (
    <div className="flex flex-col w-full h-full overflow-hidden">
      <ChatTopBar />
      <ChatList messages={messages} />
      <ChatBottomBar sendMessage={handleSendMessage} />
    </div>
  );
};

export default memo(ChatPage);
