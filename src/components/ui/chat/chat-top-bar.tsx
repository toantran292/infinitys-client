import React from "react";
import { Info, Phone, Video } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { ExpandableChatHeader } from "@/components/ui/chat/expandable-chat";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Profile } from "@/components/profile-page";
import { useParams } from "next/navigation";
import { useGetGroupChat } from "@/views/chat-id/hooks";
import { useAuth } from "@/providers/auth-provider";

interface ChatTopbarProps {
  selectedUser?: Profile;
}

export const TopbarIcons = [{ icon: Phone }, { icon: Video }, { icon: Info }];

const ChatTopBar = () => {
  const params = useParams();
  const { groupChat } = useGetGroupChat(params.id as string);

  return (
    <div className="flex items-center gap-3 p-4 border-b bg-white">
      <Avatar className="h-12 w-12">
        <AvatarImage src="https://github.com/shadcn.png" alt="avatar" />
      </Avatar>
      <div className="flex flex-col min-w-0">
        <h2 className="font-medium text-sm text-gray-900 truncate">
          {groupChat?.name || "Loading..."}
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">
            {groupChat?.groupChatMembers?.[0]?.user?.name || "No members"}
          </span>
          <span className="w-1 h-1 bg-gray-300 rounded-full" />
          <span className="text-xs text-gray-500">Available on mobile</span>
        </div>
      </div>
    </div>
  );
};

export default ChatTopBar;
