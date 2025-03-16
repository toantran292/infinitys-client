'use client';

import moment from 'moment';
import 'moment/locale/vi';
import { useNotification } from '@/contexts/NotificationContext';
import { Notification } from '@/types/notification';

interface NotificationItemProps {
    notification: Notification;
    onClose?: () => void;
}

export function NotificationItem({ notification, onClose }: NotificationItemProps) {
    const { markAsRead } = useNotification();

    const getNotificationColor = (type: Notification['type']) => {
        switch (type) {
            case 'success': return 'bg-green-50 hover:bg-green-100';
            case 'error': return 'bg-red-50 hover:bg-red-100';
            case 'warning': return 'bg-yellow-50 hover:bg-yellow-100';
            case 'info': return 'bg-blue-50 hover:bg-blue-100';
            default: return 'bg-gray-50 hover:bg-gray-100';
        }
    };

    const handleClick = () => {
        markAsRead(notification.id);
        if (notification.link) {
            window.location.href = notification.link;
        }
        if (onClose) {
            onClose();
        }
    };

    // Cấu hình locale tiếng Việt
    moment.locale('vi');

    return (
        <div
            className={`p-4 border-b cursor-pointer transition-colors ${!notification.isRead ? getNotificationColor(notification.type) : 'hover:bg-gray-50'
                }`}
            onClick={handleClick}
        >
            <div className={`text-sm ${!notification.isRead ? 'font-semibold' : ''}`}>
                {notification.message}
            </div>
            <div className="text-xs text-gray-500 mt-1">
                {moment(notification.createdAt).format('HH:mm DD/MM/YYYY')}
            </div>
        </div>
    );
} 