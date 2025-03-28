import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import axiosInstance from "@/lib/axios";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageStatusBadge } from "./page-status-badge";

interface PageListItemProps {
    page: {
        id: string;
        name: string;
        email: string;
        avatar: { url: string };
        status: string;
    };
}

export function PageListItem({ page }: PageListItemProps) {
    const [status, setStatus] = useState(page.status);
    const [isLoading, setIsLoading] = useState(false);
    const queryClient = useQueryClient();

    const handleReRegister = async () => {
        try {
            setIsLoading(true);
            await axiosInstance.post(`/api/pages/${page.id}/re-register`);
            setStatus("pending");
            toast.success("Đăng ký lại thành công");
        } catch (error) {
            console.error("Failed to re-register:", error);
            toast.error("Đăng ký lại thất bại");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-between py-3 border-b">
            <Link
                href={`/page/${page.id}`}
                className="flex items-center gap-3 flex-1"
            >
                <div className="flex items-center gap-3">
                    <Avatar className="w-20 h-20">
                        <AvatarImage
                            className="object-cover"
                            src={page.avatar?.url || "https://github.com/shadcn.png"}
                            alt="Avatar"
                        />
                        <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold">{page.name}</p>
                        <p className="text-sm text-gray-500">{page.email}</p>
                    </div>
                </div>
            </Link>

            <PageStatusBadge status={status} />

            {status === "rejected" && (
                <Button
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md ml-4"
                    onClick={handleReRegister}
                    disabled={isLoading}
                >
                    {isLoading ? "Đang xử lý..." : "Đăng ký lại"}
                </Button>
            )}
        </div>
    );
} 