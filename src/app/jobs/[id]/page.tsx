"use client";

import { useParams } from "next/navigation";
import { JobDetailPage } from "@/components/ui/jobs/job-detail-page";

export default function JobPage() {
  const params = useParams();
  const jobId = params.id as string;

  return <JobDetailPage jobId={jobId} />;
}
