import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { useS3Upload } from "@/hooks/use-s3-upload";
import { FileUploadResponse, S3UploadError } from "@/types/upload";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { ProtectedRouteLayout } from "@/components/layouts";
import { Button } from "@/components/ui/button";
import PagePreview from "@/components/ui/PagePreview";

export function PageRegisterComponent() {
  const router = useRouter();
  const [avatarFile, setAvatarFile] = useState<File | undefined>();

  const { uploadToS3 } = useS3Upload({
    type: "avatar",
    onError: (error: S3UploadError) => {
      console.error("Upload error:", error);
    }
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: "",
      url: "",
      address: "",
      email: "",
      content: ""
    }
  });

  const { mutate: registerPageMutation, isPending } = useMutation({
    mutationFn: async (data: any) => {
      const response = await axiosInstance.post("api/pages/register", data);
      return response.data;
    },
    onSuccess: async (data) => {
      const pageId = data.id;

      if (avatarFile) {
        const { key } = await uploadToS3(avatarFile, pageId);

        const fileData: FileUploadResponse = {
          key,
          name: avatarFile.name,
          content_type: avatarFile.type,
          size: avatarFile.size
        };

        await axiosInstance.patch(`api/pages/${pageId}/avatar`, {
          avatar: fileData
        });
      }

      toast.success("Tạo trang thành công!", {
        description: `Trang "${data.name}" đã được tạo.`
      });

      router.push("/page");
    },
    onError: (error) => {
      toast.error("Lỗi khi tạo trang", {
        description: "Đã có lỗi xảy ra khi tạo trang. Vui lòng thử lại"
      });
    }
  });

  const onSubmit = async (data: any) => {
    registerPageMutation(data);
  };

  return (
    <ProtectedRouteLayout>
      <div className="bg-[#f4f2ee] min-h-screen w-full flex justify-center py-10 border-t-2 border-b-2 border-gray-600">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="max-w-5xl w-full flex gap-8"
        >
          <div className="w-2/3 bg-white p-6 rounded-lg shadow-md self-start">
            <h1 className="text-xl font-semibold mb-4">
              Hãy bắt đầu với một vài chi tiết về công ty của bạn.
            </h1>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold">Tên*</label>
                <Input
                  className="w-full"
                  type="text"
                  {...register("name", { required: "Tên trang là bắt buộc" })}
                />
                <p className="text-red-500 text-sm">{errors.name?.message}</p>
              </div>

              <div>
                <label className="block text-sm font-semibold">
                  Trang web công ty
                </label>
                <Input
                  className="w-full"
                  type="text"
                  {...register("url")}
                  placeholder="http://, https:// hoặc www."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold">
                  Địa chỉ công ty
                </label>
                <Input
                  className="w-full"
                  type="text"
                  {...register("address")}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold">
                  Email công ty
                </label>
                <Input className="w-full" type="email" {...register("email")} />
              </div>

              <div>
                <label className="block text-sm font-semibold">
                  Logo trang
                </label>
                <label className="w-full border-dashed border-2 border-gray-300 bg-gray-100 flex flex-col items-center justify-center py-4 rounded-md cursor-pointer text-gray-600 text-sm">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setAvatarFile(e.target.files?.[0])}
                    className="hidden"
                  />
                  {avatarFile ? `Tải lên ${avatarFile.name}` : "Tải lên tệp"}
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  Khuyến nghị 300 x 300px. Hỗ trợ JPG, JPEG và PNG.
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold">Khẩu hiệu</label>
                <Input
                  className="w-full"
                  type="text"
                  {...register("content")}
                />
              </div>
            </div>

            <div className="mt-4 flex items-start gap-2">
              <input type="checkbox" id="confirm" className="mt-1" required />
              <label htmlFor="confirm" className="text-sm">
                Tôi xác minh rằng tôi là đại diện được ủy quyền của tổ chức này
                và có quyền hành động thay mặt tổ chức này trong việc tạo và
                quản lý trang này.
              </label>
            </div>

            <div className="flex justify-end mt-6">
              <Button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-3xl"
              >
                {isPending ? "Đang tạo trang..." : "Tạo trang"}
              </Button>
            </div>
          </div>

          <div className="w-1/3 sticky top-6 self-start">
            <PagePreview
              url={avatarFile ? URL.createObjectURL(avatarFile) : ""}
              name={watch("name")}
              content={watch("content")}
              email={watch("email")}
            />
          </div>
        </form>
      </div>
    </ProtectedRouteLayout>
  );
}
