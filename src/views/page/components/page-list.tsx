import { Loader2 } from "lucide-react";
import { PageListItem } from "./page-list-item";

interface PageListProps {
  pages: Array<{
    id: string;
    name: string;
    email: string;
    avatar: { url: string };
    status: string;
  }>;
  isLoading: boolean;
}

export function PageList({ pages, isLoading }: PageListProps) {
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
        <PageListItem key={page.id} page={page} />
      ))}
    </div>
  );
}
