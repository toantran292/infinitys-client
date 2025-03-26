import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { JobPostResponse } from "@/types/job";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

interface JobsTabProps {
  pageId: string;
}

export function JobsTab({ pageId }: JobsTabProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const take = 10;

  // Reset to page 1 when pageId changes
  useEffect(() => {
    setCurrentPage(1);
  }, [pageId]);

  const { data: response, isLoading } = useQuery<JobPostResponse>({
    queryKey: ["page-jobs", pageId, currentPage],
    queryFn: () =>
      axiosInstance
        .get(
          `/api/recruitment-posts/page/${pageId}?page=${currentPage}&take=${take}`
        )
        .then((res) => res.data),
    enabled: !!pageId, // Auto fetch when pageId is available
    staleTime: 0, // Always fetch fresh data when tab is selected
    refetchOnMount: true // Refetch when component mounts (tab is selected)
  });

  const jobs = response?.items || [];
  const total = response?.meta?.itemCount || 0;
  const totalPages = response?.meta?.pageCount || 1;

  const handlePrevPage = () => {
    if (response?.meta?.hasPreviousPage) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (response?.meta?.hasNextPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    const halfVisible = Math.floor(maxVisiblePages / 2);

    // Always show first page
    pageNumbers.push(1);

    let startPage = Math.max(2, currentPage - halfVisible);
    let endPage = Math.min(totalPages - 1, currentPage + halfVisible);

    // Adjust start and end if we're near the edges
    if (currentPage <= halfVisible + 1) {
      endPage = Math.min(maxVisiblePages - 1, totalPages - 1);
    } else if (currentPage >= totalPages - halfVisible) {
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

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4">
              <div className="h-16 w-16 bg-gray-200 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!jobs?.length) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-500 text-center">Chưa có việc làm.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="space-y-4">
        {jobs.map((job) => {
          const timeAgo = new Date(job.createdAt).toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "long",
            day: "numeric"
          });

          return (
            <Link href={`/jobs/${job.id}`} key={job.id}>
              <div className="p-4 hover:bg-accent cursor-pointer flex gap-4 border rounded-lg">
                <div className="flex-1">
                  <h3 className="font-medium text-primary">{job.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {job.location}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        job.active
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {job.active ? "Đang tuyển" : "Ngừng tuyển"}
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      {job.workType}
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      {job.jobType}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      • {timeAgo}
                    </span>
                  </div>
                </div>
                <Button variant="outline" className="self-center">
                  Xem chi tiết
                </Button>
              </div>
            </Link>
          );
        })}

        {/* Pagination */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-700">
              {total > 0 ? (
                <>
                  Hiển thị{" "}
                  <span className="font-medium">
                    {(currentPage - 1) * take + 1}
                  </span>{" "}
                  đến{" "}
                  <span className="font-medium">
                    {Math.min(currentPage * take, total)}
                  </span>{" "}
                  trong <span className="font-medium">{total}</span> kết quả
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
              disabled={currentPage === 1}
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
                    variant={pageNumber === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNumber as number)}
                    className="min-w-[32px]"
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
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
