"use client";

import { ProfileComponent } from "@/views/profile/profile";
import { useParams } from "next/navigation";

export default function Profile() {
  const { id } = useParams();

  return <ProfileComponent userId={id as string} />;
}
