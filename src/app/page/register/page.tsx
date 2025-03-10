"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { registerPage } from "@/providers/page-provider";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layouts";
import { toast } from "@/hooks/use-toast";
import PagePreview from "@/components/ui/PagePreview";

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [avatar, setAvatar] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      url: "",
      address: "",
      email: "",
      // avatar: null,
      content: "",
    },
  });

  useEffect(() => {
    setValue("name", searchParams.get("name") || "");
    setValue("url", searchParams.get("url") || "");
    setValue("address", searchParams.get("address") || "");
    setValue("email", searchParams.get("email") || "");
    // setValue("avatar", searchParams.get("avatar") || null);
    setValue("content", searchParams.get("content") || "");
  }, [searchParams, setValue]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // const file = e.target.files?.[0];
    // if (file) {
    //   const reader = new FileReader();
    //   reader.onload = () => {
    //     setAvatar(reader.result as string);
    //   };
    //   reader.readAsDataURL(file);
    // }
    console.log(e.target.files);
  };

  const onSubmit = async (data: any) => {
    try {
      await registerPage({ ...data,
      // avatar
      });
      toast({
        title: "Tạo trang thành công!",
        description: `Trang "${data.name}" đã được tạo.`,
      });
      router.push("/page");
    } catch (error) {
      toast({
        title: "Lỗi khi tạo trang",
        description: "Đã có lỗi xảy ra khi tạo trang. Vui lòng thử lại",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <div className="bg-[#f4f2ee] min-h-screen w-full flex justify-center py-10 border-t-2 border-b-2 border-gray-600">
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-5xl w-full flex gap-8">
          <div className="w-2/3 bg-white p-6 rounded-lg shadow-md self-start">
            <h1 className="text-xl font-semibold mb-4">
              Hãy bắt đầu với một vài chi tiết về công ty của bạn.
            </h1>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold">Tên*</label>
                <Input className="w-full" type="text" {...register("name", { required: "Tên trang là bắt buộc" })} />
                <p className="text-red-500 text-sm">{errors.name?.message}</p>
              </div>

              <div>
                <label className="block text-sm font-semibold">Trang web công ty</label>
                <Input className="w-full" type="text" {...register("url")} placeholder="http://, https:// hoặc www." />
              </div>

              <div>
                <label className="block text-sm font-semibold">Địa chỉ công ty</label>
                <Input className="w-full" type="text" {...register("address")} />
              </div>

              <div>
                <label className="block text-sm font-semibold">Email công ty</label>
                <Input className="w-full" type="email" {...register("email")} />
              </div>

              <div>
                <label className="block text-sm font-semibold">Logo</label>
                <label
                  className="w-full border-dashed border-2 border-gray-300 bg-gray-100 flex flex-col items-center justify-center py-4 rounded-md cursor-pointer text-gray-600 text-sm">
                  <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                  {avatar ? "Tải lên {:fileName}" : "Tải lên tệp"}
                </label>
                <p className="text-xs text-gray-500 mt-1">Khuyến nghị 300 x 300px. Hỗ trợ JPG, JPEG và PNG.</p>
              </div>

              <div>
                <label className="block text-sm font-semibold">Khẩu hiệu</label>
                <Input className="w-full" type="text" {...register("content")} />
              </div>
            </div>

            <div className="mt-4 flex items-start gap-2">
              <input type="checkbox" id="confirm" className="mt-1" required />
              <label htmlFor="confirm" className="text-sm">
                Tôi xác minh rằng tôi là đại diện được ủy quyền của tổ chức này và có quyền hành động thay mặt tổ chức này trong việc tạo và quản lý trang này. Tổ chức và tôi đồng ý với các điều khoản bổ sung dành cho Trang.
              </label>
            </div>

            <div className="flex justify-end mt-6">
              <Button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-3xl">
                Tạo trang
              </Button>
            </div>
          </div>

          <div className="w-1/3 sticky top-6 self-start">
            <PagePreview avatar={avatar} name={watch("name")} content={watch("content")} email={watch("email")} />
          </div>
        </form>
      </div>
    </Layout>
  );
}
