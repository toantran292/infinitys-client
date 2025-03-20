import { ProtectedRouteLayout } from "@/components/layouts";
import { PostList } from "@/views/profile/components/post-list";

export default function ActivityPage() {
    return (

        <ProtectedRouteLayout>
            <div className="max-w-[1128px] mx-auto py-6 px-4">
                <div className="grid grid-cols-1 md:grid-cols-[7fr_3fr] gap-6">
                    <div className="space-y-4">
                        <div className="bg-white rounded-lg border border-gray-200">
                            <h1 className="text-xl font-semibold p-4 border-b border-gray-200">All activity</h1>
                            <div className="p-4">
                                <div className="flex gap-4 mb-4">
                                    <button className="px-4 py-1 text-sm font-medium text-green-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50">
                                        Posts
                                    </button>
                                    <button className="px-4 py-1 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-full hover:bg-gray-50">
                                        Reactions
                                    </button>
                                </div>
                                <PostList showAll={true} />
                            </div>
                        </div>
                    </div>

                    <div className="hidden md:block space-y-4">
                        <div className="bg-white rounded-lg border border-gray-200 p-4">
                            <h2 className="font-semibold mb-4">Analytics</h2>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-gray-600">Post impressions</p>
                                    <p className="font-medium">0</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Profile views</p>
                                    <p className="font-medium">0</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRouteLayout>

    );
} 