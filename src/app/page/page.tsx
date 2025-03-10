"use client";

import { Layout } from "@/components/layouts";
import PageTypeCard from "@/components/ui/PageTypeCard";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Building } from "lucide-react";
import { getMyPage } from "@/providers/page-provider";
import Link from "next/link";

export default function PageList() {
  const [search, setSearch] = useState("");
  const [myPages,setPages] = useState([]);
  useEffect(() => {
    async function fetchPages() {
      const pages = await getMyPage();
      console.log(pages);
      setPages(pages.data);
    }
    fetchPages();
  }, []);
  const getStatusClass = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-500 text-white";
      case "rejected":
        return "bg-red-500 text-white";
      default:
        return "bg-yellow-500 text-white";
    }
  }
  return (
    <Layout sectionClassName="bg-[#f4f2ee] min-h-screen w-full py-8">
      <div className="max-w-5xl mx-auto flex gap-6">

        <div className="w-2/3 bg-white p-6 rounded-lg shadow-md">
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
            {myPages.length === 0 ?
              <p className="text-center text-gray-500">Không có trang nào được đăng ký.</p>
              : (myPages
                .filter((page) => page.name.toLowerCase().includes(search.toLowerCase()))
                .map((page) => (
                  <div key={page.id} className="flex items-center justify-between py-3 border-b">
                    <Link href={`/page/${page.id}`} className="flex items-center gap-3 flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{page.avatar}</span>
                        <div>
                          <p className="font-semibold">{page.name}</p>
                          <p className="text-sm text-gray-500">{page.email}</p>
                        </div>
                      </div>
                    </Link>
                    <span
                      className={`px-4 py-1 rounded-full text-sm ${getStatusClass(page.status)}`}>{page.status}</span>
                  </div>
                )))}
          </div>
        </div>
        <div className="w-1/3">
          <h1 className="text-2xl font-bold mb-4">Đăng ký trang</h1>
          <PageTypeCard title="Công ty" description="Doanh nghiệp nhỏ, vừa và lớn" icon={<Building size={70} className="text-blue-500" />} pageType='register' />
        </div>
      </div>
    </Layout>
  );
}
