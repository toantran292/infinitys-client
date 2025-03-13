"use client";

import { Layout } from "@/components/layouts";
import PageTypeCard from "@/components/ui/PageTypeCard";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Building } from "lucide-react";
import { getMyPage } from "@/providers/page-provider";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function PageList() {
  const [search, setSearch] = useState("");
  const [myPages, setPages] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchPages() {
      const pages = await getMyPage();
      setPages(pages.data);
    }
    fetchPages();
  }, []);

  const getStatusClass = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700 border border-green-500";
      case "rejected":
        return "bg-red-100 text-red-700 border border-red-500";
      default:
        return "bg-yellow-100 text-yellow-700 border border-yellow-500";
    }
  };

  const handleReapply = (page) => {
    const queryParams = new URLSearchParams({
      name: page.name,
      email: page.email,
      industry: page.industry || "",
      address: page.address || "",
      url: page.url || "",
      content: page.content || "",
      avatar: page.avatar || ""
    }).toString();

    router.push(`/page/register?${queryParams}`);
  };

  return (
    <Layout sectionClassName="bg-[#f4f2ee] min-h-screen w-full py-8">
      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 px-4">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4 border-b pb-4">
            <h2 className="text-lg font-semibold">Các trang đã đăng ký</h2>
            <Input
              className="w-1/3"
              placeholder="Tìm theo tên"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div>
            {myPages.length === 0 ? (
              <p className="text-center text-gray-500">
                Không có trang nào được đăng ký.
              </p>
            ) : (
              myPages
                .filter((page) =>
                  page.name.toLowerCase().includes(search.toLowerCase())
                )
                .map((page) => (
                  <div
                    key={page.id}
                    className="flex items-center justify-between py-3 border-b"
                  >
                    <Link
                      href={`/page/${page.id}`}
                      className="flex items-center gap-3 flex-1"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{page.avatar}</span>
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
                      {page.status === "approved" && "Đã duyệt"}
                      {page.status === "rejected" && "Bị từ chối"}
                      {page.status === "started" && "Chờ duyệt"}
                    </span>
                    {page.status === "rejected" && (
                      <Button
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md ml-4"
                        onClick={() => handleReapply(page)}
                      >
                        Đăng ký lại
                      </Button>
                    )}
                  </div>
                ))
            )}
          </div>
        </div>
        <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md min-h-[300px] flex flex-col justify-center items-center m-auto">
          <h1 className="text-2xl font-bold mb-4">Đăng ký trang</h1>
          <PageTypeCard
            title="Công ty"
            description="Doanh nghiệp nhỏ, vừa và lớn"
            icon={<Building size={70} className="text-blue-500" />}
            pageType="register"
          />
        </div>
      </div>
    </Layout>
  );
}
