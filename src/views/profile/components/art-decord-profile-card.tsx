import { Button } from "@/components/ui/button";
import { MapPin, Mail, Pencil } from "lucide-react";
import Image from "next/image";
import { UserUploadType, useUserUpload } from "../hooks/use-user-upload";
import { ProfileAvatarComponent } from "./profile-avatar";
import { toast } from "sonner";
import { useAuth } from "@/providers/auth-provider";
import { useState } from "react";
import { EditProfileDialog } from "./edit-profile-dialog";
import { useCreateConversation } from "@/hooks/use-create-conversation";
import { Profile } from "@/types/job";
interface ArtDecordProfileCardProps {
  data: Profile;
  isEditable?: boolean;
}

export const ArtDecordProfileCard = ({
  data,
  isEditable = false
}: ArtDecordProfileCardProps) => {
  const { refetchUser, user } = useAuth();
  const { createUserUser } = useCreateConversation();
  const [isEditing, setIsEditing] = useState(false);

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
    if (data.friend_status === "friend") {
      createUserUser.mutate({ userId: data.id });
    }
  };

  return (
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
            avatar={data.avatar}
            fallback={data.fullName?.charAt(0)}
            canEdit={isEditable && user?.id === data.id}
            onFileChange={handleAvatarUpload}
          />
          {isEditable && user?.id === data.id && (
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
                data={data}
                onSubmit={handleProfileUpdate}
              />
            </>
          )}
        </div>

        <div className="flex justify-between">
          {/* Profile Info */}
          <div className="w-full space-y-1">
            <h1 className="text-2xl font-bold text-gray-900">
              {data.fullName}
            </h1>
            <p className="text-base text-gray-600">
              {data.desiredJobPosition || "Software Engineer"}
            </p>

            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>Cần Thơ, Việt Nam</span>
              </div>
              <div className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                <a
                  href={`mailto:${data.email}`}
                  className="text-blue-600 hover:underline"
                >
                  {data.email}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <span className="text-blue-600 hover:underline cursor-pointer font-bold">
                {data.total_connections} kết nối
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
            <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold">
              {data.friend_status === "friend" ? "Bạn bè" : "Kết nối"}
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
  );
};

export default ArtDecordProfileCard;
