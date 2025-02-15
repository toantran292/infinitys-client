import { Metadata } from "next";
import SignUpViewPage from "@/components/sign-up-view";

export const metadata: Metadata = {
  title: "Authentication | Sign Up",
  description: "Sign Up page for authentication."
};

export default async function Page() {
  return (
    <div>
      <SignUpViewPage />
    </div>
  );
}
