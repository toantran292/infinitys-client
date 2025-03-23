"use client";

import { Button } from "@/components/ui/button";
import { Header } from "@/components/layouts/header";
import { JobDescriptionViewer } from "@/components/ui/editor/job-description-viewer";
import { useProfile } from "@/hooks/use-profile";
import { useAuth } from "@/providers/auth-provider";
import { JobPost, Page } from "@/types/job";
import { useQuery, useMutation, useQueryClient, useQueries } from "@tanstack/react-query";
import ProfileCard from "@/views/profile/components/profile-card";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import { ErrorMessage } from "@/common/error";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface JobDetailPageProps {
    jobId: string;
}

interface Applicant {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: {
        url: string;
    };
    createdAt: string;
    user: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
    };
}

export function JobDetailPage({ jobId }: JobDetailPageProps) {
    const { user } = useAuth();
    const { data: profile, isLoading: isLoadingProfile } = useProfile(user?.id);
    const queryClient = useQueryClient();
    const router = useRouter();


    const { data: job, isLoading: isLoadingJob } = useQuery<JobPost>({
        queryKey: ['job', jobId],
        queryFn: () => axiosInstance.get(`/api/recruitment-posts/${jobId}`).then(res => res.data)
    });

    const { data: application } = useQuery({
        queryKey: ['application', jobId],
        queryFn: () => axiosInstance.get(`/api/applications/${jobId}`).then(res => res.data),
        enabled: !!user && !!jobId
    });

    const { data: page, isLoading: isLoadingPage } = useQuery<Page>({
        queryKey: ['page', job?.pageUser.page.id],
        queryFn: () => axiosInstance.get(`/api/pages/${job?.pageUser.page.id}`).then(res => res.data),
        enabled: !!job?.pageUser.page.id
    });

    const applyMutation = useMutation({
        mutationFn: () => axiosInstance.post('/api/applications', { jobId }),
        onSuccess: () => {
            toast.success('Ứng tuyển thành công!');
            queryClient.invalidateQueries({ queryKey: ['application', jobId] });
        },
        onError: (error: ErrorMessage) => {
            toast.error(error.message);
        }
    });

    const handleApply = () => {
        if (!user) {
            toast.error('Vui lòng đăng nhập để ứng tuyển');
            return;
        }
        applyMutation.mutate();
    };

    if (isLoadingJob || isLoadingPage) {
        return (
            <div className="min-h-screen flex flex-col bg-gray-50">
                <Header />
                <main className="flex-1 w-full">
                    <div className="container max-w-[1200px] mx-auto px-4 py-8">
                        <div className="animate-pulse space-y-4">
                            <div className="h-40 bg-white rounded-xl"></div>
                            <div className="h-96 bg-white rounded-xl"></div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    if (!job) return null;
    const author = job.pageUser.user;

    const timeAgo = new Date(job.createdAt).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />
            <main className="flex-1 w-full">
                <div className="container max-w-[1200px] mx-auto px-4 py-8">
                    <div className="flex gap-8">
                        {/* Main Content - Left Side */}
                        <div className="flex-1 max-w-[780px] space-y-4">
                            {/* Job Header Card */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <div className="flex gap-4">
                                    <div className="w-[72px] h-[72px] relative rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                        <img
                                            src={page?.avatar?.url || "https://github.com/shadcn.png"}
                                            alt={page?.name || "Tên công ty"}
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h1 className="text-2xl font-semibold text-gray-900 mb-1">
                                            {job.title}
                                        </h1>
                                        <div className="space-y-1 text-sm">
                                            <p className="font-medium">
                                                {page?.name || "Tên công ty"}
                                            </p>
                                            <p className="text-gray-600">
                                                {job.location} • {timeAgo}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2 mt-4">
                                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12Z" stroke="currentColor" strokeWidth="2" />
                                                    <path d="M15 12L12 12M12 12L9 12M12 12L12 9M12 12L12 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                                </svg>
                                                {job.workType}
                                            </span>
                                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                                                </svg>
                                                {job.jobType}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 mt-6 justify-end">
                                            <Button
                                                className={`px-6 py-2 rounded-full ${!job.active ? 'bg-gray-400 hover:bg-gray-400 cursor-not-allowed' :
                                                    application ? 'bg-gray-500 hover:bg-gray-600' :
                                                        'bg-blue-600 hover:bg-blue-700'
                                                    } text-white`}
                                                onClick={handleApply}
                                                disabled={!job.active || applyMutation.isPending || application}
                                            >
                                                {!job.active ? 'Hết hạn ứng tuyển' :
                                                    application ? 'Đã ứng tuyển' :
                                                        applyMutation.isPending ? 'Đang xử lý...' : 'Ứng tuyển'}
                                            </Button>
                                            <Button variant="outline" className="rounded-full">
                                                Lưu
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Job Description Card */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <JobDescriptionViewer content={job.description} />
                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <p className="text-sm text-gray-500 text-right">
                                        Được đăng bởi {author.lastName} {author.firstName} • {timeAgo}
                                    </p>
                                </div>
                            </div>

                            {/* Applicants List */}
                            {
                                job?.pageUser.user.id === user?.id && (job.pageUser.role === "ADMIN" || job.pageUser.role === "OPERATOR") && (
                                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                        <h2 className="text-lg font-semibold mb-4">Danh sách ứng viên</h2>
                                        {job.active && (
                                            <div className="overflow-x-auto">
                                                <table className="w-full">
                                                    <thead className="bg-gray-50 border-b">
                                                        <tr>
                                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Ứng viên</th>
                                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Email</th>
                                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Ngày ứng tuyển</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y">
                                                        <ApplicantsList jobId={jobId} />
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                        {!job.active && (
                                            <p className="text-gray-500 text-center py-4">Tin tuyển dụng đã hết hạn</p>
                                        )}
                                    </div>
                                )
                            }
                        </div>

                        {/* Sidebar - Right Side */}
                        <div className="w-[400px] space-y-4">
                            <div className="sticky top-8 space-y-4">
                                {/* Profile Card */}
                                {isLoadingProfile ? (
                                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                        <div className="animate-pulse space-y-4">
                                            <div className="h-20 bg-gray-200 rounded-lg"></div>
                                            <div className="h-20 w-20 bg-gray-200 rounded-full mx-auto -mt-10"></div>
                                            <div className="space-y-3">
                                                <div className="h-4 bg-gray-200 rounded"></div>
                                                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                                            </div>
                                        </div>
                                    </div>
                                ) : profile ? (
                                    <ProfileCard data={profile} />
                                ) : null}

                                {/* About Company Card */}
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                    <h2 className="text-base font-semibold mb-4">Thông tin công ty</h2>
                                    <div className="flex items-center gap-3 mb-4 cursor-pointer hover:bg-gray-50 p-2 rounded-lg" onClick={() => router.push(`/page/${page?.id}`)}>
                                        <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-gray-100">
                                            <img
                                                src={page?.avatar?.url || "https://github.com/shadcn.png"}
                                                alt="Logo"
                                                className="object-cover"
                                            />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-blue-600 hover:underline">{page?.name || "Tên công ty"}</h3>
                                            <p className="text-sm text-gray-600">{page?.address || "Địa chỉ công ty"}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-3 text-sm">
                                        {page?.url && (
                                            <p className="break-all">
                                                <a href={page?.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-block max-w-full overflow-hidden text-ellipsis">
                                                    {page?.url}
                                                </a>
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function ApplicantsList({ jobId }: { jobId: string }) {
    const [currentPage, setCurrentPage] = useState(1);
    const take = 10;

    const { data: response, isLoading } = useQuery<{ items: Applicant[], meta: { itemCount: number, pageCount: number, hasNextPage: boolean, hasPreviousPage: boolean } }>({
        queryKey: ['applicants', jobId, currentPage],
        queryFn: () => axiosInstance.get(`/api/recruitment-posts/${jobId}/applications?page=${currentPage}&take=${take}`).then(res => res.data)
    });

    const applicants = response?.items || [];
    const total = response?.meta?.itemCount || 0;
    const totalPages = response?.meta?.pageCount || 1;

    // Use useQueries to fetch multiple profiles
    const profileQueries = useQueries({
        queries: applicants.map(applicant => ({
            queryKey: ['profile', applicant.user.id],
            queryFn: () => axiosInstance.get(`/api/users/${applicant.user.id}`).then(res => res.data),
            enabled: !!applicant.user.id
        }))
    });

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
            pageNumbers.push('...');
        }

        // Add middle pages
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        // Add dots before last page if needed
        if (endPage < totalPages - 1) {
            pageNumbers.push('...');
        }

        // Always show last page if there is more than one page
        if (totalPages > 1) {
            pageNumbers.push(totalPages);
        }

        return pageNumbers;
    };

    if (isLoading || profileQueries.some(query => query.isLoading)) {
        return (
            <tr>
                <td colSpan={3} className="px-4 py-3 text-center text-sm text-gray-500">
                    Đang tải danh sách ứng viên...
                </td>
            </tr>
        );
    }

    if (!applicants?.length) {
        return (
            <tr>
                <td colSpan={3} className="px-4 py-3 text-center text-sm text-gray-500">
                    Chưa có ứng viên nào
                </td>
            </tr>
        );
    }

    return (
        <>
            {applicants.map((applicant, index) => {
                const appliedDate = new Date(applicant.createdAt).toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });

                const profile = profileQueries[index].data;
                const avatarUrl = profile?.avatar?.url || "https://github.com/shadcn.png";

                return (
                    <tr key={applicant.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage className="object-cover" src={avatarUrl} />
                                </Avatar>
                                <div>
                                    <p className="font-medium text-sm">{applicant.user.lastName} {applicant.user.firstName}</p>
                                </div>
                            </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{applicant.user.email}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{appliedDate}</td>
                    </tr>
                );
            })}
            {total > 0 && (
                <tr>
                    <td colSpan={3}>
                        <div className="flex items-center justify-between pt-4">
                            <div className="flex items-center gap-2">
                                <p className="text-sm text-gray-700">
                                    Hiển thị <span className="font-medium">{(currentPage - 1) * take + 1}</span> đến{" "}
                                    <span className="font-medium">{Math.min(currentPage * take, total)}</span> trong{" "}
                                    <span className="font-medium">{total}</span> ứng viên
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
                                    {getPageNumbers().map((pageNumber, index) => (
                                        pageNumber === '...' ? (
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
                                    ))}
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
                    </td>
                </tr>
            )}
        </>
    );
} 