import ChatLayout from "@/components/chat/ChatLayout";
import { FullWidthProtectedRouteLayout } from "@/components/layouts";

export default function ChatComponent() {
    return (
        <FullWidthProtectedRouteLayout>
            <ChatLayout />
        </FullWidthProtectedRouteLayout>
    )
}