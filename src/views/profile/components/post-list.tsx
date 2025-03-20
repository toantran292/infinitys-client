"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ThumbsUp, MessageCircle } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { Profile } from "../profile";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CommentSection } from "@/components/post/comment";


interface Post {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: Profile;
  comment_count: number;
  react_count: number;
  is_reacted: boolean;
}

const getPosts = async (): Promise<Post[]> => {
  const response = await axiosInstance.get('api/posts/me');
  return response.data;
};

interface PostListProps {
  showAll?: boolean;
}

export const PostList = ({ showAll = false }: PostListProps) => {
  const router = useRouter();
  const { data: posts, isLoading, error } = useQuery({
    queryKey: ['posts'],
    queryFn: getPosts,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading posts</div>;

  if (showAll) {
    return (
      <div className="space-y-4">
        {posts?.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 p-4 mb-4">
      <Carousel
        className="w-full max-w-[850px] mx-auto relative"
        opts={{
          align: "start",
          slidesToScroll: 1,
        }}
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {posts?.map((post) => (
            <CarouselItem key={post.id} className="pl-2 md:pl-4 basis-1/2">
              <PostCard post={post} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute -left-1 top-1/2 -translate-y-1/2 h-10 w-10 border-2 bg-gray-100 hover:bg-white/90 -translate-x-1/2" />
        <CarouselNext className="absolute -right-1 top-1/2 -translate-y-1/2 h-10 w-10 border-2 bg-gray-100 hover:bg-white/90 translate-x-1/2" />
      </Carousel>

      <Button
        variant="outline"
        className="w-full mt-2 border-gray-200"
        onClick={() => router.push('/activity')}
      >
        Hiển thị tất cả bài viết
      </Button>
    </div>
  );
}

interface PostCardProps {
  post: Post;
}

export const PostCard = ({ post }: PostCardProps) => {
  const queryClient = useQueryClient();
  const [showComments, setShowComments] = useState(false);

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
      queryClient.setQueryData(['posts'], (oldData: Post[] | undefined) => {
        if (!oldData) return oldData;
        return oldData.map(p => {
          if (p.id === post.id) {
            return {
              ...p,
              is_reacted: !p.is_reacted,
              react_count: p.is_reacted ? p.react_count - 1 : p.react_count + 1
            };
          }
          return p;
        });
      });

      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

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
        {/* Nao co ảnh thì thêm */}
        <img src="https://github.com/shadcn.png" alt="post" className="w-full object-cover" />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex justify-between text-sm text-gray-500 px-2 border-b border-gray-200 pb-1">
          <span>{post.react_count} likes</span>
          <span>{post.comment_count} comments</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            className={`text-sm flex items-center gap-1 flex-1 ${post.is_reacted ? 'bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700' : ''}`}
            variant="ghost"
            onClick={() => likePost()}
          >
            <ThumbsUp size={16} className={post.is_reacted ? 'fill-current' : ''} />
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
