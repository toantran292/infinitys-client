import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { useState } from "react";
import { useAuth } from "@/providers/auth-provider";
import { SmilePlus, ThumbsUp } from "lucide-react";
import EmojiPicker, { EmojiStyle, Theme } from "emoji-picker-react";
import { CommentCard } from "./comment-card";
import { Profile } from "../chat-page";

interface Comment {
    id: string;
    content: string;
    createdAt: string;
    author: Profile;
    react_count: number;
    is_reacted?: boolean;
}

interface CommentSectionProps {
    postId: string;
}

const getComments = async (postId: string): Promise<Comment[]> => {
    const response = await axiosInstance.get(`api/posts/${postId}/comments`);
    return response.data;
};

export const CommentSection = ({ postId }: CommentSectionProps) => {
    const [newComment, setNewComment] = useState("");
    const queryClient = useQueryClient();
    const { user: currentUser } = useAuth();
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const { data: comments, isLoading } = useQuery({
        queryKey: ['comments', postId],
        queryFn: () => getComments(postId),
    });

    const { mutate: addComment } = useMutation({
        mutationFn: async () => {
            await axiosInstance.post(`/api/posts/${postId}/comments`, {
                content: newComment,
            });
        },
        onSuccess: () => {
            setNewComment("");
            queryClient.invalidateQueries({ queryKey: ['comments', postId] });
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        },
    });

    const handleSubmitComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (newComment.trim()) {
            addComment();
        }
    };

    const onEmojiClick = (emoji: any) => {
        setNewComment(newComment + emoji.emoji);
    };

    return (
        <div className="space-y-4">
            <form onSubmit={handleSubmitComment} className="flex items-center gap-3">
                <Avatar className="size-10">
                    <AvatarImage className="object-cover" src={currentUser?.avatar?.url} />
                    <AvatarFallback className="bg-gray-500 text-white">
                        {currentUser && `${currentUser.firstName[0]}${currentUser.lastName[0]}`}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1 relative">
                    <Input
                        placeholder="Thêm bình luận..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="w-full !rounded-full border border-gray-500 hover:border-gray-400 focus:border-gray-400 bg-white px-4 py-2 pr-32 placeholder:text-sm placeholder:text-gray-500"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                        <div className="relative">
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 hover:bg-gray-100"
                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            >
                                <SmilePlus size={20} className="text-gray-500" />
                            </Button>
                            {showEmojiPicker && (
                                <div className="absolute bottom-full right-0 mb-2 z-50">
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
                        {newComment.trim() && (
                            <Button
                                type="submit"
                                size="sm"
                                className="h-7 rounded-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 text-sm font-semibold"
                            >
                                Comment
                            </Button>
                        )}
                    </div>
                </div>
            </form>

            {isLoading ? (
                <div className="text-center text-gray-500 py-4">Loading comments...</div>
            ) : (
                <div className="space-y-4">
                    {comments?.map((comment) => (
                        <CommentCard key={comment.id} comment={comment} postId={postId} />
                    ))}
                </div>
            )}
        </div>
    );
}; 