"use client";

import { Building2, MapPin, Clock } from "lucide-react";

interface JobPreviewCardProps {
  title: string;
  company: string;
  location: string;
  workType: string;
  jobType: string;
  companyLogo?: string;
  status?: string;
  avatar?: string;
}

export function JobPreviewCard({
  title,
  company,
  location,
  workType,
  jobType,
  avatar
}: JobPreviewCardProps) {
  return (
    <div className="flex gap-4 p-4 rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
      <div className="shrink-0 h-14 w-14 rounded-lg bg-white border flex items-center justify-center overflow-hidden">
        <img
          src={avatar || "https://github.com/shadcn.png"}
          alt="Logo"
          width={56}
          height={56}
          className="object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        {/* Title and Company */}
        <div className="space-y-2 mb-3">
          <h3 className="text-lg font-semibold text-gray-900 leading-tight tracking-tight">
            {title}
          </h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Building2 className="w-4 h-4 shrink-0" />
            <span className="truncate">{company}</span>
          </div>
        </div>

        {/* Info List */}
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 shrink-0" />
            <span className="break-words">{location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 shrink-0" />
            <span className="break-words">{jobType}</span>
          </div>
        </div>

        {/* Work Type Badge */}
        <div className="mt-3">
          <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground">
            {workType}
          </span>
        </div>
      </div>
    </div>
  );
}
