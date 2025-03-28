import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera } from "lucide-react";
import { ProfileAvatar } from "@/views/profile/profile";
import { cn } from "@/lib/utils";

interface ProfileAvatarProps {
  avatar: ProfileAvatar;
  fallback?: string;
  canEdit?: boolean;
  onFileChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export function ProfileAvatarComponent({
  avatar,
  fallback,
  canEdit,
  onFileChange,
  className
}: ProfileAvatarProps) {
  return (
    <div className="relative">
      <Avatar className={cn("w-[144px] h-[144px] border-4 border-white", className)}>
        <AvatarImage
          className="object-cover w-full h-full"
          src={avatar?.url || "https://github.com/shadcn.png"}
          alt="Avatar"
        />
        <AvatarFallback>{fallback}</AvatarFallback>
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
