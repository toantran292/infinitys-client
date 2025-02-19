"use client";

import { ProfilePage } from "@/components/profile-page";
import { useParams } from "next/navigation";

export default function Profile() {
  const { id } = useParams();

  return <ProfilePage userId={id as string} />;
}
