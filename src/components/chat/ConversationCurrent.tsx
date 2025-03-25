/* eslint-disable @typescript-eslint/no-explicit-any */
import { useChat } from "@/contexts/ChatContext";
import axiosInstance from "@/lib/axios";
import { useAuth } from "@/providers/auth-provider";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState, useMemo, useCallback } from "react";

type Props = {
    conversationId: string;
    pageId?: string;
}

interface Message {
    id: string;
    content: string;
    createdAt: string;
    senderUser: {
        id: string;
    };
    conversation: {
        id: string;
    };
}

interface MessagesResponse {
    items: Message[];
    nextCursor: string | null;
}

export default function ConversationCurrent({ conversationId, pageId }: Props) {
    const { user } = useAuth();
    const { socket, sendMessage, onNewMessage } = useChat();
    const queryClient = useQueryClient();
    const bottomRef = useRef<HTMLDivElement | null>(null);
    const [input, setInput] = useState('');
    const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const oldScrollHeight = useRef<number>(0);

    // Fetch messages
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ['messages', conversationId],
        queryFn: async ({ pageParam = null }: { pageParam: string | null }) => {
            const res = await axiosInstance.get<MessagesResponse>('api/chats/messages', {
                params: {
                    conversationId,
                    limit: 20,
                    cursor: pageParam,
                }
            });
            return res.data;
        },
        getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
        initialPageParam: null,
    });

    // Memoize messages array với thứ tự đúng
    const messages = useMemo(() => {
        // Không đảo ngược pages, chỉ lấy theo thứ tự từ server
        return data?.pages.reverse().flatMap(page => page.items) ?? [];
    }, [data?.pages]);

    // Handle sending messages
    const handleSend = useCallback(() => {
        const trimmedInput = input.trim();
        if (!trimmedInput) return;

        sendMessage({ conversationId, content: trimmedInput, pageId });
        setInput('');
        setShouldScrollToBottom(true);
    }, [input, conversationId, pageId, sendMessage]);

    // Handle scroll
    const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
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
    }, [fetchNextPage, hasNextPage]);

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
                queryClient.setQueryData(['messages', conversationId], (old: any) => {
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

                // Mark message as read if from other user
                if (message.senderUser?.id !== user?.id) {
                    socket?.emit('mark_as_read', {
                        conversationId,
                        userId: user?.id,
                        messageId: message.id
                    });
                }
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
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, shouldScrollToBottom]);

    return (
        <div className="flex flex-col h-full border-l">
            <div
                ref={scrollContainerRef}
                className="flex-1 overflow-y-auto px-4 py-2 space-y-2"
                onScroll={handleScroll}
            >
                {isFetchingNextPage && (
                    <div className="text-center text-gray-500">Đang tải thêm...</div>
                )}

                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`max-w-xs p-2 rounded-lg ${message.senderUser?.id === user?.id
                            ? 'bg-blue-500 text-white self-end ml-auto'
                            : 'bg-gray-200'
                            }`}
                    >
                        {message.content}
                        <div className="text-xs text-right opacity-50">
                            {new Date(message.createdAt).toLocaleTimeString()}
                        </div>
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>

            <div className="p-3 border-t flex gap-2">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Nhập tin nhắn..."
                    className="flex-1 border rounded px-3 py-2"
                />
                <button
                    onClick={handleSend}
                    className="px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Gửi
                </button>
            </div>
        </div>
    );
}