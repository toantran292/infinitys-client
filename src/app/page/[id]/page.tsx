"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Layout } from "@/components/layouts";
import { getMyPage, getPageId } from "@/providers/page-provider";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PageDetail() {
  const { id } = useParams();
  const isMyPage = id === "me"; // Kiểm tra nếu là trang của bản thân
  const [page, setPage] = useState<{
    id: string;
    name: string;
    content: string;
    address: string;
    url: string;
    email: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchPageDetail = async () => {
      try {
        let res;
        if (isMyPage) {
          res = await getMyPage();
          setPage(res.data[0]);
        } else {
          res = await getPageId(id);
          setPage(res.data);
        }
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết trang:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPageDetail();
  }, [id]);

  if (loading) return <p className="text-center mt-6">Đang tải thông tin...</p>;
  if (!page)
    return (
      <p className="text-center mt-6 text-red-500">Không tìm thấy trang</p>
    );

  return (
    <Layout sectionClassName="bg-[#f4f2ee] min-h-screen w-full py-8">
      <div className="p-6 max-w-6xl mx-auto">
        {/* Banner + Avatar */}
        <div className="relative bg-gray-200 h-40 rounded-lg">
          <div className="absolute -bottom-10 left-6 bg-white p-2 rounded-full border border-gray-200">
            <div className="w-20 h-20 bg-gray-300 rounded-full" />
          </div>
        </div>

        {/* Content chính */}
        <div className="bg-white p-6 mt-12 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold">{page.name}</h1>

          {/* Trạng thái */}
          <div
            className={`mt-2 px-3 py-1 rounded-md text-sm font-semibold w-max inline-block
            ${
              page.status === "approved"
                ? "bg-green-100 text-green-700 border border-green-500"
                : page.status === "started"
                  ? "bg-yellow-100 text-yellow-700 border border-yellow-500"
                  : "bg-red-100 text-red-700 border border-red-500"
            }`}
          >
            {page.status === "approved" && "Đã duyệt"}
            {page.status === "started" && "Chờ duyệt"}
            {page.status === "rejected" && "Bị từ chối"}
          </div>

          <a
            href={page.url}
            target="_blank"
            className="block mt-2 text-blue-500 hover:underline"
          >
            {page.url}
          </a>

          {/* Nút Đăng ký lại - Chỉ hiển thị nếu là "/me" và bị từ chối */}
          {isMyPage && page.status === "rejected" && (
            <Link
              href={{
                pathname: "/page/register",
                query: {
                  name: page.name,
                  content: page.content || "",
                  address: page.address,
                  url: page.url,
                  email: page.email
                }
              }}
            >
              <Button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 mt-4 rounded-md">
                Đăng ký lại
              </Button>
            </Link>
          )}
        </div>

        {/* Nội dung và thông tin */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="col-span-2 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-3">Nội dung</h2>
            <p className="text-gray-600">
              {page.content || "Không có nội dung"}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-semibold text-lg">Thông tin</h3>
            <p className="text-gray-600">
              <strong>Địa chỉ:</strong> {page.address}
            </p>
            <p className="text-gray-600">
              <strong>Email:</strong> {page.email}
            </p>
            <p className="text-gray-600">
              <strong>Ngày tạo:</strong>{" "}
              {new Date(page.createdAt).toLocaleDateString()}
            </p>
            <p className="text-gray-600">
              <strong>Ngày cập nhật:</strong>{" "}
              {new Date(page.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Nếu không có bài viết nào */}
      <div className="mx-auto text-center text-gray-500">
        Chưa có bài viết nào
      </div>
    </Layout>
  );
}
