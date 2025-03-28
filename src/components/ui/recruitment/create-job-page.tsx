"use client";

import { Button } from "@/components/ui/button";
import { InputForm } from "@/components/ui/input";
import { Header } from "@/components/layouts/header";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { JobPreviewCard } from "@/components/ui/jobs/job-preview-card";
import { JobDescriptionEditor } from "@/components/ui/editor/job-description-editor";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Combobox } from "@/components/ui/combobox";
import { Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import { Page } from "@/types/job";

interface ErrorResponse {
  message: string;
}

const formSchema = z.object({
  title: z.string().min(1, "Vui lòng nhập tiêu đề công việc"),
  jobPosition: z.string().min(1, "Vui lòng chọn vị trí công việc"),
  pageId: z.string().min(1, "Vui lòng chọn công ty"),
  workType: z.enum(["On-site", "Hybrid", "Remote"], {
    required_error: "Vui lòng chọn hình thức làm việc"
  }),
  location: z.string().min(1, "Vui lòng nhập địa điểm làm việc"),
  jobType: z.enum(
    ["Full-time", "Part-time", "Contract", "Temporary", "Internship"],
    {
      required_error: "Vui lòng chọn loại hợp đồng"
    }
  ),
  description: z
    .string()
    .min(1, "Vui lòng nhập mô tả công việc")
    .max(10000, "Mô tả không được vượt quá 10000 ký tự")
});

type JobFormData = z.infer<typeof formSchema>;

const danhSachCongViec = [
  "Kỹ sư phần mềm",
  "Lập trình viên Backend",
  "Lập trình viên Frontend",
  "Lập trình viên Full Stack",
  "Lập trình viên di động",
  "Kỹ sư DevOps",
  "Kỹ sư đám mây",
  "Kỹ sư dữ liệu",
  "Nhà khoa học dữ liệu",
  "Kỹ sư Machine Learning",
  "Kỹ sư AI",
  "Chuyên viên an ninh mạng",
  "Kỹ sư bảo mật",
  "Kỹ sư mạng",
  "Quản trị cơ sở dữ liệu",
  "Quản trị hệ thống",
  "Kỹ sư Site Reliability (SRE)",
  "Kỹ sư phần mềm nhúng",
  "Lập trình viên game",
  "Lập trình viên Blockchain",
  "Nhà thiết kế UI/UX",
  "Quản lý sản phẩm (Product Manager)",
  "Chuyên viên hỗ trợ IT",
  "Kỹ sư kiểm thử phần mềm (QA)",
  "Kỹ sư kiểm thử tự động",
  "Chuyên viên phân tích nghiệp vụ (Business Analyst)",
  "Scrum Master",
  "Tech Lead",
  "Kiến trúc sư phần mềm",
  "Giám đốc công nghệ (CTO)"
];

export default function CreateJobForm() {
  const router = useRouter();
  const [showNoCompanyDialog, setShowNoCompanyDialog] = useState(false);

  const { data: companies, isLoading: isLoadingCompanies } = useQuery<Page[]>({
    queryKey: ["user", "companies"],
    queryFn: () =>
      axiosInstance.get("/api/pages/me").then((res) => res.data.items)
  });

  useEffect(() => {
    if (!isLoadingCompanies && (!companies || companies.length === 0)) {
      setShowNoCompanyDialog(true);
    }
  }, [companies, isLoadingCompanies]);

  const form = useForm<JobFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      jobPosition: "",
      pageId: "",
      workType: undefined,
      location: "",
      jobType: undefined,
      description: ""
    }
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = form;

  const { mutate: createJob, isPending: isSubmitting } = useMutation({
    mutationFn: (data: JobFormData) =>
      axiosInstance
        .post("/api/recruitment-posts", data)
        .then((res) => res.data),
    onSuccess: (data) => {
      toast.success("Tạo bài tuyển dụng thành công!");
      router.push(`/jobs/${data.id}`);
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(
        error.response?.data?.message || "Có lỗi xảy ra khi tạo bài tuyển dụng"
      );
    }
  });

  const onSubmit = (data: JobFormData) => {
    createJob(data);
  };

  const formValues = watch();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 w-full">
        {/* Progress Header */}
        <div className="border-b bg-white">
          <div className="container max-w-[1200px] mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h1 className="text-2xl font-semibold text-gray-900">
                  Đăng bài tuyển dụng
                </h1>
              </div>
            </div>
          </div>
        </div>

        <div className="container max-w-[1200px] mx-auto px-4 py-8">
          <div className="flex gap-8">
            {/* Job Form - Left Side */}
            <div className="flex-1 max-w-[720px]">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
              >
                <div className="p-8 space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Job Title */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="title"
                        className="text-sm font-medium flex items-center gap-1"
                      >
                        Tiêu đề tuyển dụng
                        <span className="text-red-500">*</span>
                      </Label>
                      <InputForm
                        {...register("title")}
                        placeholder="Tiêu đề tuyển dụng"
                        className="h-11"
                      />
                      {errors.title && (
                        <p className="text-sm text-red-500">
                          {errors.title.message}
                        </p>
                      )}
                    </div>

                    {/* Company */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="pageId"
                        className="text-sm font-medium flex items-center gap-1"
                      >
                        Công ty
                        <span className="text-red-500">*</span>
                      </Label>
                      <Controller
                        name="pageId"
                        control={form.control}
                        render={({ field }) => (
                          <Combobox
                            options={(companies || []).map((company) => ({
                              label: company.name,
                              value: company.id,
                              avatar: company.avatar?.url
                            }))}
                            value={field.value}
                            onValueChange={field.onChange}
                            placeholder="Chọn công ty của bạn"
                          />
                        )}
                      />
                      {errors.pageId && (
                        <p className="text-sm text-red-500">
                          {errors.pageId.message}
                        </p>
                      )}
                    </div>

                    {/* Job Type */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="jobType"
                        className="text-sm font-medium flex items-center gap-1"
                      >
                        Loại hợp đồng
                        <span className="text-red-500">*</span>
                      </Label>
                      <select
                        {...register("jobType")}
                        className="w-full h-11 px-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                      >
                        <option value="">Chọn loại hợp đồng</option>
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Temporary">Temporary</option>
                        <option value="Internship">Internship</option>
                      </select>
                      {errors.jobType && (
                        <p className="text-sm text-red-500">
                          {errors.jobType.message}
                        </p>
                      )}
                    </div>

                    {/* Workplace Type */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="workType"
                        className="text-sm font-medium flex items-center gap-1"
                      >
                        Hình thức làm việc
                        <span className="text-red-500">*</span>
                      </Label>
                      <select
                        {...register("workType")}
                        className="w-full h-11 px-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                      >
                        <option value="">Chọn hình thức làm việc</option>
                        <option value="On-site">On-site</option>
                        <option value="Remote">Remote</option>
                        <option value="Hybrid">Hybrid</option>
                      </select>
                      {errors.workType && (
                        <p className="text-sm text-red-500">
                          {errors.workType.message}
                        </p>
                      )}
                    </div>

                    {/* Job Location */}
                    <div className="space-y-2 md:col-span-2">
                      <Label
                        htmlFor="location"
                        className="text-sm font-medium flex items-center gap-1"
                      >
                        Địa điểm làm việc
                        <span className="text-red-500">*</span>
                      </Label>
                      <InputForm
                        {...register("location")}
                        placeholder="Ví dụ: Quận 1, Thành phố Hồ Chí Minh"
                        className="h-11"
                      />
                      {errors.location && (
                        <p className="text-sm text-red-500">
                          {errors.location.message}
                        </p>
                      )}
                    </div>

                    {/* Job Position */}
                    <div className="space-y-2 md:col-span-2">
                      <Label
                        htmlFor="jobPosition"
                        className="text-sm font-medium flex items-center gap-1"
                      >
                        Vị trí công việc
                        <span className="text-red-500">*</span>
                      </Label>
                      <Controller
                        name="jobPosition"
                        control={form.control}
                        render={({ field }) => (
                          <Combobox
                            options={danhSachCongViec}
                            value={field.value}
                            onValueChange={field.onChange}
                            placeholder="Chọn vị trí công việc"
                          />
                        )}
                      />
                      {errors.jobPosition && (
                        <p className="text-sm text-red-500">
                          {errors.jobPosition.message}
                        </p>
                      )}
                    </div>

                    {/* Description */}
                    <div className="space-y-2 md:col-span-2">
                      <Label
                        htmlFor="description"
                        className="text-sm font-medium flex items-center gap-1"
                      >
                        Mô tả công việc
                        <span className="text-red-500">*</span>
                      </Label>
                      <div className="p-4 bg-blue-50 rounded-lg mb-4 flex items-center gap-2">
                        <div className="p-1.5 rounded-full bg-blue-100">
                          <svg
                            className="w-4 h-4 text-blue-600"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill="currentColor"
                              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-4h2v2h-2zm1-10c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z"
                            />
                          </svg>
                        </div>
                        <p className="text-sm text-blue-700 flex-1">
                          Tạo bài tuyển dụng chất lượng cao bằng cách sử dụng
                          hướng dẫn đề xuất dưới đây.
                          <button className="ml-1 font-medium hover:underline">
                            Tìm hiểu thêm
                          </button>
                        </p>
                        <button className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-100 rounded-full transition-colors">
                          <svg className="w-4 h-4" viewBox="0 0 24 24">
                            <path
                              fill="currentColor"
                              d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                            />
                          </svg>
                        </button>
                      </div>
                      <JobDescriptionEditor
                        value={formValues.description}
                        onChange={(value) => setValue("description", value)}
                      />
                      {errors.description && (
                        <p className="text-sm text-red-500">
                          {errors.description.message}
                        </p>
                      )}
                      <div className="flex justify-end">
                        <span className="text-sm text-gray-500">
                          {formValues.description?.length || 0}/10,000
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-between px-8 py-4 bg-gray-50 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    className="text-gray-600 hover:text-gray-900"
                    onClick={() => router.push("/jobs")}
                    disabled={isSubmitting}
                  >
                    Trở về
                  </Button>
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="font-medium"
                      disabled={isSubmitting}
                    >
                      Xem trước
                    </Button>
                    <Button
                      type="submit"
                      variant="outline"
                      className="bg-primary hover:bg-primary/90 font-medium px-6 text-white"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Đang tạo..." : "Tạo"}
                    </Button>
                  </div>
                </div>
              </form>
            </div>

            {/* Preview Card - Right Side */}
            {companies && (
              <div className="w-[400px] sticky top-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-base font-semibold mb-4">
                    Bài tuyển dụng
                  </h2>
                  <JobPreviewCard
                    title={formValues.title || "Tiêu đề tuyển dụng"}
                    company={
                      companies.find((c: Page) => c.id === formValues.pageId)
                        ?.name || "Tên công ty"
                    }
                    location={formValues.location || "Địa điểm làm việc"}
                    workType={formValues.workType || "Hình thức làm việc"}
                    jobType={formValues.jobType || "Loại hợp đồng"}
                    avatar={
                      companies.find((c: Page) => c.id === formValues.pageId)
                        ?.avatar?.url || "https://github.com/shadcn.png"
                    }
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Dialog
        open={showNoCompanyDialog}
        onOpenChange={(open) => {
          setShowNoCompanyDialog(open);
          if (!open) {
            router.push("/jobs");
          }
        }}
      >
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="text-gray-900">
              Chỉ công ty mới có thể đăng tuyển dụng
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Bạn cần có ít nhất một công ty để đăng bài tuyển dụng. Vui lòng
              tạo trang công ty trước khi đăng bài.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button
              onClick={() => router.push("/jobs")}
              className="bg-black hover:bg-gray-800 text-white px-6"
            >
              Trở về
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
