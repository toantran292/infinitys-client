import { ProtectedRouteLayout } from "@/components/layouts";
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import ChatSidebar from "@/components/ui/chat/chat-sidebar";
import ChatPage from "@/components/chat-page";
import React from "react";
import { GroupChatProvider } from "@/providers/group-chat-provider";
import NewChatPage from "@/components/new-chat-page";

export interface ChatIdViewProps {
  groupChatId?: string;
  defaultLayout?: number[] | undefined;
}

export const ChatIdView = ({
  groupChatId,
  defaultLayout = [50, 200]
}: ChatIdViewProps) => {
  return (
    <GroupChatProvider>
      <ProtectedRouteLayout sectionClassName="bg-gray-50 h-[calc(100vh-72px)] w-full overflow-hidden">
        <ResizablePanelGroup
          direction="horizontal"
          className="h-full w-full items-stretch"
        >
          <ChatSidebar isCollapsed={false} />
          <ResizablePanel
            className="h-full w-full overflow-hidden"
            defaultSize={defaultLayout[1]}
            minSize={30}
          >
            {groupChatId === "new" ? (
              <NewChatPage />
            ) : groupChatId ? (
              <ChatPage groupChatId={groupChatId} />
            ) : (
              <div className="flex items-center justify-center h-full">
                Chưa có tin nhắn
              </div>
            )}
          </ResizablePanel>
        </ResizablePanelGroup>
      </ProtectedRouteLayout>
    </GroupChatProvider>
  );
};
