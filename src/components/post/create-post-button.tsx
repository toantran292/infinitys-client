"use client";
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";;
import { useAuth } from "@/providers/auth-provider";
import { Button } from "../ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import { useState, useRef } from "react";
import TiptapEditor from "./editor-component";
import { UserUploadType } from "@/views/profile/hooks/use-user-upload";
import { PostUploadType } from "./hooks/usePostUpload";
import { usePostUpload } from "./hooks/usePostUpload";
import { useS3Upload } from "@/hooks/use-s3-upload";

const useCreatePost = () => {
    const queryClient = useQueryClient();
    const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
    const [content, setContent] = useState("");
    const filesRef = useRef<File[]>([]);

    const { uploadMultipleToS3 } = useS3Upload({
        type: PostUploadType.IMAGES,
        prefix: "posts"
    });

    const { mutate: createPost, ...remain } = useMutation({
        mutationFn: async (content: string) => {
            let imageKeys: any[] = [];

            if (filesRef.current && filesRef.current.length > 0) {
                const results = await uploadMultipleToS3(filesRef.current);
                imageKeys = results.map((result, index) => ({
                    key: result.key,
                    name: filesRef.current[index].name,
                    content_type: filesRef.current[index].type,
                    size: filesRef.current[index].size
                }));
            }

            const { data: newPost } = await axiosInstance.post(`api/posts`, {
                content,
                images: imageKeys
            });

            return newPost;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
            setIsCreatePostOpen(false);
            toast.success("Đăng bài viết thành công");
            setContent("");
            filesRef.current = [];
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
        filesRef,
        ...remain
    };
};

export function CreatePostButton() {
    const { user } = useAuth();
    const { createPost, isPending, isCreatePostOpen, setIsCreatePostOpen, content, setContent, filesRef } = useCreatePost();

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
                            <AvatarImage className="object-cover" src={user?.avatar?.url || ""} />
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

                <TiptapEditor content={content} setContent={setContent} filesRef={filesRef} />

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