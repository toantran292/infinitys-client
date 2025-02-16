import { Metadata } from "next";
import { HomePage } from "@/components/home-page";

export const metadata: Metadata = {
  title: "Home",
  description: "Home page"
};

export default async function Page() {
  return <HomePage />;
}
