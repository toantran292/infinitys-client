import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PageStatusBadge } from "@/views/page/components/page-status-badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface PageHeaderProps {
  page: {
    id: string;
    status: string;
    banner?: { url: string };
    avatar?: { url: string };
    name: string;
    content?: string;
    address?: string;
  };
  children?: React.ReactNode;
  isAdmin?: boolean;
}

export function PageHeader({ page, children, isAdmin }: PageHeaderProps) {
  const [status, setStatus] = useState(page.status);
  const [isLoading, setIsLoading] = useState(false);

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
    <>
      <div className="relative">
        {page.banner?.url ? (
          <div
            className="h-40 w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${page.banner?.url})` }}
          />
        ) : (
          <div className="h-40 w-full bg-gradient-to-r from-[#004182] to-[#0077b5] rounded-lg" />
        )}

        <div className="absolute -bottom-10 left-6 bg-white p-2 rounded-full border border-gray-200">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
            <Avatar className="w-full h-full rounded-full object-cover">
              <AvatarImage
                src={page.avatar?.url || "/default-avatar.png"}
                alt={page.name}
                className="w-full h-full rounded-full object-cover"
              />
              <AvatarFallback>{page.name.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>

      <div className="p-6 pt-12">
        <div className="flex items-center gap-4 mb-4">
          <h1 className="text-2xl font-bold">{page.name}</h1>
          <div className="flex items-center gap-3">
            {isAdmin && <PageStatusBadge status={status} />}
            {status === "rejected" && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleReRegister}
                disabled={isLoading}
                className="relative bg-red-500 hover:bg-red-600 text-white transition-all duration-200 
                shadow-[0_4px_14px_0_rgb(239_68_68/39%)] hover:shadow-[0_6px_20px_rgb(239_68_68/23%)]
                hover:translate-y-[-1px] active:translate-y-[1px]"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Đang xử lý...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Đăng ký lại
                  </span>
                )}
              </Button>
            )}
          </div>
        </div>

        <p className="text-gray-600">{page.content || "Không có nội dung"}</p>
        <p className="text-gray-500 mt-1">{page.address}</p>
        {children}
      </div>
    </>
  );
}
