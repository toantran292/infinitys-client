"use client";

import { MoreHorizontal } from "lucide-react";
import { ProtectedRouteLayout } from "@/components/layouts";
import { usePages } from "@/providers/page-provider"; // Thay thế useConnections bằng usePages
import { SearchBar } from "@/components/ui/search-bar";
import Link from "next/link";
import { formatDate } from "@/views/connections/connections";

const PagesView = () => {
  const { pages, isLoading, error } = usePages();
  console.log(pages);

  if (isLoading)
    return <p className="text-gray-500 text-center py-4">Loading...</p>;
  if (error)
    return (
      <p className="text-red-500 text-center py-4">
        Lỗi khi tải danh sách trang.
      </p>
    );

  return (
    <ProtectedRouteLayout
      sectionClassName={"bg-[#f4f2ee] min-h-screen w-full h-full py-8 pt-3"}
    >
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-md p-4 border border-gray-300 mx-auto">
        <h2 className="text-lg font-semibold text-gray-800">
          {pages?.meta.itemCount || 0} Trang
        </h2>

        <div className="flex justify-end mb-4">
          <SearchBar />
        </div>

        {pages?.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            Không tìm thấy trang nào.
          </p>
        ) : (
          <ul>
            {pages?.items.map((page) => {
              const avatarUrl =
                page.avatar?.url || "https://via.placeholder.com/50";

              return (
                <li
                  key={page.id}
                  className="flex items-center justify-between py-3 border-t"
                >
                  <Link
                    href={`/pages/${page.id}`}
                    className="font-medium text-gray-800 hover:underline"
                  >
                    <div className="flex items-center space-x-3">
                      {/* Avatar */}
                      <img
                        src={avatarUrl}
                        alt={page.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />

                      <div>
                        <p className="font-medium text-gray-800">{page.name}</p>
                        <p className="text-sm text-gray-500">{page.address}</p>
                        <p className="text-xs text-gray-400">
                          Đã kết nối vào {formatDate(page.createdAt)}
                        </p>
                      </div>
                    </div>
                  </Link>
                  <div className="flex items-center space-x-2">
                    <Link href={`/pages/${page.id}/chat`} passHref>
                      <button
                        className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-sm font-semibold transition
                     hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      >
                        Nhắn tin
                      </button>
                    </Link>
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
