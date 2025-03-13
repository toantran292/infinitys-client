"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  registerPage,
  getPresignedUrl,
  getViewsAsset
} from "@/providers/page-provider";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layouts";
import { toast } from "@/hooks/use-toast";
import PagePreview from "@/components/ui/PagePreview";
import instance from "@/common/api";

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [avatar, setAvatar] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [presignedUrl, setPresignedUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: "",
      url: "",
      address: "",
      email: "",
      avatar: null,
      content: ""
    }
  });

  useEffect(() => {
    setValue("name", searchParams.get("name") || "");
    setValue("url", searchParams.get("url") || "");
    setValue("address", searchParams.get("address") || "");
    setValue("email", searchParams.get("email") || "");
    setValue("avatar", searchParams.get("avatar") || null);
    setValue("content", searchParams.get("content") || "");
  }, [searchParams, setValue]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    try {
      setUploading(true);

      const { url, key } = await getPresignedUrl(file.name);
      const uploadResponse = await fetch(url, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type }
      });

      if (!uploadResponse.ok) throw new Error("Upload ảnh thất bại");

      const res = await getViewsAsset(key);
      setPresignedUrl(res.url);
      setAvatar(key);
      setValue("avatar", key);

      toast({
        title: "Upload thành công!",
        description: "Ảnh đã được tải lên."
      });
    } catch (error) {
      console.error("Upload lỗi:", error);
      toast({
        title: "Lỗi khi upload ảnh",
        description: "Vui lòng thử lại!",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: any) => {
    try {
      const response = await registerPage({
        ...data,
        avatar: avatar
          ? {
              key: avatar,
              name: selectedFile?.name,
              content_type: selectedFile?.type,
              size: selectedFile?.size
            }
          : null
      });

      const pageId = response.id;

      toast({
        title: "Tạo trang thành công!",
        description: `Trang "${data.name}" đã được tạo.`
      });

      if (selectedFile && avatar) {
        console.log("📌 Bắt đầu cập nhật Avatar cho Page:", pageId);

        await instance.patch(`api/pages/${pageId}/avatar`, {
          avatar: {
            key: avatar,
            name: selectedFile.name,
            content_type: selectedFile.type,
            size: selectedFile.size
          }
        });
      }
      router.push("/page");
    } catch (error) {
      toast({
        title: "Lỗi khi tạo trang",
        description: "Đã có lỗi xảy ra khi tạo trang. Vui lòng thử lại",
        variant: "destructive"
      });
    }
  };

  return (
    <Layout>
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
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                  {avatar ? "Tải lên {:fileName}" : "Tải lên tệp"}
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
                {uploading ? "Đang tải ảnh..." : "Tạo trang"}
              </Button>
            </div>
          </div>

          <div className="w-1/3 sticky top-6 self-start">
            <PagePreview
              url={presignedUrl}
              name={watch("name")}
              content={watch("content")}
              email={watch("email")}
            />
          </div>
        </form>
      </div>
    </Layout>
  );
}
