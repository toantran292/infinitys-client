import axiosInstance from "@/lib/axios";

interface PresignedUrlResponse {
    url: string;
    key: string;
}

interface UseS3UploadOptions {
    type: string;
    prefix?: string;
    onSuccess?: (data: { key: string; url: string }) => void;
    onError?: (error: Error) => void;
}

export function useS3Upload({ type, prefix = "", onSuccess, onError }: UseS3UploadOptions) {
    const uploadToS3 = async (file: File) => {
        try {
            // 1. Lấy presigned URL
            const { data: presignedData } = await axiosInstance.post<PresignedUrlResponse>(
                `api/assets/presign-link`,
                {
                    type,
                    suffix: `${prefix}/${Date.now()}-${String(file.name).trim().replace(/\s+/g, "-")}`
                }
            );

            if (!presignedData.url) {
                throw new Error("Không lấy được pre-signed URL");
            }

            // 2. Upload file lên S3
            const uploadResponse = await fetch(presignedData.url, {
                method: "PUT",
                body: file,
                headers: { "Content-Type": file.type }
            });

            if (!uploadResponse.ok) {
                throw new Error("Upload file thất bại");
            }

            onSuccess?.({ key: presignedData.key, url: presignedData.url });
            return presignedData;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Lỗi không xác định";
            onError?.(new Error(errorMessage));
            throw error;
        }
    };

    return { uploadToS3 };
} 