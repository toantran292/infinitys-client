import { useS3Upload } from "@/hooks/use-s3-upload";
import axiosInstance from "@/lib/axios";
import { Post } from "@/types/job";
import {
  FileUploadResponse,
  PresignedUrlResponse,
  S3UploadError
} from "@/types/upload";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export enum PostUploadType {
  IMAGES = "images"
}

interface UsePostUploadProps {
  postId: string;
  type: PostUploadType;
  onSuccess?: () => void;
  onError?: (error: S3UploadError) => void;
}

interface FileData {
  key: string;
  name: string;
  content_type: string;
  size: number;
}

interface PostUploadResponse {
  images: FileData[];
  // Thêm các trường khác nếu API trả về
}

export function usePostUpload({
  postId,
  type = PostUploadType.IMAGES,
  onSuccess,
  onError
}: UsePostUploadProps) {
  const queryClient = useQueryClient();

  const { uploadMultipleToS3 } = useS3Upload({
    type: type,
    onSuccess: (data: PresignedUrlResponse[]) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error: S3UploadError) => {
      onError?.(error);
    }
  });

  const mutation = useMutation<PostUploadResponse, S3UploadError, File[]>({
    mutationFn: async (files: File[]) => {
      const results = await uploadMultipleToS3(files);

      const fileData: FileData[] = results.map((result, index) => ({
        key: result.key,
        name: files[index].name,
        content_type: files[index].type,
        size: files[index].size
      }));

      const { data } = await axiosInstance.patch<PostUploadResponse>(
        `api/posts/${postId}/images`,
        {
          images: fileData
        }
      );

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      onSuccess?.();
    },
    onError
  });

  return mutation;
}
