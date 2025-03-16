import { ProtectedRouteLayout } from "@/components/layouts";
import { Input } from "@/components/ui/input";
import PageTypeCard from "@/components/ui/PageTypeCard";
import { Building } from "lucide-react";
import { useState } from "react";
import { PageList } from "./components/page-list";
import { usePages } from "./hooks/use-pages";
import { useRouter } from "next/navigation";

export default function PagesComponent() {
  const router = useRouter();
  const [params, setParams] = useState({
    page: 1,
    limit: 10,
    search: ""
  });

  const { data, isLoading } = usePages(params);

  const handleReapply = (id) => {
    router.push(`/page/register?id=${id}`);
  };

  return (
    <ProtectedRouteLayout sectionClassName="bg-[#f4f2ee] min-h-screen w-full h-full py-8 pt-3">
      <div className="max-w-5xl mx-auto flex flex-wrap lg:flex-nowrap gap-6 px-4">
        <div className="flex-1 bg-white p-6 rounded-lg shadow-md min-w-[300px] bg-black">
          <div className="flex justify-between items-center mb-4 border-b pb-4">
            <h2 className="text-lg font-semibold">Các trang đã đăng ký</h2>
            <Input
              className="w-1/3"
              placeholder="Tìm theo tên"
              value={params.search}
              onChange={(e) => setParams({ ...params, search: e.target.value })}
            />
          </div>
          <PageList
            isLoading={isLoading}
            pages={data?.items || []}
            onReapply={handleReapply}
          />
        </div>

        <div className="w-[300px] bg-white p-6 rounded-lg shadow-md flex flex-col justify-center items-center">
          <h1 className="text-2xl font-bold mb-4">Đăng ký trang</h1>
          <PageTypeCard
            title="Công ty"
            description="Doanh nghiệp nhỏ, vừa và lớn"
            icon={<Building size={70} className="text-blue-500" />}
            pageType="register"
          />
        </div>
      </div>
    </ProtectedRouteLayout>
  );
}
