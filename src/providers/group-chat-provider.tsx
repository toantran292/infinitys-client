'use client';

import React, { createContext, useContext, useState } from 'react';
import { GroupChat } from '@/components/chat-page';
import { useGetGroupChats, useGetGroupChat, useCreateGroupChat } from '@/views/chat-id/hooks';
import { useParams } from 'next/navigation';

interface GroupChatContextType {
    selectedChat: GroupChat | null;
    setSelectedChat: (chat: GroupChat | null) => void;
    groupChats: GroupChat[] | undefined;
    isLoading: boolean;
    createNewGroupChat: (userId: string) => void;
    isCreating: boolean;
    currentGroupChat: GroupChat | undefined;
    currentGroupChatLoading: boolean;
    search: string;
    setSearch: (search: string) => void;
}

const GroupChatContext = createContext<GroupChatContextType | undefined>(undefined);

export function GroupChatProvider({ children }: { children: React.ReactNode }) {
    const [search, setSearch] = useState('');

    const [selectedChat, setSelectedChat] = useState<GroupChat | null>(null);

    // Lấy danh sách group chats
    const { groupChats, isLoading } = useGetGroupChats(search);

    // Lấy thông tin chi tiết của group chat được chọn
    const { groupChat: currentGroupChat, isLoading: currentGroupChatLoading } = useGetGroupChat(selectedChat?.id);

    // Hook tạo group chat mới
    const { createGroupChat, isPending: isCreating } = useCreateGroupChat();

    const value = {
        selectedChat,
        setSelectedChat,
        groupChats,
        isLoading,
        createNewGroupChat: createGroupChat,
        isCreating,
        currentGroupChat,
        currentGroupChatLoading,
        search,
        setSearch
    };

    return (
        <GroupChatContext.Provider value={value}>
            {children}
        </GroupChatContext.Provider>
    );
}

export function useGroupChat() {
    const context = useContext(GroupChatContext);
    if (context === undefined) {
        throw new Error('useGroupChat must be used within a GroupChatProvider');
    }
    return context;
} 