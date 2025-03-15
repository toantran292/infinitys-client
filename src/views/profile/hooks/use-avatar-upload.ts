import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { useS3Upload } from "@/hooks/use-s3-upload";

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
    onError?: (error: Error) => void;
}

export function useAvatarUpload({ userId, onSuccess, onError }: UseAvatarUploadProps) {
    const queryClient = useQueryClient();
    const { uploadToS3 } = useS3Upload({
        type: "avatar",
        prefix: userId
    });

    const mutation = useMutation({
        mutationFn: async (file: File) => {
            // Upload file và lấy key
            const { key } = await uploadToS3(file);

            // Cập nhật avatar trong database
            await axiosInstance.patch(`api/users/${userId}/avatar`, {
                avatar: {
                    key,
                    name: file.name,
                    content_type: file.type,
                    size: file.size
                }
            });

            // Lấy profile mới
            const { data: updatedProfile } = await axiosInstance.get(`api/users/${userId}`);
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