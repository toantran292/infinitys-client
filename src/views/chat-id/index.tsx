import { ProtectedRouteLayout } from "@/components/layouts";
import {
  ResizablePanel,
  ResizablePanelGroup
} from "@/components/ui/resizable";
import ChatSidebar from "@/components/ui/chat/chat-sidebar";
import ChatPage from "@/components/chat-page";
import React, { useState } from "react";
import { GroupChatProvider } from "@/providers/group-chat-provider";
import NewChatPage from "@/components/new-chat-page";


export interface ChatIdViewProps {
  groupChatId?: string;
  defaultLayout?: number[] | undefined;
  // defaultCollapsed?: boolean;
}

export const ChatIdView = ({
  groupChatId,
  defaultLayout = [50, 200]
  // defaultCollapsed = false,
}: ChatIdViewProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <GroupChatProvider>
      <ProtectedRouteLayout sectionClassName="bg-gray-50 h-full max-h-full">
        <ResizablePanelGroup
          direction="horizontal"
          className="h-full items-stretch max-h-full"
        >
          <ChatSidebar isCollapsed={isCollapsed} />
          <ResizablePanel
            className="max-h-full"
            defaultSize={defaultLayout[1]}
            minSize={30}
          >
            {groupChatId === "new" ? (
              <NewChatPage />
            ) : groupChatId ? (
              <ChatPage groupChatId={groupChatId} />
            ) : null}
          </ResizablePanel>
        </ResizablePanelGroup>
      </ProtectedRouteLayout>
    </GroupChatProvider>
  );
};
