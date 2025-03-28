import { useState } from "react";
import { useQuery, useQueries } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { ApplicantItem } from "./applicant-item";
import { Pagination } from "./pagination";
import { Loader2 } from "lucide-react";

interface ApplicantsListProps {
    pageId: string;
    jobId: string;
    isActive: boolean;
}

export function ApplicantsList({ pageId, jobId, isActive }: ApplicantsListProps) {
    const [page, setPage] = useState(1);
    const take = 10;

    const { data: response, isLoading } = useQuery({
        queryKey: ["applicants", pageId, jobId, page],
        queryFn: () =>
            axiosInstance
                .get(
                    `/api/pages/${pageId}/recruitment-posts/${jobId}/applications`,
                    { params: { page, take } }
                )
                .then((res) => res.data)
    });

    const applicants = response?.items || [];
    const total = response?.meta?.itemCount || 0;
    const totalPages = response?.meta?.pageCount || 1;

    // Use useQueries to fetch multiple profiles
    const profileQueries = useQueries({
        queries: applicants.map((applicant: any) => ({
            queryKey: ["profile", applicant.user.id],
            queryFn: () =>
                axiosInstance
                    .get(`/api/users/${applicant.user.id}`)
                    .then((res) => res.data),
            enabled: !!applicant.user.id
        }))
    });

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

    if (!isActive) {
        return (
            <tr>
                <td colSpan={3} className="px-4 py-3 text-center text-sm text-gray-500">
                    Tin tuyển dụng đã hết hạn
                </td>
            </tr>
        );
    }

    if (isLoading || profileQueries.some((query) => query.isLoading)) {
        return (
            <tr>
                <td colSpan={3} className="px-4 py-3 text-center text-sm text-gray-500">
                    <div className="flex justify-center">
                        <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
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
            {applicants.map((applicant, index) => (
                <ApplicantItem
                    key={applicant.id}
                    applicant={applicant}
                    profile={profileQueries[index].data}
                />
            ))}
            {total > 0 && (
                <tr>
                    <td colSpan={3}>
                        <Pagination
                            currentPage={page}
                            totalPages={totalPages}
                            total={total}
                            take={take}
                            onPrevPage={handlePrevPage}
                            onNextPage={handleNextPage}
                            onPageChange={setPage}
                        />
                    </td>
                </tr>
            )}
        </>
    );
} 