"use client";
import { Layout } from "@/components/layouts";
import { UserCard } from "@/components/user-card";
import { useQuery } from "@tanstack/react-query";
import instance from "@/common/api";
import { Loader } from "@/components/ui/Loader";
import { Profile } from "@/components/profile-page";
import {
  useFriendRequest,
  useRejectFriendRequest
} from "@/views/chat-id/hooks";

export const SearchPage = ({ q }: { q: string }) => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["SEARCH", q],
    queryFn: () =>
      instance
        .get(`http://localhost:20250/search/user?q=${q}`)
        .then((res) => res.data)
  });

  const { friendRequest } = useFriendRequest({
    onSuccess: () => refetch()
  });
  const { rejectFriendRequest } = useRejectFriendRequest({
    onSuccess: () => refetch()
  });

  if (isLoading)
    return (
      <div>
        <Loader />
      </div>
    );

  return (
    <Layout sectionClassName="mx-auto w-[760px] flex flex-col gap-4 py-4">
      <h1 className="text-center font-bold text-xl">Kết quả tìm kiếm</h1>
      {data?.map((user: Profile) => (
        <UserCard
          key={user.id}
          user={user}
          onFriendRequest={() => {
            friendRequest({
              userId: user.id,
              friend_status: user.friend_status
            });
          }}
          onRejectFriendRequest={() => {
            rejectFriendRequest({ userId: user.id });
          }}
        />
      ))}
    </Layout>
  );
};
