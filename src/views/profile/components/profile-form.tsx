import { useForm } from "react-hook-form";
import { Profile } from "@/views/profile/profile";

export interface ProfileFormData {
  dateOfBirth: string;
  gender: string;
  major: string;
  desiredJobPosition: string;
}

interface ProfileFormProps {
  profile: Profile;
  onSubmit: (data: ProfileFormData) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  error?: string;
}

export function ProfileForm({
  profile,
  onSubmit,
  onCancel,
  isSubmitting,
  error
}: ProfileFormProps) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting: isFormSubmitting }
  } = useForm<ProfileFormData>({
    defaultValues: {
      dateOfBirth: profile?.dateOfBirth
        ? new Date(profile.dateOfBirth).toISOString().split("T")[0]
        : "",
      gender: profile?.gender || "",
      major: profile?.major || "",
      desiredJobPosition: profile?.desiredJobPosition || ""
    }
  });

  return (
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
          onClick={onCancel}
          className="px-4 py-2 bg-gray-400 text-white rounded-md"
        >
          Hủy
        </button>
        <button
          type="submit"
          disabled={isSubmitting || isFormSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          {isSubmitting || isFormSubmitting ? "Đang lưu..." : "Lưu"}
        </button>
      </div>

      {error && (
        <p className="text-red-500 text-sm mt-2">Lỗi khi cập nhật: {error}</p>
      )}
    </form>
  );
}
