import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { FC } from "react";
import Link from "next/link";
import { MessageSquare, UserPlus, UserMinus, Check, X } from "lucide-react";
import { useCreateConversation } from "@/hooks/conversations";
import { FriendStatus } from "@/types/friend";
import { useRouter } from "next/navigation";

interface UserCardProps {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: {
      url?: string;
    };
    friendStatus?: FriendStatus;
  };
  onSendFriendRequest: ({ userId }: { userId: string }) => void;
  onAcceptFriendRequest: ({ userId }: { userId: string }) => void;
  onCancelFriendRequest: ({ userId }: { userId: string }) => void;
  onUnfriend: ({ userId }: { userId: string }) => void;
}

export const UserCard: FC<UserCardProps> = ({
  user,
  onSendFriendRequest,
  onAcceptFriendRequest,
  onCancelFriendRequest,
  onUnfriend
}: UserCardProps) => {
  const router = useRouter();
  const { createUserUser } = useCreateConversation();

  const handleCreateConversation = () => {
    createUserUser.mutate({ userId: user.id },
      {
        onSuccess: (data) => {
          router.push(`/chat/${data.id}`);
        }
      }
    );
  };

  const renderAvatar = () => (
    <Link href={`/profile/${user.id}`} className="flex-shrink-0">
      <Avatar className="h-16 w-16">
        <AvatarImage
          src={user.avatar?.url}
          alt={`${user.firstName} ${user.lastName}`}
          className="object-cover"
        />
        <AvatarFallback className="bg-[#f3f6f8] text-[#666666] text-xl">
          {user.firstName?.[0]}{user.lastName?.[0]}
        </AvatarFallback>
      </Avatar>
    </Link>
  );

  const renderUserInfo = () => (
    <>
      <Link
        href={`/profile/${user.id}`}
        className="text-[#191919] font-medium hover:text-[#0a66c2] hover:underline"
      >
        {user.firstName} {user.lastName}
      </Link>
      <p className="text-[#666666] text-sm mt-1">{user.email}</p>
    </>
  );

  const renderFriendButton = () => {
    const buttonConfigs = {
      [FriendStatus.FRIEND]: {
        variant: "outline" as const,
        icon: UserMinus,
        text: "Bạn bè",
        onClick: onUnfriend,
        className: "text-[#666666] hover:bg-[#f3f6f8] border-[#666666]"
      },
      [FriendStatus.RECEIVED]: {
        variant: "default" as const,
        icon: Check,
        text: "Chấp nhận",
        onClick: onAcceptFriendRequest,
        className: "bg-[#0a66c2] hover:bg-[#004182] text-white"
      },
      [FriendStatus.WAITING]: {
        variant: "outline" as const,
        icon: UserMinus,
        text: "Hủy lời mời",
        onClick: onCancelFriendRequest,
        className: "text-[#666666] hover:bg-[#f3f6f8] border-[#666666]"
      },
      none: {
        variant: "default" as const,
        icon: UserPlus,
        text: "Kết bạn",
        onClick: onSendFriendRequest,
        className: "bg-[#0a66c2] hover:bg-[#004182] text-white"
      }
    };

    const status = user.friendStatus || "none";
    const config = buttonConfigs[status as keyof typeof buttonConfigs];
    const Icon = config.icon;

    return (
      <Button
        variant={config.variant}
        size="sm"
        className={config.className}
        onClick={() => config.onClick({ userId: user.id })}
      >
        <Icon className="w-4 h-4 mr-2" />
        {config.text}
      </Button>
    );
  };

  const renderRejectButton = () => {
    if (user.friendStatus !== FriendStatus.RECEIVED) return null;

    return (
      <Button
        variant="outline"
        size="sm"
        className="text-[#666666] hover:bg-[#f3f6f8] border-[#666666]"
        onClick={() => onCancelFriendRequest({ userId: user.id })}
      >
        <X className="w-4 h-4 mr-2" />
        Từ chối
      </Button>
    );
  };

  const renderMessageButton = () => (
    <Button
      variant="outline"
      size="sm"
      disabled={createUserUser.isPending}
      className="text-[#666666] hover:bg-[#f3f6f8] border-[#666666]"
      onClick={handleCreateConversation}
    >
      <MessageSquare className="w-4 h-4 mr-2" />
      Nhắn tin
    </Button>
  );

  return (
    <div className="p-4 hover:bg-[#f9fafb]">
      <div className="flex gap-4">
        {renderAvatar()}
        <div className="flex-1">
          {renderUserInfo()}
          <div className="flex gap-2 mt-3">
            {renderFriendButton()}
            {renderRejectButton()}
            {renderMessageButton()}
          </div>
        </div>
      </div>
    </div>
  );
};
