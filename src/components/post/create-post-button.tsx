"use client";
import { Dialog, DialogContent, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "../ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import { useState } from "react";

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
                    queryKey: ["POSTS"]
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
                <button className="flex-1 text-left px-4 py-2 bg-gray-100 rounded-full text-gray-500">
                    Bạn muốn đăng gì?
                </button>
            </DialogTrigger>

            <DialogContent className="bg-white p-6" position="top" size="xl" >
                <DialogTitle className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                        <Avatar className="h-10 w-10 mr-3">
                            <AvatarImage src={user?.avatar?.url || ""} />
                            <AvatarFallback>
                                {user?.firstName?.charAt(0)}
                                {user?.lastName?.charAt(0)}
                            </AvatarFallback>
                        </Avatar>

                        <div>
                            <h2 className="font-semibold">
                                {user?.firstName} {user?.lastName}
                            </h2>
                            <span className="text-sm text-gray-600">Tạo bài đăng</span>
                        </div>
                    </div>
                </DialogTitle>

                <Textarea
                    placeholder="Bạn muốn chia sẻ điều gì?"
                    className="min-h-[300px] resize-none border-none placeholder:text-gray-400 rounded-md p-2 !text-2xl md:text-2xl shadow-none"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />

                <DialogFooter className="border-t border-gray-200 ">
                    <Button className="bg-primary text-white rounded-full mt-6" onClick={() => createPost(content)} disabled={isPending}>{isPending ? "Đang đăng..." : "Đăng bài viết"}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog >
    );
} 