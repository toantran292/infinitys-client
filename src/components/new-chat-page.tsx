import React, { useState, useMemo } from 'react';
import { MultiSelect } from './ui/multi-select';
import { useCreateGroupChat, useGetFriends, useGetGroupChatbyMembersIds, useGetGroupChatMessage } from '@/views/chat-id/hooks';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';
import { ChatList } from './ui/chat/chat-list';
import ChatBottomBar from './ui/chat/chat-bottombar';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
export const NewChatPage = () => {
    const router = useRouter();
    const { user } = useAuth();
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const { friends, isLoading: isFetchingFriends } = useGetFriends(user?.id);

    const { group, isLoading: isFetchingGroup } = useGetGroupChatbyMembersIds(selectedUsers);
    const { groupChatMessage } = useGetGroupChatMessage(group?.id);
    const { createGroupChat, isPending: isCreatingGroup } = useCreateGroupChat();

    const friendOptions = useMemo(() => {
        return friends?.map((friend: any) => ({
            label: `${friend.firstName} ${friend.lastName}`,
            value: friend.id,
        })) || [];
    }, [friends]);

    const handleSelectUsers = (users: string[]) => {
        setSelectedUsers(users);
    }

    const handleAccessGroupChat = () => {
        if (group?.id) {
            router.push(`/chat/${group.id}`);
        } else {
            createGroupChat(selectedUsers);
        }
    }


    return (
        <div className="bg-white flex flex-col w-full h-full">
            <h1 className="text-xl font-semibold p-4 border-b border-gray-100">New message</h1>
            <div className="p-4 border-b border-gray-200">
                <MultiSelect
                    options={friendOptions}
                    onValueChange={handleSelectUsers}
                    placeholder="Type a name or multiple names"
                    className="border-0 shadow-none"
                    disabled={isFetchingFriends}
                />
                {isFetchingFriends && (
                    <div className="flex items-center justify-center p-4">
                        <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                )}
            </div>
            {groupChatMessage ? (
                <ChatList messages={groupChatMessage} />
            ) : (
                <div className="flex items-center justify-center p-4 flex-1">
                    <p>No messages yet</p>
                </div>
            )}
            <Button onClick={handleAccessGroupChat} disabled={isCreatingGroup}>{group?.id ? "Go to this Chat" : "Create a new Chat"}</Button>
        </div>
    );
};

export default NewChatPage; 