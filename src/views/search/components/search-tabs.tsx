import { Users, Building2 } from "lucide-react";
import { TabType } from "../types";

interface SearchTabsProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
    totalCount: number;
    usersCount: number;
    pagesCount: number;
}

export const SearchTabs = ({
    activeTab,
    onTabChange,
    totalCount,
    usersCount,
    pagesCount
}: SearchTabsProps) => {
    return (
        <div className="flex gap-3 mb-4 text-sm font-medium">
            <button
                onClick={() => onTabChange('all')}
                className={`px-4 py-2 rounded-full transition-colors ${activeTab === 'all'
                    ? 'bg-[#0a66c2] text-white'
                    : 'text-[#666666] hover:bg-[#ebebeb]'
                    }`}
            >
                Tất cả ({totalCount})
            </button>
            <button
                onClick={() => onTabChange('users')}
                className={`px-4 py-2 rounded-full transition-colors flex items-center ${activeTab === 'users'
                    ? 'bg-[#0a66c2] text-white'
                    : 'text-[#666666] hover:bg-[#ebebeb]'
                    }`}
            >
                <Users className="w-4 h-4 mr-2" />
                Người dùng ({usersCount})
            </button>
            <button
                onClick={() => onTabChange('pages')}
                className={`px-4 py-2 rounded-full transition-colors flex items-center ${activeTab === 'pages'
                    ? 'bg-[#0a66c2] text-white'
                    : 'text-[#666666] hover:bg-[#ebebeb]'
                    }`}
            >
                <Building2 className="w-4 h-4 mr-2" />
                Trang ({pagesCount})
            </button>
        </div>
    );
}; 