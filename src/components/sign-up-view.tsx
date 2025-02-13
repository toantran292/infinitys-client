"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const signUpSchema = z.object({
  lastName: z.string().min(1, "Họ là bắt buộc"),
  firstName: z.string().min(1, "Tên là bắt buộc"),
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu ít nhất 6 ký tự")
});

export default function HalfSidedGlassMorphismSignUp() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema)
  });

  type SignUpFormData = {
    lastName: string;
    firstName: string;
    email: string;
    password: string;
  };

  const onSubmit = async (data: SignUpFormData) => {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost:20250/api/auths/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      setMessage(result.message);
      console.log("Server response:", result);

      if (response.ok) {
        if (result.token) {
          localStorage.setItem("accessToken", result.token);
        }
      }
    } catch (error) {
      console.log("Error signing up:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className="relative flex h-[100vh] items-center justify-center bg-[url('https://images.unsplash.com/photo-1580610447943-1bfbef5efe07?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover px-2 py-6 md:px-12 lg:justify-end lg:p-0 ">
      <div className="relative z-10 flex flex-1 flex-col rounded-3xl border-white/50 border-t bg-white/60 px-4 py-10 backdrop-blur-2xl sm:justify-center md:flex-none md:px-20 lg:rounded-r-none lg:border-t-0 lg:border-l lg:py-24">
        <div className="mx-auto w-full max-w-md sm:px-4 md:w-96 md:max-w-sm md:px-0">
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
                  disabled={loading}
                >
                  {loading ? "Đang xử lý..." : "Đăng ký"}
                </button>
              </div>
            </div>
            {message && (
              <p
                className={`mt-3 text-sm ${message.includes("thành công") ? "text-green-600" : "text-red-600"}`}
              >
                {message}
              </p>
            )}
            <div className="mt-6">
              <p className="mx-auto flex text-center font-medium text-black text-sm leading-tight">
                Đã có tài khoản?
                <Link
                  className="ml-auto text-amber-500 hover:text-black"
                  href="/"
                >
                  Đăng nhập ngay
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
