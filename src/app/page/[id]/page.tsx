"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Layout } from "@/components/layouts";
import { getMyPage, getPageId } from "@/providers/page-provider";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const TABS = [
  { key: "home", label: "Trang chủ" },
  { key: "about", label: "Giới thiệu" },
  { key: "posts", label: "Bài đăng" },
  { key: "jobs", label: "Việc làm" },
  { key: "people", label: "Người" }
];

export default function PageDetail() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "home";
  const [page, setPage] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchPageDetail = async () => {
      try {
        const myPagesRes = await getMyPage();
        const isUserAdmin = myPagesRes.data.some((p) => p.id === id);
        setIsAdmin(isUserAdmin);
        const res = await getPageId(id);
        setPage(res.data || null);
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
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="relative">
          {page.banner ? (
            <div
              className="h-40 w-full bg-cover bg-center"
              style={{ backgroundImage: `url(${page.banner})` }}
            />
          ) : (
            <div className="h-40 w-full bg-gradient-to-r from-[#004182] to-[#0077b5] rounded-lg" />
          )}

          <div className="absolute -bottom-10 left-6 bg-white p-2 rounded-full border border-gray-200">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
              <img
                src={page.avatar?.url || "/default-avatar.png"}
                alt={page.name}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
          </div>
        </div>

        <div className="p-6 pt-12">
          <h1 className="text-2xl font-bold">{page.name}</h1>
          <p className="text-gray-600">{page.content || "Không có nội dung"}</p>
          <p className="text-gray-500 mt-1">{page.address}</p>

          <div className="flex gap-2 mt-4">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              + Theo dõi
            </Button>
            <Button variant="outline">Nhắn tin</Button>
          </div>
        </div>

        <div className="flex border-b px-6">
          {TABS.map((tab) => (
            <Link
              key={tab.key}
              href={`?tab=${tab.key}`}
              className={`px-4 py-2 font-semibold relative transition-all duration-200
        ${
          currentTab === tab.key
            ? "text-green-700 font-bold after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-green-700"
            : "text-gray-600 hover:text-green-700 hover:font-semibold hover:after:content-[''] hover:after:absolute hover:after:left-0 hover:after:bottom-0 hover:after:w-full hover:after:h-[2px] hover:after:bg-green-700"
        }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="pt-6 max-w-5xl mx-auto">
        {currentTab === "home" && <HomeTab page={page} />}
        {currentTab === "about" && <AboutTab page={page} />}
        {currentTab === "posts" && <PostsTab posts={page.posts} />}
        {currentTab === "jobs" && <JobsTab jobs={page.jobs} />}
        {currentTab === "people" && <PeopleTab people={page.people} />}
      </div>
    </Layout>
  );
}

function HomeTab({ page }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-3">Tổng quan</h2>
      <p className="text-gray-600">
        {page.content || "Chưa có mô tả về công ty này."}
      </p>

      {/* Hai cột liên hệ & đầu tư */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="bg-gray-100 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Thông tin liên hệ</p>
          <a
            href={page.url}
            target="_blank"
            className="text-blue-500 hover:underline"
          >
            {page.url}
          </a>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Funding via Crunchbase</p>
          <p className="text-lg font-semibold text-gray-800">
            {page.funding ? `$${page.funding.toLocaleString()}` : "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
}

function AboutTab({ page }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-3">Tổng quan</h2>
      <p className="text-gray-600">{page.content}</p>
      <p className="text-gray-500 mt-2">🌍 {page.industry}</p>
      <p className="text-gray-500">🏢 {page.size} nhân viên</p>
      <p className="text-gray-500">📍 {page.address}</p>
      <p className="text-gray-500">📆 Thành lập: {page.founded}</p>
    </div>
  );
}

function PostsTab({ posts }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">Chưa có bài đăng.</div>
  );
}

function JobsTab({ jobs }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">Chưa có việc làm.</div>
  );
}

function PeopleTab({ people }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">Chưa có nhân viên.</div>
  );
}
