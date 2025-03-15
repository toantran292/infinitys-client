"use client";

import Link from "next/link";
import { SquarePen } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Avatar, AvatarImage } from "../avatar";
import { GroupChat } from "@/components/chat-page";
import { useGetGroupChats } from "@/views/chat-id/hooks";
import { memo } from "react";

interface ChatSidebarProps {
  isCollapsed: boolean;
}

interface ChatSidebarHeaderProps extends ChatSidebarProps {
  quantity: number;
}

interface ChatSideBarBodyProps extends ChatSidebarProps {
  groupChats: GroupChat[];
}

const ChatSideBarHeader = ({
  isCollapsed,
  quantity
}: ChatSidebarHeaderProps) => {
  return isCollapsed ? (
    <></>
  ) : (
    <div className="flex justify-between p-4 items-center border-b">
      <div className="flex gap-2 items-center">
        <p className="font-medium text-lg">Messaging</p>
        <span className="text-zinc-500">({quantity})</span>
      </div>

      <Link
        href="#"
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "h-9 w-9"
        )}
      >
        <SquarePen size={20} />
      </Link>
    </div>
  );
};

const ChatSideBarBodyProps = ({
  groupChats,
  isCollapsed
}: ChatSideBarBodyProps) => {
  return (
    <>
      {groupChats.map((chat, index) =>
        isCollapsed ? (
          <Link
            key={index}
            href={`/chat/${chat.id}`}
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "h-11 w-11 md:h-16 md:w-16"
            )}
          >
            <Avatar className="h-10 w-10">
              <AvatarImage
                src="https://github.com/shadcn.png"
                alt="avatar"
              />
            </Avatar>
          </Link>
        ) : (
          <Link
            key={index}
            href={`/chat/${chat.id}`}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "w-full h-[72px] px-4 py-2 justify-start gap-3 hover:bg-gray-100"
            )}
          >
            <Avatar className="h-12 w-12">
              <AvatarImage
                src="https://github.com/shadcn.png"
                alt="avatar"
              />
            </Avatar>
            <div className="flex flex-col items-start gap-0.5 min-w-0">
              <span className="font-medium text-sm text-gray-900">{chat.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 truncate">
                  {chat.groupChatMembers?.[0]?.user?.name || "No members"}
                </span>
                <span className="w-1 h-1 bg-gray-300 rounded-full" />
                <span className="text-xs text-gray-500">Available on mobile</span>
              </div>
            </div>
          </Link>
        )
      )}
    </>
  );
};

const ChatSidebar = ({ isCollapsed }: ChatSidebarProps) => {
  const { groupChats } = useGetGroupChats();

  return (
    <div
      data-collapsed={isCollapsed}
      className="relative group flex flex-col h-full bg-white border-r"
    >
      <ChatSideBarHeader
        quantity={groupChats?.length || 0}
        isCollapsed={isCollapsed}
      />
      <nav className="flex-1 overflow-y-auto">
        <ChatSideBarBodyProps
          groupChats={groupChats || []}
          isCollapsed={isCollapsed}
        />
      </nav>
    </div>
  );
};

export default memo(ChatSidebar);
