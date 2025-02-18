import { Layout } from "@/components/layouts";
import ProfileCard from "./ui/ProfileCard";
import PostList from "./ui/PostList";
import { instance } from "@/common/api";
import { useEffect, useState } from "react";

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
}

const getProfile = async (userId: string) => {
  const response = await instance.get(`/users/profile/${userId}`);
  return response.data;
};

export const ProfilePage = ({ userId }: ProfilePageProps) => {
  const [profile, setProfile] = useState<Profile | null>(null);

  const refreshProfile = async () => {
    const updatedProfile = await getProfile(userId);
    setProfile(updatedProfile);
  };

  useEffect(() => {
    refreshProfile();
  }, [userId]);

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <h1 className="text-center text-3xl font-semibold mb-6">
          Hồ sơ cá nhân
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1 flex justify-center">
            <div className="w-full max-w-md">
              <ProfileCard data={profile} refreshProfile={refreshProfile} />
            </div>
          </div>

          <div className="lg:col-span-2">
            <PostList data={profile?.posts ?? null} />
          </div>
        </div>
      </div>
    </Layout>
  );
};
