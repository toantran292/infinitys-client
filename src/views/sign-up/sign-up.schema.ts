import { z } from "zod";

export const signUpSchema = z.object({
    lastName: z.string().min(1, "Họ là bắt buộc"),
    firstName: z.string().min(1, "Tên là bắt buộc"),
    email: z.string().email("Email không hợp lệ"),
    password: z.string().min(6, "Mật khẩu ít nhất 6 ký tự")
});

export type SignUpFormData = z.infer<typeof signUpSchema>; 