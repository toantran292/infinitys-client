"use client";

import { Button } from "@/components/ui/button";
import { Building } from "lucide-react";

interface PagePreviewProps {
  avatar: string | null;
  name: string;
  content: string;
  email: string;
}

export default function PagePreview({ avatar, name, content, email }: PagePreviewProps) {
  return (
    // border border-gray-300 shadow-sm
    <div className="w-[420px] rounded-lg  p-4 ">
      {/* Header */}
      <div className="bg-white px-4 py-2 flex items-center text-sm font-medium text-gray-700 rounded-t-lg">
        Xem trước trang
        <div className="">
          <span className="ml-1 text-gray-500 cursor-pointer text-xs" title="Thông tin xem trước trang">?</span>
        </div>
      </div>

      {/* Nội dung chính */}
      <div className="p-4 bg-[#eae6df] rounded-b-lg shadow-md">
        <div className="bg-white p-5 rounded-lg flex flex-col items-start shadow-sm">
          {/* Avatar */}
          <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center border border-gray-300">
            {avatar ? (
              <img src={avatar} alt="Avatar Preview" className="w-full h-full rounded-md object-cover" />
            ) : (
              <div className="w-10 h-10 flex items-center justify-center bg-gray-300 rounded-md">
                <Building/>
              </div>
            )}
          </div>

          {/* Thông tin công ty */}
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-gray-400 text-color-">{name || "Tên công ty"}</h3>
            <p className="text-sm text-gray-500">{content || "Khẩu hiệu"}</p>
            <p className="text-sm text-gray-600">{email || "Email"}</p>
          </div>

          {/* Nút Theo dõi */}
          <div className="mt-4">
            <Button className="bg-[#0A66C2] text-white px-4 py-1 text-sm font-medium shadow-sm hover:bg-[#004182] rounded-3xl">
              + Theo dõi
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
