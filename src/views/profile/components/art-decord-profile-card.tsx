import { Button } from "@/components/ui/button";
import { MapPin, Mail, Pencil, UserX } from "lucide-react";
import Image from "next/image";
import { UserUploadType, useUserUpload } from "../hooks/use-user-upload";
import { ProfileAvatarComponent } from "./profile-avatar";
import { toast } from "sonner";
import { useAuth } from "@/providers/auth-provider";
import { useState } from "react";
import { EditProfileDialog } from "./edit-profile-dialog";
import { useCreateConversation } from "@/hooks/conversations/use-create-conversation";
import { Profile } from "@/types/job";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useFriend from "@/hooks/use-friend";
import { motion } from "framer-motion";
import { FriendStatus } from "@/types/friend";
import { useRouter } from "next/navigation";
interface ArtDecordProfileCardProps {
  data: Profile;
  isEditable?: boolean;
}

export const ArtDecordProfileCard = ({
  data,
  isEditable = false
}: ArtDecordProfileCardProps) => {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile>(data);
  const { refetchUser, user } = useAuth();
  const { createUserUser } = useCreateConversation();
  const [isEditing, setIsEditing] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { sendFriendRequest, cancelFriendRequest, acceptFriendRequest } = useFriend();

  const { action: uploadAvatar } = useUserUpload({
    userId: data?.id || "",
    type: UserUploadType.AVATAR,
    onSuccess: () => {
      toast.success("Ảnh đã được tải lên");
      refetchUser();
    },
    onError: (error) =>
      toast.error("Lỗi khi tải ảnh lên", {
        description: error.message
      })
  });

  const handleAvatarUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadAvatar(file);
      event.target.value = "";
    }
  };

  const handleProfileUpdate = (updatedData: Partial<Profile>) => {
    // Xử lý cập nhật thông tin profile
    console.log("Updated data:", updatedData);
    setIsEditing(false);
  };

  const handleCreateConversation = () => {
    createUserUser.mutate({ userId: profile.id }, {
      onSuccess: (data) => {
        router.push(`/chat/${data.id}`);
      }
    });
  };

  const getFriendButtonConfig = (status: string) => {
    const configs = {
      friend: {
        text: "Bạn bè",
        className: "flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold",
        onClick: () => setShowConfirmDialog(true)
      },
      waiting: {
        text: "Hủy lời mời",
        className: "flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold",
        onClick: () => cancelFriendRequest.mutate({ userId: profile.id }, {
          onSuccess: () => {
            setProfile({ ...profile, friendStatus: null });
          }
        })
      },
      received: {
        text: "Chấp nhận",
        className: "flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold",
        onClick: () => acceptFriendRequest.mutate({ userId: profile.id }, {
          onSuccess: () => {
            setProfile({ ...profile, friendStatus: FriendStatus.FRIEND });
          }
        })
      },
      none: {
        text: "Kết nối",
        className: "flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold",
        onClick: () => sendFriendRequest.mutate({ userId: profile.id }, {
          onSuccess: () => {
            setProfile({ ...profile, friendStatus: FriendStatus.WAITING });
          }
        })
      }
    };

    return configs[status as keyof typeof configs] || configs.none;
  };

  const buttonConfig = getFriendButtonConfig(profile.friendStatus || "none");

  return (
    <>
      <div className="w-full bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Cover Image Section */}
        <div className="relative h-[200px] bg-gradient-to-r from-blue-100 to-cyan-100">
          {isEditable && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 bg-white/80 hover:bg-white"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Profile Section */}
        <div className="px-6 pb-6">
          {/* Avatar & Edit Button */}
          <div className="flex justify-between items-end -mt-[72px] mb-4">
            <ProfileAvatarComponent
              avatar={profile.avatar}
              fallback={profile.fullName?.charAt(0)}
              canEdit={isEditable && user?.id === profile.id}
              onFileChange={handleAvatarUpload}
            />
            {isEditable && user?.id === profile.id && (
              <>
                <Button
                  variant="outline"
                  className="mb-2"
                  onClick={() => setIsEditing(true)}
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Chỉnh sửa hồ sơ
                </Button>

                <EditProfileDialog
                  open={isEditing}
                  onOpenChange={setIsEditing}
                  data={profile}
                  onSubmit={handleProfileUpdate}
                />
              </>
            )}
          </div>

          <div className="flex justify-between">
            {/* Profile Info */}
            <div className="w-full space-y-1">
              <h1 className="text-2xl font-bold text-gray-900">
                {profile.fullName}
              </h1>
              <p className="text-base text-gray-600">
                {profile.desiredJobPosition || "Software Engineer"}
              </p>

              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>Cần Thơ, Việt Nam</span>
                </div>
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  <a
                    href={`mailto:${profile.email}`}
                    className="text-blue-600 hover:underline"
                  >
                    {profile.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <span className="text-blue-600 hover:underline cursor-pointer font-bold">
                  {profile.totalConnections} kết nối
                </span>
              </div>
            </div>

            {/* Company/School Section */}
            <div className="mt-4 flex flex-col gap-2">
              {/* Company */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                  <Image
                    src="/boom-logo.png"
                    alt="Boom"
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>
                <span className="text-sm font-medium text-gray-600 whitespace-nowrap">
                  Boom
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {user?.id !== data.id && (
            <div className="mt-4 flex gap-2">
              <Button
                className={buttonConfig.className}
                onClick={buttonConfig.onClick}
                disabled={cancelFriendRequest.isPending || acceptFriendRequest.isPending}
              >
                {cancelFriendRequest.isPending || acceptFriendRequest.isPending ? (
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  buttonConfig.text
                )}
              </Button>
              <Button
                variant="outline"
                className="flex-1 font-semibold"
                onClick={handleCreateConversation}
              >
                Nhắn tin
              </Button>
              <Button variant="outline" size="icon">
                <span className="font-semibold">···</span>
              </Button>
            </div>
          )}
        </div>
      </div>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-[425px] bg-white rounded-lg shadow-lg overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <DialogHeader className="space-y-4 text-center p-6">
              <div className="mx-auto bg-red-50 w-16 h-16 rounded-full flex items-center justify-center">
                <UserX className="w-8 h-8 text-red-500" />
              </div>
              <DialogTitle className="text-xl font-semibold text-gray-900">
                Hủy kết bạn
              </DialogTitle>
              <p className="text-gray-500 text-sm">
                Bạn có chắc chắn muốn hủy kết bạn với{" "}
                <span className="font-bold text-gray-900">{profile.fullName}</span>
                ?
              </p>
            </DialogHeader>

            <DialogFooter className="flex gap-3 p-6 bg-gray-50">
              <Button
                variant="outline"
                onClick={() => setShowConfirmDialog(false)}
                className="flex-1 text-gray-600 hover:text-gray-700 border-gray-300 hover:bg-gray-100"
              >
                Hủy
              </Button>
              <Button
                variant="destructive"
                onClick={() => cancelFriendRequest.mutate({ userId: profile.id }, {
                  onSuccess: () => {
                    setProfile({ ...profile, friendStatus: null });
                    setShowConfirmDialog(false);
                  }
                })}
                disabled={cancelFriendRequest.isPending}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white"
              >
                {cancelFriendRequest.isPending ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  "Xác nhận"
                )}
              </Button>
            </DialogFooter>
          </motion.div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ArtDecordProfileCard;
