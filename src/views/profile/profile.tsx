import { ProtectedRouteLayout } from "@/components/layouts";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "@/components/ui/Loader";
import axiosInstance from "@/lib/axios";
import PostList from "@/components/ui/PostList";
import ArtDecordProfileCard from "./components/art-decord-profile-card";

interface ProfilePageProps {
  userId: string;
}

export interface Post {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  name: string;
}

export interface ProfileAvatar {
  id: string;
  url: string;
  createdAt: string;
  updatedAt: string;
}

export interface Profile {
  id: string;
  name: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  gender?: string;
  major?: string;
  desiredJobPosition?: string;
  fullName: string;
  posts: Post[];
  friend_status: null | "sent" | "waiting" | "friend";
  avatar: ProfileAvatar;
  connections?: number;
}

const getProfile = async (userId: string): Promise<Profile> => {
  const response = await axiosInstance.get(`api/users/${userId}`);
  return response.data;
};

export const ProfileComponent = ({ userId }: ProfilePageProps) => {
  const {
    data: profile,
    isLoading,
    error
  } = useQuery({
    queryKey: ["PROFILE", userId],
    queryFn: () => getProfile(userId)
  });

  if (isLoading || !profile)
    return (
      <div className="h-screen">
        <Loader />
      </div>
    );

  return (
    <ProtectedRouteLayout>
      <div className="px-6 py-4">
        {error && (
          <p className="text-center text-red-500 mb-4">Lỗi khi tải dữ liệu</p>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,_744px)_minmax(0,_360px)] gap-6 mx-auto max-w-[1128px]">
          {/* Cột trái - Thông tin chính */}
          <div className="space-y-6">
            {/* Card thông tin cá nhân */}
            <ArtDecordProfileCard data={profile} isEditable={true} />

            {/* Giới thiệu */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Giới thiệu</h2>
                <button className="p-2 hover:bg-gray-100 rounded-full">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21.13 2.86a3 3 0 00-4.17 0l-13 13L2 22l6.19-2L21.13 7a3 3 0 000-4.16zM6.77 19.14l-2.52.83.83-2.52 10.05-10.05 1.68 1.69L6.77 19.14z" />
                  </svg>
                </button>
              </div>
              <p className="text-gray-600">{profile.desiredJobPosition || "Software Engineer"}</p>
            </div>

            {/* Bài viết */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold">Bài viết</h2>
              </div>
              <PostList data={profile?.posts ?? []} />
            </div>
          </div>

          {/* Cột phải - Thông tin bổ sung */}
          <div className="space-y-6">
            {/* Ngôn ngữ hồ sơ */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold">Ngôn ngữ hồ sơ</h2>
                  <p className="text-gray-600">Tiếng Anh</p>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-full">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21.13 2.86a3 3 0 00-4.17 0l-13 13L2 22l6.19-2L21.13 7a3 3 0 000-4.16zM6.77 19.14l-2.52.83.83-2.52 10.05-10.05 1.68 1.69L6.77 19.14z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Hồ sơ công khai và URL */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold">Hồ sơ công khai và URL</h2>
                  <p className="text-gray-600 break-all">www.linkedin.com/in/{profile.id}</p>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-full">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21.13 2.86a3 3 0 00-4.17 0l-13 13L2 22l6.19-2L21.13 7a3 3 0 000-4.16zM6.77 19.14l-2.52.83.83-2.52 10.05-10.05 1.68 1.69L6.77 19.14z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRouteLayout>
  );
};
