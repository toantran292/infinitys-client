import { Layout } from "@/components/layouts";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from "@/components/ui/resizable";
import { cn } from "@/lib/utils";
import { ChatSidebar } from "@/components/ui/chat/chat-sidebar";
import ChatPage from "@/components/chat-page";
import React, { useState } from "react";

export interface ChatIdViewProps {
  groupChatId?: string;
  defaultLayout?: number[] | undefined;
  // defaultCollapsed?: boolean;
  navCollapsedSize?: number;
}

export const ChatIdView = ({
  groupChatId,
  defaultLayout = [320, 480],
  // defaultCollapsed = false,
  navCollapsedSize = 30
}: ChatIdViewProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <Layout sectionClassName="bg-gray-50 p-6 h-full">
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          document.cookie = `react-resizable-panels:layout=${JSON.stringify(
            sizes
          )}`;
        }}
        className="h-full items-stretch"
      >
        <ResizablePanel
          defaultSize={defaultLayout[0]}
          collapsedSize={navCollapsedSize}
          collapsible={true}
          minSize={24}
          maxSize={30}
          onCollapse={() => {
            setIsCollapsed(true);
            document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
              true
            )}`;
          }}
          onExpand={() => {
            setIsCollapsed(false);
            document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
              false
            )}`;
          }}
          className={cn(
            isCollapsed &&
              "min-w-[50px] md:min-w-[70px] transition-all duration-300 ease-in-out"
          )}
        >
          <ChatSidebar isCollapsed={isCollapsed} />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
          {groupChatId ? <ChatPage groupChatId={groupChatId} /> : null}
        </ResizablePanel>
      </ResizablePanelGroup>
    </Layout>
  );
};
