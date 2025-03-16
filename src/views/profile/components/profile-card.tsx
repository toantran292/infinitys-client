import { Profile } from "@/views/profile/profile";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil, MessageCircleCode, UserRoundPlus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCreateGroupChat } from "@/views/chat-id/hooks";
import { useAuth } from "@/providers/auth-provider";
import axiosInstance from "@/lib/axios";
import { ProfileAvatarComponent } from "./profile-avatar";
import { ProfileForm } from "./profile-form";
import type { ProfileFormData } from "./profile-form";
import { useAvatarUpload } from "../hooks/use-avatar-upload";
import { toast } from "sonner";

export default function ProfileCard({ data }: { data: Profile | null }) {
  const { user, refetchUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();
  const { createGroupChat, isPending } = useCreateGroupChat();
  const { uploadAvatar } = useAvatarUpload({
    userId: data?.id || "",
    onSuccess: () => {
      toast.success("Ảnh đã được tải lên");
      refetchUser();
    },
    onError: (error) =>
      toast.error("Lỗi khi tải ảnh lên", {
        description: error.message
      })
  });

  const mutation = useMutation({
    mutationFn: async (updatedData: ProfileFormData) => {
      const sanitizedData = Object.fromEntries(
        Object.entries(updatedData).filter(([, value]) => value !== "")
      ) as Partial<ProfileFormData>;

      if (sanitizedData.dateOfBirth) {
        const selectedDate = new Date(sanitizedData.dateOfBirth as string);
        sanitizedData.dateOfBirth = new Date(
          selectedDate.getUTCFullYear(),
          selectedDate.getUTCMonth(),
          selectedDate.getUTCDate(),
          12,
          0,
          0
        ).toISOString();
      }

      await axiosInstance.patch(`api/users/${data?.id}`, sanitizedData);
    },
    onSuccess: () => {
      setIsEditing(false);
      queryClient.invalidateQueries({
        queryKey: ["PROFILE", data?.id]
      });
    }
  });

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadAvatar(file);
      event.target.value = "";
    }
  };

  if (!data)
    return <div className="text-center text-gray-500">Đang tải...</div>;

  return (
    <div className="relative p-6 bg-gray-50 shadow-lg rounded-lg max-w-lg mx-auto">
      <button
        onClick={() => setIsEditing(true)}
        className="absolute top-4 right-4 p-2 text-gray-600 hover:text-gray-800 transition"
      >
        <Pencil className="w-5 h-5" />
      </button>

      <div className="flex items-center space-x-4 border-b border-gray-300 pb-4">
        <ProfileAvatarComponent
          avatar={data.avatar}
          canEdit={data.id === user?.id}
          onFileChange={handleFileChange}
        />

        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-gray-900">
            {data.firstName} {data.lastName}
          </h2>
          <p className="text-gray-600">{data.email}</p>
          {data.id !== user?.id && (
            <div className="flex gap-2 items-center">
              <Button
                disabled={isPending}
                onClick={() => createGroupChat(data?.id)}
                className="bg-neutral-500 text-white"
              >
                <MessageCircleCode /> Nhắn tin
              </Button>
              <Button
                disabled={isPending}
                onClick={() => createGroupChat(data?.id)}
              >
                <UserRoundPlus /> Kết bạn
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 space-y-2 text-gray-700">
        {isEditing ? (
          <ProfileForm
            profile={data}
            onSubmit={mutation.mutate}
            onCancel={() => setIsEditing(false)}
            isSubmitting={mutation.isPending}
            error={mutation.error?.message}
          />
        ) : (
          <ProfileInfo profile={data} />
        )}
      </div>
    </div>
  );
}

function ProfileInfo({ profile }: { profile: Profile }) {
  const genderText =
    profile.gender === "Male"
      ? "Nam"
      : profile.gender === "Female"
        ? "Nữ"
        : "Chưa cập nhật";

  return (
    <>
      <p>
        <strong className="text-gray-900">🎂 Ngày sinh:</strong>{" "}
        {profile.dateOfBirth
          ? new Date(profile.dateOfBirth).toLocaleDateString("vi-VN")
          : "Chưa cập nhật"}
      </p>
      <p>
        <strong className="text-gray-900">🚻 Giới tính:</strong> {genderText}
      </p>
      <p>
        <strong className="text-gray-900">🎓 Chuyên ngành:</strong>{" "}
        {profile.major || "Chưa cập nhật"}
      </p>
      <p>
        <strong className="text-gray-900">💼 Vị trí mong muốn:</strong>{" "}
        {profile.desiredJobPosition || "Chưa cập nhật"}
      </p>
    </>
  );
}
