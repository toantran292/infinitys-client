import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import { ErrorMessage } from "@/common/error";

export function useJobApplication(jobId: string) {
  const queryClient = useQueryClient();

  const applyMutation = useMutation({
    mutationFn: () => axiosInstance.post("/api/applications", { jobId }),
    onSuccess: () => {
      toast.success("Ứng tuyển thành công!");
      queryClient.invalidateQueries({ queryKey: ["application", jobId] });
    },
    onError: (error: ErrorMessage) => {
      toast.error(error.message);
    }
  });

  return {
    apply: applyMutation.mutate,
    isApplying: applyMutation.isPending
  };
}
