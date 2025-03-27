/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChatInput } from "@/components/ui/chat/chat-input";
import { Button } from "@/components/ui/button";
import { SendHorizontal, ThumbsUp, X } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { useChat } from "@/contexts/ChatContext";
import axiosInstance from "@/lib/axios";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { ChatMessageList } from "@/components/ui/chat/chat-message-list";
import { AnimatePresence, motion } from "framer-motion";
import { cn, toVietnamDate } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";

interface Friend {
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    avatar?: { url: string };
}

interface Message {
    id: string;
    content: string;
    createdAt: string;
    senderUser: {
        id: string;
        fullName: string;
        avatar?: { url: string };
    };
}

export default function ConversationNew() {
    const router = useRouter();
    const { sendMessage } = useChat();
    const [selectedFriends, setSelectedFriends] = useState<Friend[]>([]);
    const [input, setInput] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearch = useDebounce(searchTerm, 300);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const { user } = useAuth();
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const queryClient = useQueryClient();

    // Fetch friends based on search term
    const { data: searchResults } = useQuery({
        queryKey: ['friends', 'search', 'a', debouncedSearch],
        queryFn: async () => {
            if (!debouncedSearch) return [];
            const res = await axiosInstance.get('api/friends/search/a', {
                params: { q: debouncedSearch }
            });

            return res.data.filter((friend: Friend) => !selectedFriends.some(f => f.id === friend.id));
        },
        enabled: !!debouncedSearch,
        staleTime: 0
    });

    // Check existing conversation
    const { data: existingConversation } = useQuery({
        queryKey: ['conversation', 'check', selectedFriends.map(friend => friend.id)],
        queryFn: async () => {
            if (selectedFriends.length === 0) return null;
            try {
                const res = await axiosInstance.post(`/api/chats/conversation/user-ids`, {
                    userIds: selectedFriends.map(friend => friend.id)
                });
                const conversation = res.data;

                return conversation;
            } catch (error: unknown) {
                console.error(error);
                return null;
            }
        },
        enabled: selectedFriends.length > 0
    });

    // Thêm query để fetch messages
    const { data: messagesData, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ['messages', existingConversation?.id],
        queryFn: async ({ pageParam = null }) => {
            const res = await axiosInstance.get("api/chats/messages", {
                params: {
                    conversationId: existingConversation?.id,
                    limit: 20,
                    cursor: pageParam
                }
            });
            return res.data;
        },
        getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
        enabled: !!existingConversation?.id,
        initialPageParam: null
    });

    // Memoize messages array
    const messages = useMemo(() => {
        return messagesData?.pages.reverse().flatMap((page) => page.items) ?? [];
    }, [messagesData?.pages]);

    // Handle scroll for loading more messages
    const handleScroll = useCallback(
        (e: React.UIEvent<HTMLDivElement>) => {
            const { scrollTop } = e.currentTarget;
            if (scrollTop === 0 && hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
            }
        },
        [fetchNextPage, hasNextPage, isFetchingNextPage]
    );

    const handleSelectFriend = (friend: Friend) => {
        setSelectedFriends((prev) => [...prev, friend]);
        setSearchTerm("");
    };

    const handleRemoveFriend = (friendId: string) => {
        setSelectedFriends(prev => prev.filter(f => f.id !== friendId));
    };

    const handleSend = async () => {
        if (!input.trim() || !selectedFriends.length) return;
        const messageContent = input.trim();
        setInput(""); // Clear input ngay lập tức

        // Tạo message object tạm thời
        const tempMessage = {
            id: Date.now().toString(),
            content: messageContent,
            createdAt: new Date().toISOString(),
            senderUser: {
                id: user?.id,
                fullName: user?.firstName + " " + user?.lastName,
                avatar: user?.avatar
            }
        };

        if (existingConversation) {
            // Update cache messages ngay lập tức
            queryClient.setQueryData(
                ['messages', existingConversation.id],
                (old: any) => {
                    if (!old) return {
                        pages: [{ items: [tempMessage] }],
                        pageParams: [null]
                    };

                    return {
                        ...old,
                        pages: [
                            {
                                ...old.pages[0],
                                items: [...old.pages[0].items, tempMessage]
                            },
                            ...old.pages.slice(1)
                        ]
                    };
                }
            );

            // Update conversations list cache để đánh dấu đã đọc
            queryClient.setQueryData(
                ['conversations'],
                (old: any) => {
                    if (!old?.pages) return old;
                    return {
                        ...old,
                        pages: old.pages.map((page: any) => ({
                            ...page,
                            items: page.items.map((conv: any) =>
                                conv.id === existingConversation.id
                                    ? {
                                        ...conv,
                                        lastMessage: tempMessage,
                                        isUnread: false // Đánh dấu đã đọc
                                    }
                                    : conv
                            )
                        }))
                    };
                }
            );

            // Gửi tin nhắn
            sendMessage({
                conversationId: existingConversation.id,
                content: messageContent
            });

            // Chuyển trang mượt mà
            router.push(`/chat/${existingConversation.id}`, { scroll: false });
        } else {
            try {
                const res = await axiosInstance.post('/api/chats/conversations/group', {
                    userIds: selectedFriends.map(friend => friend.id)
                });
                const newConversation = res.data;

                // Prefetch và update cache cho conversation mới
                queryClient.setQueryData(
                    ['messages', newConversation.id],
                    {
                        pages: [{ items: [tempMessage] }],
                        pageParams: [null]
                    }
                );

                // Update conversations list cache với trạng thái đã đọc
                queryClient.setQueryData(
                    ['conversations'],
                    (old: any) => {
                        if (!old?.pages) return old;
                        return {
                            ...old,
                            pages: [
                                {
                                    ...old.pages[0],
                                    items: [
                                        {
                                            ...newConversation,
                                            lastMessage: tempMessage,
                                            isUnread: false // Đánh dấu đã đọc cho conversation mới
                                        },
                                        ...old.pages[0].items
                                    ]
                                },
                                ...old.pages.slice(1)
                            ]
                        };
                    }
                );

                // Gửi tin nhắn
                sendMessage({
                    conversationId: newConversation.id,
                    content: messageContent
                });

                // Chuyển trang mượt mà
                router.push(`/chat/${newConversation.id}`, { scroll: false });
            } catch (error) {
                console.error('Failed to create conversation:', error);
                setInput(messageContent);
            }
        }
    };

    return (
        <div className="flex flex-col h-full border-l w-full">
            {/* Header */}
            <div className="flex items-center gap-3 p-4 border-b bg-white">
                <h2 className="font-medium">Tin nhắn mới</h2>
            </div>

            {/* Search and Selected Friends */}
            <div className="p-4 border-b bg-white">
                <div className="flex flex-wrap gap-2 items-center">
                    {selectedFriends.map(friend => (
                        <div
                            key={friend.id}
                            className="flex items-center gap-2 bg-gray-100 rounded-full py-1 px-3"
                        >
                            <Avatar className="h-6 w-6">
                                <AvatarImage src={friend.avatar?.url} />
                                <AvatarFallback>{friend.firstName[0]}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{friend.fullName}</span>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-4 w-4 p-0 hover:bg-gray-200"
                                onClick={() => handleRemoveFriend(friend.id)}
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </div>
                    ))}
                </div>

                <div className="relative mt-2">
                    <Command className="rounded-lg border shadow-md">
                        <CommandInput
                            placeholder="Tìm kiếm bạn bè..."
                            value={searchTerm}
                            onValueChange={setSearchTerm}
                        />
                        <CommandGroup>
                            {searchTerm.length > 0 && (
                                <>
                                    {!searchResults || searchResults.length === 0 ? (
                                        <CommandEmpty>Không tìm thấy kết quả</CommandEmpty>
                                    ) : (
                                        searchResults.map((friend: Friend) => (
                                            <CommandItem
                                                key={friend.id}
                                                value={friend.fullName}
                                                onSelect={() => handleSelectFriend(friend)}
                                                className="cursor-pointer"
                                            >
                                                <div className="flex items-center gap-2 p-1 w-full">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarImage src={friend.avatar?.url} />
                                                        <AvatarFallback>
                                                            {friend.firstName?.[0] || friend.fullName?.[0]}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col flex-1">
                                                        <span className="font-medium truncate">
                                                            {friend.fullName}
                                                        </span>
                                                    </div>
                                                </div>
                                            </CommandItem>
                                        ))
                                    )}
                                </>
                            )}
                        </CommandGroup>
                    </Command>
                </div>
            </div>

            {/* Thêm phần Messages */}
            <div className="flex-1 overflow-hidden bg-white">
                {existingConversation ? (
                    <div className="flex flex-col h-full">
                        <ChatMessageList
                            scrollContainerRef={scrollContainerRef}
                            onScroll={handleScroll}
                        >
                            <AnimatePresence>
                                {isFetchingNextPage && (
                                    <div className="text-center text-gray-500">
                                        Đang tải thêm...
                                    </div>
                                )}
                                {messages?.map((message: Message, index: number) => {
                                    const isSentByMe = message.senderUser.id === user?.id;
                                    return (
                                        <motion.div
                                            key={message.id}
                                            layout
                                            initial={{ opacity: 0, scale: 1, y: 50 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 1, y: 1 }}
                                            transition={{
                                                opacity: { duration: 0.1 },
                                                layout: {
                                                    type: "spring",
                                                    bounce: 0.3,
                                                    duration: index * 0.05 + 0.2
                                                }
                                            }}
                                            className={cn(
                                                "flex gap-2 px-4 py-1.5",
                                                isSentByMe ? "flex-row-reverse" : "flex-row"
                                            )}
                                        >
                                            {!isSentByMe && (
                                                <Avatar className="h-9 w-9 mt-5">
                                                    <AvatarImage
                                                        src={message.senderUser.avatar?.url}
                                                        className="object-cover"
                                                    />
                                                    <AvatarFallback>
                                                        {message.senderUser.fullName[0]}
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
                                                        {message.senderUser.fullName}
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
                                                <span className="text-[11px] text-gray-500 mt-1">
                                                    {toVietnamDate(message.createdAt)}
                                                </span>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </ChatMessageList>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                        Chọn người để bắt đầu cuộc trò chuyện
                    </div>
                )}
            </div>

            {/* Message Input */}
            <div className="mt-auto px-4 py-3 border-t bg-white">
                <div className="flex items-center gap-2">
                    <div className="flex-1">
                        <ChatInput
                            ref={inputRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                            placeholder="Nhập tin nhắn..."
                            disabled={!selectedFriends.length}
                        />
                    </div>
                    {input.trim() ? (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9"
                            onClick={handleSend}
                            disabled={!selectedFriends.length}
                        >
                            <SendHorizontal className="h-5 w-5 text-[#0a66c2]" />
                        </Button>
                    ) : (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9"
                            onClick={() => {
                                if (selectedFriends.length) {
                                    setInput("👍");
                                    handleSend();
                                }
                            }}
                            disabled={!selectedFriends.length}
                        >
                            <ThumbsUp className="h-5 w-5 text-gray-500" />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}