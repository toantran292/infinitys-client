import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { useS3Upload } from "@/hooks/use-s3-upload";
import type { FileUploadResponse, S3UploadError } from "@/types/upload";

export enum PageUploadType {
    AVATAR = "avatar",
    BANNER = "banner"
  }

interface UsePageUploadProps {
    pageId: string;
    type: PageUploadType;
    onSuccess?: (data: any) => void;
    onError?: (error: S3UploadError) => void;
  }

export function usePageUpload({
    pageId,
    type,
    onSuccess,
    onError
  }: UsePageUploadProps) {
    const queryClient = useQueryClient();
    const { uploadToS3 } = useS3Upload({
      type,
      prefix: pageId,
      onError: (error: S3UploadError) => {
        console.error("Upload error:", error);
        onError?.(error);
      }
    });
  
    const mutation = useMutation<FileUploadResponse, S3UploadError, File>({
      mutationFn: async (file: File) => {
        const { key } = await uploadToS3(file);
  
        const fileData: FileUploadResponse = {
          key,
          name: file.name,
          content_type: file.type,
          size: file.size
        };
  
        await axiosInstance.patch(`api/pages/${pageId}/avatar`, {
          avatar: fileData
        });
  
        const { data: updatedProfile } = await axiosInstance.get(
          `api/pages/${pageId}`
        );
        return updatedProfile;
      },
      onSuccess: (data) => {
        queryClient.setQueryData(["PAGE", pageId], data);
        onSuccess?.(data);
      },
      onError
    });
  
    return {
      action: mutation.mutate,
      isUploading: mutation.isPending,
      error: mutation.error
    };
  }
  