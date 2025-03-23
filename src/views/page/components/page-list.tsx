import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";

interface PageListProps {
  pages: Array<{
    id: string;
    name: string;
    email: string;
    avatar: { url: string };
    status: string;
  }>;
  onReapply: () => void;
  isLoading: boolean;
}

export function PageList({ pages, onReapply, isLoading }: PageListProps) {
  const getStatusClass = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700 border border-green-500";
      case "rejected":
        return "bg-red-100 text-red-700 border border-red-500";
      default:
        return "bg-yellow-100 text-yellow-700 border border-yellow-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved":
        return "Đã duyệt";
      case "rejected":
        return "Bị từ chối";
      default:
        return "Chờ duyệt";
    }
  };

  if (!pages.length) {
    return (
      <p className="text-center text-gray-500">
        Không có trang nào được đăng ký.
      </p>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }
  return (
    <div>
      {pages.map((page) => (
        <div
          key={page.id}
          className="flex items-center justify-between py-3 border-b"
        >
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
          <span
            className={`px-4 py-1 rounded-full text-sm font-medium ${getStatusClass(
              page.status
            )}`}
          >
            {getStatusText(page.status)}
          </span>
          {page.status === "rejected" && (
            <Button
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md ml-4"
              onClick={() => onReapply()}
            >
              Đăng ký lại
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}
