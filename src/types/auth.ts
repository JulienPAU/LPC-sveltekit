// src/types/auth.ts
import '@auth/core'

declare module '@auth/core' {
    interface User {
        id?: string;
        name?: string | null;
        email?: string | null;
        profile_picture?: string | null;
        role?: string | null;
        User_Role?: string | null;
        username?: string | null;
    }
}