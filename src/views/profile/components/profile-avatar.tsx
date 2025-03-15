import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera } from "lucide-react";
import { ProfileAvatar } from "@/views/profile/profile";

interface ProfileAvatarProps {
  avatar: ProfileAvatar;
  canEdit?: boolean;
  onFileChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ProfileAvatarComponent({
  avatar,
  canEdit,
  onFileChange
}: ProfileAvatarProps) {
  return (
    <div className="relative w-20 h-20">
      <Avatar className="w-20 h-20">
        <AvatarImage
          src={avatar?.url || "https://github.com/shadcn.png"}
          alt="Avatar"
        />
        <AvatarFallback>U</AvatarFallback>
      </Avatar>

      {canEdit && (
        <>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            id="avatarUpload"
            onChange={onFileChange}
          />
          <label
            htmlFor="avatarUpload"
            className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black/50 rounded-full cursor-pointer hover:bg-black/60 transition"
          >
            <Camera className="w-6 h-6 text-white" />
          </label>
        </>
      )}
    </div>
  );
}
