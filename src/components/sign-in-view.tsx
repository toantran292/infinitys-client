"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { type SVGProps } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuth } from "@/providers/auth-provider";

const signInSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu ít nhất 6 ký tự")
});

type SignInFormData = {
  email: string;
  password: string;
};

export default function HalfSidedGlassMorphismAuthentication() {
  const { signIn, isSigningIn, auth } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema)
  });

  return (
    <section className="relative flex h-[100vh] items-center justify-center bg-[url('https://images.unsplash.com/photo-1580610447943-1bfbef5efe07?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover px-2 py-6 md:px-12 lg:justify-end lg:p-0 ">
      <div className="relative z-10 flex flex-1 flex-col rounded-3xl border-white/50 border-t bg-white/60 px-4 py-10 backdrop-blur-2xl sm:justify-center md:flex-none md:px-20 lg:rounded-r-none lg:border-t-0 lg:border-l lg:py-24">
        <div className="mx-auto w-full max-w-md sm:px-4 md:w-96 md:max-w-sm md:px-0">
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
          <form onSubmit={handleSubmit((data: SignInFormData) => signIn(data))}>
            <div className="space-y-3">
              <div>
                <label
                  className="mb-3 block font-medium text-black text-sm"
                  htmlFor="name"
                >
                  Email
                </label>
                <input
                  {...register("email")}
                  className="block h-12 w-full appearance-none rounded-xl bg-white px-4 py-2 text-amber-500 placeholder-neutral-300 duration-200 focus:outline-none focus:ring-neutral-300 sm:text-sm"
                  id="name"
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
                  disabled={isSigningIn}
                >
                  {isSigningIn ? "Đang xử lý..." : "Đăng nhập"}
                </button>
              </div>
            </div>
            {auth.message && (
              <p
                className={`mt-3 text-sm ${auth.message.includes("thành công") ? "text-green-600" : "text-red-600"}`}
              >
                {auth.message}
              </p>
            )}
            <div className="mt-6">
              <p className="mx-auto flex text-center font-medium text-black text-sm leading-tight">
                Không có tài khoản?
                <Link
                  className="ml-auto text-amber-500 hover:text-black"
                  href="/signup"
                >
                  Đăng ký ngay
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

function GoogleIcon(props: Readonly<SVGProps<SVGSVGElement>>) {
  return (
    <svg
      height="100"
      viewBox="0 0 48 48"
      width="100"
      x="0px"
      xmlns="http://www.w3.org/2000/svg"
      y="0px"
      {...props}
    >
      <title>Google Logo</title>
      <path
        d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
        fill="#FFC107"
      />
      <path
        d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
        fill="#FF3D00"
      />
      <path
        d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
        fill="#4CAF50"
      />
      <path
        d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
        fill="#1976D2"
      />
    </svg>
  );
}
