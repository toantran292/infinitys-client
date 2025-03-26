"use client";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { useRouter } from "next/navigation";
import { PostCard } from "@/components/post/post-card";
import { Profile } from "../types";

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
  const response = await axiosInstance.get("api/posts/me");
  return response.data;
};

interface PostListProps {
  showAll?: boolean;
}

export const PostList = ({ showAll = false }: PostListProps) => {
  const router = useRouter();
  const {
    data: posts,
    isLoading,
    error
  } = useQuery({
    queryKey: ["posts"],
    queryFn: getPosts
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading posts</div>;

  if (showAll) {
    return (
      <div className="space-y-4">
        {posts?.map((post) => (
          <PostCard key={post.id} post={post} showAll={true} />
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
          slidesToScroll: 1
        }}
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {posts?.map((post) => (
            <CarouselItem key={post.id} className="pl-2 md:pl-4 basis-1/2">
              <PostCard post={post} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute -left-4 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-gray-600/70 hover:bg-gray-600/90 border-none text-white" />
        <CarouselNext className="absolute -right-4 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-gray-600/70 hover:bg-gray-600/90 border-none text-white" />
      </Carousel>

      <Button
        variant="outline"
        className="w-full mt-2 border-gray-200"
        onClick={() => router.push("/activity")}
      >
        Hiển thị tất cả bài viết
      </Button>
    </div>
  );
};
