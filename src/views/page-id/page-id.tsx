"use client";

import { useParams, useRouter } from "next/navigation";
import { ProtectedRouteLayout } from "@/components/layouts";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import axiosInstance from "@/lib/axios";
import { TABS, TabKey } from "./constants";
import { PageHeader } from "./components/page-header";
import { TabNavigation } from "./components/tab-navigation";
import {
  HomeTab as NewHomeTab,
  AboutTab as NewAboutTab,
  PostsTab as NewPostsTab,
  JobsTab as NewJobsTab,
  PeopleTab as NewPeopleTab
} from "./components/tabs";
import { useAuth } from "@/providers/auth-provider";
import { useCreateConversation } from "@/hooks/conversations";

export default function PagesIdComponent() {
  const { user } = useAuth();
  const { id } = useParams();
  const [currentTab, setCurrentTab] = useState<TabKey>("home");
  const router = useRouter();

  const { createUserPage } = useCreateConversation();

  const { data: page, isLoading } = useQuery({
    queryKey: ["page", id],
    queryFn: () =>
      axiosInstance.get(`/api/pages/${id}`).then((res) => res.data),
    enabled: !!id
  });

  const isAdmin = useMemo(() => {
    return page?.admin_user_id === user?.id;
  }, [page, user]);

  if (isLoading)
    return <p className="text-center mt-6">Đang tải thông tin...</p>;
  if (!page) router.push("/pages");

  const renderTabContent = () => {
    switch (currentTab) {
      case "home":
        return <NewHomeTab page={page} />;
      case "about":
        return <NewAboutTab page={page} />;
      case "posts":
        return <NewPostsTab posts={page.posts} />;
      case "jobs":
        return <NewJobsTab pageId={page.id} />;
      case "people":
        return <NewPeopleTab people={page.people} />;
      default:
        return null;
    }
  };

  const handleMessagePage = () => {
    createUserPage.mutate({ pageId: page.id }, {
      onSuccess: (data) => {
        router.push(`/chat/${data.id}`);
      }
    });
  };

  return (
    <ProtectedRouteLayout sectionClassName="bg-[#f4f2ee] min-h-screen w-full py-8">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <PageHeader page={page} isAdmin={isAdmin}>
          {!isAdmin ? (
            <div className="flex gap-2 mt-4">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                + Theo dõi
              </Button>
              <Button variant="outline" onClick={handleMessagePage}>Nhắn tin</Button>
            </div>
          ) : (
            <div className="flex gap-2 mt-4">
              <Button variant="outline" onClick={() => router.push(`/chat/page/${page.id}`)}>
                Tin nhắn
              </Button>
            </div>
          )}
        </PageHeader>

        <TabNavigation
          tabs={TABS}
          currentTab={currentTab}
          onTabChange={setCurrentTab}
        />
      </div>

      <div className="pt-6 max-w-5xl mx-auto">{renderTabContent()}</div>
    </ProtectedRouteLayout>
  );
}
