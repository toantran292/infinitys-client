"use client";

import { useEffect, useState } from "react";
import { getMyPage, getPages } from "@/providers/page-provider";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layouts";

export default function PageList() {
  const [pages, setPages] = useState<
    { id: string; name: string; address: string; content: string; email: string; url: string; status: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [myPages, setMyPages] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const res = await getPages();
        setPages(res.data);

        const resMyPages = await getMyPage();
        if (resMyPages?.data?.length > 0) {
          setMyPages(resMyPages.data);
        }
      } catch (error) {
        console.error("Lỗi:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPages();
  }, []);

  return (
    <Layout>
      <div className="p-6 max-w-5xl mx-auto flex gap-6">
        <aside className="w-64 bg-white shadow-md p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-3">Trang</h2>

          {myPages.length > 0 ? (
            <Link href="/page/me">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm rounded-md">
                Trang của tôi
              </Button>
            </Link>
          ) : (
            <Link href="/page/register">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm rounded-md">
                + Tạo Trang
              </Button>
            </Link>
          )}
        </aside>

        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Khám phá trang</h1>

          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-24 w-full rounded-lg" />
              ))}
            </div>
          ) : pages.length === 0 ? (
            <p className="text-gray-500 text-lg">Không có trang nào để hiển thị.</p>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {pages.data.map((page) => (
                <Link key={page.id} href={`/page/${page.id}`}>
                  <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition">
                    <div className="h-36 bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-600 text-lg font-semibold">{page.name[0]}</span>
                    </div>
                    <div className="p-4">
                      <h2 className="text-lg font-semibold">{page.name}</h2>
                      <p className="text-sm text-gray-600">{page.content || "Không có mô tả"}</p>
                      <p className="text-sm text-gray-500 mt-2">{page.address}</p>
                      <button className="mt-3 w-full bg-gray-100 py-2 rounded-md text-gray-700 font-semibold">
                        Xem trang
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
