import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { SignUpFormData, signUpSchema } from "./sign-up.schema";

interface SignUpFormProps {
    onSubmit: (data: SignUpFormData) => void;
    isSubmitting: boolean;
}

export function SignUpForm({ onSubmit, isSubmitting }: SignUpFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<SignUpFormData>({
        resolver: zodResolver(signUpSchema)
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-3">
                <div>
                    <label
                        className="mb-3 block font-medium text-black text-sm"
                        htmlFor="lastName"
                    >
                        Họ
                    </label>
                    <input
                        {...register("lastName")}
                        className="block h-12 w-full appearance-none rounded-xl bg-white px-4 py-2 text-amber-500 placeholder-neutral-300 duration-200 focus:outline-none focus:ring-neutral-300 sm:text-sm"
                        id="lastName"
                        placeholder="Nhập họ..."
                        type="text"
                    />
                    {errors.lastName && (
                        <p className="text-red-500 text-sm">
                            {errors.lastName.message as string}
                        </p>
                    )}
                </div>
                <div>
                    <label
                        className="mb-3 block font-medium text-black text-sm"
                        htmlFor="firstName"
                    >
                        Tên
                    </label>
                    <input
                        {...register("firstName")}
                        className="block h-12 w-full appearance-none rounded-xl bg-white px-4 py-2 text-amber-500 placeholder-neutral-300 duration-200 focus:outline-none focus:ring-neutral-300 sm:text-sm"
                        id="firstName"
                        placeholder="Nhập tên..."
                        type="text"
                    />
                    {errors.firstName && (
                        <p className="text-red-500 text-sm">
                            {errors.firstName.message as string}
                        </p>
                    )}
                </div>
                <div>
                    <label
                        className="mb-3 block font-medium text-black text-sm"
                        htmlFor="email"
                    >
                        Email
                    </label>
                    <input
                        {...register("email")}
                        className="block h-12 w-full appearance-none rounded-xl bg-white px-4 py-2 text-amber-500 placeholder-neutral-300 duration-200 focus:outline-none focus:ring-neutral-300 sm:text-sm"
                        id="email"
                        placeholder="Nhập email..."
                        type="text"
                    />
                    {errors.email && (
                        <p className="text-red-500 text-sm">
                            {errors.email.message as string}
                        </p>
                    )}
                </div>
                <div className="col-span-full">
                    <label
                        className="mb-3 block font-medium text-black text-sm"
                        htmlFor="password"
                    >
                        Mật khẩu
                    </label>
                    <input
                        {...register("password")}
                        className="block h-12 w-full appearance-none rounded-xl bg-white px-4 py-2 text-amber-500 placeholder-neutral-300 duration-200 focus:outline-none focus:ring-neutral-300 sm:text-sm"
                        id="password"
                        placeholder="Nhập mật khẩu..."
                        type="password"
                    />
                    {errors.password && (
                        <p className="text-red-500 text-sm">
                            {errors.password.message as string}
                        </p>
                    )}
                </div>
                <div className="col-span-full">
                    <button
                        className="inline-flex h-12 w-full items-center justify-center gap-3 rounded-xl bg-neutral-900 px-5 py-3 font-medium text-white duration-200 hover:bg-neutral-700 focus:ring-2 focus:ring-black focus:ring-offset-2"
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Đang xử lý..." : "Đăng ký"}
                    </button>
                </div>
            </div>

            <div className="mt-6">
                <p className="mx-auto flex text-center font-medium text-black text-sm leading-tight">
                    Đã có tài khoản?
                    <Link
                        className="ml-auto text-amber-500 hover:text-black"
                        href="/auth/login"
                    >
                        Đăng nhập ngay
                    </Link>
                </p>
            </div>
        </form>
    );
} 