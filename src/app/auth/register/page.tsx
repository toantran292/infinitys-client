import { Metadata } from "next";
import SignUpViewPage from "@/views/sign-up/sign-up";

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
