"use client";
import { useAuth } from "@/providers/auth-provider";
import { ImageIcon, VideoIcon, FileTextIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { CreatePostButton } from "./create-post-button";

const postOptions = [
    {
        icon: ImageIcon,
        label: "Photo",
        color: "text-blue-500",
    },
    {
        icon: VideoIcon,
        label: "Video",
        color: "text-green-500",
    },
    {
        icon: FileTextIcon,
        label: "Write article",
        color: "text-orange-500",
    },
];

export const CreatePost = () => {
    const { user } = useAuth();

    return (
        <div className="w-full bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-3 mb-4">
                <Avatar className="size-10 flex-shrink-0 bg-gray-500 text-white">
                    <AvatarImage src={user!.avatar?.url} alt="avatar" />
                    <AvatarFallback>{user!.firstName.charAt(0)}</AvatarFallback>
                </Avatar>
                <CreatePostButton />
            </div>

            <div className="flex justify-between items-center">
                {postOptions.map((option) => (
                    <button
                        key={option.label}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <option.icon className={`${option.color}`} size={20} />
                        <span className="text-gray-600">{option.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CreatePost; 