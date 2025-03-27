/* eslint-disable @typescript-eslint/no-explicit-any */
import { useChat } from "@/contexts/ChatContext";
import axiosInstance from "@/lib/axios";
import { useAuth } from "@/providers/auth-provider";
import { useInfiniteQuery, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useParams, useRouter } from "next/navigation";
import { ChatMessageList } from "@/components/ui/chat/chat-message-list";
import { AnimatePresence, motion } from "framer-motion";
import { cn, toVietnamDate } from "@/lib/utils";
import { ChatInput } from "@/components/ui/chat/chat-input";
import EmojiPicker, { EmojiStyle, Theme } from "emoji-picker-react";
import { Button } from "@/components/ui/button";
import { SendHorizontal, SmilePlus, ThumbsUp } from "lucide-react";
import { Conversation } from "@/types/conversation";
import { ConversationSkeleton } from "./ConversationSkeleton";

type Props = {
  pageId?: string;
  isPageView: boolean;
};

interface Message {
  id: string;
  content: string;
  createdAt: string;
  senderUser: {
    id: string;
    fullName: string;
    firstName: string;
    lastName: string;
    avatar: {
      url: string;
    };
  };
  conversation: {
    id: string;
  };
}

interface MessagesResponse {
  items: Message[];
  nextCursor: string | null;
}

const ConversationCurrentHeader = ({ conversation, isPageView }: { conversation: Conversation, isPageView: boolean }) => {
  const { user } = useAuth();

  let name: string | undefined;
  let avatar: string | undefined;

  if (!conversation.isGroup) {
    const participant = conversation.participants.find(
      (p: any) => {
        if (isPageView) {
          return p.user;
        }
        return p.user.id !== user?.id;
      }
    );

    name = participant?.page?.name || participant?.user?.fullName || "Unknown";
    avatar = participant?.page?.avatar?.url || participant?.user?.avatar?.url || "";
  } else {
    if (conversation.name) {
      name = conversation.name;
    } else {
      name = conversation.participants.slice(0, 3).map(p => p.user?.fullName).join(", ")
      if (conversation.participants.length > 3) {
        name = `${name}, ...`
      }
    }
  }


  return (
    <div className="flex items-center gap-3 p-4 border-b bg-white">
      <Avatar className="h-12 w-12">
        <AvatarImage className="object-cover" src={avatar || ""} alt="avatar" />
        <AvatarFallback className="bg-gray-500 text-white">{name.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col min-w-0">
        <h2 className="font-medium text-sm text-gray-900 truncate">
          {name}
        </h2>
        {conversation.isGroup && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">
              {`${conversation.participants.length || "No"} members`}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
const ConversationCurrentMain = (props: any) => {
  const { user } = useAuth();
  const { messages, scrollContainerRef, handleScroll, isFetchingNextPage } = props;
  return (
    <div
      className="flex flex-col w-full overflow-y-auto h-[calc(100vh-242px)] bg-white"
    >
      <ChatMessageList scrollContainerRef={scrollContainerRef} onScroll={handleScroll}>
        <AnimatePresence>
          {isFetchingNextPage && (
            <div className="text-center text-gray-500">Đang tải thêm...</div>
          )}
          {messages?.map((message: Message, index: number) => {
            const fullName = message.senderUser?.firstName + " " + message.senderUser?.lastName;
            const isSentByMe = message.senderUser?.id === user?.id
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
                    <AvatarImage
                      className="object-cover"
                      src={message.senderUser.avatar?.url || ""}
                    />
                    <AvatarFallback className="bg-gray-500 text-white">
                      {fullName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    "flex flex-col max-w-[70%]",
                    isSentByMe ? "items-end" : "items-start"
                  )}
                >
                  {!isSentByMe && (
                    <span className="text-xs text-gray-600 mb-1">
                      {fullName}
                    </span>
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
                      {toVietnamDate(message.createdAt)}
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </ChatMessageList>
    </div>
  )
};
const ConversationCurrentBottom = (props: any) => {
  const { handleSend } = props;
  const [input, setInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim()) {
        handleSend(input);
        setInput("");
      }
    }
  };

  const onEmojiClick = (emojiObject: any) => {
    setInput(prev => prev + emojiObject.emoji);
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
            value={input}
            ref={inputRef}
            onKeyDown={handleKeyPress}
            onChange={handleInputChange}
            placeholder="Write a message..."
          />
        </div>
        <AnimatePresence initial={false}>
          {input.trim() ? (
            <Button
              className="h-9 w-9 hover:bg-gray-100"
              onClick={() => {
                handleSend(input);
                setInput("");
              }}
              // disabled={isLoading}
              variant="ghost"
              size="icon"
            >
              <SendHorizontal size={20} className="text-[#0a66c2]" />
            </Button>
          ) : (
            <Button
              className="h-9 w-9 hover:bg-gray-100"
              onClick={() => {
                handleSend("👍");
                setInput("");
              }}
              // disabled={isLoading}
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
};
export default function ConversationCurrent({
  pageId,
  isPageView
}: Props) {
  const router = useRouter();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { id: conversationId } = useParams();
  const { socket, sendMessage, onNewMessage, joinConversation } = useChat();

  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);

  const oldScrollHeight = useRef<number>(0);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { data: conversation, isLoading: isConversationLoading } = useQuery({
    queryKey: ["conversation", conversationId],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get<Conversation>(`api/chats/conversations/${conversationId}`);
        return res.data;
      } catch (e: any) {
        if (e.response.status === 404) {
          router.push("/chat");
        }
        return null;
      }
    }
  });

  // Fetch messages
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["messages", conversationId],
      queryFn: async ({ pageParam = null }: { pageParam: string | null }) => {
        const res = await axiosInstance.get<MessagesResponse>(
          "api/chats/messages",
          {
            params: {
              conversationId,
              limit: 20,
              cursor: pageParam
            }
          }
        );
        return res.data;
      },
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
      initialPageParam: null,
      enabled: !!conversation?.id
    });

  // Memoize messages array với thứ tự đúng
  const messages = useMemo(() => {
    // Không đảo ngược pages, chỉ lấy theo thứ tự từ server
    return data?.pages.reverse().flatMap((page) => page.items) ?? [];
  }, [data?.pages]);

  // Handle sending messages
  const handleSend = useCallback((input: string) => {
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    sendMessage({ conversationId: conversationId as string, content: trimmedInput, pageId });
    setShouldScrollToBottom(true);
  }, [conversationId, pageId, sendMessage]);

  // Handle scroll
  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

      // Check if scrolled to top for loading more messages
      if (scrollTop === 0 && hasNextPage) {
        // Lưu lại chiều cao cũ trước khi fetch
        oldScrollHeight.current = scrollHeight;
        fetchNextPage();
      }
      // Check if scrolled to bottom
      const isAtBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 1;
      setShouldScrollToBottom(isAtBottom);
    },
    [fetchNextPage, hasNextPage]
  );

  // Maintain scroll position after loading more messages
  useEffect(() => {
    if (scrollContainerRef.current && oldScrollHeight.current) {
      const newScrollHeight = scrollContainerRef.current.scrollHeight;
      const scrollDiff = newScrollHeight - oldScrollHeight.current;
      scrollContainerRef.current.scrollTop = scrollDiff;
      oldScrollHeight.current = 0; // Reset sau khi đã điều chỉnh
    }
  }, [data?.pages]);

  // Handle new messages
  useEffect(() => {
    let isSubscribed = true;

    const handleNewMessage = (message: Message) => {
      if (!isSubscribed) return;

      if (message.conversation.id === conversationId) {
        queryClient.setQueryData(["messages", conversationId], (old: any) => {
          if (!old) return old;

          return {
            ...old,
            // Thêm tin nhắn mới vào page đầu tiên
            pages: [
              {
                ...old.pages[0],
                items: [...old.pages[0].items, message]
              },
              ...old.pages.slice(1)
            ]
          };
        });

        socket?.emit("mark_as_read", {
          conversationId,
          userId: user?.id,
          messageId: message.id
        });
      }
    };

    onNewMessage(handleNewMessage);

    // Cleanup function
    return () => {
      isSubscribed = false;
    };
  }, [conversationId, onNewMessage, queryClient, socket, user?.id]);

  // Handle auto-scroll
  useEffect(() => {
    if (shouldScrollToBottom) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, shouldScrollToBottom]);

  useEffect(() => {
    if (conversation && socket) {
      joinConversation(conversation.id);

      socket.emit("mark_as_read", {
        conversationId: conversation.id,
        userId: user?.id,
        messageId: conversation?.lastMessage?.id
      });
    }
  }, [socket, conversation, joinConversation, user?.id]);

  if (isConversationLoading) {
    return <ConversationSkeleton />;
  }

  if (!conversation) {
    return null;
  }

  return (
    <div className="flex flex-col h-full border-l w-full">
      <ConversationCurrentHeader
        conversation={conversation}
        isPageView={isPageView}
      />
      <ConversationCurrentMain
        messages={messages}
        scrollContainerRef={scrollContainerRef}
        handleScroll={handleScroll}
        isFetchingNextPage={isFetchingNextPage}
      //bottomRef={bottomRef}
      />
      <ConversationCurrentBottom
        handleSend={handleSend}
      />
    </div>
  );
}
