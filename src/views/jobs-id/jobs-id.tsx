"use client";

import { Header } from "@/components/layouts/header";
import { useProfile } from "@/hooks/use-profile";
import { useAuth } from "@/providers/auth-provider";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import ProfileCard from "@/views/profile/components/profile-card";

// Import các components đã tách
import { LoadingState } from "./components/loading-state";
import { JobHeader } from "./components/job-header";
import { JobDescription } from "./components/job-description";
import { ApplicantsList } from "./components/applicants-list";
import { CompanyInfo } from "./components/company-info";
import { useJobApplication } from "./hooks/use-job-application";
import { useCompanyWorking } from "./hooks/use-company-working";
import { useMemo } from "react";
import { Page } from "@/types/job";

interface JobDetailPageProps {
  jobId: string;
}

export function JobsIdComponent({ jobId }: JobDetailPageProps) {
  const { user } = useAuth();
  const { data: profile, isLoading: isLoadingProfile } = useProfile(user?.id);
  const { apply, isApplying } = useJobApplication(jobId);
  const { companies, isLoadingCompanyWorking } = useCompanyWorking();

  const { data: job, isLoading: isLoadingJob } = useQuery({
    queryKey: ["job", jobId],
    queryFn: () =>
      axiosInstance
        .get(`/api/recruitment-posts/${jobId}`)
        .then((res) => res.data)
  });

  const { data: application } = useQuery({
    queryKey: ["application", jobId],
    queryFn: () =>
      axiosInstance.get(`/api/applications/${jobId}`).then((res) => res.data),
    enabled: !!user && !!jobId
  });

  const { data: page, isLoading: isLoadingPage } = useQuery({
    queryKey: ["page", job?.page.id],
    queryFn: () =>
      axiosInstance
        .get(`/api/pages/${job?.page.id}`)
        .then((res) => res.data),
    enabled: !!job?.page.id
  });

  const company = useMemo(() => {
    return companies.find((company: Page) => company.id === job?.page.id) || null;
  }, [companies, job]);

  const handleApply = () => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để ứng tuyển");
      return;
    }
    apply();
  };

  if (isLoadingJob || isLoadingPage || isLoadingCompanyWorking) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 w-full">
          <div className="container max-w-[1200px] mx-auto px-4 py-8">
            <LoadingState />
          </div>
        </main>
      </div>
    );
  }

  if (!job) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 w-full">
        <div className="container max-w-[1200px] mx-auto px-4 py-8">
          <div className="flex gap-8">
            {/* Main Content - Left Side */}
            <div className="flex-1 max-w-[780px] space-y-4">
              {/* Job Header Card */}
              <JobHeader
                job={job}
                page={page}
                application={application}
                onApply={handleApply}
                isApplying={isApplying}
                company={company}
              />

              {/* Job Description Card */}
              <JobDescription
                description={job.description}
                author={job.author}
                createdAt={job.createdAt}
              />

              {/* Applicants List */}
              {job?.author.id === user?.id &&
                (["ADMIN", "OPERATOR"].includes(company?.pageRole || "") && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold mb-4">
                      Danh sách ứng viên
                    </h2>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                              Ứng viên
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                              Email
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                              Ngày ứng tuyển
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          <ApplicantsList pageId={job?.page.id} jobId={jobId} isActive={job.active} />
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
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
                <CompanyInfo page={page} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
