import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ThumbsUp, MessageCircle } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { useState } from "react";
import { CommentSection } from "@/components/comment/comment-list";
import { Profile } from "../chat-page";
import { PostContent } from './post-content';
import Image from 'next/image';
import { ImageViewerModal } from "./image-viewer-modal";

interface Post {
    id: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    author: Profile;
    comment_count: number;
    react_count: number;
    images: Array<{
        url: string;
    }>;
}

interface PostCardProps {
    post: Post;
}

export const PostCard = ({ post }: PostCardProps) => {
    const queryClient = useQueryClient();
    const [showComments, setShowComments] = useState(false);
    const [isLikeAnimating, setIsLikeAnimating] = useState(false);
    const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
        return `${hours} giờ trước`;
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

    const handleImageClick = (index: number) => {
        setCurrentImageIndex(index);
        setIsImageViewerOpen(true);
    };

    const handleNextImage = () => {
        if (currentImageIndex < post.images.length - 1) {
            setCurrentImageIndex(currentImageIndex + 1);
        }
    };

    const handlePrevImage = () => {
        if (currentImageIndex > 0) {
            setCurrentImageIndex(currentImageIndex - 1);
        }
    };

    if (isLoadingReactStatus) {
        return <div>Loading...</div>;
    }

    const isReacted = reactStatus?.isActive;

    return (
        <div className="border border-gray-200 rounded-lg w-full bg-white shadow-sm">
            <div className="p-4 space-y-4">
                <div className="flex gap-2 items-center">
                    <Avatar className="h-12 w-12">
                        <AvatarImage className="object-cover" src={post.author?.avatar?.url} />
                        <AvatarFallback className="bg-gray-500 text-white">{`${post.author.firstName[0]}${post.author.lastName[0]}`}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <p className="font-bold">{`${post.author.firstName} ${post.author.lastName}`}</p>
                        <p className="text-xs text-gray-500">{getTimeAgo(post.createdAt)}</p>
                    </div>
                </div>

                <PostContent content={post.content} />
            </div>

            <div className="h-[250px]">
                {post.images && post.images.length > 0 ? (
                    <div className={`grid gap-1 h-full ${post.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                        {post.images.slice(0, Math.min(2, post.images.length)).map((image, index) => (
                            <div
                                key={index}
                                className="relative h-full cursor-pointer"
                                onClick={() => handleImageClick(index)}
                            >
                                <Image
                                    src={image.url}
                                    alt={`Post image ${index + 1}`}
                                    fill
                                    className="object-cover"
                                />
                                {index === 1 && post.images.length > 2 && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                        <span className="text-white text-2xl font-bold">
                                            +{post.images.length - 2}
                                        </span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="h-full bg-gray-50"></div>
                )}
            </div>

            <ImageViewerModal
                isOpen={isImageViewerOpen}
                onClose={() => setIsImageViewerOpen(false)}
                images={post.images}
                currentImageIndex={currentImageIndex}
                onNextImage={handleNextImage}
                onPrevImage={handlePrevImage}
                post={post}
                getTimeAgo={getTimeAgo}
            />

            <div className="flex flex-col gap-2 p-4">
                <div className="flex justify-between text-sm text-gray-500 px-2 border-b border-gray-200 pb-1">
                    <div className="flex items-center gap-1">
                        <div className={`flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 transition-transform ${isLikeAnimating ? 'scale-125' : ''}`}>
                            <ThumbsUp size={12} className="text-white" />
                        </div>
                        <span>{post.react_count}</span>
                    </div>
                    <span>{post.comment_count} bình luận</span>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        className={`text-sm flex items-center gap-1 flex-1 ${isReacted ? 'bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700' : ''}`}
                        variant="ghost"
                        onClick={() => likePost()}
                    >
                        <ThumbsUp size={16} className={isReacted ? 'fill-current' : ''} />
                        Thích
                    </Button>
                    <Button
                        className="text-sm flex items-center gap-1 flex-1"
                        variant="ghost"
                        onClick={() => setShowComments(!showComments)}
                    >
                        <MessageCircle size={16} />
                        Bình luận
                    </Button>
                </div>
                {showComments && (
                    <div className="mt-4">
                        <CommentSection postId={post.id} />
                    </div>
                )}
            </div>
        </div >
    );
} 