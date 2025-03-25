/* eslint-disable @typescript-eslint/no-explicit-any */
import { useChat } from "@/contexts/ChatContext";
import axiosInstance from "@/lib/axios";
import { useAuth } from "@/providers/auth-provider";
import { Conversation } from "@/types/conversation";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useCallback } from "react";


const useConversations = ({
    pageId,
    isPageView,
    limit = 10,
}: {
    pageId?: string;
    isPageView?: boolean;
    limit?: number;
}) => {
    return useInfiniteQuery({
        queryKey: ['conversations', pageId, isPageView],
        queryFn: async ({ pageParam = null }) => {
            const params: any = {
                limit,
                cursor: pageParam,
            }

            if (isPageView) {
                params.pageId = pageId;
            }

            const res = await axiosInstance.get(`api/chats/${isPageView ? 'page-conversations' : 'conversations'}`, { params });
            return res.data;
        },
        getNextPageParam: (lastPage) => {
            return lastPage.nextCursor ?? undefined;
        },
        initialPageParam: null,
    });
}

type Props = {
    isPageView?: boolean;
    pageId?: string;
    activeConversationId?: string;
    onSelect: (conversation: Conversation) => void;
}

export default function ConversationList({ isPageView, pageId, activeConversationId, onSelect }: Props) {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useConversations({ isPageView, pageId });

    // Memoize conversations để tránh re-render không cần thiết
    const conversations = useMemo(() =>
        data?.pages.flatMap((page) => page.items) ?? [],
        [data?.pages]
    );

    const { onConversationUpdate } = useChat();

    // Xử lý cập nhật conversation
    useEffect(() => {
        let isSubscribed = true;

        const handleConversationUpdate = (updated: {
            conversationId: string;
            lastMessage: any;
            updatedAt: string;
        }) => {
            if (!isSubscribed) return;

            queryClient.setQueryData(['conversations', pageId, isPageView], (old: any) => {
                if (!old?.pages) return old;

                // Tìm và xóa conversation cũ khỏi tất cả các pages
                let foundConversation: any = null;
                const pagesWithoutUpdated = old.pages.map((page: any) => {
                    const existingConv = page.items.find((conv: any) => conv.id === updated.conversationId);
                    if (existingConv) {
                        foundConversation = {
                            ...existingConv,
                            lastMessage: updated.lastMessage,
                            updatedAt: updated.updatedAt,
                            isUnread: activeConversationId !== updated.conversationId
                        };
                    }
                    return {
                        ...page,
                        items: page.items.filter((conv: any) => conv.id !== updated.conversationId)
                    };
                });

                // Nếu không tìm thấy conversation cũ, tạo mới
                const updatedConversation = foundConversation || {
                    id: updated.conversationId,
                    lastMessage: updated.lastMessage,
                    updatedAt: updated.updatedAt,
                    isUnread: activeConversationId !== updated.conversationId,
                    participants: []
                };

                // Thêm conversation vào đầu page đầu tiên
                return {
                    ...old,
                    pages: [
                        {
                            ...pagesWithoutUpdated[0],
                            items: [updatedConversation, ...pagesWithoutUpdated[0].items]
                        },
                        ...pagesWithoutUpdated.slice(1)
                    ]
                };
            });
        };

        onConversationUpdate(handleConversationUpdate);

        return () => {
            isSubscribed = false;
        };
    }, [onConversationUpdate, queryClient, pageId, isPageView, activeConversationId]);

    // Xử lý infinite scroll
    const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
        const el = e.currentTarget;
        const isNearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 50;

        if (isNearBottom && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

    const handleSelectConversation = useCallback((conversation: Conversation) => {
        // Update conversation unread status in cache
        queryClient.setQueryData(['conversations', pageId, isPageView], (old: any) => {
            if (!old?.pages) return old;

            return {
                ...old,
                pages: old.pages.map((page: any) => ({
                    ...page,
                    items: page.items.map((item: any) =>
                        item.id === conversation.id
                            ? { ...item, isUnread: false }
                            : item
                    )
                }))
            };
        });

        onSelect(conversation);
    }, [onSelect, queryClient, pageId, isPageView]);

    // Render conversation item
    const renderConversationItem = useCallback((conversation: any) => {
        const participant = conversation.participants.find(
            (p: any) => !p.user || p.user.id !== user?.id
        );
        const name = participant?.page?.name || participant?.user?.username || 'Unknown';
        const avatar = participant?.page?.avatarUrl || participant?.user?.avatarUrl;

        return (
            <div
                key={conversation.id}
                className={`flex items-center gap-3 p-3 cursor-pointer border-b 
                    hover:bg-gray-100 transition-colors
                    ${conversation.isUnread ? 'bg-blue-50' : ''}
                    ${activeConversationId === conversation.id ? 'bg-gray-100' : ''}`}
                onClick={() => handleSelectConversation(conversation)}
            >
                <div className="relative">
                    <img
                        src={avatar || '/default-avatar.png'}
                        className="w-10 h-10 rounded-full object-cover"
                        alt={name}
                    />
                    {conversation.isUnread && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full" />
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <div className={`truncate ${conversation.isUnread ? 'font-semibold' : 'font-normal'}`}>
                        {name}
                    </div>
                    <div className={`text-sm truncate ${conversation.isUnread ? 'text-gray-900' : 'text-gray-500'}`}>
                        {conversation.lastMessage?.content || 'No messages yet'}
                    </div>
                </div>
                {conversation.updatedAt && (
                    <div className={`text-xs text-gray-400 whitespace-nowrap`}>
                        {new Date(conversation.updatedAt).toLocaleTimeString()}
                    </div>
                )}
            </div>
        );
    }, [user?.id, handleSelectConversation, activeConversationId]);

    return (
        <div className="w-full h-full overflow-y-auto" onScroll={handleScroll}>
            {conversations.map(renderConversationItem)}
            {isFetchingNextPage && (
                <div className="text-center py-2 text-gray-500">
                    Đang tải thêm...
                </div>
            )}
        </div>
    );
}