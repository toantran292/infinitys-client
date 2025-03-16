import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { FC } from "react";
import { Profile } from "@/components/profile-page";
import Link from "next/link";
import { useCreateGroupChat } from "@/views/chat-id/hooks";

const textButton = {
  sent: "Hủy lời mởi",
  waiting: "Chấp nhận"
};

export const UserCard: FC<{
  user: Profile;
  onFriendRequest: () => void;
  onRejectFriendRequest: () => void;
}> = ({ user, onFriendRequest, onRejectFriendRequest }) => {
  const { createGroupChat, isPending } = useCreateGroupChat();

  return (
    <div className="w-full p-6 bg-gray-50 space-y-8 border border-gray-100 rounded-2xl">
      <Link href={`/profile/${user.id}`}>
        <div className="flex gap-4 items-center">
          <Avatar className="w-20 h-20">
            <AvatarImage src="https://github.com/shadcn.png" alt="avartar" />
          </Avatar>

          <div className="space-y-2">
            <p>{user.firstName}</p>
            <p>{user.email}</p>
          </div>
        </div>
      </Link>

      <div className="flex gap-2 w-full">
        {(["sent", "waiting"].includes(user.friend_status ?? "") ||
          !user.friend_status) && (
          <Button
            variant="default"
            className="w-full bg-neutral-500 text-white hover:bg-neutral-600"
            onClick={onFriendRequest}
          >
            {!user.friend_status
              ? "Kết bạn"
              : textButton[user.friend_status as "sent" | "waiting"]}
          </Button>
        )}

        {user.friend_status === "waiting" && (
          <Button
            variant="default"
            className="w-full bg-neutral-500 text-white hover:bg-neutral-600"
            onClick={onRejectFriendRequest}
          >
            Từ chối
          </Button>
        )}

        <Button
          variant="outline"
          className="w-full hover:bg-neutral-100"
          disabled={isPending}
          onClick={() => createGroupChat([user.id])}
        >
          Nhắn tin
        </Button>
      </div>
    </div>
  );
};
