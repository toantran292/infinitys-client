"use client";

import { useNotification } from "@/contexts/NotificationContext";
import { NotificationItem } from "./NotificationItem";

interface NotificationListProps {
  onClose?: () => void;
}

export function NotificationList({ onClose }: NotificationListProps) {
  const { notifications, unreadCount, markAllAsRead } = useNotification();

  return (
    <div className="bg-white rounded-lg shadow-lg max-h-[600px] flex flex-col border">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="font-semibold">
          Thông báo {unreadCount > 0 && `(${unreadCount})`}
        </h3>
        {unreadCount > 0 && (
          <button
            onClick={() => markAllAsRead()}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Đánh dấu tất cả đã đọc
          </button>
        )}
      </div>

      <div className="overflow-y-auto flex-1">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            Không có thông báo nào
          </div>
        ) : (
          notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onClose={onClose}
            />
          ))
        )}
      </div>
    </div>
  );
}
