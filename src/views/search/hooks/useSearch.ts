import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { SearchResult } from "../types";

export const useSearch = (q: string) => {
  return useQuery({
    queryKey: ["SEARCH", q],
    queryFn: () =>
      axiosInstance
        .get(`/search?q=${q}`)
        .then((res) => res.data as SearchResult[])
  });
};
