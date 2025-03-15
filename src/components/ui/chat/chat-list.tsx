// import { Message, UserData } from "@/app/data";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChatMessageList } from "@/components/ui/chat/chat-message-list";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/providers/auth-provider";
import { Message } from "@/components/chat-page";
import { cn } from "@/lib/utils";

interface ChatListProps {
  messages: Message[];
}

const getMessageVariant = (currentUserId?: string, selectedUserId?: string) =>
  currentUserId === selectedUserId ? "sent" : "received";

export function ChatList({ messages }: ChatListProps) {
  const { auth } = useAuth();

  return (
    <div className="flex flex-col w-full overflow-y-auto h-[calc(100vh-242px)]">
      <ChatMessageList>
        <AnimatePresence>
          {messages?.map((message, index) => {
            const isSentByMe = getMessageVariant(auth?.user?.id, message.user.id) === "sent";
            return (
              <motion.div
                key={index}
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
                  "flex gap-2 px-4 py-1",
                  isSentByMe ? "flex-row-reverse" : "flex-row"
                )}
              >
                {!isSentByMe && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={message.user.avatar || "https://github.com/shadcn.png"} />
                  </Avatar>
                )}
                <div
                  className={cn(
                    "flex flex-col max-w-[70%]",
                    isSentByMe ? "items-end" : "items-start"
                  )}
                >
                  {!isSentByMe && (
                    <span className="text-sm text-gray-600 mb-1">{message.user.name}</span>
                  )}
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-2 text-sm",
                      isSentByMe
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-900"
                    )}
                  >
                    {message.content}
                  </div>
                  {message.createdAt && (
                    <span className="text-xs text-gray-500 mt-1">
                      {new Date(message.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
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
