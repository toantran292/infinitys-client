'use client';

import { ProtectedRouteLayout } from "@/components/layouts";
import CreatePost from "@/components/post/create-post";

export const HomeComponent = () => {

  return (
    <ProtectedRouteLayout>
      <div className="max-w-2xl mx-auto py-6 px-4">
        <CreatePost />
      </div>
    </ProtectedRouteLayout>
  );
};
