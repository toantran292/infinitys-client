import { Metadata } from "next";
import SignInViewPage from "@/views/sign-in/sign-in";

export const metadata: Metadata = {
  title: "Authentication | Sign In",
  description: "Sign In page for authentication."
};

export default async function Page() {
  return (
    <div>
      <SignInViewPage />
    </div>
  );
}
