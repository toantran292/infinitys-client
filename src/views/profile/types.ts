export interface ProfileAvatar {
    url?: string;
    key?: string;
}

export interface Profile {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar: ProfileAvatar;
    dateOfBirth?: string;
    gender?: string;
    major?: string;
    desiredJobPosition?: string;
}

export interface ProfileFormData {
    dateOfBirth: string;
    gender: string;
    major: string;
    desiredJobPosition: string;
} 