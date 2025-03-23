"use client";
import { useAuth } from "@/providers/auth-provider";
import { FileTextIcon, InstagramIcon, ScanTextIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { CreatePostButton } from "./create-post-button";

const postOptions = [
    {
        icon: InstagramIcon,
        label: "Ảnh",
        color: "text-blue-600",
    },
    {
        icon: ScanTextIcon,
        label: "Bài viết",
        color: "text-orange-600",
    },
];

export const CreatePost = () => {
    const { user } = useAuth();

    return (
        <div className="w-full bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
                <Avatar className="size-12 flex-shrink-0 bg-gray-500 text-white">
                    <AvatarImage src={user?.avatar?.url} alt="avatar" />
                    <AvatarFallback>{user?.firstName.charAt(0)}</AvatarFallback>
                </Avatar>
                <CreatePostButton />
            </div>

            <div className="flex items-center">
                {postOptions.map((option) => (
                    <button
                        key={option.label}
                        className="flex items-center justify-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors flex-1"
                    >
                        <option.icon className={`${option.color}`} size={22} />
                        <span className="text-gray-600 text-sm font-bold">{option.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CreatePost; 