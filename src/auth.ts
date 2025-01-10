import { SvelteKitAuth } from "@auth/sveltekit";
import Google from "@auth/core/providers/google";
import Credentials from "@auth/core/providers/credentials";
import prisma from "$lib/prisma";
import bcrypt from "bcrypt";
import type { Session as AuthSession, User as AuthUser } from "@auth/core/types";
import type { JWT } from "next-auth/jwt";

export type UserRole = "READER" | "ADMIN";

export interface SessionUser {
    id: string;
    email: string;
    name: string; // Toujours une chaîne
    first_name?: string;
    last_name?: string;
    username?: string;
    role?: UserRole;
}

export type CustomUser = {
    id: string;
    email: string;
    role: string | null;
    password: string | null;

    last_name: string;
    first_name: string;
    username: string | null;
    profile_picture: string | null;
    authProvider: string | null;
    verified: boolean;
    lastLogin: Date | null;
};

export const { handle, signIn, signOut } = SvelteKitAuth({
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
            name: "credentials",
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
                    name: `${user.first_name} ${user.last_name}`,  // Assurer que c'est une chaîne
                    role: user.role
                };
            }
        })
    ],
    callbacks: {
        async signIn({ user, account }: { user: AuthUser; account?: { provider: string; providerAccountId: string } | null }) {
            if (account?.provider === "google") {
                const existingUser = await prisma.user.findUnique({
                    where: { email: user.email as string }
                });

                if (!existingUser) {
                    await prisma.user.create({
                        data: {
                            email: user.email as string,
                            username: user.name as string,
                            id: account.providerAccountId as string,
                            first_name: "",
                            last_name: "",
                            password: "", // Vide pour Google Auth
                            authProvider: "google",
                            User_Role: {
                                create: {
                                    role: "READER"
                                }
                            }
                        }
                    });
                } else {
                    await prisma.user.update({
                        where: { id: existingUser.id },
                        data: { lastLogin: new Date() }
                    });
                }
            }
            return true; // Retourner true à la fin de signIn
        },
        async jwt({ token, user }: { token: JWT; user?: AuthUser | CustomUser }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.role = (user as CustomUser).role;
                token.name = (user as CustomUser).username;
                // Ajoute tous les autres champs nécessaires à ton JWT
            }
            return token;
        },
        async session({ session, token }: { session: AuthSession; token: JWT }) {
            if (session.user) {
                (session.user as CustomUser).id = token.id as string;
                (session.user as CustomUser).email = token.email as string;
                (session.user as CustomUser).role = token.role as string;
                (session.user as CustomUser).username = token.name as string;
                // Ajoute les autres champs nécessaires au session.user
            }
            return session;
        }
    },
    secret: process.env.AUTH_SECRET, // secret provenant des variables d'environnement
    trustHost: true
});
