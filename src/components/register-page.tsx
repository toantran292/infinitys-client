"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input";
import { registerPage } from "@/providers/page-provider";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Khởi tạo formData
  const [formData, setFormData] = useState({
    name: "",
    content: "",
    address: "",
    url: "",
    email: "",
  });

  // Cập nhật formData mỗi khi searchParams thay đổi
  useEffect(() => {
    setFormData({
      name: searchParams.get("name") || "",
      content: searchParams.get("content") || "",
      address: searchParams.get("address") || "",
      url: searchParams.get("url") || "",
      email: searchParams.get("email") || "",
    });
  }, [searchParams]); // Lắng nghe sự thay đổi của searchParams

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreate = async () => {
    try {
      setLoading(true);
      await registerPage(formData);
      alert("Tạo trang thành công!");
      router.push("/page"); // Chuyển về danh sách trang
    } catch (error) {
      alert("Lỗi khi tạo trang: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Tạo Trang Mới</h1>

      <div className="space-y-4">
        <Input
          type="text"
          name="name"
          placeholder="Tên trang *"
          value={formData.name}
          onChange={handleChange}
        />
        <Input
          type="text"
          name="content"
          placeholder="Nội dung (Không bắt buộc)"
          value={formData.content}
          onChange={handleChange}
        />
        <Input
          type="text"
          name="address"
          placeholder="Địa chỉ *"
          value={formData.address}
          onChange={handleChange}
        />
        <Input
          type="url"
          name="url"
          placeholder="URL *"
          value={formData.url}
          onChange={handleChange}
        />
        <Input
          type="email"
          name="email"
          placeholder="Email *"
          value={formData.email}
          onChange={handleChange}
        />
      </div>

      <Button
        onClick={handleCreate}
        className="bg-green-500 text-white mt-4 w-full"
        disabled={loading}
      >
        {loading ? "Đang tạo..." : "Lưu Trang"}
      </Button>
    </div>
  );
}
