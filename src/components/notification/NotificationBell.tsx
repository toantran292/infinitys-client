'use client';

import { useNotification } from '@/contexts/NotificationContext';
import { NotificationList } from './NotificationList';

interface NotificationBellProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

export function NotificationBell({ isOpen, setIsOpen }: NotificationBellProps) {
    return (
        <>
            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 z-50 mt-2 w-80">
                        <NotificationList onClose={() => setIsOpen(false)} />
                    </div>
                </>
            )}
        </>
    );
} 