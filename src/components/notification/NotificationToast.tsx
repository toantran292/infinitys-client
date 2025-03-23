import { useRouter } from "next/navigation";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Check, X } from "lucide-react";
import { useRejectFriendRequest, useFriendRequest } from "@/views/chat-id/hooks";
import { toast } from "sonner";

interface FriendRequestToastProps {
    t: any;
    id: string;
    avatar: string;
    firstName: string;
    lastName: string;
    type?: string;
    message: string;
}

export const FriendRequestToast = ({ t, id, avatar, firstName, lastName, message, type = '' }: FriendRequestToastProps) => {
    const router = useRouter();

    const { friendRequest } = useFriendRequest({
        onSuccess: () => {
            toast.success('Đã gửi lời mời kết bạn');
            toast.dismiss(t);
        }
    });

    const { rejectFriendRequest } = useRejectFriendRequest({
        onSuccess: () => {
            toast.success('Đã từ chối lời mời kết bạn');
            toast.dismiss(t);
        }
    });

    return (
        <div
            className="flex flex-col gap-2 bg-white p-4 rounded-lg shadow-md w-[356px] min-w-[356px] cursor-pointer"
        >
            <div className="flex items-center gap-2" onClick={() => router.push(`/profile/${id}`)}>
                <Avatar className="w-10 h-10">
                    <AvatarImage src={avatar as string} alt="avartar" />
                </Avatar>
                <div>
                    <p className="font-bold">{firstName} {lastName}</p>
                    <p>{message}</p>
                </div>
            </div>
            {type === 'friend_request' && (
                <div className="flex gap-2 mt-2">
                    <Button
                        className="flex-1 bg-[#0a66c2] text-white hover:bg-[#004182] hover:text-white"
                        variant="outline"
                        onClick={() => {
                            friendRequest({ userId: id, friend_status: 'waiting' });
                        }}
                    >
                        <Check className="w-4 h-4" />
                        <span className="ml-2">Chấp nhận</span>
                    </Button>
                    <Button
                        className="flex-1 bg-white text-[#666666] border-[#666666] hover:bg-gray-100"
                        variant="outline"
                        onClick={() => {
                            rejectFriendRequest({ userId: id });
                        }}
                    >
                        <X className="w-4 h-4" />
                        <span className="ml-2">Từ chối</span>
                    </Button>
                </div>
            )}
        </div>
    );
};

export const ReactToast = ({ reacter, target, t }: any) => {
    const router = useRouter();
    return (
        <div
            className="flex flex-col gap-2 bg-white p-4 rounded-lg shadow-md w-[356px] min-w-[356px] cursor-pointer"
        >
            <div className="flex items-center gap-2">
                <Avatar className="w-10 h-10">
                    <AvatarImage src={reacter.avatar as string} alt="avartar" />
                </Avatar>
                <div>
                    <p className="font-bold">{reacter.fullName}</p>
                    <p>{target.type === 'posts' ? 'Đã thích bài viết của bạn' : 'Đã thích bình luận của bạn'}</p>
                </div>
            </div>
            {/* {type === 'friend_request' && (
                <div className="flex gap-2 mt-2">
                    <Button
                        className="flex-1 bg-[#0a66c2] text-white hover:bg-[#004182] hover:text-white"
                        variant="outline"
                        onClick={() => {
                            friendRequest({ userId: id, friend_status: 'waiting' });
                        }}
                    >
                        <Check className="w-4 h-4" />
                        <span className="ml-2">Chấp nhận</span>
                    </Button>
                    <Button
                        className="flex-1 bg-white text-[#666666] border-[#666666] hover:bg-gray-100"
                        variant="outline"
                        onClick={() => {
                            rejectFriendRequest({ userId: id });
                        }}
                    >
                        <X className="w-4 h-4" />
                        <span className="ml-2">Từ chối</span>
                    </Button>
                </div>
            )} */}
        </div>
    );
};

export const CommentToast = ({ commenter, content, t }: any) => {
    return (
        <div
            className="flex flex-col gap-2 bg-white p-4 rounded-lg shadow-md w-[356px] min-w-[356px] cursor-pointer"
        >
            <div className="flex items-center gap-2">
                <Avatar className="w-10 h-10">
                    <AvatarImage src={commenter.avatar as string} alt="avartar" />
                </Avatar>
                <div>
                    <p className="font-bold">{commenter.fullName}</p>
                    <p>{"Đã bình luận: " + content}</p>
                </div>
            </div>
            {/* {type === 'friend_request' && (
                <div className="flex gap-2 mt-2">
                    <Button
                        className="flex-1 bg-[#0a66c2] text-white hover:bg-[#004182] hover:text-white"
                        variant="outline"
                        onClick={() => {
                            friendRequest({ userId: id, friend_status: 'waiting' });
                        }}
                    >
                        <Check className="w-4 h-4" />
                        <span className="ml-2">Chấp nhận</span>
                    </Button>
                    <Button
                        className="flex-1 bg-white text-[#666666] border-[#666666] hover:bg-gray-100"
                        variant="outline"
                        onClick={() => {
                            rejectFriendRequest({ userId: id });
                        }}
                    >
                        <X className="w-4 h-4" />
                        <span className="ml-2">Từ chối</span>
                    </Button>
                </div>
            )} */}
        </div>
    );
};