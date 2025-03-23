"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Camera, MessageCircleCode, Pencil, UserRoundPlus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCreateGroupChat } from "@/views/chat-id/hooks";
import { useAuth } from "@/providers/auth-provider";
import axiosInstance from "@/lib/axios";
import { Profile, ProfileAvatar } from "../types";

interface FormData {
  dateOfBirth: string;
  gender: string;
  major: string;
  desiredJobPosition: string;
}

const ProfileAvatarComponent = ({ avatar }: { avatar: ProfileAvatar }) => {
  return (
    <Avatar className="w-20 h-20">
      <AvatarImage
        src={avatar?.url}
        alt="Avatar"
      />
      <AvatarFallback>T</AvatarFallback>
    </Avatar>
  );
};

export default function ProfileCard({ data }: { data: Profile | null }) {
  const { user, refetchUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();
  const { createGroupChat, isPending } = useCreateGroupChat();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting }
  } = useForm<FormData>({
    defaultValues: {
      dateOfBirth: data?.dateOfBirth
        ? new Date(data.dateOfBirth).toISOString().split("T")[0]
        : "",
      gender: data?.gender || "",
      major: data?.major || "",
      desiredJobPosition: data?.desiredJobPosition || ""
    }
  });

  const mutation = useMutation({
    mutationFn: async (updatedData: FormData) => {
      const sanitizedData = Object.fromEntries(
        Object.entries(updatedData).filter(([, value]) => value !== "")
      );

      if (sanitizedData.dateOfBirth) {
        const selectedDate = new Date(sanitizedData.dateOfBirth);
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
    if (!file) return;

    event.target.value = "";

    try {
      const { data: presignedData } = await axiosInstance.post(
        `api/assets/presign-link`,
        {
          type: "avatar",
          suffix: `${data?.id}/${Date.now()}-${file.name}`
        }
      );

      const presignedUrl = presignedData.url;
      const key = presignedData.key;

      if (!presignedUrl) throw new Error("Không lấy được pre-signed URL");

      const uploadResponse = await fetch(presignedUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type }
      });

      if (!uploadResponse.ok) throw new Error("Upload ảnh thất bại");

      await axiosInstance.patch(`api/users/${data?.id}/avatar`, {
        avatar: {
          key,
          name: file.name,
          content_type: file.type,
          size: file.size
        }
      });

      const updatedProfile = await axiosInstance.get(`api/users/${data?.id}`);

      queryClient.setQueryData(["PROFILE", data?.id], updatedProfile.data);
      refetchUser();
    } catch (error) {
      console.error("Lỗi khi tải ảnh lên S3:", error);
    }
  };

  const onSubmit = (formData: FormData) => {
    mutation.mutate(formData);
  };

  if (!data)
    return <div className="text-center text-gray-500">Đang tải...</div>;

  const genderText =
    data.gender === "Male"
      ? "Nam"
      : data.gender === "Female"
        ? "Nữ"
        : "Chưa cập nhật";

  return (
    <div className="relative p-6 bg-gray-50 shadow-lg rounded-lg max-w-lg mx-auto">
      <button
        onClick={() => {
          reset();
          setIsEditing(true);
        }}
        className="absolute top-4 right-4 p-2 text-gray-600 hover:text-gray-800 transition"
      >
        <Pencil className="w-5 h-5" />
      </button>

      <div className="flex items-center space-x-4 border-b border-gray-300 pb-4">
        <div className="relative w-20 h-20">
          <ProfileAvatarComponent avatar={data.avatar} />

          {data.id === user?.id && (
            <>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="avatarUpload"
                onChange={handleFileChange}
              />
              <label
                htmlFor="avatarUpload"
                className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black/50 rounded-full cursor-pointer hover:bg-black/60 transition"
              >
                <Camera className="w-6 h-6 text-white" />
              </label>
            </>
          )}
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-gray-900">
            {data.firstName} {data.lastName}
          </h2>
          <p className="text-gray-600">{data.email}</p>
          {data.id !== user?.id ? (
            <div className="flex gap-2 items-center">
              <Button
                disabled={isPending}
                onClick={() => createGroupChat([data.id])}
                className="bg-neutral-500 text-white"
              >
                <MessageCircleCode /> nhắn tin
              </Button>

              <Button
                disabled={isPending}
                onClick={() => createGroupChat([data.id])}
              >
                <UserRoundPlus /> Kết bạn
              </Button>
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-4 space-y-2 text-gray-700">
        {isEditing ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                🎂 Ngày sinh
              </label>
              <input
                type="date"
                {...register("dateOfBirth")}
                className="w-full mt-1 p-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                🚻 Giới tính
              </label>
              <select
                {...register("gender")}
                className="w-full mt-1 p-2 border rounded-md"
              >
                <option value="">Chưa cập nhật</option>
                <option value="Male">Nam</option>
                <option value="Female">Nữ</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                🎓 Chuyên ngành
              </label>
              <input
                type="text"
                {...register("major")}
                className="w-full mt-1 p-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                💼 Vị trí mong muốn
              </label>
              <input
                type="text"
                {...register("desiredJobPosition")}
                className="w-full mt-1 p-2 border rounded-md"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded-md"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={mutation.isPending || isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                {mutation.isPending || isSubmitting ? "Đang lưu..." : "Lưu"}
              </button>
            </div>

            {mutation.isError && (
              <p className="text-red-500 text-sm mt-2">
                Lỗi khi cập nhật: {mutation.error?.message}
              </p>
            )}
          </form>
        ) : (
          <>
            <p>
              <strong className="text-gray-900">🎂 Ngày sinh:</strong>{" "}
              {data.dateOfBirth
                ? new Date(data.dateOfBirth).toLocaleDateString("vi-VN")
                : "Chưa cập nhật"}
            </p>
            <p>
              <strong className="text-gray-900">🚻 Giới tính:</strong>{" "}
              {genderText}
            </p>
            <p>
              <strong className="text-gray-900">🎓 Chuyên ngành:</strong>{" "}
              {data.major || "Chưa cập nhật"}
            </p>
            <p>
              <strong className="text-gray-900">💼 Vị trí mong muốn:</strong>{" "}
              {data.desiredJobPosition || "Chưa cập nhật"}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
