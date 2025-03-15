import { ProtectedRouteLayout } from "@/components/layouts";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from "@/components/ui/resizable";
import { cn } from "@/lib/utils";
import ChatSidebar from "@/components/ui/chat/chat-sidebar";
import ChatPage from "@/components/chat-page";
import React, { useState } from "react";

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

  console.log({ isCollapsed });

  return (
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
          {groupChatId ? <ChatPage groupChatId={groupChatId} /> : null}
        </ResizablePanel>
      </ResizablePanelGroup>
    </ProtectedRouteLayout>
  );
};
