/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

type ChatContextType = {
  socket: Socket | null;
  connect: (userId: string, accessToken: string) => void;
  joinConversation: (conversationId: string) => void;
  sendMessage: (payload: {
    conversationId: string;
    content: string;
    pageId?: string;
  }) => void;
  onNewMessage: (callback: (data: any) => void) => void;
  onConversationUpdate: (callback: (data: any) => void) => void;
};

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:20250/chats";

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  const connect = (userId: string, token: string) => {
    const s = io(SOCKET_URL, {
      auth: {
        userId,
        token
      }
    });

    setSocket(s);
  };

  const joinConversation = (conversationId: string) => {
    socket?.emit("join_conversation", conversationId);
  };

  const sendMessage = (payload: {
    conversationId: string;
    content: string;
    pageId?: string;
  }) => {
    socket?.emit("send_message", payload);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onNewMessage = (callback: (data: any) => void) => {
    socket?.on("new_message", callback);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onConversationUpdate = (callback: (data: any) => void) => {
    socket?.on("conversation_updated", callback);
  };

  useEffect(() => {
    return () => {
      socket?.disconnect();
    };
  }, [socket]);

  return (
    <ChatContext.Provider
      value={{
        socket,
        connect,
        joinConversation,
        sendMessage,
        onNewMessage,
        onConversationUpdate
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChat must be used within a ChatProvider");

  return context;
};
