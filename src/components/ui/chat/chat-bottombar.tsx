import { Image, Paperclip, SendHorizontal, SmilePlus, ThumbsUp } from "lucide-react";
import React, { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChatInput } from "@/components/ui/chat/chat-input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChatBottombarProps {
  sendMessage: (newMessage: string) => void;
  isLoading?: boolean;
}

export default function ChatBottomBar({
  sendMessage,
  isLoading
}: ChatBottombarProps) {
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (message.trim()) {
        sendMessage(message);
        setMessage("");
      }
    }
  };

  return (
    <div className="px-4 py-3 border-t bg-white">
      <div className="flex items-end gap-2">
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 hover:bg-gray-100"
          >
            <Image size={20} className="text-gray-500" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 hover:bg-gray-100"
          >
            <Paperclip size={20} className="text-gray-500" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 hover:bg-gray-100"
          >
            <SmilePlus size={20} className="text-gray-500" />
          </Button>
        </div>
        <div className="flex-1 relative">
          <ChatInput
            value={message}
            ref={inputRef}
            onKeyDown={handleKeyPress}
            onChange={handleInputChange}
            placeholder="Write a message..."
            className="min-h-[44px] py-3 px-4 rounded-2xl bg-[#f2f2f2] focus:bg-white focus:ring-1 focus:ring-[#0a66c2]"
          />
        </div>
        <AnimatePresence initial={false}>
          {message.trim() ? (
            <Button
              className="h-9 w-9 hover:bg-gray-100"
              onClick={() => {
                sendMessage(message);
                setMessage("");
              }}
              disabled={isLoading}
              variant="ghost"
              size="icon"
            >
              <SendHorizontal size={20} className="text-[#0a66c2]" />
            </Button>
          ) : (
            <Button
              className="h-9 w-9 hover:bg-gray-100"
              onClick={() => {
                sendMessage("👍");
                setMessage("");
              }}
              disabled={isLoading}
              variant="ghost"
              size="icon"
            >
              <ThumbsUp size={20} className="text-gray-500" />
            </Button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
