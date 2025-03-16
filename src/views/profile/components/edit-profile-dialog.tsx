import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogClose, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { Profile } from "../profile";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface FormValues {
    firstName: string;
    lastName: string;
    otherName?: string;
    position: string;
    currentPosition: boolean;
    jobTitle?: string;
    company?: string;
}

interface EditProfileDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    data: Profile;
    onSubmit: (data: Partial<Profile>) => void;
}

export const EditProfileDialog = ({ open, onOpenChange, data, onSubmit }: EditProfileDialogProps) => {
    const { register, handleSubmit, watch } = useForm<FormValues>({
        defaultValues: {
            firstName: data.firstName,
            lastName: data.lastName,
            position: data.desiredJobPosition,
            currentPosition: false,
        }
    });

    const isCurrentPosition = watch("currentPosition");

    const onSubmitForm = (formData: FormValues) => {
        onSubmit({
            firstName: formData.firstName,
            lastName: formData.lastName,
            desiredJobPosition: formData.position,
            // Thêm các trường khác nếu cần
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] bg-white rounded-xl p-0 border-none">
                <DialogTitle asChild>
                    <VisuallyHidden>Chỉnh sửa phần giới thiệu</VisuallyHidden>
                </DialogTitle>
                <form onSubmit={handleSubmit(onSubmitForm)}>
                    <div className="p-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold">Chỉnh sửa phần giới thiệu</h2>
                            {/* <DialogClose className="opacity-70 hover:opacity-100">
                                <X className="h-4 w-4" />
                            </DialogClose> */}
                        </div>

                        <div className="space-y-4 mt-4">
                            {/* Tên */}
                            <div>
                                <Label htmlFor="firstName" className="block text-sm mb-1.5">
                                    Tên*
                                </Label>
                                <Input
                                    {...register("firstName", { required: true })}
                                    className="w-full bg-white border-[1.5px] border-gray-300 focus:border-blue-600"
                                />
                            </div>

                            {/* Họ */}
                            <div>
                                <Label htmlFor="lastName" className="block text-sm mb-1.5">
                                    Họ*
                                </Label>
                                <Input
                                    {...register("lastName", { required: true })}
                                    className="w-full bg-white border-[1.5px] border-gray-300 focus:border-blue-600"
                                />
                            </div>

                            {/* Tên khác */}
                            <div>
                                <Label htmlFor="otherName" className="block text-sm mb-1.5">
                                    Tên khác
                                </Label>
                                <Input
                                    {...register("otherName")}
                                    placeholder="Ví dụ: Tên thời con gái, biệt danh, v.v."
                                    className="w-full bg-white border-[1.5px] border-gray-300 focus:border-blue-600"
                                />
                            </div>

                            {/* Tiêu đề */}
                            <div>
                                <Label htmlFor="position" className="block text-sm mb-1.5">
                                    Tiêu đề*
                                </Label>
                                <Input
                                    {...register("position", { required: true })}
                                    className="w-full bg-white border-[1.5px] border-gray-300 focus:border-blue-600"
                                />
                            </div>

                            {/* Vị trí hiện tại */}
                            <div>
                                <Label className="block text-base font-semibold mb-2">
                                    Vị trí hiện tại
                                </Label>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            {...register("currentPosition")}
                                            className="w-4 h-4"
                                        />
                                        <Label className="text-sm">
                                            Tôi hiện đang giữ vị trí này
                                        </Label>
                                    </div>
                                    {isCurrentPosition && (
                                        <div className="flex gap-2">
                                            <Input
                                                {...register("jobTitle", { required: isCurrentPosition })}
                                                placeholder="Vị trí*"
                                                className="flex-1 bg-white border-[1.5px] border-gray-300 focus:border-blue-600"
                                            />
                                            <Input
                                                {...register("company", { required: isCurrentPosition })}
                                                placeholder="Tên công ty*"
                                                className="flex-1 bg-white border-[1.5px] border-gray-300 focus:border-blue-600"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between items-center border-t p-4 bg-gray-50 rounded-xl">
                        <span className="text-sm text-gray-500">* Cho biết phần bắt buộc</span>
                        <div className="flex gap-2">
                            <DialogClose asChild>
                                <Button type="button" variant="outline" className="bg-white">
                                    Hủy
                                </Button>
                            </DialogClose>
                            <Button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                Lưu
                            </Button>
                        </div>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}; 