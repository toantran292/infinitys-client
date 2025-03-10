"use client";
import { JSX } from "react";
import Link from "next/link";

const PageTypeCard: ({ title, description, icon, pageType }: {
  title: string;
  description: string;
  icon: React.ReactNode;
  pageType: string;
}) => JSX.Element = ({ title, description, icon, pageType }) => {
  return (
    <Link href={`/page/${pageType}`} prefetch={false}>
      <div className="border rounded-lg p-6 text-center shadow-md hover:shadow-lg transition cursor-pointer bg-white" onClick={() => console.log("Clicked")}>
        <div className="flex justify-center mb-4">{icon}</div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </Link>
  );
};

export default PageTypeCard;
