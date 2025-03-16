"use client";
import { createContext, useContext, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";

export type Page = {
  id: string;
  name: string;
  content?: string;
  address: string;
  url: string;
  email: string;
  status: string;
  avatar?: { url: string };
};

type PageContextType = {
  pages: Page[] | null;
  myPages: Page[] | null;
  page: Page | null;
  isLoading: boolean;
  registerPage: (data: Page) => Promise<void>;
  getPageById: (id: string) => void;
  revalidatePages: () => void;
};

const PageContext = createContext<PageContextType | undefined>(undefined);

export const PageProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);

  // Lấy danh sách tất cả trang
  const { data: pages, isLoading } = useQuery<Page[]>({
    queryKey: ["pages"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/pages");
      return res.data;
    },
  });

  // Lấy trang cá nhân của user
  const { data: myPages } = useQuery<Page[]>({
    queryKey: ["myPages"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/pages/me");
      return res.data;
    },
  });

  // Lấy thông tin page theo ID
  const { data: page } = useQuery<Page>({
    queryKey: ["page", selectedPageId],
    queryFn: async () => {
      if (!selectedPageId) return null;
      const res = await axiosInstance.get(`/api/pages/${selectedPageId}`);
      return res.data;
    },
    enabled: !!selectedPageId,
  });

  // Mutation để đăng ký trang
  const registerMutation = useMutation({
    mutationFn: async (data: Page) => {
      const res = await axiosInstance.post("/api/pages/register", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["pages"]); // Refresh lại danh sách trang
    },
  });

  const registerPage = async (data: Page) => {
    await registerMutation.mutateAsync(data);
  };

  const getPageById = (id: string) => {
    setSelectedPageId(id);
  };

  // Revalidate lại danh sách pages
  const revalidatePages = () => {
    queryClient.invalidateQueries(["pages"]);
  };

  return (
    <PageContext.Provider
      value={{ pages, myPages, page, isLoading, registerPage, getPageById, revalidatePages }}
    >
      {children}
    </PageContext.Provider>
  );
};

export const usePages = () => {
  const context = useContext(PageContext);
  if (!context) {
    throw new Error("usePages phải được dùng trong PageProvider");
  }
  return context;
};
