"use client";

import { useState } from "react";
import { Settings, TicketX } from "lucide-react";
import { useConnectionRequests, useConnectionSuggestions } from "@/views/mynetwork/hooks/use-connections";
import Link from "next/link";
import { useFriendRequest, useRejectFriendRequest, useRemoveFriend } from "@/views/chat-id/hooks";

const ManageInvitations = () => {
  const [activeTab, setActiveTab] = useState<"received" | "sent">("received");

  const { data: receivedRequests = [], refetch: refetchRequests, isLoading, error } = useConnectionRequests();
  const { data: sentRequests = [],  refetch: refetchSentRequests  } = useConnectionSuggestions();

  // Xử lý Accept/Cancel request
  const { friendRequest } = useFriendRequest({
    onSuccess: () => {
      refetchRequests();
      refetchSentRequests();
    }
  });
  const { rejectRequest } = useRejectFriendRequest({ onSuccess: () => refetchRequests() });


  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading friend requests.</p>;

  const activeList = activeTab === "received" ? receivedRequests : sentRequests;

  return (
    <div className="w-full max-w-2xl bg-white rounded-xl shadow-md p-4 border border-gray-300">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Quản lý lời mời</h2>
        <Settings className="w-5 h-5 text-gray-500 cursor-pointer hover:text-black" />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-300">
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === "received" ? "text-green-600 border-b-2 border-green-600" : "text-gray-500"
          }`}
          onClick={() => setActiveTab("received")}
        >
          Đã nhận ({receivedRequests.length})
        </button>
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === "sent" ? "text-green-600 border-b-2 border-green-600" : "text-gray-500"
          }`}
          onClick={() => setActiveTab("sent")}
        >
          Đã gửi ({sentRequests.length})
        </button>
      </div>

      {/* Danh sách lời mời */}
      <div className="mt-4">
        {activeList.length === 0 ? (
          <div className="flex flex-col items-center text-gray-500">
            <TicketX />
            <p className="text-center">Không có lời mời</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {activeList.map((user: any) => {
              const avatarUrl = user.avatar?.length > 0 ? user.avatar[0].url : "https://via.placeholder.com/50";

              return (
                <li key={user.id} className="flex items-center justify-between p-3 border rounded-md">
                  <Link href={`/profile/${user.id}`} className="font-medium text-gray-800 hover:underline">
                    <div className="flex items-center space-x-3">
                      {/* Avatar */}
                      <img src={avatarUrl} alt={user.firstName} className="w-12 h-12 rounded-full object-cover" />
                      {/* Thông tin user */}
                      <div>
                        {user.firstName} {user.lastName}
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </Link>

                  {/* Nút thao tác */}
                  {activeTab === "received" ? (
                    <div className="flex space-x-2">
                      <button
                        className="border border-blue-600 text-blue-600 font-semibold px-4 py-1.5 rounded-full text-sm hover:bg-blue-600 hover:text-white transition"
                        onClick={() => friendRequest({ userId: user.id, friend_status: "waiting" })}
                      >
                        Chấp nhận
                      </button>
                      <button
                        className="border border-gray-500 text-gray-500 font-semibold px-4 py-1.5 rounded-full text-sm hover:bg-gray-500 hover:text-white transition"
                        onClick={() => rejectRequest({ userId: user.id })}
                      >
                        Từ chối
                      </button>
                    </div>
                  ) : (
                    <div className="text-gray-500 text-sm flex items-center space-x-2">
                      <span>Đã gửi</span>
                      <button
                        className="border border-gray-400 text-gray-500 px-3 py-1 rounded-full text-sm hover:bg-gray-300 transition"
                        onClick={() => friendRequest({ userId: user.id, friend_status: "sent" })}
                      >
                        Hủy kết bạn
                      </button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ManageInvitations;
