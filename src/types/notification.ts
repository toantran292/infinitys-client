export type NotificationType = "success" | "error" | "warning" | "info";

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  createdAt: Date;
  isRead: boolean;
  link?: string;
  userId?: string;
}

export interface NotificationWsResponse {
  event_name: string;
  meta: any;
}

export interface NotificationResponse {
  notifications: Notification[];
  unreadCount: number;
}
