import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { SignInFormData, signInSchema } from "./sign-in.schema";
import { GoogleIcon } from "./google-icon";

interface SignInFormProps {
    onSubmit: (data: SignInFormData) => void;
    isSubmitting: boolean;
}

export function SignInForm({ onSubmit, isSubmitting }: SignInFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<SignInFormData>({
        resolver: zodResolver(signInSchema)
    });

    return (
        <>
            <h1 className="font-semibold text-3xl text-neutral-900 tracking-tighter">
                Cơ hội việc làm, <br />
                <span className="text-neutral-600">Rèn luyện lập trình</span>
            </h1>
            <p className="mt-4 font-medium text-base text-neutral-500">
                Mạng xã hồi lớn nhất thế giới dành cho các lập trình viên và nhà
                phát triển.
            </p>

            <div className="mt-8">
                <button
                    aria-label="Sign in with Google"
                    className="inline-flex h-12 w-full items-center justify-center gap-3 rounded-xl bg-white px-5 py-3 font-medium duration-200 hover:bg-white/50 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                    type="button"
                >
                    <GoogleIcon className="size-6" />
                    <span>Đăng nhập với Google</span>
                </button>
                <div className="relative py-3">
                    <div className="relative flex justify-center">
                        <span className="before:-translate-y-1/2 after:-translate-y-1/2 px-2 text-neutral-500 text-sm before:absolute before:top-1/2 before:left-0 before:h-px before:w-4/12 after:absolute after:top-1/2 after:right-0 after:h-px after:w-4/12 sm:after:bg-neutral-300 sm:before:bg-neutral-300">
                            Hoặc
                        </span>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-3">
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
                            {isSubmitting ? "Đang xử lý..." : "Đăng nhập"}
                        </button>
                    </div>
                </div>

                <div className="mt-6">
                    <p className="mx-auto flex text-center font-medium text-black text-sm leading-tight">
                        Không có tài khoản?
                        <Link
                            className="ml-auto text-amber-500 hover:text-black"
                            href="/auth/register"
                        >
                            Đăng ký ngay
                        </Link>
                    </p>
                </div>
            </form>
        </>
    );
} 