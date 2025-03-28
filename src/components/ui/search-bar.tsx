"use client";
import { Search, Globe } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import axiosInstance from "@/lib/axios";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

enum SearchResultType {
  USER = "user",
  PAGE = "page"
}

interface BaseSearchResult {
  id: string;
  type: SearchResultType;
}

interface UserSearchResult extends BaseSearchResult {
  type: SearchResultType.USER;
  email: string;
  firstName: string;
  lastName: string;
  friendshipStatus?: {
    isFriend: boolean;
  };
  avatar?: {
    key: string;
    url?: string;
  };
}

interface PageSearchResult extends BaseSearchResult {
  type: SearchResultType.PAGE;
  address: string;
  content: string;
  email: string;
  url: string;
  name: string;
  avatar?: {
    key: string;
    url?: string;
  };
}

type SearchResult = UserSearchResult | PageSearchResult;

export const SearchBar = () => {
  const [searchValue, setSearchValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const debouncedSearch = useDebounce(searchValue, 300);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      if (!debouncedSearch) {
        setSearchResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await axiosInstance.get('/search', {
          params: { q: debouncedSearch, autocomplete: true }
        });
        setSearchResults(response.data);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [debouncedSearch]);

  const handleSearchResult = (item: SearchResult) => {
    if (item.type === SearchResultType.USER) {
      router.push(`/profile/${item.id}`);
    } else {
      router.push(`/page/${item.id}`);
    }
    setIsOpen(false);
    setSearchValue("");
  };

  const renderSearchItem = (item: SearchResult) => {
    if (item.type === SearchResultType.USER) {
      return (
        <button
          key={item.id}
          onClick={() => handleSearchResult(item)}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 hover:bg-gray-50"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={item.avatar?.url} />
            <AvatarFallback className="bg-blue-100 text-blue-600">
              {item.firstName[0]}
              {item.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 text-left">
            <div className="text-sm font-medium text-gray-900">
              {item.firstName} {item.lastName}
            </div>
            <div className="text-xs text-gray-500">{item.email}</div>
          </div>
          {item.friendshipStatus?.isFriend && (
            <div className="text-xs text-gray-500">Bạn bè</div>
          )}
        </button>
      );
    }

    return (
      <button
        key={item.id}
        onClick={() => handleSearchResult(item)}
        className="flex w-full items-center gap-3 rounded-md px-3 py-2 hover:bg-gray-50"
      >
        <Avatar className="h-8 w-8">
          <AvatarImage src={item.avatar?.url} />
          <AvatarFallback className="bg-green-100 text-green-600">
            <Globe className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 text-left min-w-0">
          <div className="text-sm font-medium text-gray-900 truncate">
            {item.name}
          </div>
          <div className="text-xs text-gray-500 truncate">
            {item.address}
          </div>
        </div>
      </button>
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchValue.trim()) {
      e.preventDefault();
      setIsOpen(false);
      router.push(`/search?q=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  return (
    <div ref={searchRef} className="relative w-[280px]">
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={16}
        />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Tìm kiếm người dùng, trang..."
          className="h-[34px] w-full rounded-md border border-gray-300 bg-gray-50 pl-9 pr-4 text-sm outline-none focus:border-blue-500 focus:bg-white"
        />
      </div>

      {isOpen && (debouncedSearch || isLoading) && (
        <div className="absolute top-full left-0 right-0 mt-1 max-h-[400px] overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg">
          {isLoading && (
            <div className="p-4 text-center text-sm text-gray-500">
              Đang tìm kiếm...
            </div>
          )}

          {!isLoading && searchResults.length > 0 && (
            <div className="py-2">
              {searchResults.map(renderSearchItem)}
            </div>
          )}

          {!isLoading && searchResults.length === 0 && debouncedSearch && (
            <div className="p-4 text-center text-sm text-gray-500">
              Không tìm thấy kết quả nào
            </div>
          )}
        </div>
      )}
    </div>
  );
};
