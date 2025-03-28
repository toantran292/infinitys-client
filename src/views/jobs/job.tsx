"use client";

import { Button } from "@/components/ui/button";
import { InputForm } from "@/components/ui/input";
import {
  Search,
  MapPin,
  Clock,
  Briefcase,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Header } from "@/components/layouts/header";
import { ProfileCard } from "@/components/ui/profile/profile-card";
import { useProfile } from "@/hooks/use-profile";
import { useAuth } from "@/providers/auth-provider";
import { useQuery, useQueries } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { JobPost, JobPostResponse } from "@/types/job";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import axiosInstance from "@/lib/axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function JobsComponent() {
  const { user } = useAuth();
  const { data: profile, isLoading } = useProfile(user?.id);
  const [page, setPage] = useState(1);
  const take = 10;
  const [showNoCompanyDialog, setShowNoCompanyDialog] = useState(false);
  const router = useRouter();

  const { data: response, isLoading: isLoadingJobs } =
    useQuery<JobPostResponse>({
      queryKey: ["jobs", page],
      queryFn: () =>
        axiosInstance
          .get(`/api/recruitment-posts?page=${page}&take=${take}&order=DESC`)
          .then((res) => res.data)
    });

  const jobs: JobPost[] = response?.items || [];

  const pageQueries = useQueries({
    queries: jobs.map((job) => ({
      queryKey: ["page", job.page.id],
      queryFn: () =>
        axiosInstance
          .get(`/api/pages/${job.page.id}`)
          .then((res) => res.data),
      staleTime: 5 * 60 * 1000 // Cache for 5 minutes
    }))
  });

  const isLoadingPages = pageQueries.some((query) => query.isLoading);
  const pages = pageQueries.map((query) => query.data);

  const total = response?.meta?.itemCount || 0;
  const totalPages = response?.meta?.pageCount || 1;

  const handlePrevPage = () => {
    if (response?.meta?.hasPreviousPage) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (response?.meta?.hasNextPage) {
      setPage(page + 1);
    }
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    const halfVisible = Math.floor(maxVisiblePages / 2);

    // Always show first page
    pageNumbers.push(1);

    let startPage = Math.max(2, page - halfVisible);
    let endPage = Math.min(totalPages - 1, page + halfVisible);

    // Adjust start and end if we're near the edges
    if (page <= halfVisible + 1) {
      endPage = Math.min(maxVisiblePages - 1, totalPages - 1);
    } else if (page >= totalPages - halfVisible) {
      startPage = Math.max(2, totalPages - maxVisiblePages + 1);
    }

    // Add dots after first page if needed
    if (startPage > 2) {
      pageNumbers.push("...");
    }

    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    // Add dots before last page if needed
    if (endPage < totalPages - 1) {
      pageNumbers.push("...");
    }

    // Always show last page if there is more than one page
    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  const handleCreateJob = async () => {
    try {
      const response = await axiosInstance.get("/api/pages/me");
      const companies = response.data;
      if (!companies || companies.length === 0) {
        setShowNoCompanyDialog(true);
      } else {
        router.push("/jobs/create");
      }
    } catch {
      toast.error("Cần có trang công ty để đăng bài tuyển dụng");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 w-full bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-12 gap-4">
            {/* Left Sidebar */}
            <div className="col-span-3 space-y-4">
              {/* Profile Card */}
              {isLoading ? (
                <div className="rounded-lg border bg-card">
                  <div className="animate-pulse">
                    <div className="h-20 bg-gray-200 rounded-t-lg"></div>
                    <div className="p-4 -mt-12">
                      <div className="w-20 h-20 bg-gray-200 rounded-full mb-3"></div>
                      <div className="space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : profile ? (
                <ProfileCard
                  name={`${profile.firstName} ${profile.lastName}`}
                  avatar={
                    profile.avatar?.url || "https://github.com/shadcn.png"
                  }
                  email={profile.email || "Chưa cập nhật"}
                  location={profile.desiredJobPosition || "Chưa cập nhật"}
                  major={profile.major || "Chưa cập nhật"}
                />
              ) : null}

              {/* Preferences Section */}
              <div className="rounded-lg border bg-card p-4 space-y-3">
                <h2 className="font-semibold">Tùy chọn</h2>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                >
                  <Clock size={16} />
                  Việc làm đã lưu
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                >
                  <Briefcase size={16} />
                  Việc làm đã ứng tuyển
                </Button>
                <Button
                  variant="default"
                  className="w-full justify-start gap-2 bg-black hover:bg-gray-800 text-white"
                  onClick={handleCreateJob}
                >
                  Đăng bài tuyển dụng
                </Button>
              </div>
            </div>

            {/* Main Content */}
            <div className="col-span-9 space-y-6">
              {/* Search Bar */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <InputForm
                    placeholder="Search job title or company"
                    className="pl-9"
                  />
                </div>
                <div className="relative flex-1">
                  <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <InputForm
                    placeholder="City, state, or zip code"
                    className="pl-9"
                  />
                </div>
                <Button>Tìm kiếm</Button>
              </div>

              {/* Job Listings */}
              <div className="rounded-lg border">
                <h2 className="p-4 font-semibold border-b">
                  Danh sách việc làm ({total})
                </h2>
                {isLoadingJobs || isLoadingPages ? (
                  <div className="p-4 space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse flex gap-4">
                        <div className="h-12 w-12 bg-gray-200 rounded-lg"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    <div className="divide-y">
                      {jobs.map((job, index) => {
                        const timeAgo = new Date(
                          job.createdAt
                        ).toLocaleDateString("vi-VN", {
                          year: "numeric",
                          month: "long",
                          day: "numeric"
                        });

                        const page = pages[index];

                        return (
                          <Link href={`/jobs/${job.id}`} key={job.id}>
                            <div className="p-4 hover:bg-accent cursor-pointer flex gap-4">
                              <Avatar className="h-12 w-12 relative rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                                <AvatarImage className="object-cover" src={page?.avatar?.url} />
                                <AvatarFallback className="text-xl bg-gray-500 text-white">
                                  {page?.name?.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <h3 className="font-medium text-primary">
                                  {job.title}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  {page?.name || "Loading..."}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {job.location}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                                    {job.workType}
                                  </span>
                                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                                    {job.jobType}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                  <Clock className="h-3 w-3 text-muted-foreground" />
                                  <span className="text-xs text-muted-foreground">
                                    {timeAgo}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                    <div className="flex items-center justify-between px-4 py-3 border-t">
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-gray-700">
                          {total > 0 ? (
                            <>
                              Hiển thị{" "}
                              <span className="font-medium">
                                {(page - 1) * take + 1}
                              </span>{" "}
                              đến{" "}
                              <span className="font-medium">
                                {Math.min(page * take, total)}
                              </span>{" "}
                              trong <span className="font-medium">{total}</span>{" "}
                              kết quả
                            </>
                          ) : (
                            "Không có kết quả nào"
                          )}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handlePrevPage}
                          disabled={page === 1}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <div className="flex items-center gap-1">
                          {getPageNumbers().map((pageNumber, index) =>
                            pageNumber === "..." ? (
                              <span key={`dots-${index}`} className="px-2">
                                {pageNumber}
                              </span>
                            ) : (
                              <Button
                                key={pageNumber}
                                variant={
                                  pageNumber === page ? "default" : "outline"
                                }
                                size="sm"
                                onClick={() => setPage(pageNumber as number)}
                                className="min-w-[32px] text-white"
                              >
                                {pageNumber}
                              </Button>
                            )
                          )}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleNextPage}
                          disabled={page === totalPages}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Job Collections */}
              <div className="rounded-lg border p-4">
                <h2 className="font-semibold mb-4">
                  Explore with job collections
                </h2>
                <div className="flex gap-4">
                  <Button variant="outline" className="gap-2">
                    <Clock size={16} />
                    Part-time
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Search size={16} />
                    Easy Apply
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <MapPin size={16} />
                    Remote
                  </Button>
                  <Button variant="outline" className="gap-2">
                    More
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Dialog open={showNoCompanyDialog} onOpenChange={setShowNoCompanyDialog}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="text-gray-900">
              Chỉ công ty mới có thể đăng tuyển dụng
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Bạn cần có ít nhất một công ty để đăng bài tuyển dụng. Vui lòng
              tạo trang công ty trước khi đăng bài.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button
              onClick={() => setShowNoCompanyDialog(false)}
              className="bg-black hover:bg-gray-800 text-white px-6"
            >
              Đóng
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
