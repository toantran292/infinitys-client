/* eslint-disable @typescript-eslint/no-explicit-any */
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ThumbsUp, MessageCircle } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { useState } from "react";
import { CommentSection } from "@/components/comment/comment-list";
import { Profile } from "../chat-page";
import { PostContent } from "./post-content";
import Image from "next/image";
import { ImageViewerModal } from "./image-viewer-modal";
import { cx } from "class-variance-authority";
import { useRouter } from "next/navigation";
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
  showAll?: boolean;
}

interface PostCardProps {
  post: Post;
  showAll?: boolean;
}

export const PostCard = ({ post, showAll = false }: PostCardProps) => {
  const queryClient = useQueryClient();
  const [postData, setPostData] = useState<Post>(post);
  const [showComments, setShowComments] = useState(false);
  const [isLikeAnimating, setIsLikeAnimating] = useState(false);
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const router = useRouter();

  const { data: reactStatus, isLoading: isLoadingReactStatus } = useQuery({
    queryKey: ["react", postData.id],
    queryFn: async () => {
      const response = await axiosInstance.post(`/api/reacts/${postData.id}`, {
        targetId: postData.id,
        targetType: "posts"
      });
      return response.data;
    }
  });

  const getTimeAgo = (date: string) => {
    const hours = Math.floor(
      (new Date().getTime() - new Date(date).getTime()) / (1000 * 60 * 60)
    );
    return `${hours} giờ trước`;
  };

  const { mutate: likePost } = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.post(`/api/reacts`, {
        targetId: postData.id,
        targetType: "posts"
      });
      return response.data;
    },
    onSuccess: (data: any) => {
      setIsLikeAnimating(true);
      setTimeout(() => setIsLikeAnimating(false), 1000);

      setPostData(prev => ({
        ...prev,
        react_count: prev.react_count + (data.isActive ? 1 : -1)
      }));

      queryClient.setQueryData(["react", postData.id], () => {
        return data;
      });
    }
  });

  const handleSubmitComment = () => {
    console.log("handleSubmitComment");
    setPostData(prev => ({
      ...prev,
      comment_count: prev.comment_count + 1
    }));
  }

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
    setIsImageViewerOpen(true);
  };

  const handleNextImage = () => {
    if (currentImageIndex < postData.images.length - 1) {
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
    <div className="border border-gray-200 rounded-lg w-full bg-white shadow-sm h-full flex flex-col justify-between">
      <div className="p-4 space-y-4">
        <div className="flex gap-2 items-center cursor-pointer" onClick={() => router.push(`/profile/${postData.author.id}`)}>
          <Avatar className="h-12 w-12">
            <AvatarImage
              className="object-cover"
              src={postData.author?.avatar?.url}
            />
            <AvatarFallback className="bg-gray-500 text-white">{`${postData.author.firstName[0]}${postData.author.lastName[0]}`}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="font-bold">{`${postData.author.firstName} ${postData.author.lastName}`}</p>
            <p className="text-xs text-gray-500">
              {getTimeAgo(postData.createdAt)}
            </p>
          </div>
        </div>

        <PostContent content={postData.content} />
      </div>

      <div
        className={cx(
          !post?.images?.length && showAll
            ? "h-0"
            : showAll && postData.images?.length === 1
              ? "h-auto"
              : "h-[250px]"
        )}
      >
        {postData.images && postData.images.length > 0 ? (
          <div
            className={`grid gap-1 ${postData.images.length === 1 ? "grid-cols-1" : "grid-cols-2"} ${showAll && postData.images.length === 1 ? "h-auto" : "h-full"}`}
          >
            {postData.images
              .slice(0, Math.min(2, postData.images.length))
              .map((image, index) => (
                <div
                  key={index}
                  className={`relative cursor-pointer ${showAll && postData.images.length === 1 ? "h-auto aspect-auto" : "h-full"}`}
                  onClick={() => handleImageClick(index)}
                >
                  {showAll && postData.images.length === 1 ? (
                    <Image
                      src={image.url}
                      alt={`Post image ${index + 1}`}
                      width={1000}
                      height={1000}
                      className="object-contain w-full"
                      style={{ maxHeight: "600px" }}
                    />
                  ) : (
                    <Image
                      src={image.url}
                      alt={`Post image ${index + 1}`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                    />
                  )}
                  {index === 1 && postData.images.length > 2 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">
                        +{postData.images.length - 2}
                      </span>
                    </div>
                  )}
                </div>
              ))}
          </div>
        ) : (
          <div className="h-full"></div>
        )}
      </div>

      <ImageViewerModal
        isOpen={isImageViewerOpen}
        onClose={() => setIsImageViewerOpen(false)}
        images={postData.images}
        currentImageIndex={currentImageIndex}
        onNextImage={handleNextImage}
        onPrevImage={handlePrevImage}
        post={postData}
        getTimeAgo={getTimeAgo}
        onLikePost={likePost}
        onSubmitComment={handleSubmitComment}
        reactStatus={reactStatus}
      />

      <div className="flex flex-col gap-2 p-4">
        <div className="flex justify-between text-sm text-gray-500 px-2 border-b border-gray-200 pb-1">
          <div className="flex items-center gap-1">
            <div
              className={`flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 transition-transform ${isLikeAnimating ? "scale-125" : ""}`}
            >
              <ThumbsUp size={12} className="text-white" />
            </div>
            <span>{postData.react_count}</span>
          </div>
          <span>{postData.comment_count} bình luận</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            className={`text-sm flex items-center gap-1 flex-1 ${isReacted ? "bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700" : ""}`}
            variant="ghost"
            onClick={() => likePost()}
          >
            <ThumbsUp size={16} className={isReacted ? "fill-current" : ""} />
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
            <CommentSection postId={postData.id} onSubmitComment={handleSubmitComment} />
          </div>
        )}
      </div>
    </div>
  );
};
