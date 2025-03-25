'use client';

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { Editor } from "@monaco-editor/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlayIcon, CheckIcon } from "lucide-react";
import { FullWidthProtectedRouteLayout } from "@/components/layouts";

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

export const ProblemsIdView = () => {
    const { id } = useParams();
    const [code, setCode] = useState(defaultCppTemplate);

    const { data, isLoading } = useQuery({
        queryKey: ['problems', id],
        queryFn: async () => {
            const response = await axiosInstance.get(`/api/problems/${id}`);
            return response.data as ProblemDetail;

        }
    });

    if (isLoading) return <div>Loading...</div>;

    return (
        <FullWidthProtectedRouteLayout>
            <div className="flex h-screen">
                {/* Problem Description Panel */}
                <div className="w-[45%] p-6 overflow-y-auto border-r">
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
                                Time Limit: {data?.timeLimit}ms
                            </span>
                            <span>
                                Memory Limit: {data?.memoryLimit}MB
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
                            <Button size="sm">
                                <CheckIcon className="w-4 h-4 mr-2" />
                                Submit
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