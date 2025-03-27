import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import axiosInstance from "@/lib/axios";
import { SearchResult, SearchResultType, UserSearchResult } from "../types";
import { FriendStatus } from "@/types/friend";

export const useSearchResults = (q: string) => {
  const [results, setResults] = useState<SearchResult[]>([]);

  const { isLoading } = useQuery({
    queryKey: ["SEARCH", q],
    queryFn: async () => {
      const response = await axiosInstance.get(`/search?q=${q}`);
      setResults(response.data);
      return response.data;
    }
  });

  const updateUserStatus = (userId: string, status: FriendStatus | null) => {
    setResults((prevResults) =>
      prevResults.map((result) => {
        if (result.type !== SearchResultType.USER || result.id !== userId) {
          return result;
        }

        const userResult = result as UserSearchResult;

        return {
          ...userResult,
          friendStatus: status
        } as UserSearchResult;
      })
    );
  };

  return {
    results,
    isLoading,
    updateUserStatus
  } as const;
};
