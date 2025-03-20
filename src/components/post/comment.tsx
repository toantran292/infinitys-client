import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Profile } from "@/views/profile/profile";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { useState } from "react";
import { useAuth } from "@/providers/auth-provider";
import { SmilePlus } from "lucide-react";
import EmojiPicker, { EmojiStyle, Theme } from "emoji-picker-react";

interface Comment {
    id: string;
    content: string;
    createdAt: string;
    author: Profile;
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

    const getTimeAgo = (date: string) => {
        const hours = Math.floor((new Date().getTime() - new Date(date).getTime()) / (1000 * 60 * 60));
        return `${hours} hours ago`;
    };

    return (
        <div className="space-y-4">
            <form onSubmit={handleSubmitComment} className="flex items-start gap-3">
                <Avatar className="w-10 h-10 mt-1">
                    <AvatarImage src={currentUser?.avatar?.url} />
                    <AvatarFallback className="bg-gray-500 text-white">
                        {currentUser && `${currentUser.firstName[0]}${currentUser.lastName[0]}`}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1 relative">
                    <Input
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="w-full rounded-full border border-gray-300 hover:border-gray-400 focus:border-gray-400 bg-white px-4 py-3 pr-32"
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
                                className="h-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 text-sm font-semibold"
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
                        <div key={comment.id} className="flex gap-3 group">
                            <Avatar className="w-10 h-10 mt-1">
                                <AvatarImage src={comment.author?.avatar?.url} />
                                <AvatarFallback className="bg-gray-500 text-white">
                                    {`${comment.author.firstName[0]}${comment.author.lastName[0]}`}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <div className="bg-gray-100 rounded-2xl py-2.5 px-4">
                                    <div className="flex items-start justify-between group">
                                        <div>
                                            <p className="text-sm font-semibold hover:text-blue-600 hover:underline cursor-pointer">
                                                {`${comment.author.firstName} ${comment.author.lastName}`}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-sm mt-1.5 text-gray-900">{comment.content}</p>
                                </div>
                                <div className="flex items-center gap-1 mt-1 px-4">
                                    <button className="text-xs text-gray-500 hover:text-gray-900 font-medium py-1 px-2 hover:bg-gray-100 rounded-md">
                                        Like
                                    </button>
                                    <span className="text-xs text-gray-400">•</span>
                                    <button className="text-xs text-gray-500 hover:text-gray-900 font-medium py-1 px-2 hover:bg-gray-100 rounded-md">
                                        Reply
                                    </button>
                                    <span className="text-xs text-gray-400">•</span>
                                    <span className="text-xs text-gray-500 py-1 px-2">{getTimeAgo(comment.createdAt)}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}; 