import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Page, JobPost } from "@/types/job";

interface JobHeaderProps {
    job: JobPost;
    page?: Page;
    application: any;
    onApply: () => void;
    isApplying: boolean;
    company: Page | null;
}

export function JobHeader({ job, page, application, onApply, isApplying, company }: JobHeaderProps) {
    const timeAgo = new Date(job.createdAt).toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex gap-4">
                <Avatar className="w-[72px] h-[72px] relative rounded-lg overflow-hidden flex-shrink-0">
                    <AvatarImage className="object-cover" src={page?.avatar?.url} />
                    <AvatarFallback className="text-xl bg-gray-500 text-white">
                        {page?.name?.charAt(0)}
                    </AvatarFallback>
                </Avatar>

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
                        <JobTag label={job.workType} icon="workType" />
                        <JobTag label={job.jobType} icon="jobType" />
                    </div>
                    <div className="flex items-center gap-4 mt-6 justify-end">
                        {!company && (<Button
                            className={`px-6 py-2 rounded-full ${!job.active
                                ? "bg-gray-400 hover:bg-gray-400 cursor-not-allowed"
                                : application
                                    ? "bg-gray-500 hover:bg-gray-600"
                                    : "bg-blue-600 hover:bg-blue-700"
                                } text-white`}
                            onClick={onApply}
                            disabled={
                                !job.active || isApplying || application
                            }
                        >
                            {!job.active
                                ? "Hết hạn ứng tuyển"
                                : application
                                    ? "Đã ứng tuyển"
                                    : isApplying
                                        ? "Đang xử lý..."
                                        : "Ứng tuyển"}
                        </Button>)}
                    </div>
                </div>
            </div>
        </div>
    );
}

function JobTag({ label, icon }: { label: string; icon: "workType" | "jobType" }) {
    return (
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
            {icon === "workType" ? (
                <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12Z"
                        stroke="currentColor"
                        strokeWidth="2"
                    />
                    <path
                        d="M15 12L12 12M12 12L9 12M12 12L12 9M12 12L12 15"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                </svg>
            ) : (
                <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M12 8V12L15 15"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                    <circle
                        cx="12"
                        cy="12"
                        r="9"
                        stroke="currentColor"
                        strokeWidth="2"
                    />
                </svg>
            )}
            {label}
        </span>
    );
} 