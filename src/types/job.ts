import { FriendStatus } from "./friend";

export interface Avatar {
  id: string;
  url: string;
  createdAt: string;
  updatedAt: string;
}
export interface JobPostResponse {
  items: JobPost[];
  meta: {
    page: number;
    take: number;
    itemCount: number;
    pageCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}

export interface JobPost {
  id: string;
  title: string;
  description: string;
  location: string;
  workType: string;
  jobType: string;
  createdAt: string;
  active: boolean;
  pageUser: PageUser;
}
export interface Page {
  id: string;
  name: string;
  content: string;
  address: string;
  email: string;
  status: string;
  url: string;
  createdAt: string;
  updatedAt: string;
  avatar?: Avatar;
}

export interface PageUser {
  id: string;
  page: Page;
  user: User;
  createdAt: string;
  updatedAt: string;
  role: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  name: string;
}

export interface Profile {
  id: string;
  name: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  gender?: string;
  major?: string;
  desiredJobPosition?: string;
  fullName: string;
  posts: Post[];
  friendStatus: FriendStatus | null;
  avatar: Avatar;
  connections?: number;
  totalConnections?: number;
}

export interface ApiResponse<T> {
  data: T[];
  meta: {
    page: number;
    take: number;
    itemCount: number;
    pageCount: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}
