"use client";
import { ProtectedRouteLayout } from "@/components/layouts";
import { UserCard } from "./components/user-card";
import { PageCard } from "./components/search-page-card";
import { SearchTabs } from "./components/search-tabs";
import { EmptyState } from "./components/empty-state";
import { Loader } from "@/components/ui/Loader";
import { useSearchResults } from "./hooks/useSearchResults";
import { Users, Building2 } from "lucide-react";
import { useState } from "react";
import { SearchResultType, TabType } from "./types";
import useFriend from "@/hooks/use-friend";
import { FriendStatus } from "@/types/friend";
export interface FriendRequestVariables {
  userId: string;
  friend_status: 'none' | 'friend' | 'waiting' | 'sent';
}

export interface FriendActionVariables {
  userId: string;
}

export const SearchPage = ({ q }: { q: string }) => {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const { results, isLoading, updateUserStatus } = useSearchResults(q);

  const { sendFriendRequest, acceptFriendRequest, cancelFriendRequest } = useFriend();

  const handleSendFriendRequest = (userId: string) => {
    sendFriendRequest.mutate({ userId },
      {
        onSuccess: () => {
          updateUserStatus(userId, FriendStatus.WAITING);
        }
      }
    );
  };

  const handleAcceptFriendRequest = (userId: string) => {
    acceptFriendRequest.mutate({ userId },
      {
        onSuccess: () => {
          updateUserStatus(userId, FriendStatus.FRIEND);
        }
      }
    );
  };

  const handleCancelFriendRequest = (userId: string) => {
    cancelFriendRequest.mutate({ userId },
      {
        onSuccess: () => {
          updateUserStatus(userId, null);
        }
      }
    );
  };

  const users = results?.filter(item => item.type === SearchResultType.USER);
  const pages = results?.filter(item => item.type === SearchResultType.PAGE);

  const renderUsers = () => (
    <div className="bg-white rounded-lg border border-[#e0e0e0] overflow-hidden">
      {activeTab === 'all' && (
        <div className="p-4 border-b border-[#e0e0e0]">
          <h2 className="text-[#191919] font-medium flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Người dùng
          </h2>
        </div>
      )}
      <div className="divide-y divide-[#e0e0e0]">
        {users.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            onSendFriendRequest={() => handleSendFriendRequest(user.id)}
            onAcceptFriendRequest={() => handleAcceptFriendRequest(user.id)}
            onCancelFriendRequest={() => handleCancelFriendRequest(user.id)}
            onUnfriend={() => handleCancelFriendRequest(user.id)}
          />
        ))}
      </div>
    </div>
  );

  const renderPages = () => (
    <div className="bg-white rounded-lg border border-[#e0e0e0] overflow-hidden">
      {activeTab === 'all' && (
        <div className="p-4 border-b border-[#e0e0e0]">
          <h2 className="text-[#191919] font-medium flex items-center">
            <Building2 className="w-5 h-5 mr-2" />
            Trang
          </h2>
        </div>
      )}
      <div className="divide-y divide-[#e0e0e0]">
        {pages.map((page) => (
          <PageCard key={page.id} page={page} />
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    if (!results?.length) {
      return <EmptyState />;
    }

    switch (activeTab) {
      case 'users':
        return users?.length ? renderUsers() : <EmptyState icon={<Users className="w-12 h-12" />} />;
      case 'pages':
        return pages?.length ? renderPages() : <EmptyState icon={<Building2 className="w-12 h-12" />} />;
      default:
        return (
          <>
            {users?.length > 0 && <div className="mb-4">{renderUsers()}</div>}
            {pages?.length > 0 && renderPages()}
          </>
        );
    }
  };

  return (
    <ProtectedRouteLayout>
      <div className="min-h-screen bg-[#f4f2ee]">
        <div className="max-w-[1128px] mx-auto px-4 py-6">
          <h1 className="text-[#191919] mb-1 text-base">
            Kết quả tìm kiếm cho &quot;{q}&quot;
          </h1>
          <p className="text-[#666666] text-sm mb-4">
            {results?.length || 0} kết quả được tìm thấy
          </p>

          <SearchTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            totalCount={results?.length || 0}
            usersCount={users?.length || 0}
            pagesCount={pages?.length || 0}
          />

          {isLoading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <Loader />
            </div>
          ) : (
            renderContent()
          )}
        </div>
      </div>
    </ProtectedRouteLayout>
  );
};
