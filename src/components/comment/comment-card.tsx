import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThumbsUp } from "lucide-react";
import { Profile } from "../chat-page";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { useState } from "react";

interface Comment {
    id: string;
    content: string;
    createdAt: string;
    author: Profile;
    react_count: number;
}

interface ReactStatus {
    isActive: boolean;
    react_count: number;
}

export const CommentCard = ({ comment, postId }: { comment: Comment, postId: string }) => {
    const queryClient = useQueryClient();
    const [isLikeAnimating, setIsLikeAnimating] = useState(false);

    const getTimeAgo = (date: string) => {
        const hours = Math.floor((new Date().getTime() - new Date(date).getTime()) / (1000 * 60 * 60));
        return `${hours} giờ trước`;
    };

    const { data: reactCommentStatus, isLoading: isLoadingReactCommentStatus } = useQuery<ReactStatus>({
        queryKey: ['react', comment.id],
        queryFn: async () => {
            const response = await axiosInstance.post(`/api/reacts/${comment.id}`, {
                targetId: comment.id,
                targetType: 'comments'
            });
            return response.data;
        },
    });

    const { mutate: reactComment } = useMutation({
        mutationFn: async (commentId: string) => {
            const response = await axiosInstance.post(`/api/reacts`, {
                targetId: commentId,
                targetType: 'comments'
            });
            return response.data;
        },
        onSuccess: (data, commentId) => {
            setIsLikeAnimating(true);
            setTimeout(() => setIsLikeAnimating(false), 1000);

            // Update react status in cache
            queryClient.setQueryData(['react', commentId], (oldData: ReactStatus | undefined) => ({
                isActive: !oldData?.isActive,
                react_count: oldData?.isActive ?
                    (oldData.react_count - 1) :
                    (oldData?.react_count || 0) + 1
            }));

            // Update comment data
            queryClient.setQueryData(['comments', postId], (oldData: Comment[] | undefined) => {
                if (!oldData) return oldData;
                return oldData.map(comment => {
                    if (comment.id === commentId) {
                        const newReactCount = reactCommentStatus?.isActive ?
                            comment.react_count - 1 :
                            comment.react_count + 1;
                        return {
                            ...comment,
                            react_count: newReactCount
                        };
                    }
                    return comment;
                });
            });

            queryClient.invalidateQueries({ queryKey: ['react', commentId] });
            queryClient.invalidateQueries({ queryKey: ['comments', postId] });
        },
    });

    if (isLoadingReactCommentStatus) return null;

    const displayReactCount = reactCommentStatus?.react_count || comment.react_count;

    return (
        <div key={comment.id} className="flex gap-2 group">
            <Avatar className="w-10 h-10 mt-1">
                <AvatarImage className="object-cover" src={comment.author?.avatar?.url} />
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
                    <div className="flex items-center">
                        <button
                            onClick={() => reactComment(comment.id)}
                            className={`flex items-center gap-1 text-xs ${reactCommentStatus?.isActive ? 'text-blue-600 font-semibold' : 'text-gray-500 hover:text-gray-900'
                                } font-medium py-1 px-2 hover:bg-gray-100 rounded-md`}
                        >
                            <div className={`flex items-center justify-center ${reactCommentStatus?.isActive ? 'text-blue-600' : 'text-gray-500'
                                }`}>
                                <ThumbsUp
                                    size={14}
                                    className={`transition-transform ${reactCommentStatus?.isActive ? 'fill-current' : ''
                                        } ${isLikeAnimating ? 'scale-125' : ''}`}
                                />
                            </div>
                            {displayReactCount > 0 && (
                                <span className={`transition-transform ${isLikeAnimating ? 'scale-125' : ''
                                    }`}>
                                    {displayReactCount}
                                </span>
                            )}
                        </button>
                    </div>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500 py-1 px-2">{getTimeAgo(comment.createdAt)}</span>
                </div>
            </div>
        </div>
    );
};