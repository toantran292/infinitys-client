"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, LayoutGrid } from "lucide-react";
import { useConnections } from "@/views/mynetwork/hooks/use-connections";
import { useState } from "react";
import { usePages } from "@/providers/page-provider";

const MyNetworkManage = () => {
  const currentPath = usePathname();
  const [params, setParams] = useState({
    page: 1,
    limit: 10,
    search: ""
  });
  const { data: connetions = [] } = useConnections(params);
  const { pages } = usePages();
  const menuItems = [
    {
      icon: <Users className="w-5 h-5" />,
      label: "Kết nối",
      count: connetions.length,
      path: "connections"
    },
    {
      icon: <LayoutGrid className="w-5 h-5" />,
      label: "Trang",
      count: pages?.meta.itemCount,
      path: "pages"
    }
  ];

  return (
    <div className="w-64 bg-white rounded-2xl shadow-md p-4 border border-gray-300">
      <h2 className="text-gray-700 font-semibold text-lg mb-2">
        Quản lý mạng lưới của tôi
      </h2>
      <ul className="space-y-3">
        {menuItems.map((item, index) => (
          <li key={index}>
            <Link
              href={`${currentPath}/${item.path}`} // Tự động nối URL hiện tại
              className="flex items-center justify-between text-gray-600 hover:text-black cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <div className="flex items-center space-x-3">
                {item.icon}
                <span>{item.label}</span>
              </div>
              {item.count !== undefined && (
                <span className="text-sm text-gray-500">{item.count}</span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyNetworkManage;
