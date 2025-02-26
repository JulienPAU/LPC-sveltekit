import type { Articles } from './article';
import { ModeratorRequest } from '@prisma/client';


export type UpdateUserData = {
    username?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    password?: string;
    profile_picture?: string;
    moderatorRequestStatus?: ModeratorRequest | null;
};

export type User = {
    id: string;
    googleId?: string;
    name?: string;
    last_name: string;
    first_name: string;
    email?: string | null;
    password: string;
    role?: RoleType;
    username?: string;
    profile_picture?: string;
    image?: string | null;
    articles: Articles[];
    User_Role: User_Role[];
    authProvider?: string;
    verified: boolean;
    lastLogin?: Date;
}



enum RoleType {
    EDITOR = "EDITOR",
    ADMIN = "ADMIN",
    MODERATOR = "MODERATOR",
    AUTHOR = "AUTHOR",
    READER = "READER",
    EXPERT = "EXPERT",
}

interface User_Role {
    id: number;
    user_id: string;
    role: RoleType;
    user: User;
}



export interface SessionUser {
    id: string;
    googleId: string | null;
    email: string;
    name?: string;
    first_name?: string;
    last_name?: string;
    username?: string;
    User_Role: RoleType;
    profile_picture?: string;
}

export type CustomUser = {
    id: string;
    googleId: string | null;
    email: string;
    role: string | null;
    User_Role?: string;
    password: string | null;
    name?: string | null;
    last_name: string | null;
    first_name: string | null;
    username: string | null;
    profile_picture: string | null;
    authProvider: string | null;
    verified: boolean;
    lastLogin: Date | null;
};


export type AuthUser = {
    id?: string
    name?: string | null
    given_name?: string | null
    family_name?: string | null
    email?: string | null
    image?: string | null
    role?: string | null
    User_Role?: string | null
    profile_picture?: string | null
}