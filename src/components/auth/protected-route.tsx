"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user && !localStorage.getItem("accessToken")) {
            router.push('/auth/login');
        }
    }, [isLoading, user, router]);

    if (isLoading) {
        return <div>Đang tải...</div>;
    }

    return user ? <>{children}</> : null;
} 