"use client";

import { MoreHorizontal } from "lucide-react";
import { ProtectedRouteLayout } from "@/components/layouts";
import { Page, usePages } from "@/providers/page-provider";
import { SearchBar } from "@/components/ui/search-bar";
import Link from "next/link";
import { formatDate } from "@/views/connections/connections";
import { useAuth } from "@/providers/auth-provider";
import { usePageFollowActions } from "@/views/connections/hooks/use-follow";
import { useEffect, useState } from "react";

const PagesView = () => {
  const { pages } = usePages();
  const { user } = useAuth();
  const { unfollowPage, isFollowing, isUnfollowing } = usePageFollowActions();

  if (!user)
    return (
      <p className="text-red-500 text-center py-4">
        Không có thông tin người dùng.
      </p>
    );

  return (
    <ProtectedRouteLayout sectionClassName="bg-[#f4f2ee] min-h-screen w-full h-full py-8 pt-3">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-md p-4 border border-gray-300 mx-auto">
        <h2 className="text-lg font-semibold text-gray-800">
          {user.total_followings} Trang đã theo dõi
        </h2>

        <div className="flex justify-end mb-4">
          <SearchBar />
        </div>

        {user.total_followings === 0 ? (
          <p className="text-gray-500 text-center py-4">
            Không tìm thấy trang nào.
          </p>
        ) : (
          <ul>
            {pages?.items.map((page: Page) => {
              const avatarUrl =
                page.avatar?.url || "https://via.placeholder.com/50";

              return (
                <li
                  key={page.id}
                  className="flex items-center justify-between py-3 border-t"
                >
                  <Link
                    href={`/page/${page.id}`}
                    className="font-medium text-gray-800 hover:underline"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={avatarUrl}
                        alt={page.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-800">{page.name}</p>
                        <p className="text-sm text-gray-500">{page.url}</p>
                        <p className="text-xs text-gray-400">
                          Đã kết nối vào {formatDate(page.createdAt)}
                        </p>
                      </div>
                    </div>
                  </Link>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => unfollowPage(page.id)}
                      className="px-4 py-1.5 rounded-full text-sm font-semibold transition bg-gray-500 text-white hover:bg-gray-600"
                      disabled={isFollowing || isUnfollowing}
                    >
                      {isFollowing || isUnfollowing
                        ? "Đang xử lý..."
                        : "Hủy theo dõi"}
                    </button>
                    <MoreHorizontal className="w-5 h-5 text-gray-500 cursor-pointer hover:text-black" />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </ProtectedRouteLayout>
  );
};

export default PagesView;
