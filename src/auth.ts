import { SvelteKitAuth } from "@auth/sveltekit"
import Google from "@auth/core/providers/google"
import Credentials from "@auth/core/providers/credentials";
import prisma from "$lib/prisma";
import bcrypt from 'bcrypt';
import type { Session } from "inspector/promises";
import type { JWT } from "next-auth/jwt";
import type { User } from "@prisma/client";
import { redirect } from "@sveltejs/kit";

export type UserRole = 'READER' | 'ADMIN';

export interface SessionUser {
    id: string;
    email: string;
    name: string;
    first_name?: string;
    last_name?: string;
    username?: string;
    role?: UserRole

}

export const { handle, signIn, signOut } = SvelteKitAuth(async () => {
    const authOptions = {
        providers: [
            Google({
                clientId: process.env.GOOGLE_ID,
                clientSecret: process.env.GOOGLE_SECRET,
                authorization: {
                    params: {
                        redirect_uri: `http://localhost:5173/auth/callback/google`
                    }
                }

            }),
            Credentials({
                name: 'credentials',
                credentials: {
                    email: { label: "Email", type: "email" },
                    password: { label: "Password", type: "password" }
                },
                async authorize(credentials) {
                    if (!credentials?.email || !credentials?.password) {
                        return null;
                    }

                    const user = await prisma.user.findUnique({
                        where: { email: credentials.email as string }
                    });

                    if (!user || !await bcrypt.compare(credentials?.password as string, user.password)) {
                        return null;
                    }


                    return {
                        id: user.id.toString(),
                        email: user.email,
                        name: `${user.first_name} ${user.last_name}`,
                        role: user.role
                    };
                }
            })
        ],
        callbacks: {
            async signIn({ user, account }: { user: SessionUser; account?: { provider: string; providerAccountId: string } | null }) {
                console.log('Callback signIn déclenché:', { user, account });

                if (account?.provider === 'google') {
                    const existingUser = await prisma.user.findUnique({
                        where: { email: user.email as string }
                    });

                    if (!existingUser) {
                        await prisma.user.create({
                            data: {
                                email: user.email as string,
                                username: user.name as string,
                                id: account.providerAccountId as string,
                                first_name: user.last_name as string || '',
                                last_name: user.first_name as string || '',
                                password: '',  // Vide pour Google Auth
                                authProvider: 'google',
                                User_Role: {
                                    create: {
                                        role: 'READER'
                                    }
                                }
                            }
                        });
                    } else {
                        // Mise à jour du lastLogin
                        await prisma.user.update({
                            where: { id: existingUser.id },
                            data: { lastLogin: new Date() }
                        });
                    }
                }
                return true;
            },
            async jwt({ token, user }: { token: Record<string, unknown>, user: User & { role?: UserRole, id?: string } }) {
                if (user) {
                    token.role = user.role;
                    token.id = user.id;
                }
                return token;
            },
            async session({ session, token }: { session: Session & { user: User & { role?: UserRole, id?: string } }, token: JWT }) {
                if (session.user) {
                    session.user.role = token.role as UserRole;
                    session.user.id = token.id as string;
                }
                return session;
            }
        },
        secret: process.env.AUTH_SECRET,
        trustHost: true
    }
    return authOptions
})