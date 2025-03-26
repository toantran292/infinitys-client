'use client';

import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { Editor } from "@monaco-editor/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlayIcon, CheckIcon, RefreshCw } from "lucide-react";
import { FullWidthProtectedRouteLayout } from "@/components/layouts";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface ProblemFormData {
    title: string
    content: string
    difficulty: 'easy' | 'medium' | 'hard'
    timeLimit: number
    memoryLimit: number
    examples: Array<{
        input: string
        output: string
        explanation?: string
    }>
    constraints: string[]
}

const defaultCppTemplate = `#include <iostream>
#include <vector>
using namespace std;

class Solution {
public:
    vector<int> solve(vector<int>& nums) {
        // Write your code here
        return {};
    }
};

int main() {
    Solution solution;
    
    // Example test case
    vector<int> nums = {1, 2, 3};
    vector<int> result = solution.solve(nums);
    
    // Print result
    for(int num : result) {
        cout << num << " ";
    }
    cout << endl;
    
    return 0;
}`;

interface ProblemDetail {
    id: string;
    title: string;
    content: string;
    difficulty: 'easy' | 'medium' | 'hard';
    timeLimit: number;
    memoryLimit: number;
    examples: Array<{
        input: string;
        output: string;
        explanation?: string;
    }>;
    constraints: string[];
}

interface TestCaseResult {
    testcase: number;
    status: 'AC' | 'WA' | 'TLE' | 'RE' | 'CE';
    runtime: number;
    memory: number;
}

interface Submission {
    id: string;
    createdAt: string;
    result: TestCaseResult[];
    summary: SubmissionResult;
}

interface SubmissionResult {
    status: 'AC' | 'WA' | 'TLE' | 'RE' | 'CE';
    runtime: number;
    memory: number;
    totalTestCases: number;
    passedTestCases: number;
    failedTestCase?: TestCaseResult;
}

interface SubmissionSummary {
    total: number;
    accepted: number;
    wrongAnswer: number;
    timeLimitExceeded: number;
    runtimeError: number;
    compilationError: number;
    bestRuntime: number;
    bestMemory: number;
}

// Thêm các hàm helper để chuyển đổi đơn vị
const formatMemory = (memoryInKB: number): string => {
    if (memoryInKB < 1024) {
        return `${memoryInKB} KB`;
    }
    return `${(memoryInKB / 1024).toFixed(2)} MB`;
};

const formatRuntime = (runtimeInMs: number): string => {
    if (runtimeInMs < 1000) {
        return `${runtimeInMs} ms`;
    }
    return `${(runtimeInMs / 1000).toFixed(2)} s`;
};

export const ProblemsIdView = () => {
    const { id } = useParams();
    const [code, setCode] = useState(defaultCppTemplate);
    const [activeTab, setActiveTab] = useState("description");
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ['problems', id],
        queryFn: async () => {
            const response = await axiosInstance.get(`/api/problems/${id}`);
            return response.data as ProblemDetail;

        }
    });

    const { data: submissions, isLoading: isLoadingSubmissions } = useQuery({
        queryKey: ['submissions', id],
        queryFn: async () => {
            const response = await axiosInstance.get(`/api/problems/${id}/submissions`);
            return response.data as Submission[];
        }
    });

    const { data: summary, isLoading: isLoadingSummary } = useQuery({
        queryKey: ['submissions-summary', id],
        queryFn: async () => {
            const response = await axiosInstance.get(`/api/problems/${id}/submissions/summary`);
            return response.data as SubmissionSummary;
        }
    });

    const { mutate: submitCode, isPending: isRunning } = useMutation({
        mutationFn: async () => {
            const response = await axiosInstance.post(`/api/problems/${id}/submit`, {
                code,
                language: 'cpp'
            });
            return response.data;
        },
        onSuccess: () => {
            toast.success('Code submitted successfully. Click refresh to see results.');
        },
        onError: () => {
            toast.error('Submit code failed');
        }
    });

    const { refetch: refetchSubmissions, isRefetching } = useQuery({
        queryKey: ['submissions', id],
        queryFn: async () => {
            const response = await axiosInstance.get(`/api/problems/${id}/submissions`);
            return response.data as Submission[];
        }
    });

    const handleRefresh = async () => {
        await Promise.all([
            refetchSubmissions(),
            queryClient.invalidateQueries({ queryKey: ['submissions-summary', id] })
        ]);
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <FullWidthProtectedRouteLayout>
            <div className="flex h-[calc(100vh-72px)]">
                {/* Left Panel with Tabs */}
                <div className="w-[45%] flex flex-col border-r">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col h-full">
                        <div className="border-b">
                            <TabsList className="w-full">
                                <TabsTrigger value="description" className="flex-1">Description</TabsTrigger>
                                <TabsTrigger value="submissions" className="flex-1">Submissions</TabsTrigger>
                            </TabsList>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4">
                            <TabsContent value="description" className="h-full">
                                <h1 className="text-2xl font-bold mb-2">{data?.title}</h1>

                                <div className="flex items-center gap-4 mb-4">
                                    <span className={`
                                        px-2 py-1 rounded text-sm
                                        ${data?.difficulty === 'easy' ? 'bg-green-100 text-green-800' : ''}
                                        ${data?.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' : ''}
                                        ${data?.difficulty === 'hard' ? 'bg-red-100 text-red-800' : ''}
                                    `}>
                                        {data?.difficulty ? data.difficulty.charAt(0).toUpperCase() + data.difficulty.slice(1) : ''}
                                    </span>

                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                        <span>
                                            Time Limit: {formatRuntime(data?.timeLimit || 0)}
                                        </span>
                                        <span>
                                            Memory Limit: {formatMemory(data?.memoryLimit || 0)}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-6 prose">
                                    <div dangerouslySetInnerHTML={{ __html: data?.content || "" }} />
                                </div>

                                <div className="mt-6">
                                    <h2 className="text-lg font-semibold mb-4">Examples:</h2>
                                    {data?.examples.map((example, index) => (
                                        <div key={index} className="mb-4 bg-gray-50 p-4 rounded">
                                            <div className="mb-2">
                                                <strong>Input:</strong> {example?.input}
                                            </div>
                                            <div className="mb-2">
                                                <strong>Output:</strong> {example?.output}
                                            </div>
                                            {example?.explanation && (
                                                <div>
                                                    <strong>Explanation:</strong> {example?.explanation}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-6">
                                    <h2 className="text-lg font-semibold mb-2">Constraints:</h2>
                                    <ul className="list-disc pl-5">
                                        {data?.constraints.map((constraint, index) => (
                                            <li key={index}>{constraint}</li>
                                        ))}
                                    </ul>
                                </div>
                            </TabsContent>

                            <TabsContent value="submissions" className="h-full">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-semibold">Submission Results</h2>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleRefresh}
                                        disabled={isRefetching}
                                    >
                                        <RefreshCw className={`w-4 h-4 mr-2 ${isRefetching ? 'animate-spin' : ''}`} />
                                        Refresh
                                    </Button>
                                </div>

                                {!isLoadingSubmissions && submissions && submissions.length > 0 && (
                                    <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div>
                                                <div className="text-sm text-gray-600">Total Submissions</div>
                                                <div className="text-lg font-semibold">{summary?.total || 0}</div>
                                            </div>
                                            <div>
                                                <div className="text-sm text-green-600">Accepted</div>
                                                <div className="text-lg font-semibold text-green-600">
                                                    {summary?.accepted || 0}
                                                    <span className="text-sm font-normal text-gray-500 ml-1">
                                                        ({Math.round(((summary?.accepted || 0) / (summary?.total || 1)) * 100)}%)
                                                    </span>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-sm text-gray-600">Best Runtime</div>
                                                <div className="text-lg font-semibold">
                                                    {summary?.bestRuntime ? formatRuntime(summary.bestRuntime) : '-'}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-sm text-gray-600">Best Memory</div>
                                                <div className="text-lg font-semibold">
                                                    {summary?.bestMemory ? formatMemory(summary.bestMemory) : '-'}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-4 flex gap-3">
                                            {(summary?.wrongAnswer || 0) > 0 && (
                                                <span className="px-2 py-1 text-sm bg-red-100 text-red-800 rounded">
                                                    WA: {summary?.wrongAnswer}
                                                </span>
                                            )}
                                            {(summary?.timeLimitExceeded || 0) > 0 && (
                                                <span className="px-2 py-1 text-sm bg-yellow-100 text-yellow-800 rounded">
                                                    TLE: {summary?.timeLimitExceeded}
                                                </span>
                                            )}
                                            {(summary?.runtimeError || 0) > 0 && (
                                                <span className="px-2 py-1 text-sm bg-gray-100 text-gray-800 rounded">
                                                    RE: {summary?.runtimeError}
                                                </span>
                                            )}
                                            {(summary?.compilationError || 0) > 0 && (
                                                <span className="px-2 py-1 text-sm bg-orange-100 text-orange-800 rounded">
                                                    CE: {summary?.compilationError}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {isLoadingSubmissions ? (
                                    <div className="flex items-center justify-center py-8">
                                        <span className="text-gray-500">Loading submissions...</span>
                                    </div>
                                ) : submissions?.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">
                                        No submissions yet
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {submissions?.map((submission) => {
                                            const result = submission.summary;
                                            return (
                                                <div key={submission.id} className="border rounded-lg overflow-hidden">
                                                    <div className="bg-gray-50 p-4 flex items-center justify-between border-b">
                                                        <div className="flex items-center gap-3">
                                                            <span className={`px-2 py-1 rounded text-sm ${result.status === 'AC' ? 'bg-green-100 text-green-800' :
                                                                result.status === 'WA' ? 'bg-red-100 text-red-800' :
                                                                    result.status === 'TLE' ? 'bg-yellow-100 text-yellow-800' :
                                                                        result.status === 'CE' ? 'bg-orange-100 text-orange-800' :
                                                                            'bg-gray-100 text-gray-800'
                                                                }`}>
                                                                {result.status} {result.status !== 'CE' && `(${result.passedTestCases}/${result.totalTestCases})`}
                                                            </span>
                                                            <span className="text-sm text-gray-600">
                                                                Runtime: {formatRuntime(result.runtime)}
                                                            </span>
                                                            <span className="text-sm text-gray-600">
                                                                Memory: {formatMemory(result.memory)}
                                                            </span>
                                                        </div>
                                                        <span className="text-sm text-gray-500">
                                                            {new Date(submission.createdAt).toLocaleString()}
                                                        </span>
                                                    </div>
                                                    {result.failedTestCase && (
                                                        <div className="p-4">
                                                            <div className="space-y-2">
                                                                <div className="text-sm text-red-600 font-medium">
                                                                    Failed at test case #{result.failedTestCase.testcase}
                                                                </div>
                                                                <div>
                                                                    <span className="font-medium">Status:</span>
                                                                    <span className="ml-2">{result.failedTestCase.status}</span>
                                                                </div>
                                                                <div>
                                                                    <span className="font-medium">Runtime:</span>
                                                                    <span className="ml-2">{formatRuntime(result.failedTestCase.runtime)}</span>
                                                                </div>
                                                                <div>
                                                                    <span className="font-medium">Memory:</span>
                                                                    <span className="ml-2">{formatMemory(result.failedTestCase.memory)}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </TabsContent>
                        </div>
                    </Tabs>
                </div>

                {/* Code Editor Panel */}
                <div className="flex-1 flex flex-col">
                    <div className="p-4 border-b flex justify-between items-center">
                        <select
                            className="border rounded px-3 py-1"
                            defaultValue="cpp"
                        >
                            <option value="cpp">C++</option>
                        </select>

                        <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                                <PlayIcon className="w-4 h-4 mr-2" />
                                Run
                            </Button>
                            <Button size="sm" onClick={() => submitCode()} disabled={isRunning}>
                                <CheckIcon className="w-4 h-4 mr-2" />
                                {isRunning ? 'Running...' : 'Submit'}
                            </Button>
                        </div>
                    </div>

                    <div className="flex-1">
                        <Editor
                            height="100%"
                            defaultLanguage="cpp"
                            theme="vs-dark"
                            value={code || defaultCppTemplate}
                            onChange={(value) => setCode(value || "")}
                            options={{
                                minimap: { enabled: false },
                                fontSize: 14,
                                lineNumbers: "on",
                                automaticLayout: true,
                            }}
                        />
                    </div>
                </div>
            </div>
        </FullWidthProtectedRouteLayout>
    );
};