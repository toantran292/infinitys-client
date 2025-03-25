"use client";

import { Button } from "@/components/ui/button";
import { usePageFollowActions } from "@/views/connections/hooks/use-follow";

const FollowButton = ({
  pageId,
  isFollowing
}: {
  pageId: string;
  isFollowing: boolean;
}) => {
  const {
    followPage,
    unfollowPage,
    isFollowing: isLoadingFollow,
    isUnfollowing
  } = usePageFollowActions();

  console.log(
    "~ file: FollowButton.tsx ~ line 10 ~ FollowButton ~ isFollowing",
    isFollowing
  );
  const handleFollow = () => {
    if (isFollowing) {
      unfollowPage(pageId);
    } else {
      followPage(pageId);
    }
  };
  console.log(isLoadingFollow, isUnfollowing);
  return (
    <Button
      onClick={handleFollow}
      className={`px-4 py-2 rounded-md text-white transition ${
        isFollowing
          ? "bg-red-500 hover:bg-red-600"
          : "bg-blue-600 hover:bg-blue-700"
      }`}
      disabled={isLoadingFollow || isUnfollowing}
    >
      {isFollowing ? "Hủy theo dõi" : "+ Theo dõi"}
    </Button>
  );
};

export default FollowButton;
