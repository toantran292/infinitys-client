/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, ThumbsUp, MessageCircle } from "lucide-react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { VisuallyHidden } from "../ui/visually-hidden";
import { useEffect, useState, useRef } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { CommentSection } from "@/components/comment/comment-list";
import axiosInstance from "@/lib/axios";
import { PostContent } from "./post-content";

interface ImageViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: Array<{ url: string }>;
  currentImageIndex: number;
  onNextImage: () => void;
  onPrevImage: () => void;
  post: any;
  getTimeAgo: (date: string) => string;
  onLikePost: () => void;
  onSubmitComment: () => void;
  reactStatus: any;
}

export const ImageViewerModal = ({
  isOpen,
  onClose,
  images,
  currentImageIndex,
  onNextImage,
  onPrevImage,
  post,
  getTimeAgo,
  onLikePost = () => undefined,
  onSubmitComment = () => undefined,
  reactStatus
}: ImageViewerModalProps) => {
  const queryClient = useQueryClient();
  const commentInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen || !images) return;

      switch (event.key) {
        case "ArrowLeft":
          if (currentImageIndex > 0) {
            onPrevImage();
          }
          break;
        case "ArrowRight":
          if (currentImageIndex < images.length - 1) {
            onNextImage();
          }
          break;
        case "Escape":
          onClose();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    isOpen,
    currentImageIndex,
    images,
    onPrevImage,
    onNextImage,
    onClose
  ]);

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-7xl h-[90vh] flex p-0 gap-0 overflow-hidden">
        <VisuallyHidden>
          <DialogTitle>
            Image Viewer - {currentImageIndex + 1} of {images?.length}
          </DialogTitle>
        </VisuallyHidden>

        <div className="relative flex-1 bg-black flex items-center">
          <Carousel
            className="w-full h-full"
            opts={{
              align: "start",
              startIndex: currentImageIndex,
              duration: 15
            }}
          >
            <CarouselContent className="-ml-0">
              {images?.map((image, index) => (
                <CarouselItem key={index} className="pl-0 w-full h-[90vh]">
                  <div className="relative w-full h-full flex items-center justify-center">
                    <Image
                      src={image.url}
                      alt={`Post image ${index + 1}`}
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {images?.length > 1 && (
              <>
                <CarouselPrevious className="absolute left-4 h-10 w-10 rounded-full bg-black/50 hover:bg-black/70 border-none text-white" />
                <CarouselNext className="absolute right-4 h-10 w-10 rounded-full bg-black/50 hover:bg-black/70 border-none text-white" />
              </>
            )}
          </Carousel>
        </div>

        <div className="w-[400px] bg-white flex flex-col">
          <div className="p-4 border-b">
            <div className="flex gap-2 items-center">
              <Avatar className="h-12 w-12">
                <AvatarImage src={post.author?.avatar?.url} />
                <AvatarFallback>{`${post.author.firstName[0]}${post.author.lastName[0]}`}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <p className="font-semibold">{`${post.author.firstName} ${post.author.lastName}`}</p>
                <p className="text-xs text-gray-500">
                  {getTimeAgo(post.createdAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Content section */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              <PostContent content={post.content} />
            </div>

            {/* Reactions count */}
            <div className="px-4 py-2 border-t border-b">
              <div className="flex justify-between text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <div className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-500">
                    <ThumbsUp size={12} className="text-white" />
                  </div>
                  <span>{post.react_count}</span>
                </div>
                <span>{post.comment_count} bình luận</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="px-4 py-1 border-b">
              <div className="flex items-center gap-2">
                <Button
                  className={`text-sm flex items-center gap-1 flex-1 ${reactStatus?.isActive ? "bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700" : ""}`}
                  variant="ghost"
                  onClick={() => onLikePost()}
                >
                  <ThumbsUp
                    size={16}
                    className={reactStatus?.isActive ? "fill-current" : ""}
                  />
                  Thích
                </Button>
                <Button
                  className="text-sm flex items-center gap-1 flex-1"
                  variant="ghost"
                >
                  <MessageCircle size={16} />
                  Bình luận
                </Button>
              </div>
            </div>

            <div className="p-4">
              <CommentSection
                postId={post.id}
                inputRef={
                  commentInputRef as React.RefObject<HTMLTextAreaElement>
                }
                onSubmitComment={onSubmitComment}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
