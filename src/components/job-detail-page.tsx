"use client";

import { Button } from "@/components/ui/button";
import { Header } from "@/components/layouts/header";
import { JobDescriptionViewer } from "@/components/ui/editor/job-description-viewer";
import Image from "next/image";
import { useProfile } from "@/hooks/use-profile";
import { useAuth } from "@/providers/auth-provider";
import { JobPost } from "@/types/job";
import { instance } from "@/lib/axios-instance";
import { useQuery } from "@tanstack/react-query";
import ProfileCard from "@/views/profile/components/profile-card";

interface JobDetailPageProps {
    jobId: string;
}

export function JobDetailPage({ jobId }: JobDetailPageProps) {
    const { user } = useAuth();
    const { data: profile, isLoading: isLoadingProfile } = useProfile(user?.id);

    const { data: job, isLoading: isLoadingJob } = useQuery<JobPost>({
        queryKey: ['job', jobId],
        queryFn: () => instance.get(`/api/recruitment-posts/${jobId}`).then(res => res.data)
    });

    if (isLoadingJob) {
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
    const page = job.pageUser.page;
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
                                        <Image
                                            src={page.avatar?.url || "https://github.com/shadcn.png"}
                                            alt={page.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h1 className="text-2xl font-semibold text-gray-900 mb-1">
                                            {job.title}
                                        </h1>
                                        <div className="space-y-1 text-sm">
                                            <p className="font-medium">
                                                {page.name}
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
                                            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full">
                                                Ứng tuyển
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
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-gray-100">
                                            <Image
                                                src={page.avatar?.url || "https://github.com/shadcn.png"}
                                                alt="Logo"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div>
                                            <h3 className="font-medium">{page.name}</h3>
                                            <p className="text-sm text-gray-600">{page.address}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-3 text-sm">
                                        {page.url && (
                                            <p>
                                                <a href={page.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                                    {page.url}
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