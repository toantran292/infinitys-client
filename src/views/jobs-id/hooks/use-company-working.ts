import { useQuery } from "@tanstack/react-query";
import { Page } from "@/types/job";
import axiosInstance from "@/lib/axios";

export function useCompanyWorking() {
  const { data: companyWorking, isLoading: isLoadingCompanyWorking } = useQuery(
    {
      queryKey: ["companyWorking"],
      queryFn: () =>
        axiosInstance.get("/api/pages/working").then((res) => res.data)
    }
  );

  const companies = (companyWorking || []).map((company: Page) => ({
    id: company.id,
    name: company.name,
    avatar: company.avatar,
    pageRole: company.pageRole,
    url: company.url
  }));

  console.log(companies);

  return { companies: companies as Page[], isLoadingCompanyWorking };
}

export function useCompanyWorkingById(id: string) {
  const { data: companyWorking, isLoading: isLoadingCompanyWorking } = useQuery(
    {
      queryKey: ["companyWorkingById", id],
      queryFn: () =>
        axiosInstance.get(`/api/users/${id}/working`).then((res) => res.data)
    }
  );

  return { companyWorking, isLoadingCompanyWorking };
}
