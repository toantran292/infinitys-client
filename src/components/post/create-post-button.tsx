"use client";
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";;
import { useAuth } from "@/providers/auth-provider";
import { Button } from "../ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import { useState } from "react";
import TiptapEditor from "./editor-component";

const useCreatePost = () => {
    const queryClient = useQueryClient();
    const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
    const [content, setContent] = useState("");

    const { mutate: createPost, ...remain } = useMutation({
        mutationFn: (content: string) =>
            axiosInstance.post(`api/posts`, {
                content
            }),
        onSuccess: () => {
            queryClient
                .invalidateQueries({
                    queryKey: ["posts"]
                })
                .catch(console.error);
            setIsCreatePostOpen(false);
            toast.success("Đăng bài viết thành công");
            setContent("");
        },
        onError: (error: unknown) => {
            toast.error(`Error creating post: ${error}`);
        }
    });

    return {
        createPost,
        isCreatePostOpen,
        setIsCreatePostOpen,
        content,
        setContent,
        ...remain
    };
};

export function CreatePostButton() {
    const { user } = useAuth();
    const { createPost, isPending, isCreatePostOpen, setIsCreatePostOpen, content, setContent } = useCreatePost();

    return (
        <Dialog open={isCreatePostOpen} onOpenChange={setIsCreatePostOpen}>
            <DialogTrigger asChild>
                <button className="flex-1 text-left px-4 py-3 rounded-full text-gray-600 border border-gray-500 text-sm">
                    Bạn muốn đăng gì?
                </button>
            </DialogTrigger>

            <DialogContent className="bg-white p-6 max-w-3xl" position="top" size="xl">
                <DialogTitle className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                        <Avatar className="size-14 mr-3">
                            <AvatarImage src={user?.avatar?.url || ""} />
                            <AvatarFallback className="bg-gray-500 text-white">
                                {user?.firstName?.charAt(0)}
                            </AvatarFallback>
                        </Avatar>

                        <div className="space-y-4">
                            <h2 className="font-semibold text-xl">
                                {user?.firstName} {user?.lastName}
                            </h2>
                            <span className="text-sm font-thin text-gray-600">Tạo bài đăng</span>
                        </div>
                    </div>
                </DialogTitle>

                <TiptapEditor content={content} setContent={setContent} />

                <DialogFooter className="border-t border-gray-200">
                    <Button
                        className="bg-primary text-white rounded-full mt-4 px-4 text-sm"
                        onClick={() => createPost(content)}
                        disabled={isPending}
                    >
                        {isPending ? "Đang đăng..." : "Đăng bài viết"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
} 