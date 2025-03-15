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
        <ResizablePanel
          defaultSize={defaultLayout[0]}
          collapsedSize={6}
          collapsible={true}
          minSize={8}
          maxSize={12}
          onCollapse={() => {
            setIsCollapsed(true);
          }}
          onExpand={() => {
            setIsCollapsed(false);
          }}
          className={cn(
            isCollapsed &&
              "min-w-[50px] md:min-w-[70px] transition-all duration-300 ease-in-out"
          )}
        >
          <ChatSidebar isCollapsed={isCollapsed} />
        </ResizablePanel>
        <ResizableHandle withHandle />
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
