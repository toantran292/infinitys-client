"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Profile } from "../profile-page";
import { instance } from "@/common/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import { useState } from "react";

interface FormData {
  dateOfBirth: string;
  gender: string;
  major: string;
  desiredJobPosition: string;
}

export default function ProfileCard({ data }: { data: Profile | null }) {
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();

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

      await instance.patch(`/users/${data?.id}`, sanitizedData);
    },
    onSuccess: () => {
      setIsEditing(false);
      queryClient.invalidateQueries({
        queryKey: ["PROFILE", data?.id]
      });
    }
  });

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

      {/* Thông tin chính */}
      <div className="flex items-center space-x-4 border-b border-gray-300 pb-4">
        <Avatar className="w-20 h-20">
          <AvatarImage
            src="https://github.com/shadcn.png"
            alt={data.firstName}
          />
          <AvatarFallback>
            {data.firstName[0]}
            {data.lastName[0]}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            {data.firstName} {data.lastName}
          </h2>
          <p className="text-gray-600">{data.email}</p>
        </div>
      </div>

      {/* Thông tin chi tiết */}
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
