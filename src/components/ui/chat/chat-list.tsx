// import { Message, UserData } from "@/app/data";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChatMessageList } from "@/components/ui/chat/chat-message-list";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/providers/auth-provider";
import { Message } from "@/components/chat-page";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface ChatListProps {
  messages: Message[];
}

const getMessageVariant = (currentUserId?: string, selectedUserId?: string) =>
  currentUserId === selectedUserId ? "sent" : "received";

export function ChatList({ messages }: ChatListProps) {
  const { auth } = useAuth();

  return (
    <div className="flex flex-col w-full overflow-y-auto h-[calc(100vh-242px)] bg-white">
      <ChatMessageList>
        <AnimatePresence>
          {messages?.map((message, index) => {
            const isSentByMe = getMessageVariant(auth?.user?.id, message.user.id) === "sent";
            return (
              <motion.div
                key={message.id || index}
                layout
                initial={{ opacity: 0, scale: 1, y: 50, x: 0 }}
                animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                exit={{ opacity: 0, scale: 1, y: 1, x: 0 }}
                transition={{
                  opacity: { duration: 0.1 },
                  layout: {
                    type: "spring",
                    bounce: 0.3,
                    duration: index * 0.05 + 0.2
                  }
                }}
                style={{ originX: 0.5, originY: 0.5 }}
                className={cn(
                  "flex gap-2 px-4 py-1.5",
                  isSentByMe ? "flex-row-reverse" : "flex-row"
                )}
              >
                {!isSentByMe && (
                  <Avatar className="h-9 w-9 mt-5">
                    <AvatarImage src={message.user.image} />
                    <AvatarFallback className="bg-gray-500 text-white">{message.user?.firstName?.[0]}</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    "flex flex-col max-w-[70%]",
                    isSentByMe ? "items-end" : "items-start"
                  )}
                >
                  {!isSentByMe && (
                    <span className="text-xs text-gray-600 mb-1">{message.user.firstName} {message.user.lastName}</span>
                  )}
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-2 text-sm break-words",
                      isSentByMe
                        ? "bg-[#0a66c2] text-white"
                        : "bg-[#f2f2f2] text-gray-900"
                    )}
                  >
                    {message.content}
                  </div>
                  {message.createdAt && (
                    <span className="text-[11px] text-gray-500 mt-1">
                      {format(new Date(message.createdAt), "h:mm a")}
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </ChatMessageList>
    </div>
  );
}
