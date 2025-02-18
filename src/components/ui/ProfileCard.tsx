"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Profile } from "../profile-page";
import { instance } from "@/common/api";
import { useEffect, useState } from "react";
import { Pencil } from "lucide-react";

export default function ProfileCard({
  data,
  refreshProfile
}: {
  data: Profile | null;
  refreshProfile: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    dateOfBirth: "",
    gender: "",
    major: "",
    desiredJobPosition: ""
  });

  useEffect(() => {
    if (data) {
      setFormData({
        dateOfBirth: data.dateOfBirth
          ? new Date(data.dateOfBirth).toISOString().split("T")[0]
          : "",
        gender: data.gender || "",
        major: data.major || "",
        desiredJobPosition: data.desiredJobPosition || ""
      });
    }
  }, [data]);

  if (!data)
    return <div className="text-center text-gray-500">Đang tải...</div>;

  let gender = "Chưa cập nhật";
  if (data.gender) {
    gender = data.gender === "Male" ? "Nam" : "Nữ";
  }

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const sanitizedData = Object.fromEntries(
        Object.entries(formData).filter(([, value]) => value !== "")
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

      await instance.put(`/users/profile/${data.id}`, sanitizedData);
      setIsEditing(false);
      refreshProfile();
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin:", error);
    }
  };

  const formatDateToDisplay = (dateString: string | undefined) => {
    if (!dateString) return "Chưa cập nhật";
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;
  };

  return (
    <div className="relative p-6 bg-gray-50 shadow-lg rounded-lg max-w-lg mx-auto">
      <button
        onClick={handleEdit}
        className="absolute top-4 right-4 p-2 text-gray-600 hover:text-gray-800 transition"
      >
        <Pencil className="w-5 h-5" />
      </button>
      {/* Thông tin chính */}
      <div className="flex items-center space-x-4 border-b border-gray-300 pb-4">
        <Avatar className="w-20 h-20">
          <AvatarImage
            src="https://github.com/shadcn.png"
            alt={data.fullName}
          />
          <AvatarFallback>
            {data.firstName[0]}
            {data.lastName[0]}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            {data.fullName}
          </h2>
          <p className="text-gray-600">{data.email}</p>
        </div>
      </div>

      {/* Thông tin chi tiết */}
      <div className="mt-4 space-y-2 text-gray-700">
        {isEditing ? (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                🎂 Ngày sinh
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                🚻 Giới tính
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-md"
              >
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
                name="major"
                value={formData.major}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                💼 Vị trí mong muốn
              </label>
              <input
                type="text"
                name="desiredJobPosition"
                value={formData.desiredJobPosition}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-md"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded-md"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Lưu
              </button>
            </div>
          </div>
        ) : (
          <>
            <p>
              <strong className="text-gray-900">🎂 Ngày sinh:</strong>{" "}
              {formatDateToDisplay(data.dateOfBirth) || "Chưa cập nhật"}
            </p>
            <p>
              <strong className="text-gray-900">🚻 Giới tính:</strong> {gender}
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
