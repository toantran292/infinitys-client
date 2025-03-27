'use client';
import { FullWidthProtectedRouteLayout } from "@/components/layouts";
import ChatLayout from "@/components/chat/ChatLayout";
export default function ChatNewComponent() {
    return <FullWidthProtectedRouteLayout>
        <ChatLayout isChatNew={true} />
    </FullWidthProtectedRouteLayout>;
}