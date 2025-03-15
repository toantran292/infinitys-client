import { useS3Upload } from "@/hooks/use-s3-upload";
import axiosInstance from "@/lib/axios";
import type { FileUploadResponse, S3UploadError } from "@/types/upload";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface AvatarUploadResponse {
  url: string;
  key: string;
}

interface AvatarData {
  key: string;
  name: string;
  content_type: string;
  size: number;
}

interface UseAvatarUploadProps {
  userId: string;
  onSuccess?: () => void;
  onError?: (error: S3UploadError) => void;
}

export function useAvatarUpload({
  userId,
  onSuccess,
  onError
}: UseAvatarUploadProps) {
  const queryClient = useQueryClient();
  const { uploadToS3 } = useS3Upload({
    type: "avatar",
    prefix: userId,
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

      await axiosInstance.patch(`api/users/${userId}/avatar`, {
        avatar: fileData
      });

      const { data: updatedProfile } = await axiosInstance.get(
        `api/users/${userId}`
      );
      return updatedProfile;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["PROFILE", userId], data);
      onSuccess?.();
    },
    onError
  });

  return {
    uploadAvatar: mutation.mutate,
    isUploading: mutation.isPending,
    error: mutation.error
  };
}
