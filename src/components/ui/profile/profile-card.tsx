"use client";

import {
  Mail,
  MapPin,
  GraduationCap,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileCardProps {
  name: string;
  avatar: string;
  location: string;
  email: string;
  major: string;
}

export function ProfileCard({
  name,
  avatar,
  location,
  email,
  major
}: ProfileCardProps) {
  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      {/* Cover Background */}
      <div className="h-20 bg-gradient-to-r from-gray-200 to-gray-300" />

      {/* Profile Info */}
      <div className="p-4 -mt-12">
        {/* Avatar */}
        <div className="mb-3">
          <Avatar className="w-20 h-20 border-4 border-white">
            <AvatarImage className="object-cover" src={avatar} alt={name} />
            <AvatarFallback className="text-2xl">
              {name.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* User Info */}
        <h2 className="text-lg font-semibold">{name}</h2>

        <div className="space-y-2 mt-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail size={14} className="text-blue-500" />
            <span>Email: {email}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin size={14} className="text-red-500" />
            <span>Vị trí: {location}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <GraduationCap size={14} className="text-green-500" />
            <span>Chuyên ngành: {major}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
