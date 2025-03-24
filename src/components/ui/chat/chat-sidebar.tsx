"use client";

import { Search, SquarePen } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { memo, useMemo } from "react";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import { useGroupChat } from "@/providers/group-chat-provider";
import { Button } from "../button";
import { vi } from "date-fns/locale";
interface ChatSidebarProps {
  isCollapsed: boolean;
}

interface ChatPreview {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  timestamp: Date;
  isOnline?: boolean;
  unread?: boolean;
}

const ChatSideBarHeader = () => {
  const router = useRouter();
  const { search, setSearch } = useGroupChat();

  return (
    <div className="flex flex-col border-b">
      <div className="flex justify-between p-4 items-center">
        <h1 className="text-xl font-semibold">Tin nhắn</h1>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => router.push(`/chat/new`)}
        >
          <SquarePen className="size-6" />
        </Button>
      </div>

      <div className="px-4 pb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Tìm kiếm"
            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-md text-sm focus:outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
    </div >
  );
};

const ChatSideBarBody = () => {
  const router = useRouter();
  const { groupChats } = useGroupChat();
  const chatPreviews: ChatPreview[] = useMemo(() => (groupChats || []).map((chat) => {
    const notGroupChat = chat.members?.length === 1;
    return {
      id: chat.id,
      name: (notGroupChat ? chat.members?.[0]?.fullName : chat.name) || "Unnamed User",
      avatar: (notGroupChat ? chat.members?.[0]?.avatar?.url : null) || "",
      lastMessage: chat.lastMessage?.content || "No messages",
      timestamp: new Date(chat.lastMessage?.createdAt || Date.now()),
    }
  }), [groupChats]);

  console.log("chatPreviews - rerender");

  return (
    <div className="flex-1 overflow-y-auto">
      {chatPreviews.map((chat) => (
        <div
          key={chat.id}
          className="flex items-center gap-3 p-4 hover:bg-gray-100 cursor-pointer relative"
          onClick={() => router.push(`/chat/${chat.id}`)}
        >
          <div className="relative">
            <Avatar className="h-12 w-12">
              <AvatarImage className="object-cover" src={chat.avatar} />
              <AvatarFallback className="bg-gray-500 text-white">{chat.name}</AvatarFallback>
            </Avatar>
            {chat.isOnline && (
              <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-sm text-gray-900 truncate">
                {chat.name}
              </h3>
              <span className="text-xs text-gray-500">
                {formatDistanceToNow(chat.timestamp, { addSuffix: true, locale: vi })}
              </span>
            </div>
            <p className={cn(
              "text-sm truncate",
              chat.unread ? "text-gray-900 font-medium" : "text-gray-500"
            )}>
              {chat.lastMessage}
            </p>
          </div>
          {chat.unread && (
            <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-blue-600" />
          )}
        </div>
      ))}
    </div>
  );
};

const ChatSidebar = ({ isCollapsed }: ChatSidebarProps) => {
  if (isCollapsed) return null;

  return (
    <div className="w-[420px] flex flex-col h-full bg-white border-r">
      <ChatSideBarHeader />
      <ChatSideBarBody />
    </div>
  );
};

export default memo(ChatSidebar);
