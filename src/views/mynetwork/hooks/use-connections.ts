import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { useAuth } from "@/providers/auth-provider";

interface ConnectionsParams {
  page?: number;
  limit?: number;
  search?: string;
}

export function useConnections(params: ConnectionsParams) {
  const { user } = useAuth();
  return useQuery({
    queryKey: [
      "connections",
      user?.id,
      params.search,
      params.page,
      params.limit
    ],
    queryFn: () =>
      axiosInstance
        .get(`/api/friends/${user?.id}`, {
          params: {
            page: params.page,
            take: params.limit,
            ...(params.search && { q: params.search })
          }
        })
        .then((res) => res.data),
    enabled: !!user?.id
  });
}

export function useConnectionRequests() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["connections", user?.id, "requests"],
    queryFn: () =>
      axiosInstance
        .get(`/api/friends/${user?.id}/requests`)
        .then((res) => res.data),
    enabled: !!user?.id
  });
}

export function useConnectionSuggestions() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["connections", user?.id, "suggestions"],
    queryFn: () =>
      axiosInstance
        .get(`/api/friends/${user?.id}/suggestions`)
        .then((res) => res.data),
    enabled: !!user?.id
  });
}
