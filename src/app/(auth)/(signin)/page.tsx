import { Metadata } from "next";
import SignInViewPage from "@/components/sign-in-view";

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
