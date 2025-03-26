import { useState, useEffect, useRef } from "react";
import ConversationList from "./ConversationList";
import ConversationCurrent from "./ConversationCurrent";
import { Conversation } from "@/types/conversation";
import { useAuth } from "@/providers/auth-provider";
import { useChat } from "@/contexts/ChatContext";
import { ResizablePanelGroup } from "@/components/ui/resizable";

type Props = {
  isPageView?: boolean;
  pageId?: string;
};

export default function ChatLayout({ isPageView = false, pageId }: Props) {
  const { user, accessToken } = useAuth();
  const { connect, socket, joinConversation } = useChat();
  const [activeConversation, setActiveConversation] =
    useState<Conversation | null>(null);
  const isConnecting = useRef(false);

  useEffect(() => {
    if (!socket && user && accessToken && !isConnecting.current) {
      isConnecting.current = true;
      connect(user.id, accessToken);
    }

    return () => {
      isConnecting.current = false;
    };
  }, [user, accessToken, connect, socket]);

  useEffect(() => {
    if (activeConversation && socket) {
      joinConversation(activeConversation.id);

      socket.emit("mark_as_read", {
        conversationId: activeConversation.id,
        userId: user?.id,
        messageId: activeConversation?.lastMessage?.id
      });
    }
  }, [socket, activeConversation, joinConversation, user?.id]);

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-full w-full items-stretch"
    >
      <div className="flex h-[calc(100vh-72px)] border rounded overflow-hidden shadow w-full">
        {/* Sidebar */}
        <div className="w-80 border-r">
          <ConversationList
            isPageView={isPageView}
            pageId={pageId}
            activeConversationId={activeConversation?.id}
            onSelect={(conversation) => setActiveConversation(conversation)}
          />
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col">
          {activeConversation ? (
            <ConversationCurrent
              isPageView={isPageView}
              conversation={activeConversation}
              conversationId={activeConversation.id}
              pageId={pageId}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              Chọn một cuộc trò chuyện để bắt đầu
            </div>
          )}
        </div>
      </div>
    </ResizablePanelGroup>
  );
}
