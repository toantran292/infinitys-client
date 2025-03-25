"use client";

import { ProtectedRouteLayout } from "@/components/layouts";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import Link from "next/link";

interface Problem {
    id: string;
    title: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    acceptance_rate: number;
    solved: boolean;
}

export const ProblemsView = () => {
    const { data, isLoading } = useQuery({
        queryKey: ['problems'],
        queryFn: async () => {
            const response = await axiosInstance.get('/api/problems');
            return response.data as { items: Problem[] };
        }
    });

    if (isLoading) return <div>Loading...</div>;

    return <ProtectedRouteLayout>
        <div className="px-6 py-4">
            <h1 className="text-2xl font-bold mb-6">Problem List</h1>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Difficulty</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acceptance</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {data?.items?.map((problem) => (
                            <tr key={problem.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className={`w-3 h-3 rounded-full ${problem.solved ? 'bg-green-500' : 'bg-gray-200'}`} />
                                </td>
                                <td className="px-6 py-4">
                                    <Link
                                        href={`/problems/${problem.id}`}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        {problem.title}
                                    </Link>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`
                                        px-2 py-1 rounded text-sm
                                        ${problem.difficulty === 'Easy' && 'bg-green-100 text-green-800'}
                                        ${problem.difficulty === 'Medium' && 'bg-yellow-100 text-yellow-800'}
                                        ${problem.difficulty === 'Hard' && 'bg-red-100 text-red-800'}
                                    `}>
                                        {problem.difficulty}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    {problem?.acceptance_rate?.toFixed(1)}%
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </ProtectedRouteLayout>
};