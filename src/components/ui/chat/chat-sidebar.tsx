"use client";

import Link from "next/link";
import { MoreHorizontal, SquarePen } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
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
    <div className="flex justify-between p-2 items-center">
      <div className="flex gap-2 items-center text-2xl">
        <p className="font-medium">Chats</p>
        <span className="text-zinc-300">({quantity})</span>
      </div>

      <div>
        <Link
          href="#"
          className={cn(
            buttonVariants({ variant: "ghost", size: "icon" }),
            "h-9 w-9"
          )}
        >
          <MoreHorizontal size={20} />
        </Link>

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
          <TooltipProvider key={index}>
            <Tooltip key={index} delayDuration={0}>
              <TooltipTrigger asChild>
                <Link
                  href={`/chat/${chat.id}`}
                  className={cn(
                    buttonVariants({ variant: "secondary", size: "icon" }),
                    "h-11 w-11 md:h-16 md:w-16 dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
                  )}
                >
                  <Avatar className="flex justify-center items-center">
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="avatar"
                      width={6}
                      height={6}
                      className="w-10 h-10 "
                    />
                  </Avatar>{" "}
                  <span className="sr-only">{chat.name}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="flex items-center gap-4">
                {chat.name}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <Link
            key={index}
            href={`/chat/${chat.id}`}
            className={cn(
              buttonVariants({ variant: "secondary", size: "lg" }),
              "h-20 dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white shrink"
            )}
          >
            <Avatar className="flex justify-center items-center">
              <AvatarImage
                src="https://github.com/shadcn.png"
                alt="avatar"
                width={6}
                height={6}
                className="w-10 h-10 "
              />
            </Avatar>
            <span className="sr-only">{chat.name}</span>
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
      className="relative group flex flex-col h-full bg-muted/10 dark:bg-muted/20 gap-4 p-2 data-[collapsed=true]:p-2"
    >
      <ChatSideBarHeader
        quantity={groupChats?.length || 0}
        isCollapsed={isCollapsed}
      />
      <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        <ChatSideBarBodyProps
          groupChats={groupChats || []}
          isCollapsed={isCollapsed}
        />
      </nav>
    </div>
  );
};

export default memo(ChatSidebar);
