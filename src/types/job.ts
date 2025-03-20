import { Company } from "./company";

export interface JobPost {
    id: string;
    title: string;
    description: string;
    location: string;
    workType: string;
    jobType: string;
    createdAt: string;
    pageUser: PageUser;
}

export interface PageUser {
    id: string;
    page: Company;
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