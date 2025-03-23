import { ProtectedRouteLayout } from "@/components/layouts";
import { PostList } from "@/views/profile/components/post-list";

export default function ActivityPage() {
    return (
        <ProtectedRouteLayout>
            <div className="max-w-[1128px] mx-auto py-6 px-4 relative">
                <div className="grid grid-cols-1 md:grid-cols-[7fr_3fr] gap-6">
                    <div className="space-y-4">
                        <div className="bg-white rounded-lg border border-gray-200">
                            <h1 className="text-xl font-semibold p-4 border-b border-gray-200">Tất cả hoạt động</h1>
                            <div className="p-4">
                                <div className="flex gap-4 mb-4">
                                    <button className="px-4 py-1 text-sm font-medium text-green-700 bg-white border !border-green-700 rounded-full hover:bg-gray-50">
                                        Bài viết của tôi
                                    </button>
                                </div>
                                <PostList showAll={true} />
                            </div>
                        </div>
                    </div>

                    <div className="hidden md:block relative">
                        <div className="sticky top-[80px] space-y-4">
                            <div className="bg-white rounded-lg border border-gray-200 p-4">
                                <h2 className="font-semibold mb-4">Thống kê</h2>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm text-gray-600">Số bài viết</p>
                                        <p className="font-medium">0</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Số lượt thích</p>
                                        <p className="font-medium">0</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRouteLayout>
    );
} 