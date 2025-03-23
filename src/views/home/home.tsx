'use client';

import { ProtectedRouteLayout } from "@/components/layouts";
import CreatePost from "@/components/post/create-post";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { PostCard } from "@/components/post/post-card";
import { Loader } from "@/components/ui/Loader";
import { LeftSideInfo } from "@/components/home/LeftSideInfo";
import { StatsCard } from "@/components/home/StatsCard";

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
      <div className="px-6 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-[200px_minmax(0,_1fr)_240px] gap-4 mx-auto max-w-[1200px]">
          <div className="relative">
            <div className="sticky top-[80px]">
              <LeftSideInfo />
            </div>
          </div>

          <div className="space-y-4">
            <div className="border-b border-gray-200 pb-4">
              <CreatePost />
            </div>

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

          <div className="relative hidden lg:block">
            <div className="sticky top-[80px]">
              <StatsCard />
            </div>
          </div>
        </div>
      </div>
    </ProtectedRouteLayout>
  );
};
