/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ProtectedRouteLayout } from "@/components/layouts";
import CreatePost from "@/components/post/create-post";
import { useInfiniteQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { PostCard } from "@/components/post/post-card";
import { Loader } from "@/components/ui/Loader";
import { LeftSideInfo } from "@/components/home/LeftSideInfo";
import { StatsCard } from "@/components/home/StatsCard";
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

const getNewsfeed = async ({ pageParam = null }) => {
  const response = await axiosInstance.get("api/newsfeed", {
    params: {
      limit: 5,
      lastId: pageParam
    }
  });
  return response.data;
};

export const HomeComponent = () => {
  const { ref, inView } = useInView();

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ["newfeeds"],
    queryFn: getNewsfeed,
    getNextPageParam: (lastPage) => {
      if (!lastPage.hasMore) return undefined; // Nếu số lượng items < 5 thì không còn page tiếp theo
      return lastPage.nextCursor; // Lấy id của post cuối cùng làm lastId
    },
    initialPageParam: null,
    staleTime: 0
  });

  // Tự động fetch page tiếp theo khi scroll đến cuối
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allPosts = data?.pages.flatMap(page => page.items) ?? [];

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
                {allPosts.map((post: any) => (
                  <PostCard key={post.id} post={post} showAll={true} />
                ))}

                {/* Loading indicator cho infinite scroll */}
                <div ref={ref} className="py-4">
                  {isFetchingNextPage && (
                    <div className="flex justify-center">
                      <Loader />
                    </div>
                  )}
                </div>

                {/* Hiển thị khi không có bài viết */}
                {allPosts.length === 0 && (
                  <div className="text-center text-gray-500">
                    Chưa có bài viết nào từ bạn bè
                  </div>
                )}

                {/* Hiển thị khi đã load hết bài viết */}
                {!hasNextPage && allPosts.length > 0 && (
                  <div className="text-center text-gray-500 py-4">
                    Đã hiển thị tất cả bài viết
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
