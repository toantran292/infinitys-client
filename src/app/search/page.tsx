"use client";
import { SearchPage } from "@/components/search-page";
import { useSearchParams } from "next/navigation";

export default function Page() {
  const searchParams = useSearchParams();

  return <SearchPage q={searchParams.get("q") || ""} />;
}
