import { useEffect, useRef } from "react";
import { useAuth } from "@/providers/auth-provider";
import { useChat } from "@/contexts/ChatContext";
import { ResizablePanelGroup } from "@/components/ui/resizable";
import ConversationList from "./ConversationList";
import ConversationCurrent from "./ConversationCurrent";
import { useParams, useRouter } from "next/navigation";
import ConversationNew from "./ConversationNew";

type Props = {
  isChatNew?: boolean;
};

export default function ChatLayout({ isChatNew = false }: Props) {
  const { id: conversationId, pageId } = useParams();
  const { user, accessToken } = useAuth();
  const { connect, socket } = useChat();
  const isConnecting = useRef(false);
  const router = useRouter();

  useEffect(() => {
    if (!socket && user && accessToken && !isConnecting.current) {
      isConnecting.current = true;
      connect(user.id, accessToken);
    }

    return () => {
      isConnecting.current = false;
    };
  }, [user, accessToken, connect, socket]);

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-full w-full items-stretch"
    >
      <div className="flex h-[calc(100vh-72px)] border rounded overflow-hidden shadow w-full">
        {/* Sidebar */}
        <div className="w-80 border-r">
          <ConversationList
            isPageView={pageId ? true : false}
            pageId={pageId as string}
            onSelect={(conversation) => {
              router.push(`/${pageId ? `page-chat/${pageId}/` : "chat"}/${conversation.id}`);
            }}
          />
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col">
          {isChatNew ? (
            <ConversationNew />
          ) : conversationId ? (
            <ConversationCurrent
              isPageView={pageId ? true : false}
              pageId={pageId as string}
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
