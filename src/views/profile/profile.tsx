import { ProtectedRouteLayout } from "@/components/layouts";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "@/components/ui/Loader";
import axiosInstance from "@/lib/axios";
import PostList from "@/components/ui/PostList";
import ProfileCard from "./components/profile-card";
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
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth?: string;
  gender?: string;
  major?: string;
  desiredJobPosition?: string;
  fullName: string;
  posts: Post[];
  friend_status: null | "sent" | "waiting" | "friend";
  avatar: ProfileAvatar;
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
      <div className="container mx-auto p-6">
        <h1 className="text-center text-3xl font-semibold mb-6">
          Hồ sơ cá nhân
        </h1>

        {error && (
          <p className="text-center text-red-500">Lỗi khi tải dữ liệu</p>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1 flex justify-center">
            <div className="w-full max-w-md">
              <ProfileCard data={profile} />
            </div>
          </div>

          <div className="lg:col-span-2">
            <PostList data={profile?.posts ?? []} />
          </div>
        </div>
      </div>
    </ProtectedRouteLayout>
  );
};
