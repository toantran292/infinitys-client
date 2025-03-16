import React from "react";
import { Info, Phone, Video } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useParams } from "next/navigation";
import { useGetGroupChat } from "@/views/chat-id/hooks";

export const TopbarIcons = [{ icon: Phone }, { icon: Video }, { icon: Info }];

const ChatTopBar = () => {
  const params = useParams();
  const { groupChat } = useGetGroupChat(params.id as string);

  if (!groupChat) {
    return null;
  }

  const isGroupChat = groupChat.members!.length > 1;

  const members = groupChat.members!;

  return (
    <div className="flex items-center gap-3 p-4 border-b bg-white">
      <Avatar className="h-12 w-12">
        <AvatarImage src={isGroupChat ? "" : members[0]?.avatar?.url || ""} alt="avatar" />
        <AvatarFallback className="bg-gray-500 text-white">{members[0]?.fullName?.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col min-w-0">
        <h2 className="font-medium text-sm text-gray-900 truncate">
          {isGroupChat ? groupChat?.name : members[0]?.fullName}
        </h2>
        {isGroupChat && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">
              {members?.join(", ") || "No members"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatTopBar;
