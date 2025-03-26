"use client";

import {
  FriendRequestToast,
  ReactToast,
  CommentToast
} from "@/components/notification/NotificationToast";
import axiosInstance from "@/lib/axios";
import { useAuth } from "@/providers/auth-provider";
import { Notification, NotificationWsResponse } from "@/types/notification";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
} from "react";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  isLoading: boolean;
  test: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:20250/notifications";

// API functions
const fetchNotifications = async () => {
  return await axiosInstance.get("/api/notifications").then((res) => res.data);
};

const markNotificationAsRead = async (id: string) => {
  await axiosInstance.put(`/api/notifications/${id}/read`);
};

const markAllNotificationsAsRead = async () => {
  await axiosInstance.put("/api/notifications/read-all");
};

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user, accessToken } = useAuth();
  const queryClient = useQueryClient();

  const [socket, setSocket] = useState<Socket | null>(null);

  // Query cho notifications
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
    enabled: !!user
  });

  // Mutations
  const markAsReadMutation = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: (_, id) => {
      // queryClient.setQueryData(['notifications'], (oldData: Notification[] = []) =>
      //     oldData.map(notif =>
      //         notif.id === id ? { ...notif, isRead: true } : notif
      //     )
      // );
    }
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      queryClient.setQueryData(
        ["notifications"],
        (oldData: Notification[] = []) =>
          oldData.map((notif) => ({ ...notif, isRead: true }))
      );
    }
  });

  const test = () => {
    if (!socket) return;

    socket.emit("notifications.test", "test");
  };

  const handleNewNotification = (newNotification: NotificationWsResponse) => {
    switch (newNotification.event_name) {
      case "friend_request:received":
        toast.custom((t) => (
          <FriendRequestToast
            {...newNotification.meta}
            message="Đã gửi cho bạn lời mời kết bạn"
            type="friend_request"
            t={t}
          />
        ));
        break;
      case "friend_request:accepted":
        toast.custom((t) => (
          <FriendRequestToast
            {...newNotification.meta}
            message="Đã chấp nhận lời mời kết bạn"
            t={t}
          />
        ));
        break;
      case "react:created":
        toast.custom((t) => <ReactToast {...newNotification.meta} t={t} />);
        break;
      case "comment:created":
        toast.custom((t) => <CommentToast {...newNotification.meta} t={t} />);
        break;
    }
  };

  // Socket connection
  useEffect(() => {
    if (!user || !accessToken) return;

    const socket = io(SOCKET_URL, {
      auth: {
        user,
        token: accessToken
      }
    });

    socket.on(
      "notifications.new",
      (newNotification: NotificationWsResponse) => {
        // queryClient.setQueryData(['notifications'], (oldData: Notification[] = []) =>
        //     [newNotification, ...oldData]
        // );
        handleNewNotification(newNotification);
      }
    );

    socket.on("notifications.updated", (updatedNotification: Notification) => {
      // queryClient.setQueryData(['notifications'], (oldData: Notification[] = []) =>
      //     oldData.map(notif =>
      //         notif.id === updatedNotification.id ? updatedNotification : notif
      //     )
      // );
    });

    socket.on("notifications.test", (data: any) => {
      console.log("data", data);
      toast.info(data.message);
    });

    setSocket(socket);

    return () => {
      socket.off("notifications.new");
      socket.off("notifications.updated");
      socket.off("notifications.test");
      socket.close();
    };
  }, [user, accessToken, queryClient]);

  const unreadCount = notifications.filter(
    (n: Notification) => !n.isRead
  ).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead: markAsReadMutation.mutateAsync,
        markAllAsRead: markAllAsReadMutation.mutateAsync,
        isLoading,
        test
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotification phải được sử dụng trong NotificationProvider"
    );
  }
  return context;
}
