import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";

interface PagesParams {
    page: number;
    limit: number;
    search: string;
}

export function usePages(params: PagesParams) {
    return useQuery({
        queryKey: ["pages", params.search, params.page, params.limit],
        queryFn: () => axiosInstance.get("api/pages/me", {
            params: {
                page: params.page,
                take: params.limit,
                ...(params.search && { q: params.search })
            }
        }).then((res) => res.data),
    });
} 