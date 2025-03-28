"use client";

import { useParams } from "next/navigation";
import { JobsIdComponent } from "@/views/jobs-id/jobs-id";

export default function JobPage() {
  const params = useParams();
  const jobId = params.id as string;

  return <JobsIdComponent jobId={jobId} />;
}
