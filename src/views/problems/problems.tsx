"use client";

import { ProtectedRouteLayout } from "@/components/layouts";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import Link from "next/link";
import { CheckCircle2, Circle, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface PaginatedResponse<T> {
    items: T[];
    meta: {
        page: number;
        take: number;
        itemCount: number;
        pageCount: number;
        hasPreviousPage: boolean;
        hasNextPage: boolean;
    };
}

interface Problem {
    id: string;
    title: string;
    difficulty: 'easy' | 'medium' | 'hard';
    statistics: {
        totalSubmissions: number;
        totalAccepted: number;
    };
    userStatus?: {
        attempted: boolean;
        solved: boolean;
        submissions: {
            total: number;
            accepted: number;
            wrongAnswer: number;
            timeLimitExceeded: number;
            runtimeError: number;
            compilationError: number;
        };
        bestSubmission?: {
            runtime: number;
            memory: number;
        };
    };
}

export const ProblemsView = () => {
    const [page, setPage] = useState(1);
    const take = 10; // số items mỗi trang

    const { data, isLoading } = useQuery({
        queryKey: ['problems', page],
        queryFn: async () => {
            const response = await axiosInstance.get('/api/problems', {
                params: {
                    page,
                    take
                }
            });
            return response.data as PaginatedResponse<Problem>;
        }
    });

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    if (isLoading) return <div>Loading...</div>;

    return <ProtectedRouteLayout>
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Problem Set</h1>
                <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-[#0A66C2] rounded-full" />
                        <span className="text-gray-600">Solved</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                        <span className="text-gray-600">Attempted</span>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                                    Trạng thái
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tiêu đề
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                                    Độ khó
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                                    Tỷ lệ chấp nhận
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {data?.items?.map((problem) => (
                                <tr key={problem.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        {problem.userStatus?.solved ? (
                                            <CheckCircle2 className="w-5 h-5 text-[#0A66C2]" />
                                        ) : problem.userStatus?.attempted ? (
                                            <Circle className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                                        ) : (
                                            <Circle className="w-5 h-5 text-gray-300" />
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Link
                                            href={`/problems/${problem.id}`}
                                            className="text-[#0A66C2] hover:text-[#084c8e] font-medium"
                                        >
                                            {problem.title}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`
                                            px-3 py-1 rounded-full text-xs font-medium
                                            ${problem.difficulty === 'easy' && 'bg-green-100 text-green-800'}
                                            ${problem.difficulty === 'medium' && 'bg-yellow-100 text-yellow-800'}
                                            ${problem.difficulty === 'hard' && 'bg-red-100 text-red-800'}
                                        `}>
                                            {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {problem.statistics.totalAccepted > 0
                                            ? `${((problem.statistics.totalAccepted / problem.statistics.totalSubmissions) * 100).toFixed(1)}%`
                                            : '0.0%'
                                        }
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-700 font-medium">
                            Hiển thị {((page - 1) * take) + 1} đến {Math.min(page * take, data?.meta.itemCount || 0)} trong tổng số {data?.meta.itemCount || 0} bài tập
                        </div>

                        <div className="flex items-center gap-1">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handlePageChange(1)}
                                disabled={page === 1}
                                className="h-8 w-8 border-gray-200 hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50"
                                title="Trang đầu"
                            >
                                <ChevronsLeft className="h-4 w-4" />
                            </Button>

                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handlePageChange(page - 1)}
                                disabled={!data?.meta.hasPreviousPage}
                                className="h-8 w-8 border-gray-200 hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50"
                                title="Trang trước"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>

                            <div className="flex items-center">
                                {Array.from({ length: Math.min(5, data?.meta.pageCount || 0) }, (_, i) => {
                                    let pageNum;
                                    if (data?.meta.pageCount && data.meta.pageCount <= 5) {
                                        pageNum = i + 1;
                                    } else if (page <= 3) {
                                        pageNum = i + 1;
                                    } else if (page >= (data?.meta.pageCount || 0) - 2) {
                                        pageNum = (data?.meta.pageCount || 0) - 4 + i;
                                    } else {
                                        pageNum = page - 2 + i;
                                    }

                                    return (
                                        <Button
                                            key={pageNum}
                                            variant={page === pageNum ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => handlePageChange(pageNum)}
                                            className={`h-8 w-8 mx-0.5 ${page === pageNum
                                                ? "bg-blue-600 text-white hover:bg-blue-700"
                                                : "border-gray-200 hover:bg-gray-100 hover:text-gray-900"
                                                }`}
                                        >
                                            {pageNum}
                                        </Button>
                                    );
                                })}
                            </div>

                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handlePageChange(page + 1)}
                                disabled={!data?.meta.hasNextPage}
                                className="h-8 w-8 border-gray-200 hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50"
                                title="Trang sau"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>

                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handlePageChange(data?.meta.pageCount || 1)}
                                disabled={page === data?.meta.pageCount}
                                className="h-8 w-8 border-gray-200 hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50"
                                title="Trang cuối"
                            >
                                <ChevronsRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Summary section */}
            <div className="mt-4 flex justify-between items-center">
                <div className="text-sm font-medium text-gray-700">
                    Tổng số {data?.meta.itemCount || 0} bài tập
                </div>
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-blue-600">
                        {data?.items?.filter(p => p.userStatus?.solved).length || 0}
                    </span>
                    <span className="text-sm font-medium text-gray-700">bài đã giải</span>
                </div>
            </div>
        </div>
    </ProtectedRouteLayout>;
};
