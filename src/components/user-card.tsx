import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { FC } from "react";
import Link from "next/link";
import { useCreateGroupChat, useGetGroupChatbyMembersIds, useGetGroupChatMessage, useGetGroupChats } from "@/views/chat-id/hooks";
import { useRouter } from "next/navigation";

const textButton = {
  sent: "Hủy lời mởi",
  waiting: "Chấp nhận"
};

export const UserCard: FC<{
  user: any;
  onFriendRequest: () => void;
  onRejectFriendRequest: () => void;
  onRemoveFriend: () => void;
}> = ({ user, onFriendRequest, onRejectFriendRequest, onRemoveFriend }) => {
  const { createGroupChat, isPending } = useCreateGroupChat();
  const { group } = useGetGroupChatbyMembersIds([user.id]);
  const router = useRouter();

  return (
    <div className="w-full p-6 bg-gray-50 space-y-8 border border-gray-100 rounded-2xl">
      <Link href={`/profile/${user.id}`}>
        <div className="flex gap-4 items-center">
          <Avatar className="w-20 h-20">
            <AvatarImage src={user.avatar?.url || "https://github.com/shadcn.png"} alt="avartar" />
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

        {user.friend_status === "friend" && (
          <Button
            variant="default"
            className="w-full bg-neutral-500 text-white hover:bg-neutral-600"
            onClick={onRemoveFriend}
          >
            Xóa kết bạn
          </Button>
        )}

        <Button
          variant="outline"
          className="w-full hover:bg-neutral-100"
          disabled={isPending}
          onClick={async () => {
            if (group) {
              router.push(`/chat/${group.id}`);
              return;
            }
            createGroupChat([user.id]);
          }}
        >
          Nhắn tin
        </Button>

      </div>
    </div>
  );
};
