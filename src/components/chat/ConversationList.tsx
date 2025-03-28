/* eslint-disable @typescript-eslint/no-explicit-any */
import { useChat } from "@/contexts/ChatContext";
import axiosInstance from "@/lib/axios";
import { useAuth } from "@/providers/auth-provider";
import { Conversation } from "@/types/conversation";
import {
  useInfiniteQuery,
  useQueryClient,
  useQuery
} from "@tanstack/react-query";
import { useEffect, useMemo, useCallback, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, SquarePen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, toVietnamDate } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";

export const useConversations = ({
  pageId,
  limit = 10
}: {
  pageId?: string;
  limit?: number;
}) => {
  return useInfiniteQuery({
    queryKey: ["conversations", pageId],
    queryFn: async ({ pageParam = null }) => {
      const params: any = {
        limit,
        cursor: pageParam
      };

      if (pageId) {
        params.pageId = pageId;
      }

      const res = await axiosInstance.get(
        `api/chats/${pageId ? "page-conversations" : "conversations"}`,
        { params }
      );
      return res.data;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.nextCursor ?? undefined;
    },
    initialPageParam: null
  });
};

const useSearch = (query: string) => {
  return useQuery({
    queryKey: ["conversations", "search", query],
    queryFn: async () => {
      if (!query) return null;
      const res = await axiosInstance.get(`api/chats/search`, {
        params: { q: query }
      });
      return res.data;
    },
    enabled: !!query
  });
};

type Props = {
  activeConversationId?: string;
  onSelect: (conversation: Conversation) => void;
};

const ConversationListHeader = ({
  onSearch
}: {
  onSearch: (value: string) => void;
}) => {
  const { pageId } = useParams();
  const router = useRouter();
  const [input, setInput] = useState("");
  const debouncedSearch = useDebounce(input, 300);

  useEffect(() => {
    onSearch(debouncedSearch);
  }, [debouncedSearch, onSearch]);

  return (
    <div className="flex flex-col border-b">
      <div className="flex justify-between p-4 items-center">
        <h1 className="text-xl font-semibold">
          Tin nhắn {pageId ? "trang" : "người dùng"}
        </h1>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => router.push(`/chat/new`)}
        >
          <SquarePen className="size-6" />
        </Button>
      </div>

      <div className="px-4 pb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Tìm kiếm"
            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-md text-sm focus:outline-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

const ConversationListBody = (props: any) => {
  const { conversations, handleSelectConversation, isFetchingNextPage } = props;
  const { id: conversationId, pageId } = useParams();
  const { user } = useAuth();
  const renderConversationItem = useCallback(
    (conversation: Conversation) => {
      let name = "";
      let avatar = "";

      if (conversation.isGroup) {
        if (conversation.name) {
          name = conversation.name;
        } else {
          const participants = conversation.participants.sort(
            (a: any, b: any) => b.user.createdAt - a.user.createdAt
          );
          name = participants
            .slice(0, 3)
            .map((p: any) => p.user.firstName)
            .join(", ");
          if (participants.length > 3) {
            name += `, ...`;
          }
        }
      } else {
        const participant = conversation.participants.find((p: any) =>
          pageId ? p.user : !p.user || p.user.id !== user?.id
        );
        console.log({ participant, participants: conversation.participants });
        name =
          participant?.page?.name || participant?.user?.fullName || "Unknown";
        avatar =
          participant?.page?.avatar?.url ||
          participant?.user?.avatar?.url ||
          "";
      }

      return (
        <div
          key={conversation.id}
          className={`flex items-center gap-3 p-3 cursor-pointer border-b 
                    hover:bg-gray-100 transition-colors relative
                    ${conversation.isUnread ? "bg-blue-50" : ""}
                    ${conversationId === conversation.id ? "bg-gray-100" : ""}`}
          onClick={() => handleSelectConversation(conversation)}
        >
          <div className="relative">
            <Avatar className="h-12 w-12">
              <AvatarImage className="object-cover" src={avatar} />
              <AvatarFallback className="bg-gray-500 text-white">
                {name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {conversation.isUnread && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-sm text-gray-900 truncate">
                {name}
              </h3>
              <span className="text-xs text-gray-500">
                {toVietnamDate(conversation.updatedAt)}
              </span>
            </div>
            <p
              className={cn(
                "text-sm truncate",
                conversation.isUnread
                  ? "text-gray-900 font-medium"
                  : "text-gray-500"
              )}
            >
              {conversation.lastMessage?.content || "No messages yet"}
            </p>
          </div>
        </div>
      );
    },
    [user?.id, handleSelectConversation, conversationId]
  );
  return (
    <div className="flex-1 overflow-y-auto">
      {conversations.map(renderConversationItem)}
      {isFetchingNextPage && (
        <div className="text-center py-2 text-gray-500">Đang tải thêm...</div>
      )}
    </div>
  );
};

export default function ConversationList({ onSelect }: Props) {
  const { id: conversationId, pageId } = useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useConversations({ pageId: pageId as string });

  const [searchQuery, setSearchQuery] = useState("");
  const { data: searchResults, isLoading: isSearching } =
    useSearch(searchQuery);

  // Memoize conversations để tránh re-render không cần thiết
  const conversations = useMemo(() => {
    if (searchQuery && searchResults) {
      return searchResults;
    }
    return data?.pages.flatMap((page) => page.items) ?? [];
  }, [data?.pages, searchQuery, searchResults]);

  const { onConversationUpdate } = useChat();

  // Xử lý cập nhật conversation
  useEffect(() => {
    let isSubscribed = true;

    const handleConversationUpdate = (updated: {
      conversationId: string;
      lastMessage: any;
      updatedAt: string;
      pageChatId: string;
    }) => {
      if (!isSubscribed) return;

      queryClient.setQueryData(["conversations", pageId], (old: any) => {
        if (!old?.pages) return old;
        console.log({ pageId, updated });
        if (pageId && updated.pageChatId !== pageId) return old;

        // Tìm và xóa conversation cũ khỏi tất cả các pages
        let foundConversation: any = null;
        const pagesWithoutUpdated = old.pages.map((page: any) => {
          const existingConv = page.items.find(
            (conv: any) => conv.id === updated.conversationId
          );
          if (existingConv) {
            foundConversation = {
              ...existingConv,
              lastMessage: updated.lastMessage,
              updatedAt: updated.updatedAt,
              isUnread: conversationId !== updated.conversationId
            };
          }
          return {
            ...page,
            items: page.items.filter(
              (conv: any) => conv.id !== updated.conversationId
            )
          };
        });

        if (updated.pageChatId) {
          if (foundConversation) {
            if (
              !foundConversation.participants.some(
                (p: any) => p.user?.id === user?.id
              ) &&
              !pageId
            ) {
              return old;
            }
          }
        }

        // Nếu không tìm thấy conversation cũ, tạo mới
        const updatedConversation = foundConversation || {
          id: updated.conversationId,
          lastMessage: updated.lastMessage,
          updatedAt: updated.updatedAt,
          isUnread: conversationId !== updated.conversationId,
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
  }, [onConversationUpdate, queryClient, pageId, conversationId]);

  // Xử lý infinite scroll
  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const el = e.currentTarget;
      const isNearBottom =
        el.scrollTop + el.clientHeight >= el.scrollHeight - 50;

      if (isNearBottom && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  const handleSelectConversation = useCallback(
    (conversation: Conversation) => {
      // Update conversation unread status in cache
      queryClient.setQueryData(["conversations", pageId], (old: any) => {
        if (!old?.pages) return old;

        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            items: page.items.map((item: any) =>
              item.id === conversation.id ? { ...item, isUnread: false } : item
            )
          }))
        };
      });

      onSelect(conversation);
    },
    [onSelect, queryClient, pageId]
  );

  return (
    <div className="w-full h-full overflow-y-auto" onScroll={handleScroll}>
      <ConversationListHeader onSearch={setSearchQuery} />
      {isSearching ? (
        <div className="flex items-center justify-center p-4 text-gray-500">
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
          Đang tìm kiếm...
        </div>
      ) : (
        <ConversationListBody
          conversations={conversations}
          handleSelectConversation={handleSelectConversation}
          isFetchingNextPage={!searchQuery && isFetchingNextPage}
        />
      )}
      {searchQuery && conversations.length === 0 && !isSearching && (
        <div className="text-center py-4 text-gray-500">
          Không tìm thấy kết quả
        </div>
      )}
    </div>
  );
}
