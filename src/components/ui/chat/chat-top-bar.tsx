import React, { useMemo } from "react";
import { Info, Phone, Video } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useParams } from "next/navigation";
import { useGetGroupChat } from "@/views/chat-id/hooks";

export const TopbarIcons = [{ icon: Phone }, { icon: Video }, { icon: Info }];

const ChatTopBar = () => {
  const params = useParams();
  const { groupChat } = useGetGroupChat(params.id as string);

  const isGroupChat = useMemo(() => {
    if (!groupChat) return false;
    return groupChat.members!.length > 1;
  }, [groupChat]);

  const members = useMemo(() => {
    if (!groupChat) return [];
    return groupChat.members!;
  }, [groupChat]);

  const groupName = useMemo(() => {
    if (!groupChat) return "";
    if (!isGroupChat) return members[0]?.fullName;

    if (groupChat.name) return groupChat.name;

    const memberNames = members.slice(0, 2).map((member) => member.fullName).join(", ");

    if (members.length === 2) return memberNames;

    return `${memberNames} và ${members.length - 2} người khác`;
  }, [groupChat]);


  if (!groupChat) {
    return null;
  }

  return (
    <div className="flex items-center gap-3 p-4 border-b bg-white">
      <Avatar className="h-12 w-12">
        <AvatarImage src={isGroupChat ? "" : members[0]?.avatar?.url || ""} alt="avatar" />
        <AvatarFallback className="bg-gray-500 text-white">{members[0]?.fullName?.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col min-w-0">
        <h2 className="font-medium text-sm text-gray-900 truncate">
          {groupName}
        </h2>
        {isGroupChat && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">
              {members?.map((member) => member.fullName).join(", ") || "No members"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatTopBar;
