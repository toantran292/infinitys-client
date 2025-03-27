import { FriendStatus } from "@/types/friend";

export enum SearchResultType {
  USER = "user",
  PAGE = "page"
}

export interface BaseSearchResult {
  id: string;
  type: SearchResultType;
}

export interface UserSearchResult extends BaseSearchResult {
  type: SearchResultType.USER;
  email: string;
  firstName: string;
  lastName: string;
  friendStatus?: FriendStatus;
  avatar?: {
    key: string;
    url?: string;
  };
}

export interface PageSearchResult extends BaseSearchResult {
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

export type SearchResult = UserSearchResult | PageSearchResult;
export type TabType = "all" | "users" | "pages";
