"use client";

import { MoreHorizontal } from "lucide-react";
import { ProtectedRouteLayout } from "@/components/layouts";
import { useConnections } from "@/views/mynetwork/hooks/use-connections";
import { SearchBar } from "@/components/ui/search-bar";
import Link from "next/link";

export const formatDate = (isoDate: string) => {
  return new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZone: "Asia/Ho_Chi_Minh" // Đảm bảo giờ Việt Nam
  }).format(new Date(isoDate));
};

const ConnectionsComponent = () => {
  const {
    data: connections = [],
    isLoading,
    error
  } = useConnections({ page: 1, limit: 10 });

  console.log(connections);
  if (isLoading)
    return <p className="text-gray-500 text-center py-4">Loading...</p>;
  if (error)
    return (
      <p className="text-red-500 text-center py-4">
        Lỗi khi tải danh sách kết nối.
      </p>
    );

  return (
    <ProtectedRouteLayout
      sectionClassName={"bg-[#f4f2ee] min-h-screen w-full h-full py-8 pt-3"}
    >
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-md p-4 border border-gray-300  justify-center items-center mx-auto">
        <h2 className="text-lg font-semibold text-gray-800">
          {connections.length} Kết nối
        </h2>

        <div className="flex justify-end mb-4">
          <SearchBar />
        </div>

        {connections.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            Không tìm thấy kết nối nào.
          </p>
        ) : (
          <ul>
            {connections.map((conn: any) => {
              const avatarUrl =
                conn.avatar?.length > 0
                  ? conn.avatar[0].url
                  : "https://via.placeholder.com/50";

              return (
                <li
                  key={conn.id}
                  className="flex items-center justify-between py-3 border-t"
                >
                  <Link
                    href={`/profile/${conn.id}`}
                    className="font-medium text-gray-800 hover:underline"
                  >
                    <div className="flex items-center space-x-3">
                      {/* Avatar */}
                      <img
                        src={avatarUrl}
                        alt={conn.firstName}
                        className="w-12 h-12 rounded-full object-cover"
                      />

                      <div>
                        <p className="font-medium text-gray-800">
                          {conn.firstName} {conn.lastName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {conn.role || "Chưa cập nhật công việc"}
                        </p>
                        <p className="text-xs text-gray-400">
                          Đã kết nối vào {formatDate(conn.createdAt)}
                        </p>
                      </div>
                    </div>
                  </Link>
                  <div className="flex items-center space-x-2">
                    <Link href={`/chat`} passHref>
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

export default ConnectionsComponent;
