import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ThumbsUp, MessageCircle } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { useState } from "react";
import { CommentSection } from "@/components/comment/comment-list";
import { Profile } from "@/views/profile/profile";

interface Post {
    id: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    author: Profile;
    comment_count: number;
    react_count: number;
}

interface PostCardProps {
    post: Post;
}

export const PostCard = ({ post }: PostCardProps) => {
    const queryClient = useQueryClient();
    const [showComments, setShowComments] = useState(false);
    const [isLikeAnimating, setIsLikeAnimating] = useState(false);

    const { data: reactStatus, isLoading: isLoadingReactStatus } = useQuery({
        queryKey: ['react', post.id],
        queryFn: async () => {
            const response = await axiosInstance.post(`/api/reacts/${post.id}`, {
                targetId: post.id,
                targetType: 'posts'
            });
            return response.data;
        },
    });

    const getTimeAgo = (date: string) => {
        const hours = Math.floor((new Date().getTime() - new Date(date).getTime()) / (1000 * 60 * 60));
        return `${hours} hours ago`;
    };

    const { mutate: likePost } = useMutation({
        mutationFn: async () => {
            await axiosInstance.post(`/api/reacts`, {
                targetId: post.id,
                targetType: 'posts'
            });
        },
        onSuccess: () => {
            setIsLikeAnimating(true);
            setTimeout(() => setIsLikeAnimating(false), 1000);

            queryClient.setQueryData(['posts'], (oldData: Post[] | undefined) => {
                if (!oldData) return oldData;
                return oldData.map(p => {
                    if (p.id === post.id) {
                        return {
                            ...p,
                            is_reacted: !reactStatus?.isActive,
                            react_count: reactStatus?.isActive ? p.react_count - 1 : p.react_count + 1
                        };
                    }
                    return p;
                });
            });

            queryClient.setQueryData(['react', post.id], (old: any) => ({
                isActive: !old?.isActive
            }));

            queryClient.invalidateQueries({ queryKey: ['posts'] });
            queryClient.invalidateQueries({ queryKey: ['react', post.id] });
        },
    });

    if (isLoadingReactStatus) {
        return <div>Loading...</div>;
    }

    const isReacted = reactStatus?.isActive;

    console.log(isReacted);

    return (
        <div className="p-4 border border-gray-200 rounded-lg w-full space-y-4">
            <div className="flex gap-4">
                <Avatar className="w-10 h-10">
                    <AvatarImage src={post.author?.avatar?.url} />
                    <AvatarFallback className="bg-gray-500 text-white">{`${post.author.firstName[0]}${post.author.lastName[0]}`}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-1">
                    <p className="text-sm font-bold">{`${post.author.firstName} ${post.author.lastName}`}</p>
                    <p className="text-xs text-gray-500">{getTimeAgo(post.createdAt)}</p>
                </div>
            </div>

            <div>
                <p className="text-sm line-clamp-3">{post.content}</p>
            </div>

            <div className="w-full h-full min-h-[300px]">
                <img src="https://github.com/shadcn.png" alt="post" className="w-full object-cover" />
            </div>

            <div className="flex flex-col gap-2">
                <div className="flex justify-between text-sm text-gray-500 px-2 border-b border-gray-200 pb-1">
                    <div className="flex items-center gap-1">
                        <div className={`flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 transition-transform ${isLikeAnimating ? 'scale-125' : ''}`}>
                            <ThumbsUp size={12} className="text-white" />
                        </div>
                        <span>{post.react_count}</span>
                    </div>
                    <span>{post.comment_count} comments</span>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        className={`text-sm flex items-center gap-1 flex-1 ${isReacted ? 'bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700' : ''}`}
                        variant="ghost"
                        onClick={() => likePost()}
                    >
                        <ThumbsUp size={16} className={isReacted ? 'fill-current' : ''} />
                        Like
                    </Button>
                    <Button
                        className="text-sm flex items-center gap-1 flex-1"
                        variant="ghost"
                        onClick={() => setShowComments(!showComments)}
                    >
                        <MessageCircle size={16} />
                        Comment
                    </Button>
                </div>
                {showComments && (
                    <div className="mt-4">
                        <CommentSection postId={post.id} />
                    </div>
                )}
            </div>
        </div>
    );
} 