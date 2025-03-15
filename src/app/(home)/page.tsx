import { Metadata } from "next";
import { HomeComponent } from "@/views/home/home";

export const metadata: Metadata = {
  title: "Home",
  description: "Home page"
};

export default async function Page() {
  return <HomeComponent />;
}
