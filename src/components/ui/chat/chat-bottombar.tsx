import { SmilePlus, SendHorizontal, ThumbsUp } from "lucide-react";
import React, { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChatInput } from "@/components/ui/chat/chat-input";
import { Button } from "@/components/ui/button";
import EmojiPicker, { Theme, EmojiStyle } from 'emoji-picker-react';

interface ChatBottombarProps {
  sendMessage: (newMessage: string) => void;
  isLoading?: boolean;
}

export default function ChatBottomBar({
  sendMessage,
  isLoading
}: ChatBottombarProps) {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
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

  const onEmojiClick = (emojiObject: any) => {
    setMessage(prev => prev + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div className="px-4 py-3 border-t bg-white">
      <div className="flex items-center gap-2">
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 hover:bg-gray-100"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            <SmilePlus size={20} className="text-gray-500" />
          </Button>
          {showEmojiPicker && (
            <div className="absolute bottom-full left-0 mb-2 z-50">
              <EmojiPicker
                onEmojiClick={onEmojiClick}
                width={350}
                height={400}
                theme={Theme.LIGHT}
                searchPlaceholder="Search emoji..."
                lazyLoadEmojis={true}
                skinTonesDisabled={true}
                emojiStyle={EmojiStyle.NATIVE}
              />
            </div>
          )}
        </div>
        <div className="flex-1 relative">
          <ChatInput
            value={message}
            ref={inputRef}
            onKeyDown={handleKeyPress}
            onChange={handleInputChange}
            placeholder="Nhập tin nhắn..."
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
