'use client';

import { ProtectedRouteLayout } from "@/components/layouts";
import CreatePost from "@/components/post/create-post";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { PostCard } from "@/components/post/post-card";
import { Loader } from "@/components/ui/Loader";

const getNewsfeed = async () => {
  const response = await axiosInstance.get('api/posts/newsfeed');
  return response.data;
};

export const HomeComponent = () => {
  const { data: posts, isLoading, error } = useQuery({
    queryKey: ['posts'],
    queryFn: getNewsfeed
  });

  return (
    <ProtectedRouteLayout>
      <div className="max-w-2xl mx-auto py-6 px-4 space-y-6">
        <CreatePost />

        {isLoading ? (
          <div className="flex justify-center">
            <Loader />
          </div>
        ) : error ? (
          <div className="text-center text-red-500">
            Có lỗi xảy ra khi tải bài viết
          </div>
        ) : (
          <div className="space-y-4">
            {posts?.map((post: any) => (
              <PostCard key={post.id} post={post} />
            ))}
            {posts?.length === 0 && (
              <div className="text-center text-gray-500">
                Chưa có bài viết nào từ bạn bè
              </div>
            )}
          </div>
        )}
      </div>
    </ProtectedRouteLayout>
  );
};
