import { Users, FileText, Activity } from "lucide-react";

export const StatsCard = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h2 className="text-sm font-semibold mb-3">Thống kê hoạt động</h2>
      <div className="space-y-2">
        <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md transition-colors">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-50 rounded-md">
              <FileText className="h-3 w-3 text-blue-600" />
            </div>
            <span className="text-xs text-gray-600">Bài viết</span>
          </div>
          <span className="text-xs font-medium">0</span>
        </div>

        <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md transition-colors">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-purple-50 rounded-md">
              <Users className="h-3 w-3 text-purple-600" />
            </div>
            <span className="text-xs text-gray-600">Người theo dõi</span>
          </div>
          <span className="text-xs font-medium">0</span>
        </div>

        <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md transition-colors">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-green-50 rounded-md">
              <Activity className="h-3 w-3 text-green-600" />
            </div>
            <span className="text-xs text-gray-600">Đang theo dõi</span>
          </div>
          <span className="text-xs font-medium">0</span>
        </div>
      </div>
    </div>
  );
};
