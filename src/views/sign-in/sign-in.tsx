"use client";

import { useAuth } from "@/providers/auth-provider";
import { SignInForm } from "./sign-in-form";

export default function SignInComponent() {
  const { signIn, isLoading } = useAuth();

  const handleSignIn = async (data: any) => {
    await signIn(data);
  };

  return (
    <section className="relative flex h-[100vh] items-center justify-center bg-[url('https://images.unsplash.com/photo-1580610447943-1bfbef5efe07?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover px-2 py-6 md:px-12 lg:justify-end lg:p-0 ">
      <div className="relative z-10 flex flex-1 flex-col rounded-3xl border-white/50 border-t bg-white/60 px-4 py-10 backdrop-blur-2xl sm:justify-center md:flex-none md:px-20 lg:rounded-r-none lg:border-t-0 lg:border-l lg:py-24">
        <div className="mx-auto w-full max-w-md sm:px-4 md:w-96 md:max-w-sm md:px-0">
          <SignInForm onSubmit={handleSignIn} isSubmitting={isLoading} />
        </div>
      </div>
    </section>
  );
}
